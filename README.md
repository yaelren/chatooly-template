# Chatooly Tool Template

**Build web tools with AI assistance - No coding experience needed!**

## 🚀 Quick Start (3 Simple Steps)

### Step 1: Clone the Template
```bash
git clone https://github.com/yaelren/chatooly-template my-tool
cd my-tool
```

### Step 2: Open in Cursor
1. Open **Cursor** (AI code editor)
2. Click **File** → **Open Folder**
3. Select your `my-tool` folder
4. Click **Open**

### Step 3: Start Building with AI
1. Open Cursor Chat (Cmd+L or Ctrl+L)
2. Drag the `START_HERE.md` file into the chat
3. Type: **"Let's start building"**
4. Answer a few questions and watch AI build your tool!

## 🎨 Testing Your Tool

Once AI builds your tool:
1. Run `npm run dev` in terminal
2. Open http://localhost:8000 in your browser
3. Test your tool and the export button (📥)
4. Ask AI to make any changes you want!

## 📤 Publishing Your Tool

When you're happy with your tool:
1. Click the export button (📥) in bottom-right
2. Select "📤 Publish"
3. Enter your tool name
4. Your tool goes live at `tools.chatooly.com/your-tool`!

---

## 📚 Want to Know More?

<details>
<summary><b>Manual Setup Options</b></summary>

### Alternative ways to start the server:

**Python:**
```bash
python3 -m http.server 8000
```

**Node.js:**
```bash
npm install -g http-server
http-server -p 8000
```

**VS Code Live Server:**
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"
</details>

<details>
<summary><b>Understanding the Files</b></summary>

```
my-tool/
├── START_HERE.md          # Instructions for AI
├── index.html             # Your tool's structure
├── styles.css             # How it looks
├── js/
│   ├── main.js           # How it works
│   └── chatooly-config.js # Tool settings
└── package.json          # Project setup
```
</details>

<details>
<summary><b>Manual Editing (Advanced)</b></summary>

If you want to edit files yourself:

1. **Config**: Edit `js/chatooly-config.js` for tool name and info
2. **Controls**: Add HTML controls in `index.html`
3. **Logic**: Write JavaScript in `js/main.js`
4. **Styles**: Customize appearance in `styles.css`

Remember: Keep visual content inside `#chatooly-canvas` div!
</details>

<details>
<summary><b>Troubleshooting</b></summary>

- **No export button?** Check if server is running
- **Export is blank?** Content must be in `#chatooly-canvas`
- **Can't publish?** Must run locally first (`npm run dev`)
- **Need help?** [Create an issue](https://github.com/yaelren/chatooly-template/issues)
</details>

---

**Built with ❤️ by Yael Renous - Studio Video**