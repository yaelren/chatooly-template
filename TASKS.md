# Chatooly Template - Refactoring Tasks

## Overview
Transform the template from a full HTML/CSS system to a minimal, CDN-powered template that gets all styling and layout from the CDN.

## Current State
- **73 lines** of HTML with full layout structure
- **141+ lines** of CSS for styling
- **Manual** control creation in HTML
- **Static** layout (sidebar only)

## Target State
- **10 lines** of minimal HTML
- **0 lines** of base CSS (only tool-specific)
- **Config-driven** control generation
- **Dynamic** layouts from CDN

## Tasks

### Phase 1: Template Simplification 🚀

#### 1.1 Create Minimal HTML Template
- [ ] Reduce index.html to minimal structure
- [ ] Remove all layout HTML
- [ ] Remove styles.css link
- [ ] Update CDN script path to new version
- [ ] Test with CDN v2

**New index.html structure:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatooly Tool</title>
</head>
<body>
    <script src="https://yaelren.github.io/chatooly-cdn/js/core.min.js"></script>
    <script src="js/chatooly-config.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
```

#### 1.2 Update Config Structure
- [ ] Add layout selection to config
- [ ] Add controls array format
- [ ] Add canvas configuration
- [ ] Update example configs

**New chatooly-config.js structure:**
```javascript
window.ChatoolyConfig = {
    // Basic info
    name: "My Tool",
    author: "Designer Name",
    version: "1.0.0",
    
    // Layout selection
    layout: "sidebar", // or "custom"
    
    // Canvas configuration
    canvas: {
        width: 1920,
        height: 1080,
        display: "fit", // or "fill", "actual"
        background: "#ffffff"
    },
    
    // Control definitions
    controls: [
        {
            type: "group",
            label: "Settings",
            controls: [
                { type: "color", id: "bg-color", label: "Background", value: "#ffffff" },
                { type: "range", id: "size", label: "Size", min: 10, max: 100, value: 50 },
                { type: "text", id: "title", label: "Title", value: "My Design" }
            ]
        }
    ]
};
```

#### 1.3 Remove/Archive Old Files
- [ ] Archive current styles.css as styles-legacy.css
- [ ] Create minimal styles.css for tool-specific styles only
- [ ] Remove unused template files
- [ ] Clean up package.json

### Phase 2: Documentation Updates 📚

#### 2.1 Update START_HERE.md
- [ ] Simplify workflow instructions
- [ ] Remove HTML/CSS editing sections
- [ ] Add config-driven control instructions
- [ ] Update examples for new system
- [ ] Add migration guide for existing tools

**Key changes to document:**
- No more HTML editing for controls
- No more CSS editing for layout
- Focus on config + JavaScript only
- Automatic control generation
- Layout selection options

#### 2.2 Create Migration Guide
- [ ] Document old vs new workflow
- [ ] Provide conversion examples
- [ ] List breaking changes
- [ ] Create compatibility checker

#### 2.3 Update README.md
- [ ] Reflect new simplified approach
- [ ] Update getting started section
- [ ] Add CDN architecture explanation
- [ ] Update examples

### Phase 3: Integration Testing 🧪

#### 3.1 Test with CDN v2
- [ ] Wait for CDN v2 deployment
- [ ] Test minimal template with new CDN
- [ ] Verify control generation
- [ ] Test canvas scaling
- [ ] Check responsive behavior

#### 3.2 Tool Migration Testing
- [ ] Convert windy-text to new format
- [ ] Test backwards compatibility mode
- [ ] Verify export functionality
- [ ] Test publishing workflow

#### 3.3 Cross-browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Phase 4: Developer Experience 🛠️

#### 4.1 Create Config Builder
- [ ] Visual config generator tool
- [ ] Control preview system
- [ ] Config validation
- [ ] Export config JSON

#### 4.2 Update Development Workflow
- [ ] Simplify npm scripts
- [ ] Remove unnecessary dependencies
- [ ] Update dev server configuration
- [ ] Add hot reload for config changes

### Phase 5: Rollout 🚀

#### 5.1 Beta Testing
- [ ] Release template v2-beta
- [ ] Gather feedback from designers
- [ ] Fix identified issues
- [ ] Performance optimization

#### 5.2 Documentation Videos
- [ ] Record new workflow walkthrough
- [ ] Create migration tutorial
- [ ] Show advanced features

#### 5.3 Final Release
- [ ] Tag template v2.0.0
- [ ] Update all examples
- [ ] Announce changes
- [ ] Archive old template

## Timeline

**Week 1-2**: CDN Development (see chatooly-cdn/REFACTORING-PLAN.md)
**Week 3**: Template simplification
**Week 4**: Documentation updates
**Week 5**: Testing & migration
**Week 6**: Release

## Success Metrics

- [ ] Template reduced from 214 lines to <20 lines
- [ ] Zero CSS required for base functionality
- [ ] 80% faster tool creation time
- [ ] 100% backwards compatibility
- [ ] All tools get automatic updates

## Dependencies

**Blocked by:**
- CDN v2 deployment (chatooly-cdn/REFACTORING-PLAN.md)

**Blocks:**
- Tool migrations
- New tool creation

## Notes

### What Designers Will Love
1. **No HTML/CSS needed** - Just config and JavaScript
2. **Professional UI instantly** - Pre-built components
3. **Multiple layouts** - Choose what fits the tool
4. **Automatic updates** - Always get improvements
5. **Better mobile support** - Responsive by default

### What Stays the Same
1. Export functionality
2. Publishing workflow  
3. Git workflow
4. Local development
5. Tool logic in main.js

### Migration Path
```javascript
// Old tools can add this to opt-in:
window.ChatoolyConfig = {
    useCDNv2: true,
    // ... rest of config
};

// Or stay on v1:
window.ChatoolyConfig = {
    legacyMode: true,
    // ... old config
};
```

## Questions to Resolve

1. Should old tools auto-migrate or require opt-in?
2. How long to maintain v1 support?
3. Should we provide a migration CLI tool?
4. Do we need a visual config builder immediately?

---

*This refactoring will transform Chatooly from a template system to a true platform where designers focus on creativity, not web development.*