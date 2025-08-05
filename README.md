# Chatooly Tool Template

**Author: Yael Renous - Studio Video**

A simple template for creating web-based design tools with Chatooly integration.

## 🚀 Quick Start

### 1. Get the Template
```bash
# Option A: Use GitHub Template (recommended)
# Go to: https://github.com/yaelren/chatooly-template
# Click "Use this template" → "Create a new repository"

# Option B: Clone directly
git clone https://github.com/yaelren/chatooly-template my-tool
cd my-tool
```

### 2. Start Development Server

Choose one of these options:

#### Option A: Using npm (simplest)
```bash
npm run dev
```

#### Option B: Using Python (cross-platform)
```bash
# Python 3
python3 -m http.server 8000

# Python 2 (older systems)
python -m http.server 8000
```

#### Option C: Using Node.js
```bash
# Install a simple server
npm install -g http-server

# Run server
http-server -p 8000
```

#### Option D: Using VS Code
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. Open in Browser
Go to: `http://localhost:8000`

## 📝 How to Build Your Tool

### 1. Configure Your Tool
Edit `js/chatooly-config.js`:
```javascript
window.ChatoolyConfig = {
    name: "My Amazing Tool",           // ← Change this
    category: "generators",            // ← Choose from options below
    tags: ["gradient", "color"],       // ← Add relevant tags
    description: "What your tool does", // ← Describe your tool
    author: "Your Name"                // ← Your name
};
```

**Category Options:**
- `"generators"` - Creates patterns, gradients, textures, layouts
- `"visualizers"` - Data visualization, charts, interactive displays  
- `"editors"` - Image editors, text formatters, code tools
- `"utilities"` - Color pickers, calculators, converters
- `"games"` - Interactive games, puzzles, simulations
- `"art"` - Creative drawing tools, artistic generators

### 2. Add Your Controls
Edit `index.html` in the controls section:
```html
<!-- Uncomment and modify these examples: -->
<div class="control-group">
    <label for="color-input">Color</label>
    <input type="color" id="color-input" value="#3498db">
</div>

<div class="control-group">
    <label for="size-slider">Size</label>
    <input type="range" id="size-slider" min="10" max="100" value="50">
</div>
```

### 3. Add Your Visual Output
Edit the `#chatooly-canvas` section in `index.html`:
```html
<!-- For canvas-based tools (p5.js, Three.js): -->
<canvas id="myCanvas"></canvas>

<!-- For DOM-based tools: -->
<div class="design-output"></div>
```

### 4. Add Your Logic
Edit `js/main.js`:
```javascript
// Your tool's JavaScript code goes here
// Examples:
// - Event listeners for your controls
// - Canvas drawing functions  
// - p5.js sketches
// - Three.js scenes
```

### 5. Style Your Tool
Edit `styles.css` in the "EDIT" sections to customize the appearance.

## 🎨 What You Can Edit vs. What You Shouldn't

### ✅ EDIT THESE:
- Tool name and title
- Controls in the left panel
- Content inside `#chatooly-canvas`
- Custom styles in marked sections
- All of `js/main.js`
- Configuration in `js/chatooly-config.js`

### ⚠️ DON'T EDIT THESE:
- CDN script tag
- `#chatooly-canvas` container (but edit contents)
- Base layout structure
- Core CSS layout styles

## 📤 Publishing Your Tool

1. Make sure your development server is running (`npm run dev`)
2. Open your tool in the browser
3. Click the export button (📥) in the bottom-right corner
4. Select "📤 Publish" from the menu
5. Enter your tool name when prompted
6. Your tool will upload to staging for review
7. After approval, it goes live at `tools.chatooly.com/your-tool`

## 🛠 Development Tips

### Testing Export
- Click the export button to test PNG export
- Try different resolutions (1x, 2x, 4x)
- Make sure your visual content is inside `#chatooly-canvas`

### Common Issues
- **Export button not appearing**: Check that the CDN script loaded
- **Export not working**: Ensure content is in `#chatooly-canvas`
- **Server not starting**: Try different port: `python3 -m http.server 3000`

### Working with Libraries

#### p5.js
```javascript
// In js/main.js
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas');
}

function draw() {
    // Your drawing code
}
```

#### Three.js
```javascript
// In js/main.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800/600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(800, 600);
document.getElementById('chatooly-canvas').appendChild(renderer.domElement);
```

## 📁 File Structure

```
my-tool/
├── index.html              # Main HTML structure  
├── styles.css              # All CSS styling
├── js/
│   ├── main.js            # Your tool logic
│   └── chatooly-config.js # Chatooly configuration
├── package.json           # Simple dev script
└── README.md              # This file
```

## 🆘 Need Help?

- **Template Issues**: [GitHub Issues](https://github.com/yaelren/chatooly-template/issues)

## 📄 License

MIT License - feel free to use for any project!

---
**Template created by Yael Renous - Studio Video**