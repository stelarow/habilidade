# Claude MCP Add Command Guide

## Basic Syntax

```bash
claude mcp add <name> <command> [args...]
```

## Transport Types

### 1. MCP Stdio Server (Default)
```bash
# Basic stdio server
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2

# With environment variables
claude mcp add local-server -e DATABASE_URL=postgres://... -- node server.js
```

### 2. MCP SSE Server
```bash
# Basic SSE server
claude mcp add --transport sse sse-server https://example.com/sse-endpoint

# SSE server with custom headers
claude mcp add --transport sse api-server https://api.example.com/mcp --header "X-API-Key: your-key"
```

### 3. MCP HTTP Server
```bash
# Basic HTTP server
claude mcp add --transport http http-server https://example.com/mcp

# HTTP server with authentication
claude mcp add --transport http secure-server https://api.example.com/mcp --header "Authorization: Bearer your-token"
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `<name>` | Unique identifier for the server | `my-server` |
| `--transport` | Server type: stdio, sse, http | `--transport sse` |
| `-e`, `--env` | Set environment variables | `-e API_KEY=123` |
| `--header` | Add custom headers | `--header "X-API-Key: key"` |
| `-s`, `--scope` | Configuration scope | `--scope project` |

## Scope Options

- **local** (default): Personal server, project-specific
- **project**: Shared with team via `.mcp.json`
- **user**: Available across all projects

## Examples

### Environment Variables
```bash
# Multiple environment variables
claude mcp add database-server -e DB_HOST=localhost -e DB_PORT=5432 -- python db_server.py
```

### Project-wide Server
```bash
# Add server for entire project team
claude mcp add --scope project team-api https://api.company.com/mcp
```

### Authenticated API Server
```bash
# Server with authentication headers
claude mcp add --transport http \
  --header "Authorization: Bearer $(cat ~/.api-token)" \
  secure-api https://secure-api.example.com/mcp
```

## Tips

- Use environment variables with `-e KEY=value` for sensitive data
- Configure server startup timeout with `MCP_TIMEOUT` environment variable
- Check server status using `/mcp` command in Claude
- Use `--scope project` to share servers with your team