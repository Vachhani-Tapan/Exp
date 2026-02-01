# LedgerCore - Live Server Settings

## If you're using VS Code Live Server:

Add this to your VS Code `settings.json`:

```json
{
  "liveServer.settings.ignoreFiles": [
    "**/.git/**",
    "**/.vscode/**",
    "**/.gitignore",
    "**/node_modules/**",
    "**/data/**",
    "**/*.db",
    "**/.*.db"
  ]
}
```

## If you're using nodemon for the server:

Create a `nodemon.json` file with:

```json
{
  "watch": ["server.js", "database.js"],
  "ignore": ["data/*", "*.db", ".*.db", "node_modules/*"],
  "ext": "js"
}
```

Then run: `nodemon server.js`

## Alternative: Use a dedicated dev server

Instead of Live Server, just open the HTML file directly in the browser.
The React app will still work fine and communicate with your Node.js backend on port 5000.

