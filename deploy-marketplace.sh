#!/bin/bash

# Deploy NFT Marketplace and Game Asset contracts
echo "🚀 Deploying NFT Marketplace and Game Asset contracts..."

# Change to contract directory
cd Contract

# Deploy the contracts
echo "📦 Running deployment script..."
npx hardhat run scripts/deploy-marketplace.js --network apechain-testnet

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    
    # Update frontend configuration
    echo "🔧 Updating frontend configuration..."
    cd ../
    node update-frontend-config.js
    
    echo "🎉 NFT Marketplace deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Test the marketplace functionality"
    echo "2. Verify contracts on block explorer"
    echo "3. Update documentation"
else
    echo "❌ Deployment failed!"
    exit 1
fi