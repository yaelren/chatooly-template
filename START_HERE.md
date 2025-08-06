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

## Step 6: Saving Your Progress with Git

### Why Use Git?
Git is like a save system for your code - it lets you:
- Save snapshots of your work at any point
- Go back to earlier versions if something breaks
- Share your code with others
- Keep your work safe in the cloud (using GitHub)

### Basic Git Commands the User Should Know:

#### First Time Setup (do this once):
```bash
git init  # Initialize git in your project
git add .  # Stage all your files
git commit -m "Initial commit - my first tool"  # Save your first snapshot
```

#### Saving Your Work (do this regularly):
```bash
git add .  # Stage your changes
git commit -m "Added new feature"  # Save a snapshot with a description
```

#### Pushing to GitHub (to save in the cloud):
1. Create a repository on GitHub.com
2. Connect your local project:
```bash
git remote add origin https://github.com/yourusername/your-tool.git
git push -u origin main  # Push your code to GitHub
```

3. Future saves to GitHub:
```bash
git push  # Send your latest commits to GitHub
```

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
- Make adjustments based on feedback
- Always test export functionality after changes
- Ensure tool works well at different screen sizes
- Encourage regular git commits after each successful change

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