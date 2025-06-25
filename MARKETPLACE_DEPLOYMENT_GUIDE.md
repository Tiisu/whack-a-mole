# NFT Marketplace Deployment Guide

## Current Status
❌ **Node.js Environment Issue**: The current environment has compatibility issues preventing direct deployment.

## What Needs to Be Deployed
1. **GameAssetNFT Contract** - For tradeable in-game assets
2. **NFTMarketplace Contract** - For buying/selling NFTs

## Manual Deployment Steps

### Prerequisites
- Working Node.js environment (v16.x or v18.x recommended)
- Private key configured in `Contract/.env`
- Sufficient APE tokens for deployment gas fees

### Step 1: Fix Environment (if needed)
```bash
# Option 1: Use nvm to switch Node.js version
nvm install 16
nvm use 16

# Option 2: Use Docker
docker run -it --rm -v $(pwd):/workspace -w /workspace node:16 bash

# Option 3: Use different machine with working Node.js
```

### Step 2: Compile Contracts
```bash
cd Contract
npm install
npx hardhat compile
```

### Step 3: Deploy Marketplace Contracts
```bash
npx hardhat run scripts/deploy-marketplace.js --network apechain-testnet
```

### Step 4: Update Frontend Configuration
```bash
cd ..
node update-frontend-config.js testnet
```

## Expected Deployment Output

When deployment succeeds, you should see:
```
Deploying NFT Marketplace and Game Asset contracts...
Deploying contracts with account: 0x...
Account balance: ...

Deploying GameAssetNFT...
GameAssetNFT deployed to: 0x[NEW_ADDRESS]

Deploying NFTMarketplace...
NFTMarketplace deployed to: 0x[NEW_ADDRESS]

Configuring contracts...
Marketplace contract set in GameAssetNFT
GameAssetNFT added as supported contract in marketplace

Deployment Summary:
==================
GameAssetNFT: 0x[NEW_ADDRESS]
NFTMarketplace: 0x[NEW_ADDRESS]
```

## Files That Will Be Updated

### 1. Contract Addresses File
`Contract/deployments/apechain-testnet-addresses.json`:
```json
{
  "WhacAMoleGame": "0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039",
  "WhacAMoleNFT": "0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F",
  "GameAssetNFT": "0x[NEW_ADDRESS]",
  "NFTMarketplace": "0x[NEW_ADDRESS]"
}
```

### 2. Frontend Deployment Info
`react-frontend/public/deployment-info.json`:
```json
{
  "network": "testnet",
  "chainId": 33111,
  "contracts": {
    "WhacAMoleGame": "0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039",
    "WhacAMoleNFT": "0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F",
    "GameAssetNFT": "0x[NEW_ADDRESS]",
    "NFTMarketplace": "0x[NEW_ADDRESS]"
  },
  "timestamp": "2025-01-XX...",
  "blockExplorer": "https://curtis.explorer.caldera.xyz/",
  "rpcUrl": "https://curtis.rpc.caldera.xyz/http",
  "networkName": "Curtis (Ape Chain Testnet)"
}
```

### 3. Web3 Configuration
`react-frontend/src/config/web3Config.ts` will be updated with the new addresses.

## Testing After Deployment

### 1. Verify Contracts on Block Explorer
- GameAssetNFT: https://curtis.explorer.caldera.xyz/address/[NEW_ADDRESS]
- NFTMarketplace: https://curtis.explorer.caldera.xyz/address/[NEW_ADDRESS]

### 2. Test Frontend Integration
```bash
cd react-frontend
npm start
```
- Navigate to "Marketplace" in the app
- Try browsing assets
- Test minting functionality
- Verify wallet integration

### 3. Run Deployment Tests
```bash
node test-marketplace-deployment.js
```

## Troubleshooting

### If deployment fails:
1. **Check private key**: Ensure it's correctly set in `.env`
2. **Check balance**: Ensure sufficient APE for gas fees
3. **Check network**: Verify connection to ApeChain testnet
4. **Check gas settings**: May need to adjust gas price in hardhat.config.ts

### If frontend doesn't work:
1. **Clear browser cache**: Hard refresh the page
2. **Check console**: Look for JavaScript errors
3. **Verify network**: Ensure MetaMask is on ApeChain testnet
4. **Check addresses**: Verify contract addresses are correct

## What the Marketplace Will Provide

Once deployed, players will be able to:

### Asset Types Available for Minting:
- 🔨 **Hammers**: Golden, Silver, Bronze, Wooden
- ⚡ **Power-ups**: Time Freeze, Double Points, Speed Boost, Luck Charm
- 🐹 **Mole Skins**: Rainbow, Cyber, Pirate
- 🖼️ **Backgrounds**: Space, Underwater, Volcano

### Marketplace Features:
- **Browse Assets**: View all available NFTs
- **Buy Assets**: Purchase NFTs with APE tokens
- **Sell Assets**: List your NFTs for sale
- **Create Auctions**: Set up timed auctions
- **Direct Trading**: Trade NFTs directly with other players

## Next Steps After Deployment

1. **Test all marketplace features**
2. **Verify contracts on block explorer**
3. **Update this guide with actual addresses**
4. **Create user documentation**
5. **Plan community launch**

## Alternative Deployment Methods

If you continue to have Node.js issues:

1. **Use Remix IDE**: Deploy contracts through browser
2. **Use Hardhat Dashboard**: Web-based deployment interface
3. **Use different environment**: Deploy from another machine
4. **Use Docker**: Containerized Node.js environment

## Support

The marketplace contracts are fully implemented and ready to deploy. The only blocker is the Node.js environment compatibility issue. Once that's resolved, deployment should be straightforward and take only a few minutes.