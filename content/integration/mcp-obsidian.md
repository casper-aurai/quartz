# MCP-Obsidian Integration

This vault is prepared to use the MCP server that connects to Obsidian via the Local REST API community plugin.

References:
- Repo: https://github.com/MarkusPfundstein/mcp-obsidian
- Requires: Obsidian plugin “Local REST API” (enabled) and its API key

## 1) Secrets: .env
Copy `.env.example` to `.env` at the vault root and fill it with your plugin values:

```
OBSIDIAN_API_KEY=your_api_key_here
# Optional (defaults shown)
OBSIDIAN_HOST=127.0.0.1
OBSIDIAN_PORT=27124
```

Note: `.env` is gitignored by default.

## 2) Installing mcp-obsidian
The server is published as a Python package. Using uv/uvx is recommended.

- Install uv if you don’t have it: https://docs.astral.sh/uv/getting-started/installation/
- Verify `uvx` is available:
  - macOS: `which uvx`

Run it manually to test:

```
uvx mcp-obsidian
```

If your client can’t find `uvx`, substitute the full path (from `which uvx`).

## 3) Configure your MCP client
Most MCP clients accept a JSON block mapping a server name to a command.

Example configuration snippet:

```json
{
  "mcp-obsidian": {
    "command": "uvx",
    "args": ["mcp-obsidian"],
    "env": {
      "OBSIDIAN_API_KEY": "${OBSIDIAN_API_KEY}",
      "OBSIDIAN_HOST": "${OBSIDIAN_HOST}",
      "OBSIDIAN_PORT": "${OBSIDIAN_PORT}"
    }
  }
}
```

If env interpolation isn’t supported by your MCP client, paste literal values instead of `${...}`.

## 4) Local REST API plugin
- Open Obsidian → Settings → Community Plugins → Local REST API
- Copy the API key and confirm host/port (defaults: 127.0.0.1 : 27124)
- Ensure the REST API is enabled and Obsidian is running when using MCP

## 5) Tools provided by mcp-obsidian
Per the upstream README, the server exposes:
- `list_files_in_vault`
- `list_files_in_dir`
- `get_file_contents`
- `search`
- `patch_content` (insert around headings/block refs/frontmatter)
- `append_content`
- `delete_file`

## 6) Example prompts
- “Get the contents of the last architecture call note and summarize them.”
- “Search for all files where Azure CosmosDb is mentioned and explain the context.”
- “Summarize the last meeting notes and put them into a new note 'summary meeting.md'. Add an introduction for email.”

## 7) Troubleshooting
- If the client can’t find `uvx`, use the absolute path from `which uvx` in the config.
- Make sure `.env` has the correct API key and Obsidian is open with the Local REST API plugin enabled.
- Port conflicts: change `OBSIDIAN_PORT` in both plugin settings and `.env`.
