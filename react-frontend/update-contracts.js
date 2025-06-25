#!/usr/bin/env node

/**
 * Script to update React frontend with deployed contract addresses
 * Run this after deploying contracts to update the Web3 configuration
 */

const fs = require('fs');
const path = require('path');

function updateContractAddresses(network = 'testnet') {
  try {
    // Read deployment data from Contract directory
    const deploymentFile = path.join(__dirname, '..', 'Contract', 'deployments', `apechain-${network}.json`);
    
    if (!fs.existsSync(deploymentFile)) {
      console.error(`❌ Deployment file not found: ${deploymentFile}`);
      console.log('Please deploy contracts first using: cd Contract && npm run deploy:testnet');
      return false;
    }
    
    const deploymentData = JSON.parse(fs.readFileSync(deploymentFile, 'utf8'));
    const contracts = deploymentData.contracts;
    
    console.log(`📋 Updating React frontend config for ${network}...`);
    console.log(`Game Contract: ${contracts.WhacAMoleGame}`);
    console.log(`NFT Contract: ${contracts.WhacAMoleNFT}`);
    
    // Read current web3Config.ts
    const configFile = path.join(__dirname, 'src', 'config', 'web3Config.ts');
    let configContent = fs.readFileSync(configFile, 'utf8');
    
    // Update contract addresses
    const networkKey = network.toUpperCase();
    
    // Create regex patterns to match the contract addresses
    const gameAddressPattern = new RegExp(
      `(${networkKey}:\\s*{[^}]*GAME_CONTRACT:\\s*['"])([^'"]*)(['"])`
    );
    const nftAddressPattern = new RegExp(
      `(${networkKey}:\\s*{[^}]*NFT_CONTRACT:\\s*['"])([^'"]*)(['"])`
    );
    
    // Replace the addresses
    configContent = configContent.replace(gameAddressPattern, `$1${contracts.WhacAMoleGame}$3`);
    configContent = configContent.replace(nftAddressPattern, `$1${contracts.WhacAMoleNFT}$3`);
    
    // Write updated config
    fs.writeFileSync(configFile, configContent);
    
    // Also create a deployment info file for the frontend
    const frontendDeploymentInfo = {
      network: network,
      chainId: network === 'testnet' ? 33111 : 33139,
      contracts: contracts,
      timestamp: deploymentData.timestamp,
      blockExplorer: network === 'testnet' ? 
        'https://curtis.explorer.caldera.xyz/' : 
        'https://apechain.calderaexplorer.xyz/'
    };
    
    const frontendInfoFile = path.join(__dirname, 'public', 'deployment-info.json');
    fs.writeFileSync(frontendInfoFile, JSON.stringify(frontendDeploymentInfo, null, 2));
    
    console.log('✅ React frontend configuration updated successfully!');
    console.log(`📄 Deployment info saved to: ${frontendInfoFile}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to update frontend config:', error);
    return false;
  }
}

// Command line usage
if (require.main === module) {
  const network = process.argv[2] || 'testnet';
  
  if (!['testnet', 'mainnet'].includes(network)) {
    console.error('❌ Invalid network. Use "testnet" or "mainnet"');
    process.exit(1);
  }
  
  const success = updateContractAddresses(network);
  process.exit(success ? 0 : 1);
}

module.exports = { updateContractAddresses };
