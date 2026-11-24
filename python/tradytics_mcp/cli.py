"""Zero-dependency stdio-to-Streamable-HTTP MCP bridge for Tradytics."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request

from . import __version__

DEFAULT_URL = "https://tradytics.com/mcp"


def _send(obj: dict) -> None:
    sys.stdout.write(json.dumps(obj, separators=(",", ":")) + "\n")
    sys.stdout.flush()


def _send_error(req_id, code: int, message: str) -> None:
    if req_id is None:
        return
    _send({"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}})


def _emit_sse(text: str) -> None:
    for block in text.replace("\r\n", "\n").split("\n\n"):
        lines = [line[5:].lstrip() for line in block.split("\n") if line.startswith("data:")]
        data = "\n".join(lines).strip()
        if not data or data == "[DONE]":
            continue
        try:
            _send(json.loads(data))
        except json.JSONDecodeError:
            sys.stderr.write("[tradytics-mcp] ignored non-JSON SSE frame\n")


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog="tradytics-mcp",
        description="Stdio MCP bridge for Tradytics (https://tradytics.com/mcp).",
    )
    parser.add_argument(
        "--api-key",
        default=os.environ.get("TRADYTICS_API_KEY", ""),
        help="Tradytics API key (or set TRADYTICS_API_KEY). Create one at https://tradytics.com/developer/keys",
    )
    parser.add_argument(
        "--url",
        default=os.environ.get("TRADYTICS_MCP_URL", DEFAULT_URL),
        help=f"MCP endpoint URL (default: {DEFAULT_URL})",
    )
    parser.add_argument("-v", "--version", action="version", version=f"tradytics-mcp {__version__}")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> None:
    args = _parse_args(argv)
    api_key = args.api_key.strip()
    url = args.url.strip()
    session_id = ""

    for raw in sys.stdin:
        line = raw.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            _send_error(None, -32700, "Parse error")
            continue

        req_id = msg.get("id")
        if not api_key:
            _send_error(
                req_id,
                -32001,
                "Missing TRADYTICS_API_KEY. Create a key at https://tradytics.com/developer/keys or connect directly with OAuth at https://tradytics.com/mcp",
            )
            continue

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
            "Authorization": f"Bearer {api_key}",
            "User-Agent": f"tradytics-mcp-py/{__version__}",
        }
        if session_id:
            headers["Mcp-Session-Id"] = session_id

        req = urllib.request.Request(
            url,
            data=json.dumps(msg).encode("utf-8"),
            headers=headers,
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                sid = resp.headers.get("Mcp-Session-Id")
                if sid:
                    session_id = sid
                if resp.status in (202, 204):
                    continue
                body = resp.read().decode("utf-8", errors="replace").strip()
                if not body:
                    continue
                ctype = (resp.headers.get("Content-Type") or "").lower()
                if "text/event-stream" in ctype:
                    _emit_sse(body)
                else:
                    parsed = json.loads(body)
                    if isinstance(parsed, list):
                        for item in parsed:
                            _send(item)
                    else:
                        _send(parsed)
        except urllib.error.HTTPError as exc:
            err_body = exc.read().decode("utf-8", errors="replace")[:300]
            detail = (
                "Unauthorized: check TRADYTICS_API_KEY at https://tradytics.com/developer/keys"
                if exc.code == 401
                else f"HTTP {exc.code}: {err_body}"
            )
            _send_error(req_id, -32000, detail)
        except Exception as exc:
            _send_error(req_id, -32603, f"Transport error: {exc}")


if __name__ == "__main__":
    main()
