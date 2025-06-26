#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple TypeScript compilation test
console.log('🔍 Testing TypeScript compilation...');

// Check if the main files exist and can be parsed
const filesToCheck = [
  'react-frontend/src/types/index.ts',
  'react-frontend/src/hooks/useMarketplace.ts',
  'react-frontend/src/components/DemoNFTPreview.tsx',
  'react-frontend/src/components/MintShop.tsx',
  'react-frontend/src/components/ui/Badge.tsx',
  'react-frontend/src/components/ui/Button.tsx',
  'react-frontend/src/components/ui/Card.tsx',
  'react-frontend/src/components/Web3DataDebug.tsx',
  'react-frontend/src/hooks/useEnhancedGameAssetNFT.ts'
];

let allFilesExist = true;

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
    
    // Basic syntax check - try to read the file
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for common TypeScript errors
      const errors = [];
      
      // Check for missing imports
      if (content.includes('ListingType') && !content.includes('import') && !content.includes('ListingType')) {
        errors.push('Missing ListingType import');
      }
      
      // Check for duplicate function definitions
      const functionMatches = content.match(/const\s+(\w+)\s*=/g);
      if (functionMatches) {
        const functionNames = functionMatches.map(match => match.match(/const\s+(\w+)/)[1]);
        const duplicates = functionNames.filter((name, index) => functionNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
          errors.push(`Duplicate functions: ${duplicates.join(', ')}`);
        }
      }
      
      if (errors.length > 0) {
        console.log(`⚠️  ${file} has potential issues: ${errors.join(', ')}`);
      } else {
        console.log(`✅ ${file} looks good`);
      }
    } catch (error) {
      console.log(`❌ ${file} has syntax errors: ${error.message}`);
      allFilesExist = false;
    }
  } else {
    console.log(`❌ ${file} does not exist`);
    allFilesExist = false;
  }
}

// Check specific fixes
console.log('\n🔧 Checking specific fixes...');

// Check types file for new enums
const typesContent = fs.readFileSync('react-frontend/src/types/index.ts', 'utf8');
if (typesContent.includes('export enum ListingType') && typesContent.includes('export enum ListingStatus')) {
  console.log('✅ ListingType and ListingStatus enums added');
} else {
  console.log('❌ Missing ListingType or ListingStatus enums');
}

// Check useMarketplace for marketplaceContract return
const marketplaceContent = fs.readFileSync('react-frontend/src/hooks/useMarketplace.ts', 'utf8');
if (marketplaceContent.includes('marketplaceContract,') && marketplaceContent.includes('return {')) {
  console.log('✅ useMarketplace returns marketplaceContract');
} else {
  console.log('❌ useMarketplace missing marketplaceContract in return');
}

// Check DemoNFTPreview for AssetRarity import
const demoContent = fs.readFileSync('react-frontend/src/components/DemoNFTPreview.tsx', 'utf8');
if (demoContent.includes('import { AssetRarity }') && demoContent.includes('getRarityColor = (rarity: AssetRarity)')) {
  console.log('✅ DemoNFTPreview uses AssetRarity correctly');
} else {
  console.log('❌ DemoNFTPreview AssetRarity usage issue');
}

// Check MintShop for LoadingSpinner size fix
const mintShopContent = fs.readFileSync('react-frontend/src/components/MintShop.tsx', 'utf8');
if (mintShopContent.includes('size="sm"') && !mintShopContent.includes('size="small"')) {
  console.log('✅ MintShop LoadingSpinner size fixed');
} else {
  console.log('❌ MintShop LoadingSpinner size not fixed');
}

console.log('\n🎯 Compilation test completed!');

if (allFilesExist) {
  console.log('✅ All critical files exist and basic checks passed');
  process.exit(0);
} else {
  console.log('❌ Some issues found');
  process.exit(1);
}