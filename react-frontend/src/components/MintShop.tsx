import React, { useState, useEffect } from 'react';
import { useEnhancedGameAssetNFT } from '../hooks/useEnhancedGameAssetNFT';
import { ASSET_TYPES } from '../hooks/useGameAssetNFT';
import { useWeb3 } from '../contexts/Web3Context';
import { AssetDefinition, AssetCategory, AssetRarity } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Badge } from './ui/Badge';
import MetaMaskSimulation from './MetaMaskSimulation';
import '../styles/MintShop.css';

interface MintShopProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MintShop: React.FC<MintShopProps> = ({ isOpen, onClose }) => {
  const { web3State, connect } = useWeb3();
  const { account, isConnected } = web3State;
  const { 
    isLoading, 
    error, 
    mintAsset, 
    getAssetDefinition, 
    getAssetMintCount,
    demoMode,
    metaMaskSimulation
  } = useEnhancedGameAssetNFT(account);

  const [assetDefinitions, setAssetDefinitions] = useState<Record<string, AssetDefinition & { mintCount: number }>>({});
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<AssetCategory | 'all'>('all');
  const [filterRarity, setFilterRarity] = useState<AssetRarity | 'all'>('all');
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    if (isOpen && isConnected) {
      loadAssetDefinitions();
    }
  }, [isOpen, isConnected]);

  const loadAssetDefinitions = async () => {
    const definitions: Record<string, AssetDefinition & { mintCount: number }> = {};
    
    for (const [key, assetType] of Object.entries(ASSET_TYPES)) {
      try {
        const definition = await getAssetDefinition(assetType);
        const mintCount = await getAssetMintCount(assetType);
        
        if (definition) {
          definitions[assetType] = {
            ...definition,
            mintCount
          };
        }
      } catch (err) {
        console.warn(`Failed to load definition for ${assetType}:`, err);
      }
    }
    
    setAssetDefinitions(definitions);
  };

  const handleMint = async (assetType: string) => {
    if (!account) return;

    setIsMinting(true);
    try {
      const tokenId = await mintAsset(assetType);
      if (tokenId) {
        console.log('Asset minted successfully:', tokenId);
        // Refresh definitions to update mint count
        await loadAssetDefinitions();
      }
    } catch (err) {
      console.error('Failed to mint asset:', err);
    } finally {
      setIsMinting(false);
    }
  };

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

  const getCategoryName = (category: AssetCategory): string => {
    switch (category) {
      case AssetCategory.WEAPON: return 'Weapon';
      case AssetCategory.HAMMER: return 'Hammer';
      case AssetCategory.POWERUP: return 'Power-up';
      case AssetCategory.SKIN: return 'Skin';
      case AssetCategory.MOLE_SKIN: return 'Mole Skin';
      case AssetCategory.BACKGROUND: return 'Background';
      case AssetCategory.SPECIAL: return 'Special';
      default: return 'Unknown';
    }
  };

  const getRarityName = (rarity: AssetRarity): string => {
    switch (rarity) {
      case AssetRarity.COMMON: return 'Common';
      case AssetRarity.UNCOMMON: return 'Uncommon';
      case AssetRarity.RARE: return 'Rare';
      case AssetRarity.EPIC: return 'Epic';
      case AssetRarity.LEGENDARY: return 'Legendary';
      case AssetRarity.MYTHIC: return 'Mythic';
      default: return 'Unknown';
    }
  };

  const filteredAssets = Object.entries(assetDefinitions).filter(([assetType, definition]) => {
    if (filterCategory !== 'all' && definition.category !== filterCategory) return false;
    if (filterRarity !== 'all' && definition.rarity !== filterRarity) return false;
    return true;
  });

  const isSupplyExhausted = (definition: AssetDefinition & { mintCount: number }): boolean => {
    return definition.maxSupply > 0 && definition.mintCount >= definition.maxSupply;
  };

  if (!isOpen) return null;

  return (
    <div className="mint-shop-overlay">
      <div className="mint-shop-modal">
        <div className="mint-shop-header">
          <h2>🏪 Asset Mint Shop</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {!isConnected ? (
          <div className="mint-shop-not-connected">
            <p>Please connect your wallet to mint assets</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mint-shop-filters">
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

            {/* Asset Grid */}
            <div className="mint-shop-content">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="error-message">Error: {error}</div>
              ) : (
                <div className="mint-assets-grid">
                  {filteredAssets.map(([assetType, definition]) => (
                    <Card key={assetType} className="mint-asset-card">
                      <div className="mint-asset-image">
                        {definition.imageURI ? (
                          <img src={definition.imageURI} alt={definition.name} />
                        ) : (
                          <div className="mint-asset-placeholder">
                            {getCategoryIcon(definition.category)}
                          </div>
                        )}
                      </div>
                      
                      <div className="mint-asset-info">
                        <h3>{definition.name}</h3>
                        
                        <div className="mint-asset-badges">
                          <Badge color={getRarityColor(definition.rarity)}>
                            {getRarityName(definition.rarity)}
                          </Badge>
                          <Badge color="blue">
                            {getCategoryName(definition.category)}
                          </Badge>
                        </div>

                        <div className="mint-asset-stats">
                          <span>⚡ {definition.power}</span>
                          <span>🏃 {definition.speed}</span>
                          <span>🍀 {definition.luck}</span>
                        </div>

                        <div className="mint-asset-supply">
                          {definition.maxSupply > 0 ? (
                            <span className={isSupplyExhausted(definition) ? 'supply-exhausted' : 'supply-available'}>
                              {definition.mintCount} / {definition.maxSupply} minted
                            </span>
                          ) : (
                            <span className="supply-unlimited">
                              {definition.mintCount} minted (unlimited)
                            </span>
                          )}
                        </div>

                        <div className="mint-asset-price">
                          <span className="price">{definition.mintPrice} APE</span>
                        </div>

                        <Button 
                          onClick={() => handleMint(assetType)}
                          disabled={isMinting || isSupplyExhausted(definition)}
                          className="mint-button"
                        >
                          {isMinting ? (
                            <>
                              <LoadingSpinner size="small" />
                              Minting...
                            </>
                          ) : isSupplyExhausted(definition) ? (
                            'Sold Out'
                          ) : (
                            `Mint for ${definition.mintPrice} APE`
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MetaMask Simulation for Demo Mode */}
      {demoMode && (
        <MetaMaskSimulation
          isVisible={metaMaskSimulation.isVisible}
          transactionType={metaMaskSimulation.currentTransaction?.type || 'mint'}
          assetName={metaMaskSimulation.currentTransaction?.assetName || 'NFT Asset'}
          price={metaMaskSimulation.currentTransaction?.price || 0}
          onConfirm={metaMaskSimulation.confirmTransaction}
          onReject={metaMaskSimulation.rejectTransaction}
          autoConfirm={true}
          autoConfirmDelay={3000}
        />
      )}
    </div>
  );
};

export default MintShop;