# Chatooly Tool Builder - AI Assistant Instructions

## When User Wants to Build a Tool
The user might say things like:
- "Let's start building"
- "Help me create a tool"
- "I want to make something"
- "Build a [type] tool"
- Or any variation indicating they want to create something

## Step 1: Gather Basic Information
Ask the user these questions to fill out the config:
1. What should your tool be called?
2. What category best fits? (generators/visualizers/editors/utilities/games/art)
3. One sentence description of what it does
4. Your name (for author credit)

## Step 2: Update Configuration
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

### CRITICAL Chatooly API Requirements:
- **Export Container**: ALL visual content MUST be inside `#chatooly-canvas` div
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

## Step 5: Testing & Viewing
Tell the user:
- Run `npm run dev` to start the local server
- Open http://localhost:8000 to see your tool
- The export button (📥) appears automatically in the bottom-right corner
- Click it to test PNG export at different resolutions (1x, 2x, 4x)

## Step 6: Publishing
When the user is ready to publish, explain:
1. Make sure the tool is running locally (`npm run dev`)
2. Click the export button (📥) in the bottom-right corner
3. Select "📤 Publish" from the menu (only available in development mode)
4. Enter your tool name when prompted
5. The tool uploads to staging for review
6. After approval, it goes live at `tools.chatooly.com/[tool-name]`

## Step 7: Iteration
After initial build:
- Ask "What would you like to change or add?"
- Make adjustments based on feedback
- Always test export functionality after changes
- Ensure tool works well at different screen sizes

## What Chatooly Handles Automatically:
- ✅ Export button creation and positioning
- ✅ PNG export at multiple resolutions
- ✅ File downloads
- ✅ Publishing workflow
- ✅ Staging upload (in dev mode)

## What You Must Ensure:
- ✅ All visual content is inside `#chatooly-canvas`
- ✅ ChatoolyConfig is properly configured
- ✅ Canvas/visual area is at least 800x600px
- ✅ Tool works on both desktop and mobile
- ✅ Export produces the expected visual output

## Common Issues & Solutions:
- **No export button?** Check if CDN script loaded, verify no JS errors
- **Export is blank?** Ensure content is inside `#chatooly-canvas`
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