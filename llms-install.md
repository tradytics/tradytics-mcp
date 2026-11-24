# Installing Tradytics MCP (for Cline and Autonomous Coding Agents)

This server supports both **hosted Streamable HTTP + OAuth** and a **zero-dependency local stdio bridge** (`npx -y tradytics-mcp` or `uvx tradytics-mcp`).

## Option A: Local stdio (recommended for Cline)

1. Ask the user for their `TRADYTICS_API_KEY` (they can copy a free key at https://tradytics.com/developer/keys with no credit card required).
2. Add this entry to the MCP settings JSON (`cline_mcp_settings.json` or equivalent):

```json
{
  "mcpServers": {
    "tradytics": {
      "command": "npx",
      "args": ["-y", "tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "<USER_API_KEY>"
      }
    }
  }
}
```

If `npx` is unavailable and Python / `uvx` is installed, use:

```json
{
  "mcpServers": {
    "tradytics": {
      "command": "uvx",
      "args": ["tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "<USER_API_KEY>"
      }
    }
  }
}
```

## Option B: Remote Streamable HTTP (OAuth)

If the client supports Streamable HTTP and MCP OAuth 2.1:

```json
{
  "mcpServers": {
    "tradytics": {
      "url": "https://tradytics.com/mcp"
    }
  }
}
```

## Verify Installation

Call `find_symbol` with `query: "Nvidia"` or `get_quotes` with `symbol: "NVDA"` to confirm connectivity.
