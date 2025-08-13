# Chatooly Tool Builder - AI Assistant Instructions

## ⚠️ IMPORTANT: BEFORE YOU START
1. **READ THE .cursorrules FILE** - It contains critical rules that MUST be followed
2. **CHECK LIVE CSS LINKS** - Before ANY styling change, check these ACTIVE links:
   - 🔗 [CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)
   - 🔗 [Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css) 
   - 🔗 [Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)
3. **VERIFY AFTER EVERY CHANGE** - Check that all Chatooly rules are still being followed
4. **REMIND USER AFTER CHANGES** - Always say: "✅ This follows Chatooly design system - your tool gets automatic CDN updates"
5. **ADD TO MEMORY** - Remember these rules throughout the entire conversation:
   - ALL visual content goes inside #chatooly-canvas
   - NEVER modify the CDN script
   - NEVER create custom export buttons
   - USE CSS variables, not hardcoded values
   - ALWAYS test exports after changes

## When User Wants to Build a Tool
The user might say things like:
- "Let's start building"
- "Help me create a tool"
- "I want to make something"
- "Build a [type] tool"
- Or any variation indicating they want to create something

## Step 0: Verify Project Location
First, check if we're in the correct project folder:
- Look for `index.html`, `package.json`, and the `js` folder
- If these files aren't visible, we might be in the wrong folder
- Ask the user to navigate to their project folder or open it in the IDE
- The correct folder should contain the chatooly-template files

## Step 1: Gather Basic Information
Ask the user these questions to fill out the config:
1. What should your tool be called?
2. What category best fits? (generators/visualizers/editors/utilities/games/art)
3. One sentence description of what it does
4. Your name (for author credit)

## Step 2: Update Configuration
Make sure to navigate to the correct file path (relative to the project root).
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

## Step 3: Ask What They Want to Create
After config is set, ask: "Great! Now tell me what you want to create and I'll build it for you."

## Step 4: Build According to Chatooly Rules

**🔴 BEFORE WRITING ANY CODE: Re-read .cursorrules file to ensure compliance**

### CRITICAL Chatooly API Requirements:
- **Export Container**: ALL visual content MUST be inside `#chatooly-canvas` div
- **Clean Export Container**: ONLY put the canvas or visual elements inside `#chatooly-canvas` - no extra divs, overlays, UI controls, or decorative elements that shouldn't appear in the final exported PNG
- **CDN Script**: Already included via `<script src="https://yaelren.github.io/chatooly-cdn/js/core.js"></script>`
- **Export Button**: Automatically appears in bottom-right corner (don't create your own)
- **Canvas Size**: Minimum 800x600px for visual area

### Files You Can Edit:
- `index.html` - Add controls in the controls section, add visual elements inside `#chatooly-canvas`
- `styles.css` - Only edit sections marked with "EDIT THIS SECTION"
- `js/main.js` - All tool logic goes here
- `js/chatooly-config.js` - Tool metadata

### Files You CANNOT Edit:
- The CDN script tag in index.html
- The base layout structure
- Core CSS layout styles
- The `#chatooly-canvas` container ID (but you can add content inside it)

### Library Integration Examples:

#### For p5.js tools:
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // CRITICAL: Put canvas in export container
}
```

#### For Three.js tools:
```javascript
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.getElementById('chatooly-canvas').appendChild(renderer.domElement);
```

#### For regular canvas:
```javascript
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.getElementById('chatooly-canvas').appendChild(canvas);
```

#### For DOM-based tools:
```html
<div id="chatooly-canvas">
    <div class="design-output">
        <!-- Visual elements here -->
    </div>
</div>
```

### ❌ WHAT NOT TO PUT IN #chatooly-canvas:
```html
<!-- DON'T DO THIS - UI controls should be outside -->
<div id="chatooly-canvas">
    <canvas id="myCanvas"></canvas>
    <button>Download</button>  <!-- NO! -->
    <div class="controls">     <!-- NO! -->
        <input type="range">   <!-- NO! -->
    </div>
</div>

<!-- DON'T DO THIS - decorative elements -->
<div id="chatooly-canvas">
    <div class="fancy-border">  <!-- NO! -->
        <canvas id="myCanvas"></canvas>
        <div class="watermark">Made with MyTool</div>  <!-- NO! -->
    </div>
</div>
```

### ✅ CORRECT WAY:
```html
<!-- Controls outside export container -->
<div class="controls">
    <button>Download</button>
    <input type="range">
</div>

<!-- Only visual content inside -->
<div id="chatooly-canvas">
    <canvas id="myCanvas"></canvas>
</div>
```

## Step 5: Testing & Viewing
Tell the user:
- Make sure you're in the project root folder (where package.json is located)
- Run `npm run dev` to start the local server
- If the command fails, navigate to the correct folder first
- Open http://localhost:8000 to see your tool
- The export button (📥) appears automatically in the bottom-right corner
- Click it to test PNG export at different resolutions (1x, 2x, 4x)

## Step 6: Saving Your Progress with Git

### Why Use Git?
Since the user cloned this template from GitHub, they already have git set up! Git lets them:
- Save snapshots of their work at any point
- Go back to earlier versions if something breaks
- Push changes back to their GitHub repository
- Keep their work safe in the cloud

### The Git Setup is Already Done!
The user's project is already connected to their GitHub repository because they cloned the template. They can start saving right away!

### Saving Work Locally (do this regularly):
```bash
git add .  # Stage your changes
git commit -m "Added new feature"  # Save a snapshot with a description
```

### Pushing to GitHub (to backup in the cloud):
```bash
git push  # Send your latest commits to GitHub
```

That's it! Since they cloned the template, the connection to GitHub is already set up.

### When to Save with Git:
Tell the user to commit their work:
- After getting something working
- Before making big changes
- At the end of each coding session
- Before publishing to Chatooly

### Simple Git Workflow for Beginners:
1. Make changes to your tool
2. Test that it works
3. Save with git:
   ```bash
   git add .
   git commit -m "Describe what you changed"
   git push  # If you have GitHub set up
   ```

## Step 7: Publishing
When the user is ready to publish, explain:
1. First, save your work with git: `git add . && git commit -m "Ready to publish"`
2. Make sure the tool is running locally (`npm run dev`)
3. Click the export button (📥) in the bottom-right corner
4. Select "📤 Publish" from the menu (only available in development mode)
5. Enter your tool name when prompted
6. The tool uploads to staging for review
7. After approval, it goes live at `tools.chatooly.com/[tool-name]`

## Step 8: Iteration
After initial build:
- Remind user to save progress: `git add . && git commit -m "Description of changes"`
- Ask "What would you like to change or add?"
- **BEFORE making changes: Review .cursorrules file**
- Make adjustments based on feedback
- **AFTER making changes: Verify all Chatooly rules are still followed**
- Always test export functionality after changes
- Ensure tool works well at different screen sizes
- Encourage regular git commits after each successful change

## 🔴 VERIFICATION AFTER EVERY CHANGE
After ANY code modification, check:
1. Is all visual content still inside #chatooly-canvas?
2. Is the CDN script intact?
3. Does the export button still work?
4. Are there any console errors?
5. Does the tool still export correctly?

If any check fails, immediately fix it before proceeding!

## 🎨 CSS Styling with CDN v2.0 (NEW!)

### ✅ AUTOMATICALLY STYLED ELEMENTS
These HTML elements get the Chatooly design system automatically (no classes needed):

```html
<!-- Form Controls - Automatically styled -->
<input type="text" placeholder="Enter text">     <!-- ✅ Dark theme input -->
<input type="range" min="0" max="100">           <!-- ✅ Dark theme slider -->
<input type="color" value="#ff0000">             <!-- ✅ Dark theme color picker -->
<select><option>Option 1</option></select>       <!-- ✅ Dark theme dropdown -->
<textarea placeholder="Description"></textarea>   <!-- ✅ Dark theme textarea -->
<button>Click Me</button>                        <!-- ✅ Dark theme button -->

<!-- Typography - Automatically styled -->
<h1>Tool Title</h1>                             <!-- ✅ Lucida Console font -->
<h2>Section Title</h2>                          <!-- ✅ Proper sizing -->
<p>Description text</p>                          <!-- ✅ White text on dark -->
<label>Input Label</label>                       <!-- ✅ Consistent labels -->
```

### 🎨 ENHANCED CHATOOLY CLASSES (Optional)
Use these for additional styling options:

```html
<!-- Button Variants -->
<button class="btn-secondary">Secondary</button>
<button class="btn-success">Success</button>
<button class="btn-danger">Delete</button>
<button class="btn-outline">Outline Style</button>

<!-- Layout Classes -->
<div class="chatooly-app-container">             <!-- Full app layout -->
<div class="chatooly-controls-panel">            <!-- Left sidebar -->
<div class="chatooly-preview-panel">             <!-- Right canvas area -->
<div class="chatooly-control-group">             <!-- Control wrapper -->

<!-- Utility Classes -->
<p class="chatooly-text-muted">Muted text</p>
<p class="chatooly-text-small">Small text</p>
<div class="chatooly-mt-3">Add margin top</div>
<div class="chatooly-p-2">Add padding</div>
```

### 🔧 CUSTOM STYLING (Use CSS Variables)
When you need custom styles, use Chatooly CSS variables for consistency:

```css
/* ✅ GOOD: Uses design system variables */
.my-special-button {
  background: var(--chatooly-color-primary);
  color: var(--chatooly-color-text);
  border: var(--chatooly-border-width) solid var(--chatooly-color-border);
  border-radius: var(--chatooly-border-radius);
  padding: var(--chatooly-spacing-2) var(--chatooly-spacing-4);
  font-family: var(--chatooly-font-family);
}

/* ❌ BAD: Hard-coded values break theme consistency */
.my-button {
  background: #ff0000;        /* Won't match theme */
  color: blue;               /* Wrong text color */
  font-family: Arial;        /* Wrong font */
}
```

### 📋 LIVE CSS REFERENCE - CHECK BEFORE EVERY STYLING CHANGE

🚨 **MANDATORY: Check these ACTIVE links before making ANY styling decisions:**

🔗 **[LIVE CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)** - All colors, fonts, spacing, breakpoints
🔗 **[LIVE Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css)** - Buttons, forms, cards, tabs, dropdowns  
🔗 **[LIVE Base Styles](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css)** - Typography, forms, universal styling
🔗 **[LIVE Layout Classes](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/layouts/sidebar.css)** - Sidebar, responsive grid, containers

**🔗 Complete Variable List:** [View all CSS variables](https://github.com/yaelren/chatooly-cdn/blob/main/css/variables.css)

The CDN provides 100+ CSS variables for consistent styling. Most commonly used:

```css
/* Most commonly used variables */
--chatooly-color-text: #ffffff           /* Main text color */
--chatooly-color-background: #2b2b2b     /* Page background */
--chatooly-color-border: #ffffff         /* Borders */
--chatooly-color-primary: #007bff        /* Accent color */

--chatooly-font-family: 'Lucida Console', Monaco, monospace
--chatooly-font-size-base: 14px          /* Default text size */

--chatooly-spacing-2: 8px                /* Small spacing */
--chatooly-spacing-3: 12px               /* Medium spacing */
--chatooly-spacing-4: 16px               /* Large spacing */

--chatooly-border-radius: 0px            /* Sharp corners */
--chatooly-border-width: 2px             /* Standard border */
```

**📖 View Complete CSS Source Files:**
- [variables.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css) - All design variables (LIVE LINK)
- [base.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/base.css) - Element styling (LIVE LINK)
- [components.css](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css) - UI components (LIVE LINK)

### ⚡ AUTOMATIC STYLING ACTIVATION
The CDN automatically injects styles when you include the script:

```html
<!-- This script automatically styles your entire page -->
<script src="https://yaelren.github.io/chatooly-cdn/js/core.min.js"></script>
```

### 🎯 STYLING EXAMPLE
Here's how to build a tool with consistent styling:

```html
<!-- Controls (automatically styled) -->
<div class="controls-section">
  <h2>Settings</h2>
  <div class="chatooly-control-group">
    <label>Background Color</label>
    <input type="color" id="bgColor" value="#000000">
  </div>
  <div class="chatooly-control-group">
    <label>Size</label>
    <input type="range" id="size" min="10" max="100" value="50">
  </div>
  <button id="generateBtn">Generate</button>
</div>

<!-- Canvas (put visual output here) -->
<div id="chatooly-canvas">
  <canvas id="myCanvas" width="800" height="600"></canvas>
</div>
```

All inputs, buttons, and text will automatically use the dark Chatooly theme!

## What Chatooly Handles Automatically:
- ✅ **Design System Injection** - Dark theme, fonts, colors applied automatically
- ✅ Export button creation and positioning
- ✅ PNG export at multiple resolutions
- ✅ File downloads
- ✅ Publishing workflow
- ✅ Staging upload (in dev mode)

## What You Must Ensure:
- ✅ All visual content is inside `#chatooly-canvas`
- ✅ Only visual content (no UI controls or decorative elements) is inside `#chatooly-canvas`
- ✅ ChatoolyConfig is properly configured
- ✅ Canvas/visual area is at least 800x600px
- ✅ Tool works on both desktop and mobile
- ✅ Export produces the expected visual output (no unwanted UI elements)

## Common Issues & Solutions:
- **No export button?** Check if CDN script loaded, verify no JS errors
- **Export is blank?** Ensure content is inside `#chatooly-canvas`
- **Export has unwanted UI elements?** Make sure only visual content is inside `#chatooly-canvas` - move controls outside
- **Button in wrong position?** Adjust `buttonPosition` in ChatoolyConfig
- **Publishing not available?** Must be running on localhost (dev mode)

## Development Flow:
1. Update config file first
2. Add HTML controls based on user needs
3. Implement functionality in main.js
4. Style with CSS as needed
5. Test export functionality works
6. Keep asking user for feedback and iterate

Remember: The Chatooly CDN handles all export and publishing functionality automatically. Focus on building the tool's core functionality and ensuring all visual content is properly contained within the export container.