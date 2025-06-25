# 🚀 NFT Marketplace Deployment Instructions

## Current Status
- ✅ Smart contracts created and ready for deployment
- ✅ Frontend components implemented
- ✅ Deployment scripts prepared
- ⚠️ Node.js environment compatibility issue detected

## Quick Deployment (When Node.js is Working)

### 1. Deploy Contracts
```bash
./deploy-marketplace.sh
```

### 2. Test Deployment
```bash
node test-marketplace-deployment.js
```

### 3. Start Frontend
```bash
cd react-frontend && npm start
```

## Manual Deployment Steps

If the automated script doesn't work, follow these steps:

### Step 1: Compile Contracts
```bash
cd Contract
npx hardhat compile
```

### Step 2: Deploy GameAssetNFT
```bash
npx hardhat run scripts/deploy-marketplace.js --network apechain-testnet
```

### Step 3: Update Configuration
```bash
cd ..
node update-frontend-config.js testnet
```

## What Will Be Deployed

### 1. GameAssetNFT Contract
- **Purpose**: In-game asset NFTs (weapons, skins, power-ups)
- **Features**: Minting, rarity system, marketplace integration
- **Assets**: 15+ pre-defined assets ready to mint

### 2. NFTMarketplace Contract  
- **Purpose**: Trading platform for all NFTs
- **Features**: Fixed price sales, auctions, direct trading
- **Fee**: 2.5% marketplace fee on sales

## Expected Results

After successful deployment, you'll have:

1. **New Contract Addresses** added to:
   - `Contract/deployments/apechain-testnet-addresses.json`
   - `react-frontend/public/deployment-info.json`
   - `react-frontend/src/config/web3Config.ts`

2. **Marketplace Functionality**:
   - Browse and buy assets
   - List assets for sale
   - Create auctions
   - Direct trading
   - Asset minting

3. **Asset Types Available**:
   - 🔨 **Hammers**: Golden, Silver, Bronze, Wooden
   - ⚡ **Power-ups**: Time Freeze, Double Points, Speed Boost, Luck Charm
   - 🐹 **Mole Skins**: Rainbow, Cyber, Pirate
   - 🖼️ **Backgrounds**: Space, Underwater, Volcano

## Testing the Deployment

### 1. Frontend Testing
```bash
cd react-frontend
npm start
```
- Navigate to "Marketplace" in the navigation
- Try browsing assets
- Test minting functionality
- Verify wallet integration

### 2. Contract Verification
```bash
node test-marketplace-deployment.js
```
This will verify:
- Contract deployment
- Configuration setup
- Integration between contracts
- Frontend configuration

## Troubleshooting

### Node.js Issues
If you encounter node library issues:
1. Try using a different Node.js version (16.x or 18.x recommended)
2. Use nvm to switch versions: `nvm use 16`
3. Clear npm cache: `npm cache clean --force`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

### Deployment Issues
If deployment fails:
1. Check private key in `.env` file
2. Ensure sufficient APE balance for gas
3. Verify network connectivity to ApeChain testnet
4. Check gas price settings in hardhat.config.ts

### Frontend Issues
If marketplace doesn't appear:
1. Verify contract addresses in web3Config.ts
2. Check browser console for errors
3. Ensure wallet is connected to ApeChain testnet
4. Clear browser cache and reload

## Post-Deployment Checklist

- [ ] Contracts deployed successfully
- [ ] Configuration files updated
- [ ] Frontend marketplace accessible
- [ ] Asset minting works
- [ ] Buying/selling functionality tested
- [ ] Contract addresses verified on block explorer

## Next Steps After Deployment

1. **Test All Features**:
   - Mint different asset types
   - List assets for sale
   - Create auctions
   - Test trading functionality

2. **Verify on Block Explorer**:
   - Check contracts on https://curtis.explorer.caldera.xyz/
   - Verify contract source code
   - Monitor transactions

3. **Security Review**:
   - Test with multiple wallets
   - Verify access controls
   - Check for edge cases

4. **Community Launch**:
   - Announce marketplace to players
   - Create tutorial content
   - Monitor initial usage

## Support

If you need help with deployment:
1. Ensure Node.js environment is working
2. Check all prerequisites are met
3. Follow troubleshooting steps
4. Test in a clean environment if needed

The marketplace is fully implemented and ready to deploy once the Node.js environment is resolved! 🎉