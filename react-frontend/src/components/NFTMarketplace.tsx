import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useEnhancedMarketplace } from '../hooks/useEnhancedMarketplace';
import { useEnhancedGameAssetNFT } from '../hooks/useEnhancedGameAssetNFT';
import { MarketplaceListing, GameAsset, AssetCategory, AssetRarity } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import MintShop from './MintShop';
import DemoModeToggle from './DemoModeToggle';
import EnhancedGameFeatures from './EnhancedGameFeatures';
import MetaMaskSimulation from './MetaMaskSimulation';
import Navbar from './Navbar';
import '../styles/NFTMarketplace.css';

interface NFTMarketplaceProps {
  className?: string;
}

export const NFTMarketplace: React.FC<NFTMarketplaceProps> = ({ className = '' }) => {
  const { web3State, connect } = useWeb3();
  const { account, isConnected } = web3State;
  const { 
    listings, 
    isLoading: marketplaceLoading, 
    error: marketplaceError,
    buyNFT,
    listNFTForSale,
    listNFTForAuction,
    listNFTForTrade,
    cancelListing,
    placeBid,
    getActiveListings,
    demoMode: marketplaceDemoMode,
    setDemoMode: setMarketplaceDemoMode,
    playerDemoAssets,
    refreshDemoData,
    metaMaskSimulation
  } = useEnhancedMarketplace(account);
  
  const {
    playerAssets,
    isLoading: assetsLoading,
    error: assetsError,
    mintAsset,
    getAssetDetails,
    getPlayerAssets,
    demoMode: assetsDemoMode,
    setDemoMode: setAssetsDemoMode,
    refreshDemoAssets
  } = useEnhancedGameAssetNFT(account);

  const [activeTab, setActiveTab] = useState<'marketplace' | 'inventory' | 'mint'>('marketplace');
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<GameAsset | null>(null);
  const [showListModal, setShowListModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [listingType, setListingType] = useState<'sale' | 'auction' | 'trade'>('sale');
  const [listingPrice, setListingPrice] = useState('');
  const [auctionDuration, setAuctionDuration] = useState('24');
  const [bidAmount, setBidAmount] = useState('');
  const [filterCategory, setFilterCategory] = useState<AssetCategory | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<AssetRarity | 'all'>('all');
  const [demoMode, setDemoMode] = useState(false);

  // Sync demo mode across both hooks
  const handleDemoModeToggle = (enabled: boolean) => {
    setDemoMode(enabled);
    setMarketplaceDemoMode(enabled);
    setAssetsDemoMode(enabled);
    if (enabled) {
      refreshDemoData();
      refreshDemoAssets();
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      getActiveListings();
      getPlayerAssets(account);
    }
  }, [isConnected, account, getActiveListings, getPlayerAssets]);

  const handleBuyNFT = async (listing: MarketplaceListing) => {
    if (!listing) return;
    
    try {
      await buyNFT(listing.listingId, listing.price);
      setShowBuyModal(false);
      setSelectedListing(null);
      // Refresh listings
      await getActiveListings();
    } catch (error) {
      console.error('Failed to buy NFT:', error);
    }
  };

  const handleListNFT = async () => {
    if (!selectedAsset) return;

    try {
      const price = parseFloat(listingPrice);
      if (isNaN(price) || price <= 0) {
        throw new Error('Invalid price');
      }

      switch (listingType) {
        case 'sale':
          await listNFTForSale(selectedAsset.tokenId, price);
          break;
        case 'auction':
          const duration = parseInt(auctionDuration) * 3600; // Convert hours to seconds
          await listNFTForAuction(selectedAsset.tokenId, price, 0.01, duration);
          break;
        case 'trade':
          await listNFTForTrade(selectedAsset.tokenId, [], []);
          break;
      }

      setShowListModal(false);
      setSelectedAsset(null);
      setListingPrice('');
      // Refresh listings
      await getActiveListings();
    } catch (error) {
      console.error('Failed to list NFT:', error);
    }
  };

  const handlePlaceBid = async () => {
    if (!selectedListing) return;

    try {
      const bid = parseFloat(bidAmount);
      if (isNaN(bid) || bid <= 0) {
        throw new Error('Invalid bid amount');
      }

      await placeBid(selectedListing.listingId, bid);
      setBidAmount('');
      // Refresh listings
      await getActiveListings();
    } catch (error) {
      console.error('Failed to place bid:', error);
    }
  };

  const filteredListings = listings.filter(listing => {
    if (filterCategory !== 'all' && listing.asset?.category !== filterCategory) return false;
    if (filterRarity !== 'all' && listing.asset?.rarity !== filterRarity) return false;
    return true;
  });

  // Use appropriate assets based on demo mode
  const currentPlayerAssets = demoMode ? playerDemoAssets : playerAssets;
  
  const filteredAssets = currentPlayerAssets.filter(asset => {
    if (filterCategory !== 'all' && asset.category !== filterCategory) return false;
    if (filterRarity !== 'all' && asset.rarity !== filterRarity) return false;
    return true;
  });

  const getRarityColor = (rarity: AssetRarity): string => {
    switch (rarity) {
      case AssetRarity.COMMON: return 'gray';
      case AssetRarity.UNCOMMON: return 'green';
      case AssetRarity.RARE: return 'blue';
      case AssetRarity.EPIC: return 'purple';
      case AssetRarity.LEGENDARY: return 'orange';
      case AssetRarity.MYTHIC: return 'red';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: AssetCategory): string => {
    switch (category) {
      case AssetCategory.WEAPON: return '⚔️';
      case AssetCategory.HAMMER: return '🔨';
      case AssetCategory.POWERUP: return '⚡';
      case AssetCategory.SKIN: return '🎨';
      case AssetCategory.MOLE_SKIN: return '🐹';
      case AssetCategory.BACKGROUND: return '🖼️';
      case AssetCategory.SPECIAL: return '✨';
      default: return '❓';
    }
  };

  // Add effect to auto-connect if needed
  useEffect(() => {
    if (!isConnected && window.ethereum?.selectedAddress) {
      console.log('Auto-connecting wallet...');
      connect();
    }
  }, [isConnected, connect]);

  // Debug log to help troubleshoot connection issues
  console.log('NFTMarketplace - Connection State:', { 
    isConnected, 
    account, 
    ethereumAddress: window.ethereum?.selectedAddress,
    isEthereumConnected: !!window.ethereum?.selectedAddress
  });
  
  // Check both isConnected flag and account existence
  // This ensures we're truly connected before showing the marketplace
  if (!isConnected || !account) {
    return (
      <>
        <Navbar currentPage="marketplace" />
        <div className={`nft-marketplace ${className}`}>
          <div className="marketplace-not-connected">
            <h2>NFT Marketplace</h2>
            <p>Please connect your wallet to access the marketplace</p>
            <Button onClick={() => connect()}>Connect Wallet</Button>
            <Button onClick={() => window.location.reload()} style={{ marginLeft: '10px' }}>Refresh Page</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar currentPage="marketplace" />
      <div className={`nft-marketplace ${className}`}>
        {/* Demo Mode Toggle */}
        <DemoModeToggle 
          onToggle={handleDemoModeToggle}
          isEnabled={demoMode}
        />
      
      <div className="marketplace-header">
        <h1>NFT Marketplace</h1>
        <p>Buy, sell, and trade in-game assets as NFTs</p>
        {demoMode && (
          <div className="demo-banner">
            🎮 <strong>Hackathon Demo Mode Active</strong> - All features available with sample data!
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="marketplace-tabs">
        <button 
          className={`tab ${activeTab === 'marketplace' ? 'active' : ''}`}
          onClick={() => setActiveTab('marketplace')}
        >
          🛒 Marketplace
        </button>
        <button 
          className={`tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          🎒 My Assets
        </button>
        <button 
          className={`tab ${activeTab === 'mint' ? 'active' : ''}`}
          onClick={() => setActiveTab('mint')}
        >
          ⚒️ Mint Assets
        </button>
        <button 
          className="tab features-tab"
          onClick={() => setShowFeaturesModal(true)}
        >
          🎮 Game Features
        </button>
      </div>

      {/* Filters */}
      <div className="marketplace-filters">
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value as AssetCategory | 'all')}
        >
          <option value="all">All Categories</option>
          <option value={AssetCategory.HAMMER}>Hammers</option>
          <option value={AssetCategory.POWERUP}>Power-ups</option>
          <option value={AssetCategory.MOLE_SKIN}>Mole Skins</option>
          <option value={AssetCategory.BACKGROUND}>Backgrounds</option>
          <option value={AssetCategory.SPECIAL}>Special</option>
        </select>

        <select 
          value={filterRarity} 
          onChange={(e) => setFilterRarity(e.target.value as AssetRarity | 'all')}
        >
          <option value="all">All Rarities</option>
          <option value={AssetRarity.COMMON}>Common</option>
          <option value={AssetRarity.UNCOMMON}>Uncommon</option>
          <option value={AssetRarity.RARE}>Rare</option>
          <option value={AssetRarity.EPIC}>Epic</option>
          <option value={AssetRarity.LEGENDARY}>Legendary</option>
          <option value={AssetRarity.MYTHIC}>Mythic</option>
        </select>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'marketplace' && (
        <div className="marketplace-content">
          <h2>Available Assets</h2>
          {marketplaceLoading ? (
            <LoadingSpinner />
          ) : marketplaceError ? (
            <div className="error-message">Error: {marketplaceError}</div>
          ) : (
            <div className="assets-grid">
              {filteredListings.map((listing) => (
                <Card key={listing.listingId} className="asset-card">
                  <div className="asset-image">
                    {listing.asset?.imageURI ? (
                      <img src={listing.asset.imageURI} alt={listing.asset.name} />
                    ) : (
                      <div className="asset-placeholder">
                        {getCategoryIcon(listing.asset?.category || AssetCategory.SPECIAL)}
                      </div>
                    )}
                  </div>
                  <div className="asset-info">
                    <h3>{listing.asset?.name || `Asset #${listing.tokenId}`}</h3>
                    <div className="asset-badges">
                      <Badge color={getRarityColor(listing.asset?.rarity || AssetRarity.COMMON)}>
                        {listing.asset?.rarity || 'Unknown'}
                      </Badge>
                      <Badge color="blue">
                        {listing.asset?.category || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="asset-stats">
                      {listing.asset && (
                        <>
                          <span>⚡ {listing.asset.power}</span>
                          <span>🏃 {listing.asset.speed}</span>
                          <span>🍀 {listing.asset.luck}</span>
                        </>
                      )}
                    </div>
                    <div className="asset-price">
                      {listing.listingType === 'FIXED_PRICE' ? (
                        <span className="price">{listing.price} APE</span>
                      ) : listing.listingType === 'AUCTION' ? (
                        <span className="auction">Auction: {listing.currentBid || listing.price} APE</span>
                      ) : (
                        <span className="trade">Trade Only</span>
                      )}
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowBuyModal(true);
                      }}
                      disabled={listing.seller === account}
                    >
                      {listing.listingType === 'AUCTION' ? 'Place Bid' : 'Buy Now'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="inventory-content">
          <h2>My Assets</h2>
          {assetsLoading ? (
            <LoadingSpinner />
          ) : assetsError ? (
            <div className="error-message">Error: {assetsError}</div>
          ) : (
            <div className="assets-grid">
              {filteredAssets.map((asset) => (
                <Card key={asset.tokenId} className="asset-card">
                  <div className="asset-image">
                    {asset.imageURI ? (
                      <img src={asset.imageURI} alt={asset.name} />
                    ) : (
                      <div className="asset-placeholder">
                        {getCategoryIcon(asset.category)}
                      </div>
                    )}
                  </div>
                  <div className="asset-info">
                    <h3>{asset.name}</h3>
                    <div className="asset-badges">
                      <Badge color={getRarityColor(asset.rarity)}>
                        {asset.rarity}
                      </Badge>
                      <Badge color="blue">
                        {asset.category}
                      </Badge>
                    </div>
                    <div className="asset-stats">
                      <span>⚡ {asset.power}</span>
                      <span>🏃 {asset.speed}</span>
                      <span>🍀 {asset.luck}</span>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedAsset(asset);
                        setShowListModal(true);
                      }}
                    >
                      List for Sale
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mint' && (
        <div className="mint-content">
          <h2>Mint New Assets</h2>
          <p>Create new in-game assets by minting them as NFTs</p>
          <Button onClick={() => setShowMintModal(true)}>
            Open Mint Shop
          </Button>
        </div>
      )}

      {/* Buy/Bid Modal */}
      <Modal 
        isOpen={showBuyModal} 
        onClose={() => setShowBuyModal(false)}
        title={selectedListing?.listingType === 'AUCTION' ? 'Place Bid' : 'Buy Asset'}
      >
        {selectedListing && (
          <div className="buy-modal-content">
            <div className="asset-preview">
              <h3>{selectedListing.asset?.name || `Asset #${selectedListing.tokenId}`}</h3>
              <p>Price: {selectedListing.price} APE</p>
            </div>
            
            {selectedListing.listingType === 'AUCTION' ? (
              <div className="bid-section">
                <label>Bid Amount (APE):</label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  min={selectedListing.currentBid || selectedListing.price}
                  step="0.01"
                />
                <Button onClick={handlePlaceBid}>Place Bid</Button>
              </div>
            ) : (
              <Button onClick={() => handleBuyNFT(selectedListing)}>
                Buy for {selectedListing.price} APE
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* List Modal */}
      <Modal 
        isOpen={showListModal} 
        onClose={() => setShowListModal(false)}
        title="List Asset for Sale"
      >
        {selectedAsset && (
          <div className="list-modal-content">
            <div className="asset-preview">
              <h3>{selectedAsset.name}</h3>
            </div>
            
            <div className="listing-options">
              <label>Listing Type:</label>
              <select value={listingType} onChange={(e) => setListingType(e.target.value as 'sale' | 'auction' | 'trade')}>
                <option value="sale">Fixed Price Sale</option>
                <option value="auction">Auction</option>
                <option value="trade">Trade Only</option>
              </select>
            </div>

            {listingType !== 'trade' && (
              <div className="price-section">
                <label>Price (APE):</label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>
            )}

            {listingType === 'auction' && (
              <div className="duration-section">
                <label>Auction Duration (hours):</label>
                <select value={auctionDuration} onChange={(e) => setAuctionDuration(e.target.value)}>
                  <option value="1">1 hour</option>
                  <option value="6">6 hours</option>
                  <option value="24">24 hours</option>
                  <option value="72">3 days</option>
                  <option value="168">7 days</option>
                </select>
              </div>
            )}

            <Button onClick={handleListNFT}>
              List Asset
            </Button>
          </div>
        )}
      </Modal>

      {/* Mint Shop Modal */}
      <MintShop 
        isOpen={showMintModal} 
        onClose={() => setShowMintModal(false)} 
      />

      {/* Enhanced Game Features Modal */}
      <EnhancedGameFeatures
        isVisible={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
        demoMode={demoMode}
      />

      {/* MetaMask Simulation for Demo Mode */}
      {demoMode && (
        <MetaMaskSimulation
          isVisible={metaMaskSimulation.isVisible}
          transactionType={metaMaskSimulation.currentTransaction?.type || 'buy'}
          assetName={metaMaskSimulation.currentTransaction?.assetName || 'NFT Asset'}
          price={metaMaskSimulation.currentTransaction?.price || 0}
          onConfirm={metaMaskSimulation.confirmTransaction}
          onReject={metaMaskSimulation.rejectTransaction}
          autoConfirm={true}
          autoConfirmDelay={4000}
        />
      )}
    </div>
    </>
  );
};

export default NFTMarketplace;