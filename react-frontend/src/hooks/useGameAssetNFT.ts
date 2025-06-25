import { useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { GameAsset, AssetCategory, AssetRarity, UseGameAssetNFTReturn } from '../types';
import { 
  getCurrentContractAddresses, 
  ERROR_MESSAGES,
  isMetaMaskInstalled 
} from '../config/web3Config';

// GameAssetNFT contract ABI
const GAME_ASSET_NFT_ABI = [
  // Minting functions
  "function mintAsset(string memory assetType, address to) external payable returns (uint256)",
  "function mintAssetForFree(string memory assetType, address to) external returns (uint256)",
  
  // Asset queries
  "function getAssetDetails(uint256 tokenId) external view returns (tuple(string name, string description, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string imageURI, bool isActive, uint256 createdAt, address creator))",
  "function getPlayerAssets(address player) external view returns (uint256[])",
  "function getPlayerAssetsByCategory(address player, uint8 category) external view returns (uint256[])",
  
  // Asset definitions
  "function assetDefinitions(string memory assetType) external view returns (tuple(string name, string description, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string imageURI, uint256 mintPrice, uint256 maxSupply, bool isActive))",
  "function assetMintCount(string memory assetType) external view returns (uint256)",
  
  // ERC-721 standard
  "function balanceOf(address owner) external view returns (uint256)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function approve(address to, uint256 tokenId) external",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function getApproved(uint256 tokenId) external view returns (address)",
  
  // Marketplace integration
  "function toggleMarketplaceListing(uint256 tokenId, bool isListed) external",
  "function isMarketplaceListed(uint256 tokenId) external view returns (bool)",
  
  // Configuration
  "function mintingFee() external view returns (uint256)",
  "function gameContract() external view returns (address)",
  "function marketplaceContract() external view returns (address)",
  
  // Events
  "event AssetMinted(address indexed to, uint256 indexed tokenId, string assetType, uint8 rarity)",
  "event MarketplaceListingToggled(uint256 indexed tokenId, bool isListed)",
  "event AssetUsedInGame(address indexed player, uint256 indexed tokenId, uint256 gameId)"
];

// Available asset types for minting
export const ASSET_TYPES = {
  // Hammers
  GOLDEN_HAMMER: 'GOLDEN_HAMMER',
  SILVER_HAMMER: 'SILVER_HAMMER',
  BRONZE_HAMMER: 'BRONZE_HAMMER',
  WOODEN_HAMMER: 'WOODEN_HAMMER',
  
  // Power-ups
  SPEED_BOOST: 'SPEED_BOOST',
  LUCK_CHARM: 'LUCK_CHARM',
  DOUBLE_POINTS: 'DOUBLE_POINTS',
  TIME_FREEZE: 'TIME_FREEZE',
  
  // Skins
  RAINBOW_MOLE: 'RAINBOW_MOLE',
  CYBER_MOLE: 'CYBER_MOLE',
  PIRATE_MOLE: 'PIRATE_MOLE',
  
  // Backgrounds
  SPACE_BG: 'SPACE_BG',
  UNDERWATER_BG: 'UNDERWATER_BG',
  VOLCANO_BG: 'VOLCANO_BG'
};

export const useGameAssetNFT = (account: string | null): UseGameAssetNFTReturn => {
  const [playerAssets, setPlayerAssets] = useState<GameAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get GameAssetNFT contract instance
  const gameAssetContract = useMemo(() => {
    if (!account || !isMetaMaskInstalled()) {
      console.log('GameAssetNFT contract not available: account or MetaMask not available');
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addresses = getCurrentContractAddresses();

      if (!addresses.GAME_ASSET_NFT_CONTRACT || addresses.GAME_ASSET_NFT_CONTRACT === '') {
        console.warn('GameAssetNFT contract address not configured');
        return null;
      }

      console.log('Creating GameAssetNFT contract instance:', {
        address: addresses.GAME_ASSET_NFT_CONTRACT,
        account: account
      });

      const contract = new ethers.Contract(
        addresses.GAME_ASSET_NFT_CONTRACT,
        GAME_ASSET_NFT_ABI,
        signer
      );

      console.log('GameAssetNFT contract instance created successfully');
      return contract;
    } catch (err) {
      console.error('Failed to create GameAssetNFT contract instance:', err);
      setError(`Failed to initialize GameAssetNFT contract: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  }, [account]);

  // Get player's assets
  const getPlayerAssets = useCallback(async (playerAddress: string): Promise<void> => {
    if (!gameAssetContract) {
      console.log('GameAssetNFT contract not available for getting assets');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching player assets for:', playerAddress);
      const tokenIds = await gameAssetContract.getPlayerAssets(playerAddress);
      
      // Fetch details for each asset
      const assets: GameAsset[] = [];
      for (const tokenId of tokenIds) {
        try {
          const assetDetails = await gameAssetContract.getAssetDetails(tokenId.toNumber());
          const asset: GameAsset = {
            tokenId: tokenId.toNumber(),
            name: assetDetails.name,
            description: assetDetails.description,
            category: assetDetails.category as AssetCategory,
            rarity: assetDetails.rarity as AssetRarity,
            power: assetDetails.power.toNumber(),
            speed: assetDetails.speed.toNumber(),
            luck: assetDetails.luck.toNumber(),
            imageURI: assetDetails.imageURI,
            isActive: assetDetails.isActive,
            createdAt: assetDetails.createdAt.toNumber(),
            creator: assetDetails.creator
          };
          assets.push(asset);
        } catch (err) {
          console.warn(`Failed to fetch details for token ${tokenId}:`, err);
        }
      }

      setPlayerAssets(assets);
      console.log('Player assets fetched successfully:', assets.length);
    } catch (err) {
      console.error('Failed to fetch player assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setIsLoading(false);
    }
  }, [gameAssetContract]);

  // Get asset details by token ID
  const getAssetDetails = useCallback(async (tokenId: number): Promise<GameAsset | null> => {
    if (!gameAssetContract) {
      console.log('GameAssetNFT contract not available for getting asset details');
      return null;
    }

    try {
      console.log('Fetching asset details for token:', tokenId);
      const assetDetails = await gameAssetContract.getAssetDetails(tokenId);
      
      const asset: GameAsset = {
        tokenId,
        name: assetDetails.name,
        description: assetDetails.description,
        category: assetDetails.category as AssetCategory,
        rarity: assetDetails.rarity as AssetRarity,
        power: assetDetails.power.toNumber(),
        speed: assetDetails.speed.toNumber(),
        luck: assetDetails.luck.toNumber(),
        imageURI: assetDetails.imageURI,
        isActive: assetDetails.isActive,
        createdAt: assetDetails.createdAt.toNumber(),
        creator: assetDetails.creator
      };

      console.log('Asset details fetched successfully:', asset);
      return asset;
    } catch (err) {
      console.error('Failed to fetch asset details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch asset details');
      return null;
    }
  }, [gameAssetContract]);

  // Mint new asset
  const mintAsset = useCallback(async (assetType: string, recipient?: string): Promise<number | null> => {
    if (!gameAssetContract || !account) {
      throw new Error('GameAssetNFT contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const to = recipient || account;
      
      // Get asset definition to check price
      const assetDef = await gameAssetContract.assetDefinitions(assetType);
      if (!assetDef.isActive) {
        throw new Error('Asset type not available for minting');
      }

      const mintingFee = await gameAssetContract.mintingFee();
      const totalCost = assetDef.mintPrice.add(mintingFee);
      
      console.log('Minting asset:', { 
        assetType, 
        to, 
        mintPrice: ethers.utils.formatEther(assetDef.mintPrice),
        mintingFee: ethers.utils.formatEther(mintingFee),
        totalCost: ethers.utils.formatEther(totalCost)
      });
      
      const tx = await gameAssetContract.mintAsset(assetType, to, {
        value: totalCost
      });
      
      console.log('Mint asset transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const mintEvent = receipt.events?.find((event: any) => event.event === 'AssetMinted');
      const tokenId = mintEvent?.args?.tokenId?.toNumber();
      
      console.log('Asset minted successfully, token ID:', tokenId);
      
      // Refresh player assets
      if (to === account) {
        await getPlayerAssets(account);
      }
      
      return tokenId || null;
    } catch (err) {
      console.error('Failed to mint asset:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint asset';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gameAssetContract, account, getPlayerAssets]);

  // Get asset definition
  const getAssetDefinition = useCallback(async (assetType: string) => {
    if (!gameAssetContract) {
      console.log('GameAssetNFT contract not available for getting asset definition');
      return null;
    }

    try {
      console.log('Fetching asset definition for:', assetType);
      const definition = await gameAssetContract.assetDefinitions(assetType);
      
      if (!definition.isActive) {
        return null;
      }

      return {
        name: definition.name,
        description: definition.description,
        category: definition.category as AssetCategory,
        rarity: definition.rarity as AssetRarity,
        power: definition.power.toNumber(),
        speed: definition.speed.toNumber(),
        luck: definition.luck.toNumber(),
        imageURI: definition.imageURI,
        mintPrice: parseFloat(ethers.utils.formatEther(definition.mintPrice)),
        maxSupply: definition.maxSupply.toNumber(),
        isActive: definition.isActive
      };
    } catch (err) {
      console.error('Failed to fetch asset definition:', err);
      return null;
    }
  }, [gameAssetContract]);

  // Get mint count for asset type
  const getAssetMintCount = useCallback(async (assetType: string): Promise<number> => {
    if (!gameAssetContract) {
      return 0;
    }

    try {
      const count = await gameAssetContract.assetMintCount(assetType);
      return count.toNumber();
    } catch (err) {
      console.error('Failed to fetch asset mint count:', err);
      return 0;
    }
  }, [gameAssetContract]);

  // Approve marketplace for trading
  const approveMarketplace = useCallback(async (tokenId: number): Promise<void> => {
    if (!gameAssetContract || !account) {
      throw new Error('GameAssetNFT contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const addresses = getCurrentContractAddresses();
      if (!addresses.MARKETPLACE_CONTRACT) {
        throw new Error('Marketplace contract address not configured');
      }

      console.log('Approving marketplace for token:', tokenId);
      
      const tx = await gameAssetContract.approve(addresses.MARKETPLACE_CONTRACT, tokenId);
      
      console.log('Approve transaction sent:', tx.hash);
      await tx.wait();
      console.log('Marketplace approved for token:', tokenId);
    } catch (err) {
      console.error('Failed to approve marketplace:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve marketplace';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gameAssetContract, account]);

  // Set approval for all (marketplace)
  const setApprovalForAll = useCallback(async (approved: boolean): Promise<void> => {
    if (!gameAssetContract || !account) {
      throw new Error('GameAssetNFT contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      const addresses = getCurrentContractAddresses();
      if (!addresses.MARKETPLACE_CONTRACT) {
        throw new Error('Marketplace contract address not configured');
      }

      console.log('Setting approval for all:', approved);
      
      const tx = await gameAssetContract.setApprovalForAll(addresses.MARKETPLACE_CONTRACT, approved);
      
      console.log('Set approval for all transaction sent:', tx.hash);
      await tx.wait();
      console.log('Approval for all set:', approved);
    } catch (err) {
      console.error('Failed to set approval for all:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to set approval';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [gameAssetContract, account]);

  // Check if marketplace is approved
  const isMarketplaceApproved = useCallback(async (tokenId?: number): Promise<boolean> => {
    if (!gameAssetContract || !account) {
      return false;
    }

    try {
      const addresses = getCurrentContractAddresses();
      if (!addresses.MARKETPLACE_CONTRACT) {
        return false;
      }

      if (tokenId) {
        // Check specific token approval
        const approved = await gameAssetContract.getApproved(tokenId);
        return approved === addresses.MARKETPLACE_CONTRACT;
      } else {
        // Check approval for all
        const approvedForAll = await gameAssetContract.isApprovedForAll(account, addresses.MARKETPLACE_CONTRACT);
        return approvedForAll;
      }
    } catch (err) {
      console.error('Failed to check marketplace approval:', err);
      return false;
    }
  }, [gameAssetContract, account]);

  // Get player assets by category
  const getPlayerAssetsByCategory = useCallback(async (
    playerAddress: string, 
    category: AssetCategory
  ): Promise<GameAsset[]> => {
    if (!gameAssetContract) {
      console.log('GameAssetNFT contract not available for getting assets by category');
      return [];
    }

    try {
      console.log('Fetching player assets by category:', { playerAddress, category });
      const tokenIds = await gameAssetContract.getPlayerAssetsByCategory(playerAddress, category);
      
      // Fetch details for each asset
      const assets: GameAsset[] = [];
      for (const tokenId of tokenIds) {
        try {
          const assetDetails = await gameAssetContract.getAssetDetails(tokenId.toNumber());
          const asset: GameAsset = {
            tokenId: tokenId.toNumber(),
            name: assetDetails.name,
            description: assetDetails.description,
            category: assetDetails.category as AssetCategory,
            rarity: assetDetails.rarity as AssetRarity,
            power: assetDetails.power.toNumber(),
            speed: assetDetails.speed.toNumber(),
            luck: assetDetails.luck.toNumber(),
            imageURI: assetDetails.imageURI,
            isActive: assetDetails.isActive,
            createdAt: assetDetails.createdAt.toNumber(),
            creator: assetDetails.creator
          };
          assets.push(asset);
        } catch (err) {
          console.warn(`Failed to fetch details for token ${tokenId}:`, err);
        }
      }

      console.log('Player assets by category fetched successfully:', assets.length);
      return assets;
    } catch (err) {
      console.error('Failed to fetch player assets by category:', err);
      return [];
    }
  }, [gameAssetContract]);

  return {
    playerAssets,
    isLoading,
    error,
    gameAssetContract,
    getPlayerAssets,
    getAssetDetails,
    mintAsset,
    getAssetDefinition,
    getAssetMintCount,
    approveMarketplace,
    setApprovalForAll,
    isMarketplaceApproved,
    getPlayerAssetsByCategory
  };
};