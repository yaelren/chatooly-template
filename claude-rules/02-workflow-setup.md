# Chatooly Workflow & Setup

## 📁 PROJECT FILE STRUCTURE

**AI Agents: Follow this file organization strictly:**

```
chatooly-template/
├── index.html              # Main HTML structure
├── js/
│   ├── main.js            # Canvas/tool logic and rendering
│   ├── ui.js              # UI controls, collapsible sections, form interactions
│   └── chatooly-config.js # Tool configuration and metadata
```

### File Responsibilities:
- **`js/main.js`**: Canvas rendering, tool logic, game loops, animations, data processing, export functions
- **`js/ui.js`**: Collapsible sections, show/hide controls, form validation, UI state management, DOM interactions
- **`js/chatooly-config.js`**: Tool metadata only (name, category, tags, export settings)

### When to Use Which File:
- Adding canvas click handlers? → `js/main.js`
- Adding collapsible menu? → `js/ui.js`
- Adding slider that affects rendering? → Event listener in `js/ui.js`, render logic in `js/main.js`
- Changing tool name/category? → `js/chatooly-config.js`

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