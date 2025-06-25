// Web3 Configuration for React Whac-A-Mole dApp

import { NetworkConfig, Web3Config } from '../types';

// Ape Chain Network Configuration
export const NETWORKS: Record<string, NetworkConfig> = {
  APECHAIN_TESTNET: {
    chainId: '0x8157', // 33111 in hex
    chainName: 'Curtis (Ape Chain Testnet)',
    nativeCurrency: {
      name: 'APE',
      symbol: 'APE',
      decimals: 18
    },
    rpcUrls: ['https://curtis.rpc.caldera.xyz/http'],
    blockExplorerUrls: ['https://curtis.explorer.caldera.xyz/']
  },
  APECHAIN_MAINNET: {
    chainId: '0x8173', // 33139 in hex
    chainName: 'ApeChain',
    nativeCurrency: {
      name: 'APE',
      symbol: 'APE',
      decimals: 18
    },
    rpcUrls: ['https://apechain.calderachain.xyz/http'],
    blockExplorerUrls: ['https://apechain.calderaexplorer.xyz/']
  }
};

// Contract addresses (updated after deployment)
export const CONTRACT_ADDRESSES: Web3Config = {
  TESTNET: {
    GAME_CONTRACT: '0x46C2F2E4AcA4048ad1E05D9B5569B5634d04B039', // WhacAMoleGame on ApeChain Testnet
    NFT_CONTRACT: '0x8FE458859F01eAcb7dfB40d2B44eF6Ae24cA907F',    // WhacAMoleNFT on ApeChain Testnet
    MARKETPLACE_CONTRACT: '0xC8E1cD4BD90Af1C0BBAce26f07fdCc436CaaE0b0',     // NFTMarketplace on ApeChain Testnet
    GAME_ASSET_NFT_CONTRACT: '0x13A8888674802Ef10223B4D374a895c70B2aca53'   // GameAssetNFT on ApeChain Testnet
  },
  MAINNET: {
    GAME_CONTRACT: '', // Will be filled after mainnet deployment
    NFT_CONTRACT: '',  // Will be filled after mainnet deployment
    MARKETPLACE_CONTRACT: '',     // Will be filled after marketplace deployment
    GAME_ASSET_NFT_CONTRACT: ''   // Will be filled after GameAssetNFT deployment
  }
};

// Contract ABIs (updated to match deployed contracts)
export const CONTRACT_ABIS = {
  MARKETPLACE_CONTRACT: [
    // Core marketplace functions
    "function listForSale(address nftContract, uint256 tokenId, uint256 price) external returns (uint256)",
    "function listForAuction(address nftContract, uint256 tokenId, uint256 startingBid, uint256 bidIncrement, uint256 duration) external returns (uint256)",
    "function listForTrade(address nftContract, uint256 tokenId, address[] memory wantedNftContracts, uint256[] memory wantedTokenIds) external returns (uint256)",
    "function buyNow(uint256 listingId) external payable",
    "function placeBid(uint256 listingId) external payable",
    "function endAuction(uint256 listingId) external",
    "function createTradeOffer(uint256 listingId, address[] memory offeredNftContracts, uint256[] memory offeredTokenIds) external returns (uint256)",
    "function acceptTradeOffer(uint256 tradeOfferId) external",
    "function cancelListing(uint256 listingId) external",
    
    // View functions
    "function getActiveListings(uint256 offset, uint256 limit) external view returns (tuple(uint256 listingId, address seller, address nftContract, uint256 tokenId, uint8 listingType, uint256 price, uint256 startTime, uint256 endTime, uint8 status, bool isActive)[] memory)",
    "function getTradeOffers(uint256 listingId) external view returns (uint256[] memory)",
    "function listings(uint256) external view returns (uint256 listingId, address seller, address nftContract, uint256 tokenId, uint8 listingType, uint256 price, uint256 startTime, uint256 endTime, uint8 status, bool isActive)",
    "function auctions(uint256) external view returns (uint256 listingId, uint256 startingBid, uint256 currentBid, address currentBidder, uint256 bidIncrement)",
    "function tradeOffers(uint256) external view returns (uint256 listingId, address[] memory wantedNftContracts, uint256[] memory wantedTokenIds, address[] memory offeredNftContracts, uint256[] memory offeredTokenIds, address offerer, bool isAccepted)",
    "function supportedNftContracts(address) external view returns (bool)",
    "function marketplaceFee() external view returns (uint256)",
    "function nextListingId() external view returns (uint256)",
    
    // Admin functions
    "function addSupportedNftContract(address nftContract) external",
    "function removeSupportedNftContract(address nftContract) external",
    "function setMarketplaceFee(uint256 _fee) external",
    "function withdrawFees() external",
    "function pause() external",
    "function unpause() external",
    
    // Events
    "event ItemListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint8 listingType, uint256 price)",
    "event ItemSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
    "event ListingCancelled(uint256 indexed listingId)",
    "event BidPlaced(uint256 indexed listingId, address indexed bidder, uint256 bidAmount)",
    "event AuctionEnded(uint256 indexed listingId, address indexed winner, uint256 winningBid)",
    "event TradeOfferCreated(uint256 indexed tradeOfferId, uint256 indexed listingId, address indexed offerer)",
    "event TradeOfferAccepted(uint256 indexed tradeOfferId, uint256 indexed listingId)"
  ],
  
  GAME_ASSET_NFT_CONTRACT: [
    // Core NFT functions
    "function mintAsset(string memory assetType, address to) external payable returns (uint256)",
    "function mintAssetForFree(string memory assetType, address to) external returns (uint256)",
    "function toggleMarketplaceListing(uint256 tokenId, bool isListed) external",
    "function useAssetInGame(address player, uint256 tokenId, uint256 gameId) external",
    
    // View functions
    "function getPlayerAssetsByCategory(address player, uint8 category) external view returns (uint256[] memory)",
    "function getPlayerAssets(address player) external view returns (uint256[] memory)",
    "function getAssetDetails(uint256 tokenId) external view returns (tuple(string name, string description, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string imageURI, bool isActive, uint256 createdAt, address creator))",
    "function gameAssets(uint256) external view returns (string memory name, string memory description, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string memory imageURI, bool isActive, uint256 createdAt, address creator)",
    "function assetDefinitions(string memory) external view returns (string memory name, string memory description, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string memory imageURI, uint256 mintPrice, uint256 maxSupply, bool isActive)",
    "function assetMintCount(string memory) external view returns (uint256)",
    "function isMarketplaceListed(uint256) external view returns (bool)",
    "function mintingFee() external view returns (uint256)",
    
    // Standard ERC721 functions
    "function balanceOf(address owner) external view returns (uint256)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function totalSupply() external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
    "function approve(address to, uint256 tokenId) external",
    "function getApproved(uint256 tokenId) external view returns (address)",
    "function setApprovalForAll(address operator, bool approved) external",
    "function isApprovedForAll(address owner, address operator) external view returns (bool)",
    "function safeTransferFrom(address from, address to, uint256 tokenId) external",
    "function transferFrom(address from, address to, uint256 tokenId) external",
    
    // Admin functions
    "function addAssetDefinition(string memory assetType, string memory name, uint8 category, uint8 rarity, uint256 power, uint256 speed, uint256 luck, string memory imageURI, uint256 mintPrice, uint256 maxSupply) external",
    "function setGameContract(address _gameContract) external",
    "function setMarketplaceContract(address _marketplaceContract) external",
    "function setMintingFee(uint256 _fee) external",
    "function setBaseURI(string memory _baseURI) external",
    "function withdraw() external",
    
    // Events
    "event AssetMinted(address indexed to, uint256 indexed tokenId, string assetType, uint8 rarity)",
    "event AssetDefinitionAdded(string assetType, uint8 category, uint8 rarity)",
    "event AssetDefinitionUpdated(string assetType)",
    "event MarketplaceListingToggled(uint256 indexed tokenId, bool isListed)",
    "event AssetUsedInGame(address indexed player, uint256 indexed tokenId, uint256 gameId)"
  ],
  
  GAME_CONTRACT: [
    // Player registration
    "function registerPlayer(string memory _username) external",
    "function getPlayer(address _player) external view returns (tuple(address playerAddress, string username, uint256 totalGamesPlayed, uint256 totalScore, uint256 highestScore, uint256 totalMolesHit, uint256 registrationTime, bool isRegistered))",
    
    // Game sessions
    "function startGame() external returns (uint256)",
    "function completeGame(uint256 _gameId, uint256 _score, uint256 _molesHit, uint256 _level) external",
    "function getGameSession(uint256 _gameId) external view returns (tuple(address player, uint256 score, uint256 molesHit, uint256 level, uint256 startTime, uint256 endTime, bool isCompleted))",
    
    // Leaderboard
    "function getLeaderboard() external view returns (tuple(address player, string username, uint256 score, uint256 timestamp)[])",
    "function getPlayerRank(address _player) external view returns (uint256)",
    
    // Statistics
    "function getGameStats() external view returns (uint256 totalPlayers, uint256 totalGames, uint256 leaderboardSize)",
    
    // Username update
    "function updateUsername(string memory _newUsername) external",
    
    // Constants
    "function GAME_DURATION() external view returns (uint256)",
    "function MIN_SCORE_FOR_LEADERBOARD() external view returns (uint256)",
    "function BEGINNER_THRESHOLD() external view returns (uint256)",
    "function PRO_THRESHOLD() external view returns (uint256)",
    "function MASTER_THRESHOLD() external view returns (uint256)",
    
    // Events
    "event PlayerRegistered(address indexed player, string username)",
    "event GameStarted(address indexed player, uint256 indexed gameId)",
    "event GameCompleted(address indexed player, uint256 indexed gameId, uint256 score)",
    "event LeaderboardUpdated(address indexed player, uint256 score, uint256 position)",
    "event AchievementUnlocked(address indexed player, string achievement)"
  ],
  
  NFT_CONTRACT: [
    // Achievement queries
    "function hasAchievement(address _player, string memory _achievement) external view returns (bool)",
    "function getPlayerAchievements(address _player) external view returns (string[])",
    "function getAchievementMetadata(string memory _achievement) external view returns (tuple(string name, string description, string imageURI, uint256 totalMinted, bool exists))",
    
    // ERC-721 standard
    "function balanceOf(address owner) external view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
    "function tokenURI(uint256 tokenId) external view returns (string)",
    
    // Events
    "event AchievementMinted(address indexed player, string achievement, uint256 tokenId)"
  ]
};

// Game configuration constants
export const GAME_CONFIG = {
  DURATION: 120, // 2 minutes in seconds
  MIN_SCORE_FOR_LEADERBOARD: 100,
  ACHIEVEMENT_THRESHOLDS: {
    BEGINNER: 1000,
    PRO: 5000,
    MASTER: 10000,
    REGULAR: 10, // games played
    VETERAN: 100 // games played
  },
  LEVEL_CONFIG: [
    { level: 1, name: 'Beginner', moleSpeed: 1000, plantSpeed: 2000, pointsRequired: 0, multiplier: 1.0 },
    { level: 2, name: 'Novice', moleSpeed: 900, plantSpeed: 1800, pointsRequired: 1000, multiplier: 1.2 },
    { level: 3, name: 'Intermediate', moleSpeed: 800, plantSpeed: 1600, pointsRequired: 1500, multiplier: 1.4 },
    { level: 4, name: 'Advanced', moleSpeed: 700, plantSpeed: 1400, pointsRequired: 2250, multiplier: 1.6 },
    { level: 5, name: 'Expert', moleSpeed: 600, plantSpeed: 1200, pointsRequired: 3375, multiplier: 1.8 }
  ],
  MOLE_POINTS: {
    mole1: 10,
    mole2: 20
  }
};

// Achievement metadata
export const ACHIEVEMENT_DATA = {
  BEGINNER: {
    name: 'Beginner',
    description: 'Score 1,000+ points in a single game',
    icon: 'target',
    rarity: 'Common'
  },
  PRO: {
    name: 'Pro Player',
    description: 'Score 5,000+ points in a single game',
    icon: 'trophy',
    rarity: 'Epic'
  },
  MASTER: {
    name: 'Master',
    description: 'Score 10,000+ points in a single game',
    icon: 'crown',
    rarity: 'Legendary'
  },
  REGULAR: {
    name: 'Regular Player',
    description: 'Play 10+ games',
    icon: 'gamepad',
    rarity: 'Common'
  },
  VETERAN: {
    name: 'Veteran',
    description: 'Play 100+ games',
    icon: 'star',
    rarity: 'Rare'
  }
};

// Default game settings
export const DEFAULT_GAME_SETTINGS = {
  soundEnabled: true,
  musicEnabled: true,
  difficulty: 'normal' as const,
  theme: 'default' as const
};

// Local storage keys
export const STORAGE_KEYS = {
  GAME_STATS: 'whac-a-mole-stats',
  GAME_SETTINGS: 'whac-a-mole-settings',
  HIGH_SCORE: 'whac-a-mole-high-score',
  PLAYER_DATA: 'whac-a-mole-player-data'
};

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: 'MetaMask not detected. Please install MetaMask to play.',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet. Please try again.',
  NETWORK_SWITCH_FAILED: 'Failed to switch to ApeChain. Please switch manually.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  PLAYER_NOT_REGISTERED: 'Please register your player profile first.',
  GAME_SESSION_FAILED: 'Failed to start game session. Please try again.',
  CONTRACT_INTERACTION_FAILED: 'Failed to interact with smart contract.',
  INSUFFICIENT_FUNDS: 'Insufficient APE tokens for gas fees.',
  USER_REJECTED: 'Transaction was rejected by user.',
  NETWORK_ERROR: 'Network error. Please check your connection.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully!',
  PLAYER_REGISTERED: 'Player registered successfully!',
  GAME_SESSION_STARTED: 'Game session started on blockchain!',
  GAME_SESSION_COMPLETED: 'Game session completed and saved to blockchain!',
  ACHIEVEMENT_UNLOCKED: 'Achievement unlocked!',
  LEADERBOARD_UPDATED: 'Leaderboard updated with your score!',
  USERNAME_UPDATED: 'Username updated successfully!'
};

// Current network (will be set based on environment or user preference)
export const getCurrentNetwork = (): 'TESTNET' | 'MAINNET' => {
  // Default to testnet for development
  return process.env.REACT_APP_NETWORK === 'mainnet' ? 'MAINNET' : 'TESTNET';
};

// Get current network configuration
export const getCurrentNetworkConfig = (): NetworkConfig => {
  const network = getCurrentNetwork();
  return network === 'MAINNET' ? NETWORKS.APECHAIN_MAINNET : NETWORKS.APECHAIN_TESTNET;
};

// Get current contract addresses
export const getCurrentContractAddresses = () => {
  const network = getCurrentNetwork();
  return CONTRACT_ADDRESSES[network];
};

// Utility function to check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Utility function to get chain ID as number
export const getChainIdAsNumber = (chainId: string): number => {
  return parseInt(chainId, 16);
};

// Utility function to format address
export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

// Utility function to format score
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

// Utility function to format time
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};