// Update frontend configuration after marketplace deployment
const fs = require('fs');
const path = require('path');

function updateMarketplaceConfig(gameAssetNFTAddress, nftMarketplaceAddress) {
  console.log('🔧 Updating frontend configuration with marketplace contracts...');
  
  // 1. Update deployment info
  const deploymentInfoPath = path.join(__dirname, 'react-frontend', 'public', 'deployment-info.json');
  let deploymentInfo = {};
  
  if (fs.existsSync(deploymentInfoPath)) {
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
  }
  
  deploymentInfo.contracts = {
    ...deploymentInfo.contracts,
    GameAssetNFT: gameAssetNFTAddress,
    NFTMarketplace: nftMarketplaceAddress
  };
  deploymentInfo.timestamp = new Date().toISOString();
  
  fs.writeFileSync(deploymentInfoPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ Updated deployment-info.json');
  
  // 2. Update contract addresses file
  const addressesPath = path.join(__dirname, 'Contract', 'deployments', 'apechain-testnet-addresses.json');
  let addresses = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }
  
  addresses.GameAssetNFT = gameAssetNFTAddress;
  addresses.NFTMarketplace = nftMarketplaceAddress;
  
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log('✅ Updated apechain-testnet-addresses.json');
  
  // 3. Update web3Config.ts
  const web3ConfigPath = path.join(__dirname, 'react-frontend', 'src', 'config', 'web3Config.ts');
  let web3Config = fs.readFileSync(web3ConfigPath, 'utf8');
  
  // Update testnet addresses
  web3Config = web3Config.replace(
    /MARKETPLACE_CONTRACT: '',\s*\/\/ Will be filled after marketplace deployment/,
    `MARKETPLACE_CONTRACT: '${nftMarketplaceAddress}',     // NFTMarketplace on ApeChain Testnet`
  );
  
  web3Config = web3Config.replace(
    /GAME_ASSET_NFT_CONTRACT: ''\s*\/\/ Will be filled after GameAssetNFT deployment/,
    `GAME_ASSET_NFT_CONTRACT: '${gameAssetNFTAddress}'   // GameAssetNFT on ApeChain Testnet`
  );
  
  fs.writeFileSync(web3ConfigPath, web3Config);
  console.log('✅ Updated web3Config.ts');
  
  console.log('\n🎉 Frontend configuration updated successfully!');
  console.log('\n📋 Updated Contract Addresses:');
  console.log(`   GameAssetNFT:    ${gameAssetNFTAddress}`);
  console.log(`   NFTMarketplace:  ${nftMarketplaceAddress}`);
  
  console.log('\n🔗 Block Explorer Links:');
  console.log(`   GameAssetNFT:    https://curtis.explorer.caldera.xyz/address/${gameAssetNFTAddress}`);
  console.log(`   NFTMarketplace:  https://curtis.explorer.caldera.xyz/address/${nftMarketplaceAddress}`);
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Start the frontend: cd react-frontend && npm start');
  console.log('   2. Navigate to the Marketplace section');
  console.log('   3. Test minting and trading functionality');
  console.log('   4. Verify contracts on block explorer');
}

// Example usage (replace with actual addresses after deployment)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log('Usage: node update-marketplace-config.js <GameAssetNFT_Address> <NFTMarketplace_Address>');
    console.log('Example: node update-marketplace-config.js 0x123... 0x456...');
    process.exit(1);
  }
  
  const [gameAssetNFTAddress, nftMarketplaceAddress] = args;
  updateMarketplaceConfig(gameAssetNFTAddress, nftMarketplaceAddress);
}

module.exports = updateMarketplaceConfig;