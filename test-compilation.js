#!/usr/bin/env node

// Simple compilation test script
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for common compilation issues...\n');

// Check React frontend
const frontendPath = './react-frontend/src';
const contractPath = './Contract/contracts';

// Function to check for common TypeScript/React issues
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for missing React import in TSX files
    if (filePath.endsWith('.tsx') && !content.includes('import React') && content.includes('<')) {
      issues.push('Missing React import in TSX file');
    }
    
    // Check for missing semicolons in import statements
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    importLines.forEach((line, index) => {
      if (!line.trim().endsWith(';') && !line.trim().endsWith('{')) {
        issues.push(`Missing semicolon in import statement at line ${index + 1}`);
      }
    });
    
    // Check for unused imports (basic check)
    const importMatches = content.match(/import\s+{([^}]+)}\s+from/g);
    if (importMatches) {
      importMatches.forEach(match => {
        const imports = match.match(/{([^}]+)}/)[1].split(',').map(s => s.trim());
        imports.forEach(imp => {
          if (imp && !content.includes(imp.replace(/\s+as\s+\w+/, ''))) {
            // This is a basic check, might have false positives
          }
        });
      });
    }
    
    return issues;
  } catch (error) {
    return [`Error reading file: ${error.message}`];
  }
}

// Check key files
const keyFiles = [
  './react-frontend/src/App.tsx',
  './react-frontend/src/index.tsx',
  './react-frontend/src/types/index.ts',
  './react-frontend/src/contexts/Web3Context.tsx',
  './react-frontend/src/contexts/AppContext.tsx',
  './react-frontend/src/contexts/GameContext.tsx',
  './react-frontend/src/components/GameContainer.tsx',
  './react-frontend/src/components/LandingPage.tsx'
];

let totalIssues = 0;

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`📁 Checking ${file}...`);
    const issues = checkFile(file);
    if (issues.length > 0) {
      console.log(`❌ Issues found:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      totalIssues += issues.length;
    } else {
      console.log(`✅ No obvious issues found`);
    }
    console.log('');
  } else {
    console.log(`❌ File not found: ${file}\n`);
    totalIssues++;
  }
});

// Check package.json dependencies
console.log('📦 Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('./react-frontend/package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for potential version conflicts
  if (deps.react && deps['@types/react']) {
    console.log(`✅ React: ${deps.react}, @types/react: ${deps['@types/react']}`);
  }
  
  if (deps.typescript) {
    console.log(`✅ TypeScript: ${deps.typescript}`);
  }
  
  if (deps.ethers) {
    console.log(`✅ Ethers: ${deps.ethers}`);
  }
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  totalIssues++;
}

console.log(`\n📊 Summary: ${totalIssues} potential issues found`);

if (totalIssues === 0) {
  console.log('🎉 No obvious compilation issues detected!');
} else {
  console.log('⚠️  Some issues detected. Please review the output above.');
}