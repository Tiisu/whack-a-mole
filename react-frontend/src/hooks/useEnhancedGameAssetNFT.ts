import { useState, useCallback, useEffect } from 'react';
import { GameAsset, AssetDefinition, UseGameAssetNFTReturn, AssetCategory, AssetRarity } from '../types';
import { useGameAssetNFT } from './useGameAssetNFT';
import { generatePlayerDummyAssets, generateDummyAssets } from '../services/dummyDataService';

interface UseEnhancedGameAssetNFTReturn extends UseGameAssetNFTReturn {
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  refreshDemoAssets: () => void;
}

export const useEnhancedGameAssetNFT = (account: string | null): UseEnhancedGameAssetNFTReturn => {
  const originalGameAssetNFT = useGameAssetNFT(account);
  const [demoMode, setDemoMode] = useState(false);
  const [demoPlayerAssets, setDemoPlayerAssets] = useState<GameAsset[]>([]);

  // Initialize demo assets
  const refreshDemoAssets = useCallback(() => {
    const playerAssets = generatePlayerDummyAssets(8);
    setDemoPlayerAssets(playerAssets);
  }, []);

  useEffect(() => {
    refreshDemoAssets();
  }, [refreshDemoAssets]);

  // Enhanced getPlayerAssets with demo support
  const getPlayerAssets = useCallback(async (playerAddress: string): Promise<void> => {
    if (demoMode) {
      console.log('Using demo player assets');
      return Promise.resolve();
    } else {
      return originalGameAssetNFT.getPlayerAssets(playerAddress);
    }
  }, [demoMode, originalGameAssetNFT.getPlayerAssets]);

  // Enhanced mintAsset with demo support
  const mintAsset = useCallback(async (assetType: string, recipient?: string): Promise<number | null> => {
    if (demoMode) {
      console.log('Demo: Minting asset', { assetType, recipient });
      
      // Create a new demo asset based on type
      const allAssets = generateDummyAssets(20);
      const templateAsset = allAssets.find(asset => 
        asset.name.toLowerCase().includes(assetType.toLowerCase()) ||
        asset.category.toString().toLowerCase().includes(assetType.toLowerCase())
      ) || allAssets[0];
      
      const newTokenId = Math.max(...demoPlayerAssets.map(a => a.tokenId), 0) + 1;
      const newAsset: GameAsset = {
        ...templateAsset,
        tokenId: newTokenId,
        name: `${templateAsset.name} #${newTokenId}`,
        createdAt: Date.now(),
        creator: account || '0x0000000000000000000000000000000000000000'
      };
      
      setDemoPlayerAssets(prev => [...prev, newAsset]);
      
      // Simulate minting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return newTokenId;
    } else {
      return originalGameAssetNFT.mintAsset(assetType, recipient);
    }
  }, [demoMode, originalGameAssetNFT.mintAsset, demoPlayerAssets, account]);

  // Enhanced getAssetDetails with demo support
  const getAssetDetails = useCallback(async (tokenId: number): Promise<GameAsset | null> => {
    if (demoMode) {
      const asset = demoPlayerAssets.find(a => a.tokenId === tokenId);
      return Promise.resolve(asset || null);
    } else {
      return originalGameAssetNFT.getAssetDetails(tokenId);
    }
  }, [demoMode, originalGameAssetNFT.getAssetDetails, demoPlayerAssets]);

  // Enhanced getAssetDefinition with demo support
  const getAssetDefinition = useCallback(async (assetType: string): Promise<AssetDefinition | null> => {
    if (demoMode) {
      // Return demo asset definitions
      const demoDefinitions: Record<string, AssetDefinition> = {
        'GOLDEN_HAMMER': {
          name: 'Golden Hammer',
          description: 'A legendary hammer forged from pure gold',
          category: AssetCategory.HAMMER,
          rarity: AssetRarity.LEGENDARY,
          power: 95,
          speed: 85,
          luck: 90,
          imageURI: 'https://via.placeholder.com/300x300/FFD700/000000?text=🔨👑',
          mintPrice: 5.0,
          maxSupply: 100,
          isActive: true
        },
        'SPEED_BOOST': {
          name: 'Speed Boost',
          description: 'Increases your speed dramatically',
          category: AssetCategory.POWERUP,
          rarity: AssetRarity.RARE,
          power: 60,
          speed: 100,
          luck: 70,
          imageURI: 'https://via.placeholder.com/300x300/1E90FF/FFFFFF?text=⚡💨',
          mintPrice: 2.0,
          maxSupply: 500,
          isActive: true
        },
        'CYBER_MOLE': {
          name: 'Cyber Mole',
          description: 'A futuristic mole skin with digital effects',
          category: AssetCategory.MOLE_SKIN,
          rarity: AssetRarity.EPIC,
          power: 70,
          speed: 80,
          luck: 75,
          imageURI: 'https://via.placeholder.com/300x300/00FFFF/000000?text=🤖🐹',
          mintPrice: 3.5,
          maxSupply: 200,
          isActive: true
        }
      };
      
      return Promise.resolve(demoDefinitions[assetType] || null);
    } else {
      return originalGameAssetNFT.getAssetDefinition(assetType);
    }
  }, [demoMode, originalGameAssetNFT.getAssetDefinition]);

  // Enhanced getAssetMintCount with demo support
  const getAssetMintCount = useCallback(async (assetType: string): Promise<number> => {
    if (demoMode) {
      // Return demo mint counts
      const demoCounts: Record<string, number> = {
        'GOLDEN_HAMMER': 45,
        'SPEED_BOOST': 234,
        'CYBER_MOLE': 89
      };
      return Promise.resolve(demoCounts[assetType] || Math.floor(Math.random() * 100));
    } else {
      return originalGameAssetNFT.getAssetMintCount(assetType);
    }
  }, [demoMode, originalGameAssetNFT.getAssetMintCount]);

  // Enhanced approval functions with demo support
  const approveMarketplace = useCallback(async (tokenId: number): Promise<void> => {
    if (demoMode) {
      console.log('Demo: Approving marketplace for token', tokenId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } else {
      return originalGameAssetNFT.approveMarketplace(tokenId);
    }
  }, [demoMode, originalGameAssetNFT.approveMarketplace]);

  const setApprovalForAll = useCallback(async (approved: boolean): Promise<void> => {
    if (demoMode) {
      console.log('Demo: Setting approval for all', approved);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } else {
      return originalGameAssetNFT.setApprovalForAll(approved);
    }
  }, [demoMode, originalGameAssetNFT.setApprovalForAll]);

  const isMarketplaceApproved = useCallback(async (tokenId?: number): Promise<boolean> => {
    if (demoMode) {
      return Promise.resolve(true); // Always approved in demo mode
    } else {
      return originalGameAssetNFT.isMarketplaceApproved(tokenId);
    }
  }, [demoMode, originalGameAssetNFT.isMarketplaceApproved]);

  // Enhanced getPlayerAssetsByCategory with demo support
  const getPlayerAssetsByCategory = useCallback(async (
    playerAddress: string, 
    category: AssetCategory
  ): Promise<GameAsset[]> => {
    if (demoMode) {
      const filteredAssets = demoPlayerAssets.filter(asset => asset.category === category);
      return Promise.resolve(filteredAssets);
    } else {
      return originalGameAssetNFT.getPlayerAssetsByCategory(playerAddress, category);
    }
  }, [demoMode, originalGameAssetNFT.getPlayerAssetsByCategory, demoPlayerAssets]);

  // Return appropriate data based on mode
  const playerAssets = demoMode ? demoPlayerAssets : originalGameAssetNFT.playerAssets;
  const isLoading = demoMode ? false : originalGameAssetNFT.isLoading;
  const error = demoMode ? null : originalGameAssetNFT.error;

  return {
    ...originalGameAssetNFT,
    playerAssets,
    isLoading,
    error,
    getPlayerAssets,
    getAssetDetails,
    mintAsset,
    getAssetDefinition,
    getAssetMintCount,
    approveMarketplace,
    setApprovalForAll,
    isMarketplaceApproved,
    getPlayerAssetsByCategory,
    demoMode,
    setDemoMode,
    refreshDemoAssets
  };
};