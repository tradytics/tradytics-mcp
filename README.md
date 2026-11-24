<p align="center">
  <a href="https://tradytics.com/docs/mcp"><img src="https://tradytics.com/api/v2/og/sdk.png?v=4" alt="Tradytics Market Data MCP Server" width="100%"></a>
</p>

# Tradytics MCP Server

The official Model Context Protocol (MCP) server for [Tradytics](https://tradytics.com): US stock quotes and bars, stitched options flow, options chains, dealer gamma/vanna/charm, ranked dark pool prints, stock perpetuals, fundamentals, SEC filings with semantic passage search, earnings transcripts, insider/13F/Congress disclosures, and Kalshi/Polymarket prediction markets. Zero dependencies.

[![npm](https://img.shields.io/npm/v/tradytics-mcp?color=168eff&label=npm)](https://www.npmjs.com/package/tradytics-mcp)
[![PyPI](https://img.shields.io/pypi/v/tradytics-mcp?color=168eff&label=pypi)](https://pypi.org/project/tradytics-mcp/)
[![MCP](https://img.shields.io/badge/MCP-Streamable%20HTTP%20%2B%20stdio-16171a)](https://tradytics.com/docs/mcp)
[![Docs](https://img.shields.io/badge/docs-tradytics.com-16171a)](https://tradytics.com/docs/mcp)
[![License](https://img.shields.io/badge/license-MIT-16171a)](LICENSE)
[![Tradytics MCP connector](https://glama.ai/mcp/connectors/com.tradytics/market-data/badges/score.svg)](https://glama.ai/mcp/connectors/com.tradytics/market-data)

```bash
# Hosted Streamable HTTP + OAuth (Claude Code)
claude mcp add --transport http tradytics https://tradytics.com/mcp

# Local stdio bridge (Node 18+ or Python 3.8+, zero dependencies)
TRADYTICS_API_KEY="tdy_..." npx -y tradytics-mcp
TRADYTICS_API_KEY="tdy_..." uvx tradytics-mcp
```

## What your agent gets

- **Options flow and chains**: full OPRA tape stitched into sweeps, blocks and splits with inferred trade side, plus live chains, contract bars, open interest and implied volatility.
- **Dealer positioning**: pre-computed gamma, delta, vanna and charm by strike and expiry, with gamma flip, call wall and put wall.
- **Dark pools**: block and off-exchange prints ranked against each stock's rolling 12 months, plus key institutional price levels.
- **Fundamentals and SEC filings**: income statements, balance sheets, cash flows, revenue segments, KPIs, earnings call transcripts, Form 4 insiders, 13F institutions, Congress trades, and semantic passage search across 10-K/10-Q/8-K filings with EDGAR links.
- **Equities, perpetuals and probabilities**: US quotes and bars, full-market screener, flow signals, 24/7 stock perpetuals, and Kalshi/Polymarket finance probabilities.

## Quickstart

### 1. Hosted Remote MCP (OAuth, zero install)

Recommended for **Claude**, **Claude Code**, **ChatGPT**, and **Cursor**. Point your client at `https://tradytics.com/mcp` and sign in with OAuth.

**Cursor (`.cursor/mcp.json`):**
```json
{
  "mcpServers": {
    "tradytics": {
      "url": "https://tradytics.com/mcp"
    }
  }
}
```

### 2. Local Stdio MCP (`npx` / `uvx` / `pip`, API key auth)

Recommended for **Claude Desktop**, **Cline**, **Windsurf**, Docker containers, and headless agents. Create a free API key at [tradytics.com/developer/keys](https://tradytics.com/developer/keys).

**Node.js (`npx`):**
```json
{
  "mcpServers": {
    "tradytics": {
      "command": "npx",
      "args": ["-y", "tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "tdy_..."
      }
    }
  }
}
```

**Python (`uvx` or `pip install tradytics-mcp`):**
```json
{
  "mcpServers": {
    "tradytics": {
      "command": "uvx",
      "args": ["tradytics-mcp"],
      "env": {
        "TRADYTICS_API_KEY": "tdy_..."
      }
    }
  }
}
```

## Example prompts

Once connected, ask your assistant:

- *"Pull NVDA's largest opening options flow orders today, its dealer gamma flip and call/put walls, and top ranked dark pool levels."*
- *"Search Apple's latest 10-K for supply chain risks and compare its last four quarters of revenue segments."*
- *"Check SPY 0DTE dealer positioning and compare Kalshi/Polymarket S&P 500 probabilities against the options expected move."*

## Available tools

<details>
<summary>Every tool exposed by the server (synced automatically from tradytics.com/mcp)</summary>

| Scope | Tools |
| :--- | :--- |
| **Options** | `get_options_flow`, `get_flow_summary`, `get_option_contracts`, `get_dealer_positioning`, `get_volatility` |
| **Dark pool** | `get_dark_pool` |
| **Perpetuals** | `get_perp_markets`, `get_perp_prints` |
| **Equities & market** | `get_quotes`, `get_price_bars`, `get_stock_snapshot`, `get_stock_data`, `get_market`, `get_calendar`, `get_news`, `get_insights` |
| **Fundamentals & SEC** | `get_fundamentals`, `get_transcripts`, `get_filings`, `get_disclosures`, `get_kpis` |
| **Screener & signals** | `screen_stocks`, `get_screener_fields`, `get_signals`, `get_signal_performance` |
| **Probabilities & fund** | `get_probabilities`, `get_ai_fund` |
| **Account & utilities** | `get_my_portfolio`, `get_my_backtests`, `get_my_dashboards`, `get_my_watchlists`, `find_symbol` |

</details>

## More

- [MCP setup guide](https://tradytics.com/docs/mcp) and [rate limits](https://tradytics.com/docs/rate-limits)
- [Python SDK](https://pypi.org/project/tradytics/): `pip install tradytics`
- [JavaScript SDK](https://www.npmjs.com/package/tradytics): `npm install tradytics`
- [Agent skill](https://www.skills.sh/tradytics/skills/tradytics): `npx skills add tradytics/skills`
- [Starter prompts & scripts](https://github.com/tradytics/options-flow-mcp-starter)
- [Market data API benchmark](https://github.com/tradytics/market-data-api-benchmark)
- Support: [hello@tradytics.com](mailto:hello@tradytics.com)

MIT License. Not investment advice; all market data is for informational purposes only.
