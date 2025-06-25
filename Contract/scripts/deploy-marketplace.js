const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying NFT Marketplace and Game Asset contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "APE");

  // Deploy GameAssetNFT contract
  console.log("\nDeploying GameAssetNFT...");
  const GameAssetNFT = await ethers.getContractFactory("GameAssetNFT");
  const baseURI = "https://api.whacamole.game/assets/"; // Update with your actual base URI
  const gameAssetNFT = await GameAssetNFT.deploy(deployer.address, baseURI);
  await gameAssetNFT.waitForDeployment();
  const gameAssetNFTAddress = await gameAssetNFT.getAddress();
  console.log("GameAssetNFT deployed to:", gameAssetNFTAddress);

  // Deploy NFTMarketplace contract
  console.log("\nDeploying NFTMarketplace...");
  const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(deployer.address);
  await nftMarketplace.waitForDeployment();
  const nftMarketplaceAddress = await nftMarketplace.getAddress();
  console.log("NFTMarketplace deployed to:", nftMarketplaceAddress);

  // Configure contracts
  console.log("\nConfiguring contracts...");
  
  // Set marketplace contract in GameAssetNFT
  await gameAssetNFT.setMarketplaceContract(nftMarketplaceAddress);
  console.log("Marketplace contract set in GameAssetNFT");

  // Add GameAssetNFT as supported contract in marketplace
  await nftMarketplace.addSupportedNftContract(gameAssetNFTAddress);
  console.log("GameAssetNFT added as supported contract in marketplace");

  // Load existing deployment info
  const deploymentPath = path.join(__dirname, '../../react-frontend/public/deployment-info.json');
  let deploymentInfo = {};
  
  if (fs.existsSync(deploymentPath)) {
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  }

  // Update deployment info with new contracts
  deploymentInfo.contracts = {
    ...deploymentInfo.contracts,
    GameAssetNFT: gameAssetNFTAddress,
    NFTMarketplace: nftMarketplaceAddress
  };
  deploymentInfo.timestamp = new Date().toISOString();

  // Save updated deployment info
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("Updated deployment info saved to:", deploymentPath);

  // Update contract addresses file
  const addressesPath = path.join(__dirname, '../deployments/apechain-testnet-addresses.json');
  let addresses = {};
  
  if (fs.existsSync(addressesPath)) {
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  }

  addresses.GameAssetNFT = gameAssetNFTAddress;
  addresses.NFTMarketplace = nftMarketplaceAddress;

  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
  console.log("Updated addresses saved to:", addressesPath);

  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("GameAssetNFT:", gameAssetNFTAddress);
  console.log("NFTMarketplace:", nftMarketplaceAddress);
  console.log("Network:", await ethers.provider.getNetwork());
  
  // Verify contracts on block explorer (if supported)
  console.log("\nTo verify contracts on block explorer, run:");
  console.log(`npx hardhat verify --network apechain-testnet ${gameAssetNFTAddress} "${deployer.address}" "${baseURI}"`);
  console.log(`npx hardhat verify --network apechain-testnet ${nftMarketplaceAddress} "${deployer.address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });