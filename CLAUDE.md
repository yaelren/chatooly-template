# Chatooly Tool Builder - Claude Code Instructions

## 🚨 MANDATORY DEVELOPMENT RULES

### Critical Rules Claude Code MUST Follow:

1. **EXPORT CONTAINER RULE** (MOST IMPORTANT)
   - ALL visual content MUST be inside `<div id="chatooly-canvas">`
   - NEVER create visual elements outside this container
   - NEVER rename or remove the #chatooly-canvas ID

2. **CDN SCRIPT RULE**
   - NEVER modify: `<script src="https://yaelren.github.io/chatooly-cdn/js/core.min.js"></script>`
   - This handles all export and publishing functionality
   - Auto-updates when CDN is updated

3. **EXPORT BUTTON RULE**
   - NEVER create custom export buttons
   - CDN automatically adds the export button
   - Position controlled by `buttonPosition` in config

4. **CANVAS SIZE RULE**
   - Visual area minimum 800x600px
   - Must be responsive for mobile

5. **CSS VARIABLE RULE**
   - ALWAYS use Chatooly CSS variables
   - NEVER hardcode colors/fonts/spacing
   - Check live CSS before ANY styling change

### Verification After EVERY Change:
✓ All visual content inside #chatooly-canvas
✓ CDN script intact and loading
✓ Export button appears correctly
✓ Tool exports properly
✓ No JavaScript console errors
✓ Mobile responsive

## 🚨 CRITICAL: Required Canvas Structure

**MANDATORY FOR ALL TOOLS**: Use this exact HTML structure to prevent publishing issues:

```html
<div id="chatooly-container">
    <canvas id="chatooly-canvas"></canvas>
</div>
```

**JavaScript MUST use:**
```javascript
const canvas = document.getElementById('chatooly-canvas');
```

❌ **DO NOT** use other IDs like `tool-canvas`, `main-canvas`, etc.
❌ **DO NOT** nest containers differently - this breaks publishing

## 🎯 When User Says "Let's Start" or "Build a Tool"

### Step 0: Verify Project Location
First, check if we're in the correct project folder:
- Look for `index.html`, `package.json`, and the `js` folder
- If these files aren't visible, we might be in the wrong folder
- Ask the user to navigate to their chatooly-template folder
- The correct folder should contain the template files

### Step 1: Create Task List with TodoWrite
Immediately create a todo list to track the build process:
```
✅ Gather tool information
✅ Update configuration
✅ Build HTML structure  
✅ Implement main functionality
✅ Add canvas resize handling (if needed)
✅ Implement high-res export
✅ Test export functionality
```

### Step 2: Gather Basic Information
Ask the user these questions to fill out the config:
1. What should your tool be called?
2. What category best fits? (generators/visualizers/editors/utilities/games/art)
3. One sentence description of what it does
4. Your name (for author credit)

### Step 3: Update Configuration
Update `js/chatooly-config.js` with their answers:
```javascript
window.ChatoolyConfig = {
    name: "[Tool Name]",
    category: "[category]",
    tags: [], // Add relevant tags based on what they're building
    description: "[Their description]",
    author: "[Their name]",
    version: "1.0.0",
    resolution: 2,
    buttonPosition: "bottom-right"
};
```

### Step 4: Ask What They Want to Create
After config is set, ask: "Great! Now tell me what you want to create and I'll build it for you."

### Step 5: Build According to Chatooly Rules
BEFORE WRITING ANY CODE:
- Re-read the MANDATORY DEVELOPMENT RULES above
- Verify all visual content will go inside #chatooly-canvas
- Plan which library to use (if any)
- Update TodoWrite with specific implementation tasks

## 🚨 CRITICAL: Canvas Resize & Mouse Coordinate Handling

**MANDATORY FOR ALL CANVAS-BASED TOOLS**: Implement proper resize event handling and mouse coordinate mapping.

### ⚡ Essential Implementation Code:

```javascript
// 1. Constructor - track dimensions
constructor() {
    this.previousCanvasSize = { width: 0, height: 0 };
}

// 2. Event listeners
setupEventListeners() {
    document.addEventListener('chatooly:canvas-resized', (e) => this.onCanvasResized(e));
}

// 3. Resize handler - scale elements
onCanvasResized(e) {
    if (!this.hasContent) return;
    
    const oldWidth = this.previousCanvasSize.width;
    const oldHeight = this.previousCanvasSize.height;
    const newWidth = e.detail.canvas.width;
    const newHeight = e.detail.canvas.height;
    
    if (oldWidth === 0 || oldHeight === 0) {
        this.previousCanvasSize = { width: newWidth, height: newHeight };
        this.redrawContent();
        return;
    }
    
    const scaleX = newWidth / oldWidth;
    const scaleY = newHeight / oldHeight;
    
    // Scale ALL interactive elements
    this.interactiveElements.forEach(element => {
        element.x *= scaleX;
        element.y *= scaleY;
        if (element.radius) element.radius *= Math.min(scaleX, scaleY);
    });
    
    this.previousCanvasSize = { width: newWidth, height: newHeight };
    this.redrawContent();
}

// 4. Mouse coordinate mapping
onMouseClick(e) {
    const coords = window.Chatooly ? 
        window.Chatooly.utils.mapMouseToCanvas(e, this.canvas) :
        this.fallbackMouseMapping(e);
    
    const x = coords.x;
    const y = coords.y;
}

// 5. Fallback mapping
fallbackMouseMapping(e) {
    const rect = this.canvas.getBoundingClientRect();
    const displayX = e.clientX - rect.left;
    const displayY = e.clientY - rect.top;
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return { x: displayX * scaleX, y: displayY * scaleY };
}
```

## 🔥 HIGH-RESOLUTION EXPORT (MANDATORY)

All tools MUST implement `window.renderHighResolution()` for quality exports:

```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    // Validate tool state
    if (!yourTool || !yourTool.isInitialized) {
        console.warn('Tool not ready for high-res export');
        return;
    }
    
    // Set up high-res canvas
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = yourTool.canvas.width * scale;
    targetCanvas.height = yourTool.canvas.height * scale;
    
    // Clear and re-render at high resolution
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    
    // Tool-specific high-res rendering here
    // Re-create content from source data, not copy pixels
    
    console.log(`High-res export completed at ${scale}x resolution`);
};
```

## 📋 Claude Code Workflow

### When User Says "Build a Tool"

Claude Code will:

1. **Plan with TodoWrite**
   ```
   ✅ Update configuration
   ✅ Create HTML structure
   ✅ Implement main functionality
   ✅ Add canvas resize handling
   ✅ Implement high-res export
   ✅ Test export functionality
   ```

2. **Gather Information**
   - Tool name
   - Category (generators/visualizers/editors/utilities/games/art)
   - Description
   - Author name

3. **Update Configuration** (`js/chatooly-config.js`)
   ```javascript
   window.ChatoolyConfig = {
       name: "[Tool Name]",
       category: "[category]",
       tags: [],
       description: "[Description]",
       author: "[Author]",
       version: "1.0.0",
       resolution: 2,
       buttonPosition: "bottom-right"
   };
   ```

4. **Build According to Rules**
   - All visual content in `#chatooly-canvas`
   - Implement resize handling for interactive tools
   - Use proper mouse coordinate mapping
   - Create high-resolution export function
   - Test at different aspect ratios

## 🎯 Library Selection Guide

Claude Code automatically selects the best library:

| **Tool Type** | **Library** | **CDN** |
|--------------|------------|---------|
| **Animations** | GSAP | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` |
| **Creative Coding** | p5.js | `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js` |
| **Vector Graphics** | Paper.js | `https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js` |
| **3D Graphics** | Three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` |
| **Data Visualization** | Chart.js | `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js` |
| **Image Processing** | Canvas API | Native |

### Library-Specific Setup

#### Three.js (CRITICAL):
```javascript
const renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById('chatooly-canvas'),
    antialias: true, 
    preserveDrawingBuffer: true  // REQUIRED for exports
});
```

#### p5.js:
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // Connect to export system
}
```

## 🎨 Chatooly Design System

### Automatic Styling
The CDN automatically styles all standard HTML elements:

```html
<!-- All automatically styled with dark theme -->
<input type="text" placeholder="Enter text">
<input type="range" min="0" max="100">
<input type="color" value="#ff0000">
<select><option>Option</option></select>
<button>Click Me</button>
```

### CSS Variables
Use Chatooly variables for custom styling:

```css
.custom-element {
    background: var(--chatooly-color-primary);
    color: var(--chatooly-color-text);
    border: var(--chatooly-border-width) solid var(--chatooly-color-border);
    font-family: var(--chatooly-font-family);
}
```

## ✅ Claude Code Verification Checklist

Claude Code automatically verifies:

### Canvas & Export
- [ ] Canvas uses `id="chatooly-canvas"`
- [ ] High-res export function implemented
- [ ] Exports work at 1x, 2x, 4x resolutions
- [ ] Visual content properly contained

### Interactions
- [ ] Canvas resize events handled
- [ ] Mouse coordinates mapped correctly
- [ ] Interactive elements scale on resize
- [ ] No console errors during operation

### Testing
- [ ] Works in HD, Square, Portrait modes
- [ ] Export button visible and functional
- [ ] Publishing workflow available in dev mode

## 🚀 Publishing Your Tool

1. **Save with Git**
   ```bash
   git add .
   git commit -m "Ready to publish"
   git push
   ```

2. **Test Locally**
   ```bash
   npm run dev
   # Open http://localhost:8000
   ```

3. **Publish via CDN**
   - Click export button (📥) in bottom-right
   - Select "📤 Publish" from menu
   - Enter tool name
   - Tool uploads to staging
   - After approval: live at `tools.chatooly.com/[tool-name]`

## 🛠️ Claude Code Best Practices

### Task Management
Claude Code uses TodoWrite to track all tasks:
```
✅ Configuration updated
🔄 Building main functionality
⏳ Testing exports
```

### Multi-File Operations
Claude Code uses efficient tools:
- **MultiEdit** for multiple file changes
- **Parallel operations** for independent tasks
- **MCP servers** for specialized functionality

### Error Handling
Claude Code automatically:
- Validates changes before execution
- Tests functionality after implementation
- Runs lint/typecheck when available
- Provides detailed error messages

## 🔴 Common Issues & Solutions

### Canvas Export Issues
- **Blank export?** → Ensure `id="chatooly-canvas"`
- **Wrong proportions?** → Remove wrapper divs
- **Pixelated export?** → Implement proper high-res function

### Interaction Issues
- **Content disappears on resize?** → Add resize event handler
- **Mouse clicks misaligned?** → Use `mapMouseToCanvas()`
- **Elements jump positions?** → Implement scaling in resize handler

### Development Issues
- **No export button?** → Check CDN script loaded
- **Publishing unavailable?** → Must run on localhost
- **Console errors?** → Check browser developer tools

## 📚 Resources

### Documentation
- [Chatooly API Reference](CHATOOLY_API.md)
- [Template README](README.md)
- [Base44 Guidelines](BASE44_GUIDELINES.txt)

### Live CSS References
- [CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)
- [Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css)
- [Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)

### Support
- GitHub Issues: Report problems with the template
- Chatooly Tools: Browse existing tools for inspiration
- CDN Updates: Automatic design system improvements

## 💡 Quick Tips for Claude Code Users

1. **Start Simple**: Build MVP first, then iterate
2. **Use TodoWrite**: Track all tasks systematically
3. **Test Often**: Export at each milestone
4. **Save Progress**: Regular git commits
5. **Ask for Help**: Claude Code can explain any aspect

## 🎯 Ready to Build?

Just tell Claude Code what you want to create, and watch your tool come to life! Claude Code will handle all the technical details while you focus on your creative vision.

Example prompts:
- "Build a gradient generator with color stops"
- "Create a mandala pattern generator"
- "Make an image glitch effect tool"
- "Build a data visualization dashboard"

Claude Code will automatically:
- Set up the project structure
- Choose the right libraries
- Implement all required functionality
- Handle exports and publishing
- Test everything works correctly

Happy building with Chatooly and Claude Code!