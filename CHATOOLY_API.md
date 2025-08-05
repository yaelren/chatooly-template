# Chatooly CDN Integration Guide

**Author: Yael Renous - Studio Video**

Simple guide for integrating your tool with Chatooly's automatic export and publishing system.

## How Chatooly Works

The Chatooly CDN automatically adds export functionality to your tool. You don't need to call any APIs - just build your tool and Chatooly handles the rest.

## Required Setup

### 1. Include the CDN Script
```html
<script src="https://yaelren.github.io/chatooly-cdn/js/core.js"></script>
```

### 2. Configure Your Tool
```javascript
window.ChatoolyConfig = {
    name: "My Tool Name",
    category: "generators", 
    description: "What your tool does",
    author: "Your Name"
};
```

### 3. Put Visual Content in Export Container
```html
<div id="chatooly-canvas">
    <!-- Everything inside here gets exported -->
</div>
```

## What Chatooly Does Automatically

- **Adds Export Button**: Appears in bottom-right corner
- **Detects Content**: Finds your canvas or visual content
- **Handles Export**: Creates PNG files at different resolutions
- **Manages Publishing**: Upload and publish your tool (dev mode)

## Export Container Rules

### For Canvas Tools (p5.js, Three.js, etc.)
```html
<div id="chatooly-canvas">
    <canvas id="myCanvas"></canvas>
</div>
```

### For DOM-based Tools
```html
<div id="chatooly-canvas">
    <div class="my-design-output">
        <!-- Your visual elements -->
    </div>
</div>
```

## Configuration Options

```javascript
window.ChatoolyConfig = {
    // Required
    name: "Tool Name",
    description: "Brief description", 
    author: "Your Name",
    
    // Optional
    category: "generators",        // Choose: generators, visualizers, editors, utilities, games, art
    tags: ["gradient", "css"],     // For discovery
    version: "1.0.0",             // Your version
    resolution: 2,                // Default export resolution (1, 2, or 4)
    buttonPosition: "bottom-right" // Button position
};
```

## What You Don't Need to Do

- ❌ Call export functions
- ❌ Handle file downloads  
- ❌ Manage publishing
- ❌ Create export buttons
- ❌ Handle different resolutions

## What You Do Need to Do

- ✅ Build your tool functionality
- ✅ Put visual content in `#chatooly-canvas`
- ✅ Configure `ChatoolyConfig`
- ✅ Test that export works

## Development vs. Production

### Development Mode (localhost)
- Export button shows "Publish" option
- Can upload to staging server
- Extended debugging

### Production Mode  
- Export button shows download options only
- Clean, minimal interface

## Library Integration

### p5.js
```javascript
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('chatooly-canvas'); // Put canvas in export container
}
```

### Three.js  
```javascript
const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 600);
document.getElementById('chatooly-canvas').appendChild(renderer.domElement);
```

### Regular Canvas
```javascript
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.getElementById('chatooly-canvas').appendChild(canvas);
```

## Testing Your Integration

1. **Load your tool** in browser
2. **Check export button appears** (bottom-right)
3. **Click export button** - should see resolution options
4. **Try PNG export** - should download image
5. **Check exported content** - should contain your visual output

## Troubleshooting

**No export button?**
- Check CDN script loaded
- Verify no JavaScript errors

**Export is blank?**  
- Ensure content is inside `#chatooly-canvas`
- Check for CORS issues with images

**Button in wrong position?**
- Set `buttonPosition` in ChatoolyConfig

That's it! Chatooly automatically handles everything else.