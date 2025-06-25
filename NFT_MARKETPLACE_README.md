# NFT Marketplace Feature

## Overview

The NFT Marketplace feature allows players to buy, sell, and trade in-game assets as NFTs. This includes weapons, skins, power-ups, backgrounds, and other game assets that can enhance the gameplay experience.

## Features

### 🛒 **Marketplace**
- **Fixed Price Sales**: List assets for immediate purchase at a set price
- **Auctions**: Create time-limited auctions with bidding functionality
- **Trading**: Direct asset-for-asset trading without currency exchange
- **Browse & Filter**: Search assets by category, rarity, and other attributes

### 🎒 **Asset Management**
- **My Assets**: View and manage owned NFT assets
- **Asset Details**: See stats, rarity, and metadata for each asset
- **Approval System**: Secure marketplace interactions with approval mechanisms

### ⚒️ **Asset Minting**
- **Mint Shop**: Create new assets by paying minting fees
- **Asset Categories**: 
  - 🔨 **Hammers**: Different hammer types with varying power stats
  - ⚡ **Power-ups**: Temporary boosts like speed, luck, and double points
  - 🐹 **Mole Skins**: Cosmetic variations for moles
  - 🖼️ **Backgrounds**: Different game environments
  - ✨ **Special**: Unique and rare assets

### 💎 **Rarity System**
- **Common** (Gray): Basic assets, unlimited supply
- **Uncommon** (Green): Slightly enhanced assets
- **Rare** (Blue): Enhanced assets with limited supply
- **Epic** (Purple): Powerful assets with restricted availability
- **Legendary** (Orange): Very rare and powerful assets
- **Mythic** (Red): Extremely rare, highest-tier assets

## Smart Contracts

### 1. **NFTMarketplace.sol**
Main marketplace contract handling all trading operations:
- Listing management (fixed price, auction, trade)
- Purchase and bidding functionality
- Trade offer system
- Fee collection and distribution
- Security features (reentrancy protection, pausable)

### 2. **GameAssetNFT.sol**
NFT contract for in-game assets:
- ERC-721 compliant with metadata
- Asset categories and rarity system
- Minting functionality with pricing
- Game integration for asset usage
- Supply management

### 3. **WhacAMoleNFT.sol** (Existing)
Achievement NFTs that can also be traded on the marketplace

## Frontend Components

### 1. **NFTMarketplace.tsx**
Main marketplace interface with three tabs:
- **Marketplace**: Browse and purchase assets
- **My Assets**: Manage owned assets
- **Mint Assets**: Create new assets

### 2. **MintShop.tsx**
Dedicated minting interface:
- Asset catalog with definitions
- Pricing and supply information
- Minting functionality
- Progress tracking

### 3. **Marketplace Hooks**
- **useMarketplace.ts**: Marketplace contract interactions
- **useGameAssetNFT.ts**: Asset NFT contract interactions

## Asset Types & Pricing

### Hammers
- **Golden Hammer** (Legendary): 0.05 APE - Power: 150, Speed: 120, Luck: 110
- **Silver Hammer** (Epic): 0.02 APE - Power: 120, Speed: 110, Luck: 100
- **Bronze Hammer** (Rare): 0.01 APE - Power: 110, Speed: 105, Luck: 100
- **Wooden Hammer** (Common): 0.005 APE - Power: 100, Speed: 100, Luck: 100

### Power-ups
- **Time Freeze** (Legendary): 0.08 APE - Freezes time temporarily
- **Double Points** (Epic): 0.03 APE - Doubles point multiplier
- **Luck Charm** (Rare): 0.015 APE - Increases luck stat
- **Speed Boost** (Uncommon): 0.008 APE - Increases speed stat

### Skins
- **Rainbow Mole** (Mythic): 0.1 APE - Ultra-rare cosmetic
- **Cyber Mole** (Legendary): 0.04 APE - Futuristic appearance
- **Pirate Mole** (Epic): 0.02 APE - Themed cosmetic

### Backgrounds
- **Volcano Background** (Epic): 0.025 APE - Dramatic lava environment
- **Space Background** (Rare): 0.012 APE - Cosmic setting
- **Underwater Background** (Uncommon): 0.008 APE - Ocean theme

## Deployment Instructions

### 1. Deploy Contracts
```bash
# Deploy marketplace and asset contracts
./deploy-marketplace.sh
```

### 2. Update Frontend Configuration
```bash
# Update contract addresses in frontend
node update-frontend-config.js testnet
```

### 3. Verify Deployment
```bash
# Test contract interactions
node test-marketplace-deployment.js
```

## Usage Guide

### For Players

#### **Buying Assets**
1. Navigate to Marketplace tab
2. Browse available assets or use filters
3. Click on desired asset
4. Click "Buy Now" or "Place Bid" for auctions
5. Confirm transaction in wallet

#### **Selling Assets**
1. Go to "My Assets" tab
2. Select asset to sell
3. Choose listing type (Fixed Price, Auction, Trade)
4. Set price and duration (for auctions)
5. Approve marketplace access if needed
6. Confirm listing transaction

#### **Minting New Assets**
1. Click "Mint Assets" tab
2. Browse available asset types
3. Check pricing and supply limits
4. Click "Mint" on desired asset
5. Pay minting fee + asset price
6. Receive NFT in wallet

#### **Trading Assets**
1. List asset for trade (specify wanted assets)
2. Other players can make trade offers
3. Review and accept/reject offers
4. Assets are exchanged automatically

### For Developers

#### **Adding New Asset Types**
1. Update `GameAssetNFT.sol` with new asset definitions
2. Add asset type to `ASSET_TYPES` in `useGameAssetNFT.ts`
3. Update UI components to handle new categories
4. Deploy contract updates

#### **Marketplace Customization**
1. Modify fee structure in `NFTMarketplace.sol`
2. Add new listing types or features
3. Update frontend components accordingly
4. Test thoroughly before deployment

## Security Features

### Smart Contract Security
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions for critical operations
- **Pausable**: Emergency stop functionality
- **Input Validation**: Comprehensive parameter checking
- **Safe Math**: Overflow/underflow protection

### Frontend Security
- **Wallet Integration**: Secure MetaMask integration
- **Transaction Validation**: Pre-transaction checks
- **Error Handling**: Comprehensive error management
- **User Confirmation**: Clear transaction previews

## Testing

### Contract Testing
```bash
cd Contract
npx hardhat test test/NFTMarketplace.test.js
npx hardhat test test/GameAssetNFT.test.js
```

### Frontend Testing
```bash
cd react-frontend
npm test -- --testPathPattern=marketplace
```

### Integration Testing
```bash
# Test full marketplace flow
node test-marketplace-integration.js
```

## Troubleshooting

### Common Issues

#### **"Marketplace not approved" Error**
- Solution: Call `setApprovalForAll` or `approve` for specific tokens

#### **"Insufficient payment" Error**
- Solution: Ensure sufficient APE balance for purchase + gas fees

#### **"Asset type not available" Error**
- Solution: Check if asset definition exists and is active

#### **Transaction Fails**
- Check gas limits and network congestion
- Verify contract addresses are correct
- Ensure wallet is connected to correct network

### Debug Tools
- Use browser console for detailed error logs
- Check transaction hashes on block explorer
- Verify contract state using read functions

## Future Enhancements

### Planned Features
1. **Batch Operations**: Buy/sell multiple assets at once
2. **Asset Bundles**: Package deals for related assets
3. **Rental System**: Temporary asset usage
4. **Governance**: Community voting on marketplace features
5. **Analytics**: Detailed market statistics and trends

### Integration Opportunities
1. **Game Mechanics**: Asset effects in gameplay
2. **Achievement System**: Trading-based achievements
3. **Social Features**: Asset showcasing and sharing
4. **Cross-Platform**: Mobile app integration

## Support

For technical support or questions:
- Check the troubleshooting section above
- Review contract documentation
- Test on testnet before mainnet deployment
- Contact development team for critical issues

## License

This marketplace feature is part of the Whac-A-Mole Web3 game and follows the same licensing terms as the main project.