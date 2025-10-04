# Background System Implementation

## Overview
The Chatooly CDN provides a **fully automatic** background management system. Background controls are **auto-injected** into every Chatooly tool - no HTML setup required!

## What the CDN Provides Automatically

### 1. Background Controls (Auto-Injected)
The CDN automatically injects these controls into `.chatooly-controls-content`:
- ✅ Transparent background checkbox
- ✅ Background color picker
- ✅ Background image upload with remove button (X)
- ✅ Background fit dropdown (Fill/Fit/Stretch)

**You don't add any HTML** - it's already there when the page loads!

### 2. Background Manager Module
The `Chatooly.backgroundManager` API provides:
- State management for all background settings
- Image loading and dimension calculations
- Transparent background with automatic checkered pattern
- Canvas drawing helpers

## Quick Start (3 Steps)

### Step 1: Initialize in your `main.js`

```javascript
// Initialize background manager with your canvas
Chatooly.backgroundManager.init(canvas);
```

### Step 2: Connect Event Listeners

Add these event listeners after DOM is ready:

```javascript
// Transparent background checkbox
document.getElementById('transparent-bg').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setTransparent(e.target.checked);
    document.getElementById('bg-color-group').style.display = e.target.checked ? 'none' : 'block';
    render();
});

// Background color picker
document.getElementById('bg-color').addEventListener('input', (e) => {
    Chatooly.backgroundManager.setBackgroundColor(e.target.value);
    render();
});

// Background image upload
document.getElementById('bg-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            await Chatooly.backgroundManager.setBackgroundImage(file);
            document.getElementById('clear-bg-image').style.display = 'block';
            document.getElementById('bg-fit-group').style.display = 'block';
            render();
        } catch (error) {
            alert('Failed to load image: ' + error.message);
        }
    }
});

// Clear background image
document.getElementById('clear-bg-image').addEventListener('click', () => {
    Chatooly.backgroundManager.clearBackgroundImage();
    document.getElementById('clear-bg-image').style.display = 'none';
    document.getElementById('bg-fit-group').style.display = 'none';
    document.getElementById('bg-image').value = '';
    render();
});

// Background fit mode
document.getElementById('bg-fit').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setFit(e.target.value);
    render();
});
```

### Step 3: Draw Background in Render Loop

```javascript
function render() {
    // ALWAYS draw background FIRST
    Chatooly.backgroundManager.drawToCanvas(ctx, canvas.width, canvas.height);

    // Then draw your content on top
    // ... your drawing code ...
}
```

## Export Support (Mandatory)

Add background to your `renderHighResolution()` function:

```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    const exportCtx = targetCanvas.getContext('2d');
    targetCanvas.width = canvas.width * scale;
    targetCanvas.height = canvas.height * scale;
    exportCtx.scale(scale, scale);

    // Draw background at export resolution
    Chatooly.backgroundManager.drawToCanvas(exportCtx, canvas.width, canvas.height);

    // Your content drawing...
};
```

## Framework-Specific Rendering

### Canvas API / HTML5 Canvas
Use `drawToCanvas()` as shown above.

### p5.js
```javascript
function draw() {
    const bg = Chatooly.backgroundManager.getBackgroundState();

    if (bg.bgTransparent) {
        clear();
    } else if (bg.bgImage) {
        const dims = Chatooly.backgroundManager.calculateImageDimensions(width, height);
        image(bg.bgImage, dims.offsetX, dims.offsetY, dims.drawWidth, dims.drawHeight);
    } else {
        background(bg.bgColor);
    }

    // Your p5.js code...
}
```

### Three.js
```javascript
const bg = Chatooly.backgroundManager.getBackgroundState();

if (bg.bgTransparent) {
    renderer.setClearAlpha(0);
} else {
    renderer.setClearColor(bg.bgColor);
}
```

### DOM-based Tools
```javascript
const bgCSS = Chatooly.backgroundManager.getBackgroundCSS();
document.getElementById('chatooly-canvas').style.background = bgCSS;
```

## Complete Implementation Example

```javascript
// main.js

const canvas = document.getElementById('chatooly-canvas');
const ctx = canvas.getContext('2d');

// Initialize background manager
Chatooly.backgroundManager.init(canvas);

// Connect event listeners (after DOM ready)
document.getElementById('transparent-bg').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setTransparent(e.target.checked);
    document.getElementById('bg-color-group').style.display = e.target.checked ? 'none' : 'block';
    render();
});

document.getElementById('bg-color').addEventListener('input', (e) => {
    Chatooly.backgroundManager.setBackgroundColor(e.target.value);
    render();
});

document.getElementById('bg-image').addEventListener('change', async (e) => {
    if (e.target.files[0]) {
        await Chatooly.backgroundManager.setBackgroundImage(e.target.files[0]);
        document.getElementById('clear-bg-image').style.display = 'block';
        document.getElementById('bg-fit-group').style.display = 'block';
        render();
    }
});

document.getElementById('clear-bg-image').addEventListener('click', () => {
    Chatooly.backgroundManager.clearBackgroundImage();
    document.getElementById('clear-bg-image').style.display = 'none';
    document.getElementById('bg-fit-group').style.display = 'none';
    document.getElementById('bg-image').value = '';
    render();
});

document.getElementById('bg-fit').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setFit(e.target.value);
    render();
});

// Render function
function render() {
    // Draw background first
    Chatooly.backgroundManager.drawToCanvas(ctx, canvas.width, canvas.height);

    // Your content drawing...
}

// High-res export
window.renderHighResolution = function(targetCanvas, scale) {
    const exportCtx = targetCanvas.getContext('2d');
    targetCanvas.width = canvas.width * scale;
    targetCanvas.height = canvas.height * scale;
    exportCtx.scale(scale, scale);

    Chatooly.backgroundManager.drawToCanvas(exportCtx, canvas.width, canvas.height);
    // Your content...
};
```

## Testing Checklist

✅ Background controls appear automatically (no HTML needed)
✅ Transparent checkbox shows checkered pattern
✅ Color picker updates background
✅ Image upload shows remove button (X)
✅ Fit modes work correctly
✅ Background appears in PNG/video exports
✅ Color picker hidden when transparent is checked
