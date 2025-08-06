# Base 44 Integration Guide

Convert Base 44 projects into Chatooly design tools using the built-in converter.

## Quick Start

### 1. Download Base 44 Project
- Export your Base 44 project as a zip file
- Extract it to your local machine

### 2. Convert to Chatooly Tool
```bash
# In the chatooly-template directory
npm run convert:base44 /path/to/extracted-base44-project my-new-tool

# Or just provide the source, and it auto-names the output:
npm run convert:base44 /path/to/extracted-base44-project
```

The tool will be created inside `chatooly-template/converted-tools/my-new-tool/`

### 3. Complete Manual Steps
The converter creates a working Chatooly tool structure but requires manual completion of the core algorithm logic.

## What Gets Converted

### ✅ Automatically Converted
- **Project Structure**: HTML, CSS, JS files in Chatooly format
- **Canvas Setup**: Basic canvas initialization and rendering loop
- **Control Framework**: Event handling structure for UI controls
- **Export Integration**: Chatooly CDN integration for PNG export
- **Basic Controls**: Attempts to extract sliders and selects from React components

### ⚠️ Requires Manual Work
- **Algorithm Logic**: Core image processing algorithms need to be ported
- **Control Mapping**: Connect extracted controls to algorithm parameters
- **Canvas Operations**: Implement actual drawing/processing logic
- **Styling Refinement**: Adjust UI styling as needed

## Manual Completion Steps

### 1. Implement Algorithm Logic
Edit `js/main.js` and replace the placeholder `render()` function:

```javascript
function render() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // TODO: Add your Base 44 algorithm here
    // Example: dithering algorithm
    if (originalImageData) {
        const processedData = applyDithering(originalImageData, settings);
        ctx.putImageData(processedData, 0, 0);
    }
}
```

### 2. Add Missing Controls
If controls weren't extracted automatically, add them manually to `index.html`:

```html
<div class="control-group">
    <label for="threshold-slider">Threshold</label>
    <input type="range" id="threshold-slider" min="0" max="255" value="128">
    <span class="value-display">128</span>
</div>

<div class="control-group">
    <label for="algorithm-select">Algorithm</label>
    <select id="algorithm-select">
        <option value="floyd-steinberg">Floyd-Steinberg</option>
        <option value="atkinson">Atkinson</option>
    </select>
</div>
```

### 3. Connect Controls to Logic
Update the control initialization in `js/main.js`:

```javascript
// Initialize controls
const thresholdSlider = document.getElementById('threshold-slider');
const algorithmSelect = document.getElementById('algorithm-select');

if (thresholdSlider) {
    thresholdSlider.addEventListener('input', handleControlChange);
}
if (algorithmSelect) {
    algorithmSelect.addEventListener('change', handleControlChange);
}
```

### 4. Test Your Tool

**Option A: Test the converted tool directly**
```bash
npm run dev:tool
# Visit http://localhost:8000/my-new-tool
```

**Option B: Test from a specific tool folder**
```bash
cd converted-tools/my-new-tool
python3 -m http.server 8000
# Visit http://localhost:8000
```

**Option C: Copy to main template for development**
```bash
# Copy converted files to main template
cp -r converted-tools/my-new-tool/* .
npm run dev
# Visit http://localhost:8000
```

## Common Base 44 Patterns

### Image Processing Tools
Base 44 projects often use:
- `ImageData` for pixel manipulation
- `canvas.getImageData()` and `canvas.putImageData()`
- File upload handling
- Real-time preview updates

### Converting Algorithm Functions
```javascript
// Base 44 React pattern:
const processImage = useCallback((imageData, settings) => {
    // algorithm logic
}, []);

// Chatooly vanilla JS pattern:
function processImage(imageData, settings) {
    // same algorithm logic
    return processedImageData;
}
```

### State Management
```javascript
// Base 44 React useState:
const [settings, setSettings] = useState({
    threshold: 128,
    algorithm: 'floyd-steinberg'
});

// Chatooly vanilla JS:
let settings = {
    threshold: 128,
    algorithm: 'floyd-steinberg'
};
```

## File Structure After Conversion

```
chatooly-template/
├── converted-tools/        # All converted tools go here
│   └── my-new-tool/
│       ├── index.html      # Main tool interface
│       ├── styles.css      # Chatooly-compatible styling
│       ├── js/
│       │   ├── chatooly-config.js  # Tool metadata
│       │   └── main.js     # Core logic with extracted algorithms
│       ├── package.json    # Development scripts
│       └── CONVERSION_REPORT.md    # Detailed conversion notes
```

## Tips for Success

### 1. Focus on Core Algorithm
- Identify the main image processing function in your Base 44 code
- Port this function first, then add UI controls
- Test algorithm independently before connecting controls

### 2. Simplify Complex Components
- Base 44 often uses complex React components
- Convert to simple HTML inputs (sliders, selects, buttons)
- Keep the same parameter ranges and default values

### 3. Preserve User Experience
- Maintain the same visual feedback
- Keep control labels and descriptions clear
- Test that all parameters affect the output as expected

### 4. Optimize for Export
- Ensure canvas renders at appropriate resolution
- Test PNG export functionality
- Consider adding export options if needed

## Troubleshooting

### Canvas Not Rendering
- Check that `canvas` and `ctx` are properly initialized
- Verify `render()` function is called after control changes
- Ensure canvas dimensions are set correctly

### Controls Not Working
- Check that event listeners are properly attached
- Verify control IDs match between HTML and JavaScript
- Test `handleControlChange` function receives events

### Export Issues
- Ensure canvas content is visible before exporting
- Check that Chatooly CDN is loaded correctly
- Verify `#chatooly-canvas` contains the canvas element

## Advanced Integration

### Custom Export Formats
Extend the tool with additional export options:

```javascript
// Add to chatooly-config.js
window.ChatoolyConfig = {
    // ... other config
    customExports: {
        svg: true,
        highRes: true
    }
};
```

### Multi-Canvas Support
For complex tools with multiple canvases:

```html
<div id="chatooly-canvas">
    <canvas id="main-canvas"></canvas>
    <canvas id="preview-canvas"></canvas>
</div>
```

### Integration with Chatooly Hub
Once your tool is complete:
1. Test thoroughly with `npm run dev`
2. Update metadata in `chatooly-config.js`
3. Follow standard Chatooly publishing workflow

---

## Support

For issues with the converter or integration questions:
- Check the generated `CONVERSION_REPORT.md` for project-specific notes
- Review Base 44 source code for algorithm implementation details
- Test incrementally - start with basic rendering, then add controls