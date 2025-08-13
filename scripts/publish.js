#!/usr/bin/env node

/**
 * Chatooly Template - Publishing Script
 * Publishes tool to Chatooly Hub via API
 */

import fs from 'fs/promises';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Helper function to extract ChatoolyConfig from HTML
async function extractConfigFromHTML() {
  try {
    const htmlPath = path.join(process.cwd(), 'index.html');
    const htmlContent = await fs.readFile(htmlPath, 'utf8');
    
    // Extract ChatoolyConfig from script tag
    const configMatch = htmlContent.match(/window\.ChatoolyConfig\s*=\s*({[\s\S]*?});/);
    if (!configMatch) {
      throw new Error('ChatoolyConfig not found in index.html');
    }
    
    // Parse the config object
    const configString = configMatch[1];
    const config = eval('(' + configString + ')'); // Using eval for simplicity in CLI context
    
    return config;
  } catch (error) {
    console.error(`${colors.red}Error reading config:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Helper function to collect all local files
async function collectLocalFiles() {
  const files = {};
  const discovered = new Set();
  
  try {
    console.log(`${colors.blue}📁 Collecting tool files...${colors.reset}`);
    
    // Start with core files
    const coreFiles = ['index.html', 'style.css', 'tool.js'];
    
    for (const fileName of coreFiles) {
      try {
        const filePath = path.join(process.cwd(), fileName);
        const content = await fs.readFile(filePath, 'utf8');
        
        // Clean up HTML (remove CDN script for published version)
        if (fileName === 'index.html') {
          const cleanedContent = content
            .replace(/<script src="[^"]*chatooly-cdn[^"]*"><\/script>/, '')
            .replace(/\s*<!-- ===== CDN Integration ===== -->\s*/, '');
          files[fileName] = cleanedContent;
        } else {
          files[fileName] = content;
        }
        
        discovered.add(fileName);
        console.log(`${colors.green}✓${colors.reset} ${fileName}`);
        
        // Scan for dependencies
        await scanFileDependencies(content, files, discovered, getFileType(fileName));
        
      } catch (error) {
        if (fileName !== 'style.css' && fileName !== 'tool.js') {
          // index.html is required
          throw error;
        }
        console.log(`${colors.yellow}⚠${colors.reset} ${fileName} not found (optional)`);
      }
    }
    
    // Try to include common asset directories
    const assetDirs = ['assets', 'images', 'img', 'sounds', 'audio', 'data'];
    for (const dir of assetDirs) {
      await includeDirectory(dir, files);
    }
    
    console.log(`${colors.green}📦 Collected ${Object.keys(files).length} files${colors.reset}`);
    return files;
    
  } catch (error) {
    console.error(`${colors.red}Error collecting files:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Helper function to scan file dependencies
async function scanFileDependencies(content, files, discovered, fileType) {
  const dependencyPatterns = {
    html: [
      /<script src="\.\/([^"]+)"/g,
      /<link href="\.\/([^"]+)"/g,
      /<img src="\.\/([^"]+)"/g,
      /<source src="\.\/([^"]+)"/g
    ],
    css: [
      /url\(['"]?\.\/([^'")\s]+)['"]?\)/g,
      /@import ['"]\.\/([^'"]+)['"]/g
    ],
    js: [
      /fetch\(['"`]\.\/([^'"`]+)['"`]\)/g,
      /import.*from ['"`]\.\/([^'"`]+)['"`]/g,
      /require\(['"`]\.\/([^'"`]+)['"`]\)/g
    ]
  };
  
  const patterns = dependencyPatterns[fileType] || [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const filePath = match[1];
      if (!discovered.has(filePath)) {
        discovered.add(filePath);
        try {
          const fullPath = path.join(process.cwd(), filePath);
          const fileContent = await fs.readFile(fullPath, 'utf8');
          files[filePath] = fileContent;
          console.log(`${colors.green}✓${colors.reset} ${filePath} (dependency)`);
          
          // Recursively scan discovered files
          const extension = path.extname(filePath).substring(1);
          if (['html', 'css', 'js'].includes(extension)) {
            await scanFileDependencies(fileContent, files, discovered, extension);
          }
        } catch (error) {
          console.log(`${colors.yellow}⚠${colors.reset} Could not load dependency: ${filePath}`);
        }
      }
    }
  }
}

// Helper function to include entire directory
async function includeDirectory(dirName, files) {
  try {
    const dirPath = path.join(process.cwd(), dirName);
    const stats = await fs.stat(dirPath);
    
    if (stats.isDirectory()) {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativePath = path.join(dirName, entry.name);
        
        if (entry.isFile()) {
          const content = await fs.readFile(fullPath);
          files[relativePath] = content.toString('base64');
          console.log(`${colors.green}✓${colors.reset} ${relativePath}`);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist, skip silently
  }
}

// Helper function to get file type
function getFileType(fileName) {
  const ext = path.extname(fileName).substring(1).toLowerCase();
  return ['html', 'css', 'js'].includes(ext) ? ext : 'text';
}

// Helper function to make HTTP request
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const parsedUrl = new URL(url);
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'X-Chatooly-Source': 'cli'
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// Main publish function
async function publish() {
  console.log(`${colors.bold}${colors.blue}🚀 Publishing tool to Chatooly Hub...${colors.reset}\n`);
  
  try {
    // Extract configuration
    console.log(`${colors.blue}📋 Reading tool configuration...${colors.reset}`);
    const config = await extractConfigFromHTML();
    
    if (!config.name) {
      console.error(`${colors.red}❌ Tool name is required in ChatoolyConfig${colors.reset}`);
      process.exit(1);
    }
    
    console.log(`${colors.green}✓${colors.reset} Tool: ${config.name}`);
    console.log(`${colors.green}✓${colors.reset} Category: ${config.category || 'generators'}`);
    console.log(`${colors.green}✓${colors.reset} Author: ${config.author || 'Anonymous'}\n`);
    
    // Collect files
    const files = await collectLocalFiles();
    
    // Prepare payload
    const payload = {
      toolName: config.name,
      metadata: {
        name: config.name,
        category: config.category || 'generators',
        tags: config.tags || [],
        description: config.description || '',
        version: config.version || '1.0.0',
        author: config.author || 'Anonymous',
        private: config.private || false,
        timestamp: new Date().toISOString()
      },
      files: files
    };
    
    console.log(`\n${colors.blue}📤 Uploading to Chatooly Hub...${colors.reset}`);
    
    // Send to Chatooly Hub
    const response = await makeRequest('https://chatooly.com/api/publish', payload);
    
    if (response.status === 200 && response.data.success) {
      console.log(`${colors.bold}${colors.green}🎉 Tool published successfully!${colors.reset}\n`);
      console.log(`${colors.blue}🔗 Live URL:${colors.reset} ${response.data.url}`);
      console.log(`${colors.blue}📛 Tool Name:${colors.reset} ${response.data.actualName}`);
      console.log(`${colors.blue}📅 Published:${colors.reset} ${new Date(response.data.publishedAt).toLocaleString()}\n`);
      
      if (response.data.actualName !== config.name) {
        console.log(`${colors.yellow}ℹ Note: Tool name was adjusted to "${response.data.actualName}" for availability${colors.reset}\n`);
      }
      
    } else {
      console.error(`${colors.red}❌ Publishing failed:${colors.reset}`, response.data.message);
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`${colors.red}❌ Publishing failed:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Run the publish function
publish();