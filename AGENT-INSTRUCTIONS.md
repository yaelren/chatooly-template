# Chatooly Template - AI Agent Instructions

## 🤖 For AI Agents Building Chatooly Tools

This document provides critical instructions for AI agents (Claude, GPT-4, etc.) when creating new Chatooly tools.

---

## 🎯 Golden Rules

1. **ALWAYS READ `index.html` FIRST** - All component patterns are documented in HTML comments
2. **NEVER IMPROVISE CSS CLASSES** - Only use classes documented in this template
3. **COPY EXACT PATTERNS** - Don't try to simplify or "improve" the structure
4. **TEST AGAINST CDN DEMO** - Compare output to https://yaelren.github.io/chatooly-cdn/sv-tools-example.html

---

## 📋 Required Component Patterns

### ✅ Sections (Collapsible Groups)

```html
<div class="chatooly-section-card">
    <h3 class="chatooly-section-header">✨ Section Name</h3>
    <div class="chatooly-section-content">
        <!-- Controls here -->
    </div>
</div>
```

**Common Mistakes:**
- ❌ `<h3 class="section-header">` (missing `chatooly-` prefix)
- ❌ Adding `<span>▼</span>` arrows (handled by CSS)
- ❌ Using `id` attributes for styling hooks

---

### ✅ Toggle Switches (Not Checkboxes!)

```html
<div class="chatooly-toggle-group">
    <button type="button"
            class="chatooly-toggle"
            id="my-toggle"
            role="switch"
            aria-pressed="false">
        <span class="chatooly-toggle-slider"></span>
    </button>
    <label class="chatooly-toggle-label" for="my-toggle">Feature Name</label>
</div>
```

**Why not checkboxes?**
CDN provides styled toggle buttons that match the design system. Plain checkboxes look wrong.

**Common Mistakes:**
- ❌ `<input type="checkbox">` - Don't use native checkboxes for toggles
- ❌ Missing `role="switch"` and `aria-pressed` attributes
- ❌ Forgetting the `<span class="chatooly-toggle-slider"></span>` inner element

---

### ✅ Color Pickers

```html
<div class="chatooly-color-group">
    <label class="chatooly-color-label" for="my-color">Color</label>
    <input type="color" class="chatooly-color-input" id="my-color" value="#ff0000">
</div>
```

**Common Mistakes:**
- ❌ Using `chatooly-control-group` instead of `chatooly-color-group`
- ❌ Missing the `-color-` prefix on classes

---

### ✅ Sliders (Range Inputs)

```html
<div class="chatooly-control-group">
    <label for="my-slider">Size</label>
    <input type="range" id="my-slider" min="0" max="100" value="50">
    <span id="my-slider-value">50</span>
</div>
```

**Note:** Range inputs don't need special classes, but value display is separate `<span>`

---

### ✅ Dropdowns (Select Elements)

```html
<div class="chatooly-input-group">
    <label class="chatooly-input-label" for="my-select">Options</label>
    <select class="chatooly-select" id="my-select">
        <option value="a">Option A</option>
        <option value="b">Option B</option>
    </select>
</div>
```

**Common Mistakes:**
- ❌ Missing `chatooly-select` class on `<select>`
- ❌ Using `chatooly-control-group` instead of `chatooly-input-group`

---

### ✅ Text Inputs

```html
<div class="chatooly-input-group">
    <label class="chatooly-input-label" for="my-input">Text</label>
    <input type="text" class="chatooly-input" id="my-input" value="" placeholder="Enter text...">
</div>
```

---

### ✅ File Uploads

```html
<div class="chatooly-input-group">
    <label class="chatooly-input-label" for="my-file">Upload</label>
    <input type="file"
           class="chatooly-input"
           id="my-file"
           accept="image/*"
           style="font-size: 13px; padding: 6px 10px;">
</div>
```

**Note:** File inputs need inline style adjustments for proper sizing

---

## 📦 Class Name Quick Reference

| Element Type | Container | Label | Input |
|-------------|-----------|-------|-------|
| **Section** | `chatooly-section-card` | `chatooly-section-header` | `chatooly-section-content` |
| **Toggle** | `chatooly-toggle-group` | `chatooly-toggle-label` | `chatooly-toggle` + `chatooly-toggle-slider` |
| **Color** | `chatooly-color-group` | `chatooly-color-label` | `chatooly-color-input` |
| **Slider** | `chatooly-control-group` | `<label>` (plain) | `<input type="range">` (no class) |
| **Select** | `chatooly-input-group` | `chatooly-input-label` | `chatooly-select` |
| **Text** | `chatooly-input-group` | `chatooly-input-label` | `chatooly-input` |
| **File** | `chatooly-input-group` | `chatooly-input-label` | `chatooly-input` |
| **Button** | N/A | N/A | `chatooly-btn` |

---

## 🚫 Common Anti-Patterns

### ❌ DO NOT USE THESE CLASSES (Old Template)

```html
<!-- WRONG - Old template classes -->
<h3 class="section-header">Section <span class="section-toggle">▼</span></h3>
<div class="section-content">...</div>

<label><input type="checkbox" id="toggle"> Feature</label>

<div class="control-group">
    <label>Color</label>
    <input type="color">
</div>
```

### ✅ USE THESE INSTEAD (Current Template)

```html
<!-- CORRECT - Current template classes -->
<div class="chatooly-section-card">
    <h3 class="chatooly-section-header">Section</h3>
    <div class="chatooly-section-content">...</div>
</div>

<div class="chatooly-toggle-group">
    <button type="button" class="chatooly-toggle" id="toggle" role="switch" aria-pressed="false">
        <span class="chatooly-toggle-slider"></span>
    </button>
    <label class="chatooly-toggle-label" for="toggle">Feature</label>
</div>

<div class="chatooly-color-group">
    <label class="chatooly-color-label">Color</label>
    <input type="color" class="chatooly-color-input">
</div>
```

---

## 🎨 Visual Design Principles

1. **All sections use cards** - White background, subtle border, rounded corners
2. **Toggle switches not checkboxes** - Modern iOS-style toggles
3. **Consistent spacing** - Defined by CDN CSS variables
4. **Collapsible sections** - Handled automatically by CDN JavaScript
5. **Responsive** - Mobile-friendly by default

---

## 🔍 Validation Checklist

Before delivering a tool to the user, verify:

- [ ] All sections use `chatooly-section-card` wrapper
- [ ] All toggles use `<button class="chatooly-toggle">` not checkboxes
- [ ] All color pickers use `chatooly-color-group` + `chatooly-color-input`
- [ ] All dropdowns have `chatooly-select` class
- [ ] All text/file inputs use `chatooly-input-group` + `chatooly-input`
- [ ] No local `style.css` file (CDN handles all styling)
- [ ] Canvas has `id="chatooly-canvas"`
- [ ] CDN script loaded: `https://yaelren.github.io/chatooly-cdn/js/core.min.js`

---

## 📖 Additional Resources

- **CDN Demo**: https://yaelren.github.io/chatooly-cdn/sv-tools-example.html
- **Template Source**: See `index.html` for complete annotated examples
- **CSS Variables**: https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css
- **Components**: https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css

---

## 🤝 When in Doubt

1. Look at the example controls in `index.html`
2. Compare to the CDN demo tool
3. Copy the exact pattern, don't improvise
4. Ask the user if unsure about a specific control type

**Remember:** The goal is consistency across all Chatooly tools. Following these patterns ensures every tool looks professional and matches the design system.
