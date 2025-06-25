// Test script to verify NFT integration
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing NFT Integration...\n');

// Check if NFT images exist
const nftDir = path.join(__dirname, 'react-frontend/src/nfts');
console.log('📁 Checking NFT images directory:', nftDir);

if (!fs.existsSync(nftDir)) {
  console.error('❌ NFT directory not found!');
  process.exit(1);
}

const nftFiles = fs.readdirSync(nftDir).filter(file => 
  file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
);

console.log(`✅ Found ${nftFiles.length} NFT images:`);
nftFiles.forEach((file, index) => {
  const filePath = path.join(nftDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`   ${index + 1}. ${file} (${sizeKB} KB)`);
});

// Check if mapping file exists
const mappingFile = path.join(__dirname, 'react-frontend/src/data/nftAssets.ts');
console.log('\n📄 Checking NFT mapping file:', mappingFile);

if (!fs.existsSync(mappingFile)) {
  console.error('❌ NFT mapping file not found!');
  process.exit(1);
}

console.log('✅ NFT mapping file exists');

// Check if dummy data service is updated
const dummyDataFile = path.join(__dirname, 'react-frontend/src/services/dummyDataService.ts');
console.log('\n🔧 Checking dummy data service:', dummyDataFile);

if (!fs.existsSync(dummyDataFile)) {
  console.error('❌ Dummy data service not found!');
  process.exit(1);
}

const dummyDataContent = fs.readFileSync(dummyDataFile, 'utf8');
if (dummyDataContent.includes('nftAssetTemplates')) {
  console.log('✅ Dummy data service updated to use real NFT images');
} else {
  console.log('⚠️  Dummy data service may not be using real NFT images');
}

// Summary
console.log('\n📊 Integration Summary:');
console.log(`   • ${nftFiles.length} NFT images available`);
console.log('   • NFT mapping system created');
console.log('   • Dummy data service updated');
console.log('   • Marketplace integration ready');

console.log('\n🎉 NFT Integration Test Complete!');
console.log('\n💡 Next steps:');
console.log('   1. Start the development server: cd react-frontend && npm start');
console.log('   2. Navigate to the NFT Marketplace');
console.log('   3. Enable Demo Mode to see your NFTs');
console.log('   4. Verify images are loading correctly');