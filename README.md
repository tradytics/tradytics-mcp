# Tradytics MCP Server (`tradytics-mcp`)

[![Tradytics MCP connector](https://glama.ai/mcp/connectors/com.tradytics/market-data/badges/score.svg)](https://glama.ai/mcp/connectors/com.tradytics/market-data)
[![npm](https://img.shields.io/npm/v/tradytics-mcp?color=168eff&label=npm)](https://www.npmjs.com/package/tradytics-mcp)
[![PyPI](https://img.shields.io/pypi/v/tradytics-mcp?color=168eff&label=pypi)](https://pypi.org/project/tradytics-mcp/)
[![License: MIT](https://img.shields.io/badge/license-MIT-16171a)](LICENSE)

Official Model Context Protocol (MCP) server for [Tradytics](https://tradytics.com) US market data: stitched options flow, options chains, dealer gamma/vanna/charm, ranked dark pool prints, stock perpetuals, stock quotes and bars, company fundamentals, SEC filings with semantic passage search, earnings transcripts, insider/13F/Congress disclosures, screener signals, and Kalshi/Polymarket prediction market odds.

Connect in two ways:
1. **Remote Streamable HTTP + OAuth (recommended for Claude, ChatGPT, Cursor):** `https://tradytics.com/mcp`
2. **Local stdio bridge (`npx -y tradytics-mcp` or `uvx tradytics-mcp`):** zero-dependency bridge using `TRADYTICS_API_KEY` for Claude Desktop, Cline, Windsurf, Docker agents, LangChain, CrewAI, and headless workflows.

---

## Option 1: Hosted Remote MCP (OAuth, Zero Install)

- **Server URL:** `https://tradytics.com/mcp`
- **Official MCP Registry ID:** `com.tradytics/market-data`
- **Setup guide:** [tradytics.com/docs/mcp](https://tradytics.com/docs/mcp)

### Claude Code
```bash
claude mcp add --transport http tradytics https://tradytics.com/mcp
```

### Cursor (`.cursor/mcp.json`)
```json
{
  "mcpServers": {
    "tradytics": {
      "url": "https://tradytics.com/mcp"
    }
  }
}
```

---

## Option 2: Local Stdio MCP (`npx` / `uvx` / `pip`, API Key Auth)

Create an API key at [tradytics.com/developer/keys](https://tradytics.com/developer/keys) and configure your MCP client:

### Node.js (`npx`, Node 18+, zero dependencies)
```json
{
  "mcpServers": {
    "tradytics": {
      "command": "npx",
      "args": ["-y", "tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "tdy_your_key_here"
      }
    }
  }
}
```

### Python (`uvx` or `pip install tradytics-mcp`, Python 3.8+, zero dependencies)
```json
{
  "mcpServers": {
    "tradytics": {
      "command": "uvx",
      "args": ["tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "tdy_your_key_here"
      }
    }
  }
}
```

Or install globally:
```bash
pip install tradytics-mcp
TRADYTICS_API_KEY="tdy_..." tradytics-mcp
```

---

## Available Data Scopes & Tools

All tools stay automatically in sync with `https://tradytics.com/mcp`:

| Scope | Key Tools |
| :--- | :--- |
| **Options flow & chains** | `get_options_flow`, `get_flow_summary`, `get_option_contracts`, `get_dealer_positioning`, `get_volatility` |
| **Dark pools** | `get_dark_pool` (ranked block prints and volume price levels) |
| **Stock perpetuals** | `get_perp_markets`, `get_perp_prints` |
| **Equities & market** | `get_quotes`, `get_price_bars`, `get_stock_snapshot`, `get_stock_data`, `get_market`, `get_calendar`, `get_news`, `get_insights` |
| **Fundamentals & SEC** | `get_fundamentals`, `get_transcripts`, `get_filings` (including semantic passage search), `get_disclosures`, `get_kpis` |
| **Screening & signals** | `screen_stocks`, `get_screener_fields`, `get_signals`, `get_signal_performance` |
| **Prediction markets** | `get_probabilities` (Kalshi and Polymarket) |
| **AI Fund & account** | `get_ai_fund`, `get_my_portfolio`, `get_my_backtests`, `get_my_dashboards`, `get_my_watchlists`, `find_symbol` |

---

## Related Packages & Resources

- **Agent Skill (Claude Code, Codex, Cursor):** `npx skills add tradytics/skills` ([github.com/tradytics/skills](https://github.com/tradytics/skills))
- **Starter prompts & scripts:** [github.com/tradytics/options-flow-mcp-starter](https://github.com/tradytics/options-flow-mcp-starter)
- **Python & JS REST SDKs:** `pip install tradytics` | `npm install tradytics`
- **Full docs & rate limits:** [tradytics.com/docs](https://tradytics.com/docs) | [tradytics.com/docs/rate-limits](https://tradytics.com/docs/rate-limits)

## License

MIT. Not investment advice; all market data is for informational purposes only.
