#!/usr/bin/env node

/**
 * Base 44 to Chatooly Converter
 * Converts Base 44 React projects to Chatooly vanilla HTML/JS tools
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Base44Converter {
  constructor(sourcePath, outputPath) {
    this.sourcePath = sourcePath;
    this.outputPath = outputPath || './converted-tool';
  }

  async convert() {
    console.log('🔄 Converting Base 44 project to Chatooly tool...');
    
    try {
      // 1. Analyze project structure
      const projectInfo = await this.analyzeProject();
      console.log(`📁 Found project: ${projectInfo.name}`);
      
      // 2. Extract core functionality
      const coreLogic = await this.extractCoreLogic();
      console.log('⚡ Extracted core logic');
      
      // 3. Convert React components to HTML/CSS
      const htmlStructure = await this.convertToHtml();
      console.log('🏗️  Converted to HTML structure');
      
      // 4. Generate Chatooly tool files
      await this.generateChatoolyTool(projectInfo, coreLogic, htmlStructure);
      console.log('✅ Generated Chatooly tool files');
      
      // 5. Create conversion report
      await this.generateReport();
      console.log(`📄 Conversion complete! Tool created at: ${this.outputPath}`);
      
    } catch (error) {
      console.error('❌ Conversion failed:', error.message);
      throw error;
    }
  }

  async analyzeProject() {
    const packageJsonPath = path.join(this.sourcePath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('Not a valid Base 44 project - package.json not found');
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Find main page component
    const srcPath = path.join(this.sourcePath, 'src');
    const pagesPath = path.join(srcPath, 'pages');
    
    let mainComponent = null;
    if (fs.existsSync(pagesPath)) {
      const pages = fs.readdirSync(pagesPath).filter(f => f.endsWith('.jsx'));
      mainComponent = pages.find(p => !p.includes('Layout') && !p.includes('index'));
    }
    
    return {
      name: packageJson.name,
      version: packageJson.version,
      dependencies: packageJson.dependencies,
      mainComponent: mainComponent
    };
  }

  async extractCoreLogic() {
    const srcPath = path.join(this.sourcePath, 'src');
    const componentsPath = path.join(srcPath, 'components');
    
    let coreLogic = {
      algorithms: [],
      canvasOperations: [],
      imageProcessingLogic: null,
      algorithmFunctions: [],
      mainProcessFunction: null,
      hasImageUpload: false
    };

    // Look for algorithm-heavy components (Canvas, Processing, etc.)
    if (fs.existsSync(componentsPath)) {
      const componentDirs = fs.readdirSync(componentsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const dir of componentDirs) {
        if (dir === 'ui') continue; // Skip UI components
        
        const dirPath = path.join(componentsPath, dir);
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Look for canvas-heavy components
          if (file.toLowerCase().includes('canvas') || content.includes('getImageData') || content.includes('putImageData')) {
            console.log(`🎯 Found algorithm component: ${file}`);
            coreLogic.algorithmFunctions = this.extractAlgorithmFunctions(content);
            coreLogic.mainProcessFunction = this.extractMainProcessFunction(content);
            coreLogic.imageProcessingLogic = content; // Keep full content for reference
          }
          
          // Check for image upload components
          if (file.toLowerCase().includes('upload') || content.includes('FileReader') || content.includes('type="file"')) {
            console.log(`📤 Found image upload component: ${file}`);
            coreLogic.hasImageUpload = true;
          }
          
          // Extract canvas operations for reference
          const canvasMatches = content.match(/canvas\.[^\n]*/g) || [];
          coreLogic.canvasOperations.push(...canvasMatches);
        }
      }
    }

    return coreLogic;
  }

  extractAlgorithmFunctions(content) {
    const algorithms = [];
    
    // Extract all algorithm functions (const apply* = () => {})
    const algorithmRegex = /const\s+(apply\w+|process\w+|\w*[Aa]lgorithm\w*)\s*=\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\n\s*\};/g;
    let match;
    
    while ((match = algorithmRegex.exec(content)) !== null) {
      const functionName = match[1];
      const fullMatch = match[0];
      const params = fullMatch.match(/\(([^)]*)\)/)[1];
      const bodyMatch = fullMatch.match(/=>\s*\{([\s\S]*?)\n\s*\};/);
      const body = bodyMatch ? bodyMatch[1] : '';
      
      algorithms.push({
        name: functionName,
        params: params.split(',').map(p => p.trim()).filter(Boolean),
        body: body.trim(),
        vanillaFunction: this.convertToVanillaFunction(functionName, params, body)
      });
      
      console.log(`  📋 Extracted algorithm: ${functionName}`);
    }
    
    return algorithms;
  }

  extractMainProcessFunction(content) {
    // Look for main processing function
    const processMatch = content.match(/const\s+(processImage|process\w+|render\w*)\s*=\s*async\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\n\s*\};/)
      || content.match(/const\s+(processImage|process\w+|render\w*)\s*=\s*\([^)]*\)\s*=>\s*\{([\s\S]*?)\n\s*\};/);
    
    if (processMatch) {
      const functionName = processMatch[1];
      const body = processMatch[2];
      console.log(`  🔄 Extracted main process function: ${functionName}`);
      
      return {
        name: functionName,
        body: body.trim(),
        vanillaFunction: this.convertProcessFunctionToVanilla(body)
      };
    }
    
    return null;
  }

  convertToVanillaFunction(name, params, body) {
    // Convert React arrow function to vanilla JS function
    const cleanParams = params.split(',').map(p => p.trim()).join(', ');
    const cleanBody = body
      .replace(/const\s+(\w+)\s*=\s*/g, 'let $1 = ') // const -> let
      .replace(/([^.])data\[/g, '$1data[') // ensure data array access is clean
      .trim();
      
    return `function ${name}(${cleanParams}) {
    ${cleanBody}
    return imageData;
  }`;
  }

  convertProcessFunctionToVanilla(body) {
    // Convert React processing logic to vanilla JS
    return body
      .replace(/onProcessingChange\(true\);?/g, '// Processing started')
      .replace(/onProcessingChange\(false\);?/g, '// Processing completed')
      .replace(/await new Promise\([^)]+\);?/g, '// Removed async delay')
      .replace(/originalImage\.img/g, 'originalImage')
      .replace(/settings\./g, 'settings.')
      .replace(/onProcessed\([^)]+\);?/g, '// Export handled by Chatooly CDN')
      .trim();
  }

  async convertToHtml() {
    // Find main page component
    const srcPath = path.join(this.sourcePath, 'src');
    const pagesPath = path.join(srcPath, 'pages');
    
    let htmlStructure = {
      title: 'Base 44 Tool',
      controls: [],
      canvasArea: '<canvas id="main-canvas"></canvas>'
    };

    // Parse main component if exists
    if (fs.existsSync(pagesPath)) {
      const files = fs.readdirSync(pagesPath).filter(f => f.endsWith('.jsx'));
      const mainFile = files.find(f => !f.includes('Layout') && !f.includes('index'));
      
      if (mainFile) {
        const mainPath = path.join(pagesPath, mainFile);
        const content = fs.readFileSync(mainPath, 'utf8');
        
        // Extract title
        const titleMatch = content.match(/<h1[^>]*>([^<]*)</);
        if (titleMatch) {
          htmlStructure.title = titleMatch[1].replace(/\s+/g, ' ').trim();
        }
        
        // Convert React controls to HTML
        htmlStructure.controls = this.extractControls(content);
      }
    }

    return htmlStructure;
  }

  extractControls(content) {
    const controls = [];
    
    // Look for DitheringControls component usage to find the actual controls
    const controlsComponentPath = path.join(this.sourcePath, 'src', 'components', 'dithering', 'DitheringControls.jsx');
    let controlsContent = '';
    
    if (fs.existsSync(controlsComponentPath)) {
      controlsContent = fs.readFileSync(controlsComponentPath, 'utf8');
      console.log('  📋 Found DitheringControls component');
      
      // Extract algorithm dropdown
      const algorithmMatch = controlsContent.match(/algorithms = \[([\s\S]*?)\];/);
      if (algorithmMatch) {
        const algorithmOptions = [];
        const optionMatches = algorithmMatch[1].match(/\{ value: '([^']*)', label: '([^']*)'/g) || [];
        
        optionMatches.forEach(match => {
          const valueMatch = match.match(/value: '([^']*)'/);
          const labelMatch = match.match(/label: '([^']*)'/);
          if (valueMatch && labelMatch) {
            algorithmOptions.push({
              value: valueMatch[1],
              text: labelMatch[1]
            });
          }
        });
        
        if (algorithmOptions.length > 0) {
          controls.push({
            type: 'select',
            id: 'algorithm-select',
            label: 'Algorithm',
            options: algorithmOptions
          });
        }
      }
      
      // Extract sliders with proper names
      this.extractNamedSliders(controlsContent, controls);
    } else {
      // Fallback to generic extraction
      this.extractGenericControls(content, controls);
    }
    
    return controls;
  }

  extractNamedSliders(content, controls) {
    // Look for specific slider patterns with labels
    const sliderPatterns = [
      { match: /Threshold.*?min=\{(\d+)\}.*?max=\{(\d+)\}.*?value=\{\[([^\]]*)\]\}/s, name: 'threshold', label: 'Threshold' },
      { match: /Color Levels.*?min=\{(\d+)\}.*?max=\{(\d+)\}.*?value=\{\[([^\]]*)\]\}/s, name: 'colors', label: 'Color Levels' },
      { match: /Contrast.*?min=\{([\d.]+)\}.*?max=\{([\d.]+)\}.*?value=\{\[([^\]]*)\]\}/s, name: 'contrast', label: 'Contrast' },
      { match: /Brightness.*?min=\{(-?\d+)\}.*?max=\{(\d+)\}.*?value=\{\[([^\]]*)\]\}/s, name: 'brightness', label: 'Brightness' }
    ];
    
    sliderPatterns.forEach(pattern => {
      const match = content.match(pattern.match);
      if (match) {
        controls.push({
          type: 'range',
          id: `${pattern.name}-slider`,
          label: pattern.label,
          min: match[1],
          max: match[2],
          value: match[3].split('.')[1] || match[3] // Handle settings.threshold format
        });
        console.log(`  🎛️  Extracted ${pattern.label} slider`);
      }
    });
  }

  extractGenericControls(content, controls) {
    // Generic extraction as fallback
    const sliderMatches = content.match(/<Slider[^>]*>/g) || [];
    sliderMatches.forEach((match, i) => {
      const minMatch = match.match(/min=\{([^}]*)\}/);
      const maxMatch = match.match(/max=\{([^}]*)\}/);
      const valueMatch = match.match(/value=\{\[([^\]]*)\]\}/);
      
      controls.push({
        type: 'range',
        id: `slider-${i}`,
        label: `Setting ${i + 1}`,
        min: minMatch ? minMatch[1] : '0',
        max: maxMatch ? maxMatch[1] : '100',
        value: valueMatch ? valueMatch[1] : '50'
      });
    });
    
    const selectMatches = content.match(/<Select[^>]*>.*?<\/Select>/gs) || [];
    selectMatches.forEach((match, i) => {
      const options = match.match(/<SelectItem[^>]*value="([^"]*)"[^>]*>.*?([^<]*)</g) || [];
      
      controls.push({
        type: 'select',
        id: `select-${i}`,
        label: `Option ${i + 1}`,
        options: options.map(opt => {
          const valueMatch = opt.match(/value="([^"]*)"/);
          const textMatch = opt.match(/>([^<]*)</);
          return {
            value: valueMatch ? valueMatch[1] : '',
            text: textMatch ? textMatch[1] : ''
          };
        })
      });
    });
  }

  async generateChatoolyTool(projectInfo, coreLogic, htmlStructure) {
    // Create output directory
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }

    // Copy template files first
    const templatePath = path.resolve(__dirname, '..');
    this.copyTemplateFile(templatePath, 'styles.css');
    
    // Create js directory
    const jsDir = path.join(this.outputPath, 'js');
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir);
    }

    // Generate customized files
    const indexHtml = this.generateIndexHtml(htmlStructure);
    fs.writeFileSync(path.join(this.outputPath, 'index.html'), indexHtml);

    const config = this.generateConfig(projectInfo, htmlStructure);
    fs.writeFileSync(path.join(jsDir, 'chatooly-config.js'), config);

    const mainJs = this.generateMainJs(coreLogic, htmlStructure);
    fs.writeFileSync(path.join(jsDir, 'main.js'), mainJs);

    // Generate package.json
    const packageJson = {
      name: `chatooly-${projectInfo.name}`,
      version: projectInfo.version,
      description: `Chatooly tool converted from ${projectInfo.name}`,
      scripts: {
        dev: "python3 -m http.server 8000 || python -m http.server 8000"
      },
      license: "MIT"
    };
    fs.writeFileSync(path.join(this.outputPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  }

  copyTemplateFile(templatePath, filename) {
    const srcFile = path.join(templatePath, filename);
    const destFile = path.join(this.outputPath, filename);
    
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, destFile);
    }
  }

  generateIndexHtml(htmlStructure) {
    const controlsHtml = htmlStructure.controls.map(control => {
      switch (control.type) {
        case 'range':
          return `
                <div class="control-group">
                    <label for="${control.id}">${control.label}</label>
                    <input type="range" id="${control.id}" min="${control.min}" max="${control.max}" value="${control.value}">
                    <span class="value-display">${control.value}</span>
                </div>`;
        case 'select':
          const options = control.options.map(opt => 
            `<option value="${opt.value}">${opt.text}</option>`
          ).join('');
          return `
                <div class="control-group">
                    <label for="${control.id}">${control.label}</label>
                    <select id="${control.id}">
                        ${options}
                    </select>
                </div>`;
        default:
          return '';
      }
    }).join('');

    return `<!DOCTYPE html>
<!--
    Chatooly Tool Template - Converted from Base 44
    Author: Base 44 Converter
-->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ========== EDIT THIS: Your Tool Name ========== -->
    <title>${htmlStructure.title} - Chatooly</title>
    
    <!-- ========== DO NOT EDIT: Required Styles ========== -->
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="app-container">
        <!-- Left Panel: Tool Controls -->
        <div class="controls-panel">
            <!-- ========== EDIT THIS: Your Tool Title ========== -->
            <h1>${htmlStructure.title}</h1>
            
            <div class="controls">
                <!-- ========== CONVERTED CONTROLS ========== -->${controlsHtml}
                <!-- ========== END CONVERTED CONTROLS ========== -->
            </div>
        </div>
        
        <!-- Right Panel: Preview/Canvas Area -->
        <div class="preview-panel">
            <!-- ========== DO NOT EDIT: Required Export Container ========== -->
            <div id="chatooly-canvas">
                <!-- ========== CONVERTED CANVAS ========== -->
                ${htmlStructure.canvasArea}
                <!-- ========== END CONVERTED CANVAS ========== -->
            </div>
        </div>
    </div>
    
    <!-- ========== DO NOT EDIT: Chatooly CDN Integration ========== -->
    <script src="https://yaelren.github.io/chatooly-cdn/js/core.js"></script>
    
    <!-- ========== DO NOT EDIT: Chatooly Configuration ========== -->
    <script src="js/chatooly-config.js"></script>
    
    <!-- ========== CONVERTED LOGIC ========== -->
    <script src="js/main.js"></script>
</body>
</html>`;
  }

  generateConfig(projectInfo, htmlStructure) {
    return `/* 
 * Chatooly Tool Template - Configuration
 * Converted from Base 44 project: ${projectInfo.name}
 */

// ========== CONVERTED CONFIGURATION ==========
window.ChatoolyConfig = {
    // REQUIRED: Your tool name
    name: "${htmlStructure.title}",
    
    // OPTIONAL: Export settings
    resolution: 2,              // 1, 2, or 4
    buttonPosition: "bottom-right",
    
    // REQUIRED FOR PUBLISHING: Tool metadata
    category: "generators",     // Choose one: "generators", "visualizers", "editors", "utilities", "games", "art"
    tags: ["base44", "converted", "${projectInfo.name.toLowerCase()}"],
    description: "Tool converted from Base 44 project: ${projectInfo.name}",
    version: "${projectInfo.version}",
    author: "Converted from Base 44"
};`;
  }

  generateMainJs(coreLogic, htmlStructure) {
    const controlsInit = htmlStructure.controls.map(control => {
      const varName = control.id.replace(/-/g, '_');
      return `
        const ${varName} = document.getElementById('${control.id}');
        if (${varName}) {
            ${varName}.addEventListener('${control.type === 'range' ? 'input' : 'change'}', handleControlChange);
        }`;
    }).join('');

    // Generate algorithm functions
    const algorithmFunctions = coreLogic.algorithmFunctions.map(algo => algo.vanillaFunction).join('\n\n');

    // Generate settings with intelligent defaults
    const settingsDefaults = this.generateSettingsDefaults(htmlStructure, coreLogic);

    // Generate main processing logic
    const processLogic = coreLogic.mainProcessFunction 
      ? this.generateProcessLogic(coreLogic.mainProcessFunction, coreLogic.algorithmFunctions)
      : this.generateBasicProcessLogic();

    return `/* 
 * Chatooly Tool Template - Main Logic
 * Converted from Base 44 - Algorithm Functions Extracted
 */

// ========== CONVERTED BASE 44 ALGORITHM FUNCTIONS ==========

${algorithmFunctions || '// No algorithm functions found - add manually'}

// ========== MAIN TOOL LOGIC ==========

let canvas, ctx, originalImage;
let settings = {
    ${settingsDefaults}
};

// Initialize canvas
function initCanvas() {
    canvas = document.getElementById('main-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Add file input for image upload
        addImageUpload();
        render();
    }
}

// Add image upload functionality
function addImageUpload() {
    // Check if we found an image upload component in the original
    ${coreLogic.hasImageUpload ? `
    // Add upload zone to controls panel instead of canvas area
    const controlsPanel = document.querySelector('.controls-panel');
    const uploadSection = document.createElement('div');
    uploadSection.className = 'control-group';
    uploadSection.innerHTML = \`
        <label>Upload Image</label>
        <div class="upload-zone" style="border: 2px dashed #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s;">
            <input type="file" id="image-upload" accept="image/*" style="display: none;">
            <div onclick="document.getElementById('image-upload').click()">
                <p style="margin: 0; color: #4a5568; font-weight: 500;">Click to upload</p>
                <p style="margin: 5px 0 0 0; color: #718096; font-size: 0.875rem;">or drag and drop</p>
            </div>
        </div>
    \`;
    
    // Add to controls panel before other controls
    const controls = controlsPanel.querySelector('.controls');
    controlsPanel.insertBefore(uploadSection, controls);
    ` : `
    // Basic upload functionality
    const uploadDiv = document.createElement('div');
    uploadDiv.innerHTML = \`
        <div style="text-align: center; padding: 20px; border: 2px dashed #ccc; margin: 20px;">
            <input type="file" id="image-upload" accept="image/*" style="display: none;">
            <button onclick="document.getElementById('image-upload').click()" style="padding: 10px 20px; font-size: 16px;">
                Upload Image
            </button>
            <p style="margin: 10px 0; color: #666;">Click to upload an image to process</p>
        </div>
    \`;
    
    canvas.parentNode.insertBefore(uploadDiv, canvas);
    `}
    
    // File upload handler
    document.getElementById('image-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    originalImage = img;
                    render();
                    
                    // Update upload zone to show filename
                    const uploadZone = document.querySelector('.upload-zone');
                    if (uploadZone) {
                        uploadZone.style.borderColor = '#4299e1';
                        uploadZone.querySelector('div').innerHTML = \`
                            <p style="margin: 0; color: #4299e1; font-weight: 500;">\${file.name}</p>
                            <p style="margin: 5px 0 0 0; color: #718096; font-size: 0.875rem;">Click to change</p>
                        \`;
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add drag and drop support
    const uploadZone = document.querySelector('.upload-zone');
    if (uploadZone) {
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#4299e1';
            this.style.backgroundColor = '#f0f9ff';
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e2e8f0';
            this.style.backgroundColor = 'transparent';
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#e2e8f0';
            this.style.backgroundColor = 'transparent';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                document.getElementById('image-upload').files = e.dataTransfer.files;
                document.getElementById('image-upload').dispatchEvent(new Event('change'));
            }
        });
    }
}

// Handle control changes
function handleControlChange(event) {
    const id = event.target.id.replace(/-/g, '_');
    const value = event.target.type === 'range' ? parseFloat(event.target.value) : event.target.value;
    
    settings[id] = value;
    
    // Update value display for sliders
    const valueDisplay = event.target.parentNode.querySelector('.value-display');
    if (valueDisplay && event.target.type === 'range') {
        valueDisplay.textContent = value;
    }
    
    render();
}

${processLogic}

// ========== INITIALIZATION ==========
// Initialize controls${controlsInit}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCanvas();
    console.log('Base 44 converted tool loaded with extracted algorithms!');
});`;
  }

  generateSettingsDefaults(htmlStructure, coreLogic) {
    // Create intelligent defaults based on extracted algorithms
    const defaults = [];
    
    // Add control-based settings
    htmlStructure.controls.forEach(control => {
      const key = control.id.replace(/-/g, '_');
      const value = control.value || (control.options && control.options[0]?.value) || '0';
      defaults.push(`${key}: ${value}`);
    });
    
    // Add algorithm-specific defaults if we found dithering algorithms
    if (coreLogic.algorithmFunctions.some(f => f.name.toLowerCase().includes('dither'))) {
      if (!defaults.some(d => d.includes('algorithm'))) {
        defaults.push(`algorithm: 'floyd-steinberg'`);
      }
      if (!defaults.some(d => d.includes('threshold'))) {
        defaults.push(`threshold: 128`);
      }
      if (!defaults.some(d => d.includes('colors'))) {
        defaults.push(`colors: 2`);
      }
      if (!defaults.some(d => d.includes('contrast'))) {
        defaults.push(`contrast: 1.0`);
      }
      if (!defaults.some(d => d.includes('brightness'))) {
        defaults.push(`brightness: 0`);
      }
    }
    
    return defaults.join(',\n    ') || 'ready: true';
  }

  generateProcessLogic(mainProcessFunction, algorithmFunctions) {
    const algorithmNames = algorithmFunctions.map(f => f.name);
    
    return `// ========== MAIN PROCESSING FUNCTION ==========
// Main render function - processes and displays the image
function render() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (!originalImage) {
        // Show upload prompt
        ctx.fillStyle = '#666666';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Upload an image above to begin processing', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Calculate display size
    const maxWidth = canvas.width - 40;
    const maxHeight = canvas.height - 40;
    let { width, height } = originalImage;
    
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
    }
    
    // Create temporary canvas for processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = width;
    tempCanvas.height = height;
    
    // Draw original image
    tempCtx.drawImage(originalImage, 0, 0, width, height);
    
    // Get image data for processing
    const imageData = tempCtx.getImageData(0, 0, width, height);
    
    // Apply preprocessing (contrast, brightness)
    applyPreprocessing(imageData, settings);
    
    // Apply main algorithm based on settings
    ${this.generateAlgorithmSwitch(algorithmNames)}
    
    // Draw processed result to main canvas
    const x = (canvas.width - width) / 2;
    const y = (canvas.height - height) / 2;
    
    const resultCanvas = document.createElement('canvas');
    const resultCtx = resultCanvas.getContext('2d');
    resultCanvas.width = width;
    resultCanvas.height = height;
    resultCtx.putImageData(imageData, 0, 0);
    
    ctx.drawImage(resultCanvas, x, y);
}

// Apply contrast and brightness adjustments
function applyPreprocessing(imageData, settings) {
    const data = imageData.data;
    const contrast = settings.contrast || 1.0;
    const brightness = settings.brightness || 0;
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply contrast
        data[i] = ((data[i] / 255 - 0.5) * contrast + 0.5) * 255;
        data[i + 1] = ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255;
        data[i + 2] = ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255;
        
        // Apply brightness
        data[i] += brightness;
        data[i + 1] += brightness;
        data[i + 2] += brightness;
        
        // Clamp values
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
    }
}`;
  }

  generateAlgorithmSwitch(algorithmNames) {
    if (algorithmNames.length === 0) {
      return `    // No algorithms found - add your processing logic here
    console.log('Processing image with settings:', settings);`;
    }

    const switchCases = algorithmNames.map(name => {
      const algorithmKey = name.replace(/^apply/, '').toLowerCase().replace(/dithering$/, '');
      return `        case '${algorithmKey}':
        case '${name.toLowerCase()}':
            ${name}(imageData, settings.threshold, settings.colors);
            break;`;
    }).join('\n');

    return `    // Apply selected algorithm
    switch (settings.algorithm) {
${switchCases}
        default:
            if (typeof ${algorithmNames[0]} === 'function') {
                ${algorithmNames[0]}(imageData, settings.threshold, settings.colors);
            }
            break;
    }`;
  }

  generateBasicProcessLogic() {
    return `// ========== BASIC PROCESSING FUNCTION ==========
// Main render function - implement your algorithm here
function render() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // TODO: Add your Base 44 algorithm logic here
    ctx.fillStyle = '#4299e1';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Algorithm extraction incomplete - see console', canvas.width / 2, canvas.height / 2);
    
    console.log('Settings:', settings);
    console.log('Add your Base 44 algorithm logic to the render() function');
}`;
  }

  async generateReport() {
    const report = `# Base 44 Conversion Report

## Project: ${path.basename(this.sourcePath)}

### ✅ Files Created:
- \`index.html\` - Main tool interface with converted controls
- \`styles.css\` - Chatooly-compatible styling  
- \`js/chatooly-config.js\` - Tool configuration
- \`js/main.js\` - **NEEDS MANUAL COMPLETION** 
- \`package.json\` - Development scripts

### ⚠️ Manual Steps Required:

1. **Complete the algorithm logic** in \`js/main.js\`
   - Replace the placeholder \`render()\` function
   - Port your Base 44 image processing algorithms
   - Connect controls to algorithm parameters

2. **Test the tool**:
   \`\`\`bash
   npm run dev
   # Visit http://localhost:8000
   \`\`\`

3. **Refine the interface**:
   - Adjust control labels and ranges
   - Customize styling in \`styles.css\`
   - Update tool metadata in \`chatooly-config.js\`

### 🔗 Integration Points:
- Canvas export will work automatically via Chatooly CDN
- Controls are connected to \`handleControlChange\`
- Call \`render()\` whenever settings change

### Next Steps:
1. Implement your Base 44 algorithms in the \`render()\` function
2. Test all controls work correctly  
3. Verify export functionality
4. Ready to publish!

---
*Generated: ${new Date().toISOString()}*
`;

    fs.writeFileSync(path.join(this.outputPath, 'CONVERSION_REPORT.md'), report);
  }
}

// CLI usage
if (process.argv[2] === '--help' || process.argv.length < 3) {
  console.log(`
🔄 Base 44 to Chatooly Converter

Usage: node convert-base44.js <base44-project-path> [output-path]

Example:
  node scripts/convert-base44.js ./extracted-base44-project ./my-new-tool

What it does:
  • Converts Base 44 React projects to Chatooly HTML/JS tools
  • Extracts controls and canvas logic
  • Generates Chatooly-compatible structure
  • Creates conversion report with next steps

Requirements:
  • Base 44 project must have package.json and src/ folder
  • Output path will be created if it doesn't exist
  `);
  process.exit(0);
}

const sourcePath = process.argv[2];
let outputPath = process.argv[3];

if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Source path does not exist: ${sourcePath}`);
  process.exit(1);
}

// If no output path specified, create in converted-tools folder
if (!outputPath) {
  const projectName = path.basename(sourcePath).toLowerCase().replace(/\s+/g, '-');
  outputPath = path.join(__dirname, '..', 'converted-tools', projectName);
}

// If output path is relative and doesn't start with ./, assume it's a tool name
if (!path.isAbsolute(outputPath) && !outputPath.startsWith('./')) {
  outputPath = path.join(__dirname, '..', 'converted-tools', outputPath);
}

const converter = new Base44Converter(sourcePath, outputPath);
converter.convert().catch(console.error);