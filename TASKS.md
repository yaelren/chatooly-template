# Chatooly Template - POC Implementation Tasks

Basic starter template for tool creation with CDN integration.

## ✅ Completed Tasks

- [x] Review CDN publishing implementation
- [x] Update architecture understanding (publishing is in CDN, not template)

## 🚧 In Progress

- [ ] Update template documentation to reflect CDN-based publishing

## 📋 Planned Tasks

- [ ] HTML structure
  - Include CDN script from yaelren.github.io
  - Basic 2-column layout (controls left, canvas right)
  - Clear "EDIT THIS" / "DO NOT EDIT" comments
  - Example control elements (input field, slider)
  - Placeholder comment for canvas area
- [ ] CSS styling
  - Responsive 2-column layout
  - Mobile-friendly design (stacks vertically)
  - Clean, modern styling with clear edit sections
- [ ] JavaScript setup
  - Placeholder tool.js with basic structure
  - Try-catch blocks with detailed error explanations
  - Event listener examples
  - Integration patterns for canvas/DOM tools
- [ ] Development workflow documentation
  - Multiple server options explained step-by-step
  - Python HTTP server (default)
  - Node.js alternatives
  - VS Code Live Server option
- [ ] Package.json configuration
  - Basic metadata only
  - Simple dev script
  - No publish script (handled by CDN)
- [ ] AI Integration files
  - .cursorrules for Cursor IDE
  - CHATOOLY_API.md with complete CDN reference
  - Instructions for AI to ask user for config details
- [ ] Git configuration
  - Simple .gitignore
  - Keep minimal for POC
- [ ] Create GitHub template repository
  - Template repository setup
  - Clear README with all server options

## 📁 Implementation Details

### File Structure
```
chatooly-template/
├── index.html              # Main HTML structure  
├── styles.css              # All CSS styling
├── js/
│   ├── main.js            # Main tool logic
│   └── chatooly-config.js # Chatooly CDN configuration only
├── package.json           # Basic scripts only
├── README.md              # Setup instructions
├── .gitignore             # Simple ignore rules
├── .cursorrules           # AI assistant context
└── CHATOOLY_API.md        # Complete CDN API reference
```

### Key Features
- One-command local development
- Publishing via CDN export button
- CDN auto-integration
- Simple 2-column responsive layout
- Tool metadata in package.json

### Package.json Structure
```json
{
  "name": "my-design-tool",
  "version": "1.0.0",
  "description": "Tool description",
  "scripts": {
    "dev": "python3 -m http.server 8000 || python -m http.server 8000"
  },
  "chatooly": {
    "category": "generators",
    "tags": ["design", "tool"],
    "private": false,
    "exportFormats": ["png"]
  }
}
```

## 🔴 Critical Path
1. Basic template files (HTML, CSS, JS)
2. Package.json with metadata
3. CDN integration in HTML
4. GitHub template setup