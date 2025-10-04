# Chatooly Tool Builder - Claude Code Instructions

Welcome to the Chatooly Template! This modular instruction system helps Claude Code efficiently build amazing creative tools while following all the essential rules.

## 📁 Modular Rule System

This CLAUDE.md file references focused rule modules to optimize token usage and maintainability:

### Core Rules & Structure
- **[01-core-rules.md](claude-rules/01-core-rules.md)** - MANDATORY development rules (canvas structure, CDN scripts, export containers)
- **[02-workflow-setup.md](claude-rules/02-workflow-setup.md)** - Step-by-step workflow when user says "build a tool"

### Technical Implementation
- **[03-canvas-resize.md](claude-rules/03-canvas-resize.md)** - Canvas resize handling and mouse coordinate mapping
- **[04-high-res-export.md](claude-rules/04-high-res-export.md)** - High-resolution export implementation (mandatory)
- **[05-library-selection.md](claude-rules/05-library-selection.md)** - Library selection guide and setup code
- **[08-background-system.md](claude-rules/08-background-system.md)** - Background controls (wire up HTML to backgroundManager API)

### Design & Publishing
- **[06-design-system.md](claude-rules/06-design-system.md)** - Chatooly CSS variables and styling system
- **[07-publishing-troubleshooting.md](claude-rules/07-publishing-troubleshooting.md)** - Publishing workflow and common issue solutions

## 🚀 Quick Start for Claude Code

When a designer says **"Let's build a tool"** or **"I want to create..."**:

1. **Read ALL Claude Rules FIRST**: You MUST read all files in `claude-rules/` directory before starting:
   - `01-core-rules.md` - MANDATORY canvas structure, CDN setup
   - `02-workflow-setup.md` - Step-by-step build process
   - `03-canvas-resize.md` - Canvas resize handling (for interactive tools)
   - `04-high-res-export.md` - Export implementation (MANDATORY)
   - `05-library-selection.md` - Choose the right framework
   - `06-design-system.md` - CSS variables and styling
   - `07-publishing-troubleshooting.md` - Publishing workflow
   - `08-background-system.md` - Background controls wiring (MANDATORY)

2. **Follow Workflow**: Use `claude-rules/02-workflow-setup.md` step-by-step
3. **Reference Technical Files**: Re-read specific files during implementation
4. **Use TodoWrite**: Track all tasks systematically

**⚠️ CRITICAL**: Reading all claude-rules files ensures you implement ALL required features (canvas resize, background controls, high-res export, etc.)

## 💡 Key Benefits of This System

### For Claude Code:
- **Token Efficiency**: Load only relevant rule sections
- **Focused Context**: Each file covers one specific area
- **Better Maintainability**: Update individual rules without affecting others
- **Reduced Errors**: Clear, focused instructions prevent rule conflicts

### For Designers:
- **Consistent Results**: Claude follows the same systematic approach every time
- **Comprehensive Coverage**: All technical requirements handled automatically
- **Easy Updates**: Rule improvements can be made to specific areas

## 🎯 Example Usage Patterns

```
User: "Build a gradient generator"
→ Claude reads ALL claude-rules files (01-08) FIRST
→ Creates TodoWrite task list
→ Implements tool following all rules:
  • Canvas structure (01-core-rules.md)
  • Background controls wiring (08-background-system.md)
  • High-res export (04-high-res-export.md)
  • Canvas resize handling (03-canvas-resize.md)
  • CSS styling (06-design-system.md)
→ Re-references specific files during implementation
→ Tests all features work correctly
```

## 📚 Additional Resources

### Documentation
- [Chatooly API Reference](template-dev/CHATOOLY_API.md)
- [Template Specification](template-dev/TEMPLATE-SPECIFICATION.md)

### Live References
- [CSS Variables](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/variables.css)
- [CDN Components](https://raw.githubusercontent.com/yaelren/chatooly-cdn/main/css/components.css)

## ⚡ Ready to Build?

Just tell Claude Code what you want to create! Examples:
- "Build a mandala pattern generator"
- "Create an image glitch effect tool" 
- "Make a data visualization dashboard"
- "Build a color palette generator"

Claude Code will automatically:
✅ Follow all Chatooly rules and standards
✅ Choose the right libraries and setup
✅ Implement proper canvas handling and exports  
✅ Create beautiful, functional tools
✅ Test everything works correctly

**Happy building with Chatooly and Claude Code!**