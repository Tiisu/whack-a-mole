# Manual Deployment Guide for NFT Marketplace

Due to the current node environment issues, here's a manual deployment guide:

## Prerequisites

1. **Environment Setup**: Ensure you have a working Node.js environment
2. **Private Key**: Make sure your .env file contains a valid PRIVATE_KEY
3. **APE Tokens**: Ensure your wallet has sufficient APE tokens for deployment

## Deployment Steps

### Step 1: Compile Contracts
```bash
cd Contract
npx hardhat compile
```

### Step 2: Deploy Marketplace Contracts
```bash
npx hardhat run scripts/deploy-marketplace.js --network apechain-testnet
```

### Step 3: Update Frontend Configuration
```bash
cd ..
node update-frontend-config.js testnet
```

### Step 4: Verify Deployment
```bash
node test-marketplace-deployment.js
```

## Expected Contract Addresses (After Deployment)

The deployment will create two new contracts:
- **GameAssetNFT**: For in-game asset NFTs
- **NFTMarketplace**: For trading functionality

## Manual Configuration (If Needed)

If automatic deployment fails, you can manually update the configuration files:

### 1. Update `Contract/deployments/apechain-testnet-addresses.json`:
```json
{
  "WhacAMoleGame": "0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039",
  "WhacAMoleNFT": "0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F",
  "GameAssetNFT": "YOUR_GAME_ASSET_NFT_ADDRESS",
  "NFTMarketplace": "YOUR_MARKETPLACE_ADDRESS"
}
```

### 2. Update `react-frontend/public/deployment-info.json`:
```json
{
  "network": "testnet",
  "chainId": 33111,
  "contracts": {
    "WhacAMoleGame": "0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039",
    "WhacAMoleNFT": "0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F",
    "GameAssetNFT": "YOUR_GAME_ASSET_NFT_ADDRESS",
    "NFTMarketplace": "YOUR_MARKETPLACE_ADDRESS"
  },
  "timestamp": "2025-01-XX...",
  "blockExplorer": "https://curtis.explorer.caldera.xyz/",
  "rpcUrl": "https://curtis.rpc.caldera.xyz/http",
  "networkName": "Curtis (Ape Chain Testnet)"
}
```

### 3. Update `react-frontend/src/config/web3Config.ts`:
```typescript
export const CONTRACT_ADDRESSES: Web3Config = {
  TESTNET: {
    GAME_CONTRACT: '0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039',
    NFT_CONTRACT: '0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F',
    MARKETPLACE_CONTRACT: 'YOUR_MARKETPLACE_ADDRESS',
    GAME_ASSET_NFT_CONTRACT: 'YOUR_GAME_ASSET_NFT_ADDRESS'
  },
  // ... rest of config
};
```

## Testing After Deployment

1. **Start the frontend**:
   ```bash
   cd react-frontend
   npm start
   ```

2. **Navigate to marketplace**: Click the "Marketplace" button in the navigation

3. **Test functionality**:
   - Browse the marketplace
   - Try minting assets
   - Test buying/selling (if you have multiple wallets)

## Troubleshooting

### If deployment fails:
1. Check your private key in .env
2. Ensure sufficient APE balance
3. Verify network connectivity
4. Check gas prices and limits

### If frontend doesn't work:
1. Verify contract addresses are correct
2. Check browser console for errors
3. Ensure wallet is connected to ApeChain testnet
4. Clear browser cache and reload

## Next Steps After Successful Deployment

1. **Test all marketplace features**
2. **Verify contracts on block explorer**
3. **Update documentation with actual addresses**
4. **Consider security audit before mainnet**
5. **Plan community launch**

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Test on a clean environment if possible
4. Contact development team for critical issues