#!/usr/bin/env node

/**
 * Test script to verify NFT Marketplace deployment
 * Checks contract deployment, configuration, and basic functionality
 */

const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Contract ABIs (simplified for testing)
const MARKETPLACE_ABI = [
  "function supportedNftContracts(address) external view returns (bool)",
  "function marketplaceFee() external view returns (uint256)",
  "function nextListingId() external view returns (uint256)",
  "function owner() external view returns (address)"
];

const GAME_ASSET_NFT_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function marketplaceContract() external view returns (address)",
  "function mintingFee() external view returns (uint256)",
  "function assetDefinitions(string) external view returns (tuple(string,string,uint8,uint8,uint256,uint256,uint256,string,uint256,uint256,bool))"
];

async function testMarketplaceDeployment() {
  try {
    console.log('🧪 Testing NFT Marketplace Deployment...\n');

    // Read deployment info
    const deploymentInfoPath = path.join(__dirname, 'react-frontend/public/deployment-info.json');
    if (!fs.existsSync(deploymentInfoPath)) {
      throw new Error('Deployment info not found. Please deploy contracts first.');
    }

    const deploymentInfo = JSON.parse(fs.readFileSync(deploymentInfoPath, 'utf8'));
    const contracts = deploymentInfo.contracts;

    console.log('📋 Deployment Info:');
    console.log(`Network: ${deploymentInfo.network}`);
    console.log(`Chain ID: ${deploymentInfo.chainId}`);
    console.log(`Timestamp: ${deploymentInfo.timestamp}\n`);

    // Setup provider
    const rpcUrl = deploymentInfo.network === 'testnet' 
      ? 'https://curtis.rpc.caldera.xyz/http'
      : 'https://apechain.calderachain.xyz/http';
    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    
    console.log('🔗 Testing Network Connection...');
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})\n`);

    // Test contract addresses
    console.log('📍 Contract Addresses:');
    for (const [name, address] of Object.entries(contracts)) {
      console.log(`${name}: ${address}`);
      
      // Check if contract exists
      const code = await provider.getCode(address);
      if (code === '0x') {
        throw new Error(`❌ No contract found at ${name} address: ${address}`);
      }
      console.log(`✅ ${name} contract verified`);
    }
    console.log();

    // Test NFTMarketplace contract
    if (contracts.NFTMarketplace) {
      console.log('🛒 Testing NFTMarketplace Contract...');
      const marketplace = new ethers.Contract(contracts.NFTMarketplace, MARKETPLACE_ABI, provider);
      
      try {
        const owner = await marketplace.owner();
        console.log(`✅ Marketplace Owner: ${owner}`);
        
        const fee = await marketplace.marketplaceFee();
        console.log(`✅ Marketplace Fee: ${fee.toString()} basis points (${fee.toNumber() / 100}%)`);
        
        const nextListingId = await marketplace.nextListingId();
        console.log(`✅ Next Listing ID: ${nextListingId.toString()}`);
        
        // Check if GameAssetNFT is supported
        if (contracts.GameAssetNFT) {
          const isSupported = await marketplace.supportedNftContracts(contracts.GameAssetNFT);
          console.log(`✅ GameAssetNFT Supported: ${isSupported}`);
        }
      } catch (error) {
        console.log(`❌ Marketplace test failed: ${error.message}`);
      }
      console.log();
    }

    // Test GameAssetNFT contract
    if (contracts.GameAssetNFT) {
      console.log('🎮 Testing GameAssetNFT Contract...');
      const gameAssetNFT = new ethers.Contract(contracts.GameAssetNFT, GAME_ASSET_NFT_ABI, provider);
      
      try {
        const name = await gameAssetNFT.name();
        const symbol = await gameAssetNFT.symbol();
        console.log(`✅ NFT Name: ${name}`);
        console.log(`✅ NFT Symbol: ${symbol}`);
        
        const marketplaceAddress = await gameAssetNFT.marketplaceContract();
        console.log(`✅ Configured Marketplace: ${marketplaceAddress}`);
        
        const mintingFee = await gameAssetNFT.mintingFee();
        console.log(`✅ Minting Fee: ${ethers.utils.formatEther(mintingFee)} APE`);
        
        // Test asset definition
        try {
          const goldenHammer = await gameAssetNFT.assetDefinitions('GOLDEN_HAMMER');
          console.log(`✅ Golden Hammer Definition: ${goldenHammer[0]} (${goldenHammer[10] ? 'Active' : 'Inactive'})`);
        } catch (error) {
          console.log(`⚠️  Asset definition test failed: ${error.message}`);
        }
      } catch (error) {
        console.log(`❌ GameAssetNFT test failed: ${error.message}`);
      }
      console.log();
    }

    // Test contract integration
    console.log('🔗 Testing Contract Integration...');
    if (contracts.NFTMarketplace && contracts.GameAssetNFT) {
      const marketplace = new ethers.Contract(contracts.NFTMarketplace, MARKETPLACE_ABI, provider);
      const gameAssetNFT = new ethers.Contract(contracts.GameAssetNFT, GAME_ASSET_NFT_ABI, provider);
      
      try {
        const marketplaceFromNFT = await gameAssetNFT.marketplaceContract();
        const isSupported = await marketplace.supportedNftContracts(contracts.GameAssetNFT);
        
        if (marketplaceFromNFT.toLowerCase() === contracts.NFTMarketplace.toLowerCase() && isSupported) {
          console.log('✅ Contracts properly integrated');
        } else {
          console.log('⚠️  Contract integration issues detected');
          console.log(`   Marketplace in NFT: ${marketplaceFromNFT}`);
          console.log(`   Expected: ${contracts.NFTMarketplace}`);
          console.log(`   NFT Supported: ${isSupported}`);
        }
      } catch (error) {
        console.log(`❌ Integration test failed: ${error.message}`);
      }
    }

    // Test frontend configuration
    console.log('🖥️  Testing Frontend Configuration...');
    const web3ConfigPath = path.join(__dirname, 'react-frontend/src/config/web3Config.ts');
    if (fs.existsSync(web3ConfigPath)) {
      const configContent = fs.readFileSync(web3ConfigPath, 'utf8');
      
      let configValid = true;
      
      if (contracts.NFTMarketplace && !configContent.includes(contracts.NFTMarketplace)) {
        console.log('❌ Marketplace address not found in web3Config.ts');
        configValid = false;
      }
      
      if (contracts.GameAssetNFT && !configContent.includes(contracts.GameAssetNFT)) {
        console.log('❌ GameAssetNFT address not found in web3Config.ts');
        configValid = false;
      }
      
      if (configValid) {
        console.log('✅ Frontend configuration updated correctly');
      }
    } else {
      console.log('❌ web3Config.ts not found');
    }

    console.log('\n🎉 Marketplace Deployment Test Complete!');
    console.log('\nNext Steps:');
    console.log('1. Test minting assets through the frontend');
    console.log('2. Test listing assets on the marketplace');
    console.log('3. Test buying/selling functionality');
    console.log('4. Verify contracts on block explorer');
    
    return true;

  } catch (error) {
    console.error('\n❌ Deployment test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure contracts are deployed: ./deploy-marketplace.sh');
    console.log('2. Check network connectivity');
    console.log('3. Verify contract addresses in deployment files');
    return false;
  }
}

// Run the test
if (require.main === module) {
  testMarketplaceDeployment()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('Test script error:', error);
      process.exit(1);
    });
}

module.exports = { testMarketplaceDeployment };