# Background System Implementation

## Overview
The Chatooly template provides background control HTML by default. Your job is to connect these controls to the `Chatooly.backgroundManager` API.

## 🤖 For AI Agents: What You Need to Do

### What's Already Provided

#### 1. Background Controls HTML (in index.html)
These controls are already in the template:
- ✅ Transparent checkbox (`#transparent-bg`)
- ✅ Color picker (`#bg-color`)
- ✅ Image upload (`#bg-image`)
- ✅ Remove button (`#clear-bg-image`) - X button, hidden by default
- ✅ Fit dropdown (`#bg-fit`) - hidden until image uploaded

**Don't create these - they're already there!**

#### 2. Background Manager API (CDN)
`Chatooly.backgroundManager` provides all background logic:
- Color and transparency management
- Image loading and fit calculations
- Canvas rendering helpers
- CSS generation for DOM tools

#### 3. Background CSS (CDN)
Automatic styling for:
- Checkered transparency pattern
- Red X button with hover effects
- Image wrapper layout

### Implementation Steps

#### Step 1: Initialize Background Manager

```javascript
// In your initialization code
const canvas = document.getElementById('chatooly-canvas');
Chatooly.backgroundManager.init(canvas);
```

#### Step 2: Connect Event Listeners

Wire up the HTML controls:

```javascript
// Transparent Background
document.getElementById('transparent-bg').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setTransparent(e.target.checked);
    // Hide color picker when transparent
    document.getElementById('bg-color-group').style.display =
        e.target.checked ? 'none' : 'block';
    render();
});

// Background Color
document.getElementById('bg-color').addEventListener('input', (e) => {
    Chatooly.backgroundManager.setBackgroundColor(e.target.value);
    render();
});

// Background Image Upload
document.getElementById('bg-image').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        await Chatooly.backgroundManager.setBackgroundImage(file);
        // Show X button and fit dropdown
        document.getElementById('clear-bg-image').style.display = 'block';
        document.getElementById('bg-fit-group').style.display = 'block';
        render();
    } catch (error) {
        alert('Failed to load image: ' + error.message);
    }
});

// Clear Image (X Button)
document.getElementById('clear-bg-image').addEventListener('click', () => {
    Chatooly.backgroundManager.clearBackgroundImage();
    // Hide X button and fit dropdown
    document.getElementById('clear-bg-image').style.display = 'none';
    document.getElementById('bg-fit-group').style.display = 'none';
    document.getElementById('bg-image').value = '';
    render();
});

// Image Fit Mode
document.getElementById('bg-fit').addEventListener('change', (e) => {
    Chatooly.backgroundManager.setFit(e.target.value);
    render();
});
```

#### Step 3: Render Background

Choose based on your framework:

##### Canvas API:
```javascript
function render() {
    // Draw background FIRST
    Chatooly.backgroundManager.drawToCanvas(ctx, canvas.width, canvas.height);
    // Your content on top...
}
```

##### p5.js:
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
    // Your drawing...
}
```

##### Three.js:
```javascript
const bg = Chatooly.backgroundManager.getBackgroundState();
if (bg.bgTransparent) {
    renderer.setClearAlpha(0);
} else {
    renderer.setClearColor(bg.bgColor);
}
```

##### DOM-based:
```javascript
const bgCSS = Chatooly.backgroundManager.getBackgroundCSS();
document.getElementById('chatooly-canvas').style.background = bgCSS;
```

#### Step 4: Export Support (MANDATORY)

Include background in high-res export:

```javascript
window.renderHighResolution = function(targetCanvas, scale) {
    const exportCtx = targetCanvas.getContext('2d');
    targetCanvas.width = canvas.width * scale;
    targetCanvas.height = canvas.height * scale;
    exportCtx.scale(scale, scale);

    // Draw background at export resolution
    Chatooly.backgroundManager.drawToCanvas(exportCtx, canvas.width, canvas.height);

    // Your content...
};
```

## Background Manager API Reference

### Methods

**`init(canvasElement)`**
Initialize with your canvas element.

**`setBackgroundColor(color)`**
Set color (hex string like "#CCFD50").

**`setTransparent(transparent)`**
Enable/disable transparency (boolean).

**`setBackgroundImage(file)`**
Load image from File object. Returns Promise.

**`clearBackgroundImage()`**
Remove background image.

**`setFit(mode)`**
Set fit mode: `'cover'`, `'contain'`, or `'fill'`.

**`getBackgroundState()`**
Returns:
```javascript
{
    bgColor: string,
    bgTransparent: boolean,
    bgImage: Image | null,
    bgImageURL: string | null,
    bgFit: 'cover' | 'contain' | 'fill'
}
```

**`calculateImageDimensions(canvasWidth, canvasHeight)`**
Returns:
```javascript
{
    drawWidth: number,
    drawHeight: number,
    offsetX: number,
    offsetY: number
}
```

**`drawToCanvas(ctx, canvasWidth, canvasHeight)`**
Draw background to 2D context.

**`getBackgroundCSS()`**
Generate CSS background string.

**`reset()`**
Reset to defaults.

## Testing Checklist

- [ ] Transparent checkbox shows checkered pattern
- [ ] Color picker changes background
- [ ] Image upload works
- [ ] X button appears when image uploaded
- [ ] X button clears image and hides dropdown
- [ ] Fit dropdown appears with image
- [ ] Fill/Fit/Stretch modes all work
- [ ] Color picker hides when transparent
- [ ] Background in PNG exports

## Troubleshooting

**Background not visible?**
- Call `drawToCanvas()` or apply CSS
- Draw background BEFORE your content

**Image not showing?**
- Check fit mode setting
- Check console for errors
- Verify image format

**Export missing background?**
- Include background in `renderHighResolution()`
- Draw background FIRST in export
