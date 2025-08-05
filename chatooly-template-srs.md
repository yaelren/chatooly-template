# Software Requirements Specification: Chatooly Template

## 1. Introduction

### 1.1 Purpose
The Chatooly Template provides a standardized starting point for designers to create web-based design tools with AI assistance. It includes pre-configured structure, CDN integration, and clear placeholders with guidance comments.

### 1.2 Repository Information
- **Repository Name**: chatooly-template
- **Type**: GitHub Template Repository
- **Usage**: Clone or "Use this template" on GitHub
- **POC Focus**: Minimal template with empty placeholders and clear documentation

## 2. Template Structure

### 2.1 File Organization (POC Simplified)
```
chatooly-template/
├── index.html              # Main HTML with CDN integration
├── style.css              # 2-column layout styles
├── tool.js                # Empty placeholder with structure
├── package.json           # Metadata + dev script
├── README.md              # Clear setup instructions
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

### 2.2 Core Files Specification

#### 2.2.1 index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ========== EDIT THIS: Your Tool Name ========== -->
    <title>My Design Tool - Chatooly</title>
    
    <!-- ========== DO NOT EDIT: Required Styles ========== -->
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="app-container">
        <!-- Left Panel: Tool Controls -->
        <div class="controls-panel">
            <!-- ========== EDIT THIS: Your Tool Title ========== -->
            <h1>My Design Tool</h1>
            
            <div class="controls">
                <!-- ========== EDIT BELOW: Add Your Tool Controls Here ========== -->
                <!-- Example controls - uncomment and modify:
                <div class="control-group">
                    <label for="color-input">Color</label>
                    <input type="color" id="color-input" value="#3498db">
                </div>
                
                <div class="control-group">
                    <label for="size-slider">Size</label>
                    <input type="range" id="size-slider" min="10" max="100" value="50">
                    <span class="value-display">50</span>
                </div>
                -->
                
                <!-- ========== END EDIT SECTION ========== -->
            </div>
        </div>
        
        <!-- Right Panel: Preview/Canvas Area -->
        <div class="preview-panel">
            <!-- ========== DO NOT EDIT: Required Export Container ========== -->
            <div id="chatooly-canvas">
                <!-- ========== EDIT BELOW: Add Your Visual Output Here ========== -->
                <!-- This content will be exported as PNG -->
                <!-- Your canvas or design elements go here -->
                <!-- Examples:
                     - <canvas id="myCanvas"></canvas> for p5.js/Three.js
                     - <div class="design-output"></div> for DOM-based tools
                -->
                
                <!-- ========== END EDIT SECTION ========== -->
            </div>
        </div>
    </div>
    
    <!-- ========== DO NOT EDIT: Chatooly CDN Integration ========== -->
    <script src="https://yaelren.github.io/chatooly-cdn/core.js"></script>
    
    <!-- ========== EDIT THIS: Tool Configuration ========== -->
    <script>
        window.ChatoolyConfig = {
            // REQUIRED: Your tool name
            name: "My Design Tool",
            
            // OPTIONAL: Export settings
            resolution: 2,              // 1, 2, or 4
            buttonPosition: "bottom-right",
            
            // REQUIRED FOR PUBLISHING: Tool metadata
            category: "generators",     // generators, visualizers, editors, utilities
            tags: ["design", "tool"],   // Add relevant tags
            description: "A brief description of your tool",
            version: "1.0.0",
            author: "Your Name"
        };
    </script>
    
    <!-- ========== DO NOT EDIT: Your Tool Logic ========== -->
    <script src="tool.js"></script>
</body>
</html>
```

#### 2.2.2 package.json
```json
{
  "name": "my-design-tool",
  "version": "1.0.0",
  "description": "A brief description of your tool",
  "keywords": [
    "chatooly",
    "design-tool",
    "generator"
  ],
  "author": "Your Name",
  "license": "MIT",
  "scripts": {
    "dev": "python3 -m http.server 8000 || python -m http.server 8000"
  },
  "chatooly": {
    "category": "generators",
    "tags": ["design", "creative"],
    "private": false,
    "exportFormats": ["png"]
  }
}
```

#### 2.2.3 style.css
```css
/* ========== DO NOT EDIT: Base Layout Styles ========== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: #f5f5f5;
    overflow: hidden;
}

.app-container {
    display: flex;
    height: 100vh;
}

/* Left Panel - Controls */
.controls-panel {
    width: 300px;
    background: white;
    padding: 20px;
    overflow-y: auto;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.controls-panel h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

/* Right Panel - Preview */
.preview-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

/* Export Container */
#chatooly-canvas {
    width: 800px;
    height: 600px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
    /* ========== EDIT BELOW: Add your canvas styles ========== */
    
    /* ========== END EDIT SECTION ========== */
}

/* Control Groups */
.control-group {
    margin-bottom: 20px;
}

.control-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #555;
}

/* ========== EDIT BELOW: Add Your Custom Styles ========== */
/* Add styles for your tool's specific elements here */



/* ========== END EDIT SECTION ========== */

/* Responsive Design */
@media (max-width: 768px) {
    .app-container {
        flex-direction: column;
    }
    
    .controls-panel {
        width: 100%;
        height: auto;
        max-height: 200px;
    }
    
    #chatooly-canvas {
        width: 100%;
        max-width: 400px;
        height: 300px;
    }
}
```

#### 2.2.4 tool.js
```javascript
// ========== Chatooly Tool Template ========== 
// This file contains your tool's logic
// Edit the sections marked with "EDIT THIS"

// ========== EDIT THIS: Tool State ========== 
// Define your tool's state variables here
const toolState = {
    // Example: color: '#3498db',
    // Example: size: 50,
};

// ========== DO NOT EDIT: Error Handling Setup ==========
// This ensures your tool fails gracefully and provides helpful error messages
function safeExecute(fn, errorMessage) {
    try {
        return fn();
    } catch (error) {
        console.error(`Chatooly Tool Error: ${errorMessage}`, error);
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="padding: 20px; background: #fee; border: 2px solid #f88; color: #800; border-radius: 8px; margin: 10px;">
                <h3>⚠️ Tool Error</h3>
                <p><strong>${errorMessage}</strong></p>
                <p>Check the browser console for details.</p>
            </div>
        `;
        document.getElementById('chatooly-canvas').appendChild(errorDiv);
        return null;
    }
}

// ========== EDIT THIS: Initialize Tool ========== 
// This runs when the page loads
function initializeTool() {
    safeExecute(() => {
        // Set up your tool here
        // Example: Create canvas, set default values, etc.
        
        console.log('Tool initialized!');
    }, 'Failed to initialize tool');
}

// ========== EDIT THIS: Event Handlers ========== 
// Add your event listeners and handlers here
function setupEventListeners() {
    safeExecute(() => {
        // Example:
        // document.getElementById('color-input').addEventListener('change', (e) => {
        //     toolState.color = e.target.value;
        //     updatePreview();
        // });
        
        // Example:
        // document.getElementById('size-slider').addEventListener('input', (e) => {
        //     toolState.size = e.target.value;
        //     document.querySelector('.value-display').textContent = e.target.value;
        //     updatePreview();
        // });
    }, 'Failed to set up event listeners');
}

// ========== EDIT THIS: Update Functions ========== 
// Functions that update your tool's visual output
function updatePreview() {
    safeExecute(() => {
        // Update the content inside #chatooly-canvas
        // This is what will be exported as PNG
    }, 'Failed to update preview');
}

// ========== DO NOT EDIT: Initialization ========== 
// Wait for page to load, then initialize
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for CDN to load
    setTimeout(() => {
        initializeTool();
        setupEventListeners();
    }, 100);
});

// ========== OPTIONAL: Export Tool API ========== 
// Expose functions for external access if needed
window.ToolAPI = {
    // Example: getState: () => toolState,
    // Example: reset: () => resetTool(),
};
```

### 2.3 Template Guidelines

#### 2.3.1 DO NOT EDIT Sections
These sections are critical for Chatooly functionality:
- CDN script inclusion
- Export container (`#chatooly-canvas`)
- Base layout structure
- Window.ChatoolyConfig object

#### 2.3.2 EDIT THIS Sections
Customize these areas for your tool:
- Tool title and description
- Control panel contents
- Canvas/preview content
- Custom styles
- Tool logic in tool.js

#### 2.3.3 Publishing Workflow
1. Develop locally using `npm run dev`
2. Test export functionality with CDN button
3. When ready, click "Publish" in CDN menu (development mode only)
4. Tool uploads to staging for review

## 3. Functional Requirements

### 3.1 Template Features

#### FR-TPL-1: Quick Start
- Clone template from GitHub
- Single `npm run dev` command
- Immediate local development at localhost:8000

#### FR-TPL-2: Clear Documentation
- Prominent "EDIT THIS" / "DO NOT EDIT" comments
- README with step-by-step instructions
- Example patterns in comments

#### FR-TPL-3: Development Workflow
- Python HTTP server (cross-platform)
- CDN auto-injects export button
- Real-time preview of changes

#### FR-TPL-4: Publishing System
- Via CDN "Publish" button in dev mode
- Automatic file gathering
- Upload to staging environment

### 3.2 Design Guidelines

#### FR-TPL-5: Clear Separation
- "DO NOT EDIT" sections clearly marked
- "EDIT THIS" sections with helpful comments
- Examples provided in comments

#### FR-TPL-6: Responsive Design
- 2-column layout on desktop
- Stacked layout on mobile
- Fixed canvas dimensions that scale

## 4. Usage Instructions

### 4.1 Getting Started
```bash
# Method 1: GitHub Template
1. Go to github.com/chatooly/chatooly-template
2. Click "Use this template"
3. Name your repository
4. Clone locally

# Method 2: Direct Clone
git clone https://github.com/chatooly/chatooly-template my-tool
cd my-tool
rm -rf .git
git init
```

### 4.2 Development Flow
```bash
# Start local development
npm run dev
# Open http://localhost:8000

# Open in code editor with AI
cursor .
# or
code .

# Ask AI: "Create a tool that generates animated gradients"
```

### 4.3 Publishing Flow
```
1. Ensure you're running locally (localhost:8000)
2. Click the export button (📥) in bottom-right
3. Select "📤 Publish" from menu
4. Enter tool name when prompted
5. Tool uploads to staging
6. Wait for admin approval to go live
```

## 5. Best Practices

### 5.1 Code Organization
- Separate concerns (UI, logic, styling)
- Use meaningful variable names
- Comment complex algorithms
- Keep functions small and focused

### 5.2 Performance
- Minimize DOM manipulation
- Use requestAnimationFrame for animations
- Lazy load heavy resources
- Optimize images and assets

### 5.3 Accessibility
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

### 5.4 Mobile Support
- Touch event handling
- Responsive layouts
- Appropriate input types
- Performance optimization

## 6. Integration Examples

### 6.1 Canvas-Based Tool (p5.js)
```javascript
// In tool.js - EDIT THIS section
function initializeTool() {
    // Create p5.js canvas inside export container
    const sketch = (p) => {
        p.setup = () => {
            let canvas = p.createCanvas(800, 600);
            canvas.parent('chatooly-canvas');
        };
        p.draw = () => {
            // Your drawing code here
        };
    };
    new p5(sketch);
}
```

### 6.2 DOM-Based Tool
```javascript
// In tool.js - EDIT THIS section
function initializeTool() {
    // Create DOM elements inside export container
    const canvas = document.getElementById('chatooly-canvas');
    canvas.innerHTML = `
        <div class="gradient-display"></div>
    `;
}

function updatePreview() {
    const display = document.querySelector('.gradient-display');
    display.style.background = toolState.gradient;
}
```

## 7. Template Maintenance

### 7.1 Version Updates
- Template versioning independent of CDN
- Backward compatibility maintained
- Migration guides for breaking changes

### 7.2 Community Contributions
- Accept PRs for improvements
- Example tool submissions
- Documentation updates
- Bug fixes

## 8. POC Limitations

### 8.1 Current Scope
- PNG export only
- Basic 2-column layout
- Manual publishing approval
- Development mode features only

### 8.2 Future Additions (Post-POC)
- Multiple export formats
- Advanced layouts
- Automated publishing
- User authentication
- Analytics integration
- Template variants (React, Vue, etc.)