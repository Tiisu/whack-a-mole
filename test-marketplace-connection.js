// Test script to verify NFT Marketplace connect button fix

const fs = require('fs');
const path = require('path');

// Check if the NFTMarketplace component has the correct destructuring
const nftMarketplacePath = path.join(__dirname, 'react-frontend/src/components/NFTMarketplace.tsx');
const mintShopPath = path.join(__dirname, 'react-frontend/src/components/MintShop.tsx');

function checkFile(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for the correct pattern
    const correctPattern = /const \{ web3State, connect \} = useWeb3\(\);[\s\S]*?const \{ account, isConnected \} = web3State;/;
    const incorrectPattern = /const \{ account, isConnected, connect \} = useWeb3\(\);/;
    
    if (content.match(correctPattern)) {
      console.log(`✅ ${componentName}: Correct destructuring pattern found`);
      return true;
    } else if (content.match(incorrectPattern)) {
      console.log(`❌ ${componentName}: Incorrect destructuring pattern found`);
      return false;
    } else {
      console.log(`⚠️  ${componentName}: Pattern not found or different structure`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${componentName}: Error reading file - ${error.message}`);
    return false;
  }
}

console.log('Testing NFT Marketplace connect button fix...\n');

const nftMarketplaceFixed = checkFile(nftMarketplacePath, 'NFTMarketplace');
const mintShopFixed = checkFile(mintShopPath, 'MintShop');

console.log('\n--- Summary ---');
if (nftMarketplaceFixed && mintShopFixed) {
  console.log('✅ All components have been fixed!');
  console.log('The connect button should now work properly.');
} else {
  console.log('❌ Some components still need fixing.');
}

// Additional check for Web3Context structure
const web3ContextPath = path.join(__dirname, 'react-frontend/src/contexts/Web3Context.tsx');
try {
  const contextContent = fs.readFileSync(web3ContextPath, 'utf8');
  
  // Check if the context returns the correct structure
  if (contextContent.includes('web3State: enhancedWeb3State') && 
      contextContent.includes('connect,') && 
      contextContent.includes('disconnect,')) {
    console.log('✅ Web3Context structure is correct');
  } else {
    console.log('❌ Web3Context structure may have issues');
  }
} catch (error) {
  console.log(`❌ Error checking Web3Context: ${error.message}`);
}