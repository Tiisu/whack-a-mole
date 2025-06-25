// TypeScript interfaces for Web3 Whac-A-Mole React App

export interface PlayerData {
  address: string;
  username: string;
  totalGamesPlayed: number;
  totalScore: number;
  highestScore: number;
  totalMolesHit: number;
  registrationTime: Date;
  isRegistered: boolean;
}

export interface GameSession {
  player: string;
  score: number;
  molesHit: number;
  level: number;
  startTime: number;
  endTime: number;
  isCompleted: boolean;
}

export interface LeaderboardEntry {
  player: string;
  username: string;
  score: number;
  timestamp: Date;
}

export interface AchievementMetadata {
  name: string;
  description: string;
  imageURI: string;
  totalMinted: number;
  exists: boolean;
}

export interface GameState {
  score: number;
  timeLeft: number;
  currentLevel: number;
  pointsToNextLevel: number;
  gameOver: boolean;
  isPaused: boolean;
  molesHit: number;
  plantsHit: number;
  isPlaying: boolean;
  currentStreak: number;
  bestStreak: number;
  highScore: number;
}

export interface GameStats {
  gamesPlayed: number;
  totalScore: number;
  totalCoins: number;
  bestTime: number;
  highestLevel: number;
  molesHit: number;
  plantsHit: number;
  averageScore: number;
}

export interface MoleData {
  id: string;
  type: 'mole1' | 'mole2' | 'plant';
  position: number; // 0-8 for 3x3 grid
  isVisible: boolean;
  points: number;
}

export interface Web3State {
  isInitialized: boolean;
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  playerData: PlayerData | null;
  achievements: string[];
  leaderboard: LeaderboardEntry[];
  currentGameId: number | null;
}

export interface ContractAddresses {
  GAME_CONTRACT: string;
  NFT_CONTRACT: string;
  MARKETPLACE_CONTRACT?: string;
  GAME_ASSET_NFT_CONTRACT?: string;
}

export interface NetworkConfig {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}

export interface Web3Config {
  TESTNET: ContractAddresses;
  MAINNET: ContractAddresses;
}

export interface NotificationData {
  id: string;
  type: 'achievement' | 'leaderboard' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  autoHide?: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  theme: 'default' | 'dark';
}

// Achievement types
export type AchievementType = 'BEGINNER' | 'PRO' | 'MASTER' | 'REGULAR' | 'VETERAN';

// Game difficulty levels
export interface DifficultyLevel {
  level: number;
  name: string;
  moleSpeed: number;
  plantSpeed: number;
  pointsRequired: number;
  multiplier: number;
}

// Audio types
export interface AudioManager {
  playSound: (soundName: string) => void;
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  setVolume: (volume: number) => void;
  isMuted: boolean;
}

// Contract event types
export interface ContractEvent {
  event: string;
  args: any[];
  blockNumber: number;
  transactionHash: string;
}

// Transaction status
export interface TransactionStatus {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
}

// Error types
export interface Web3Error {
  code: number;
  message: string;
  data?: any;
}

// Component props interfaces
export interface GameBoardProps {
  gameState: GameState;
  onMoleClick: (position: number) => void;
  moles: MoleData[];
}

export interface DashboardProps {
  gameStats: GameStats;
  playerData: PlayerData | null;
  web3State: Web3State;
  onRefresh: () => void;
}

export interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentPlayer: string | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export interface AchievementsProps {
  achievements: string[];
  playerData: PlayerData | null;
  isLoading: boolean;
}

export interface WalletConnectionProps {
  web3State: Web3State;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface PlayerRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (username: string) => Promise<void>;
  isLoading: boolean;
}

export interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled: boolean;
}

export interface NotificationProps {
  notification: NotificationData;
  onClose?: (id: string) => void;
}

// Hook return types
export interface UseWalletReturn {
  web3State: Web3State;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export interface UseGameContractReturn {
  registerPlayer: (username: string) => Promise<void>;
  startGameSession: () => Promise<number>;
  completeGameSession: (gameId: number, score: number, molesHit: number, level: number) => Promise<void>;
  getPlayerData: (address: string) => Promise<PlayerData>;
  getLeaderboard: () => Promise<LeaderboardEntry[]>;
  updateUsername: (newUsername: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface UseNFTContractReturn {
  getPlayerAchievements: (address: string) => Promise<string[]>;
  hasAchievement: (address: string, achievement: AchievementType) => Promise<boolean>;
  getAchievementMetadata: (achievement: AchievementType) => Promise<AchievementMetadata>;
  isLoading: boolean;
  error: string | null;
}

export interface UseGameReturn {
  gameState: GameState;
  gameStats: GameStats;
  moles: MoleData[];
  startGame: () => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  stopGame: () => Promise<void>;
  handleMoleClick: (position: number) => void;
  resetGame: () => void;
}

export interface UseNotificationsReturn {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  addAchievementNotification: (achievement: string) => void;
  addLeaderboardNotification: (position: number, score: number) => void;
  addSuccessNotification: (message: string) => void;
  addErrorNotification: (message: string) => void;
}

// Context types
export interface Web3ContextType {
  web3State: Web3State;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  registerPlayer: (username: string) => Promise<void>;
  startGameSession: () => Promise<number>;
  completeGameSession: (gameId: number, score: number, molesHit: number, level: number) => Promise<void>;
  refreshData: () => Promise<void>;
  clearPendingTransaction: () => void;
  clearCurrentGameId: () => void;
  isLoading: boolean;
  error: string | null;
  pendingTransaction: {
    type: 'registration' | 'gameStart' | 'gameComplete';
    message: string;
  } | null;
}

export interface GameContextType {
  gameState: GameState;
  gameStats: GameStats;
  moles: MoleData[];
  startGame: () => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  stopGame: () => Promise<void>;
  handleMoleClick: (position: number) => void;
  resetGame: () => void;
  forceCleanupGame: () => Promise<void>;
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
}

export interface NotificationContextType {
  notifications: NotificationData[];
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// NFT Marketplace Types
export enum AssetCategory {
  WEAPON = 0,
  SKIN = 1,
  POWERUP = 2,
  BACKGROUND = 3,
  MOLE_SKIN = 4,
  HAMMER = 5,
  SPECIAL = 6
}

export enum AssetRarity {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
  MYTHIC = 5
}

export interface GameAsset {
  tokenId: number;
  name: string;
  description: string;
  category: AssetCategory;
  rarity: AssetRarity;
  power: number;
  speed: number;
  luck: number;
  imageURI: string;
  isActive: boolean;
  createdAt: number;
  creator: string;
}

export interface AssetDefinition {
  name: string;
  description: string;
  category: AssetCategory;
  rarity: AssetRarity;
  power: number;
  speed: number;
  luck: number;
  imageURI: string;
  mintPrice: number;
  maxSupply: number;
  isActive: boolean;
}

export interface MarketplaceListing {
  listingId: number;
  seller: string;
  nftContract: string;
  tokenId: number;
  listingType: 'FIXED_PRICE' | 'AUCTION' | 'TRADE_OFFER';
  price: number;
  startTime: number;
  endTime: number;
  status: 'ACTIVE' | 'SOLD' | 'CANCELLED' | 'EXPIRED';
  isActive: boolean;
  currentBid?: number;
  currentBidder?: string | null;
  asset?: GameAsset | null;
}

export interface TradeOffer {
  tradeOfferId: number;
  listingId: number;
  wantedNftContracts: string[];
  wantedTokenIds: number[];
  offeredNftContracts: string[];
  offeredTokenIds: number[];
  offerer: string;
  isAccepted: boolean;
}

// Hook return types for marketplace
export interface UseMarketplaceReturn {
  listings: MarketplaceListing[];
  isLoading: boolean;
  error: string | null;
  marketplaceContract: any;
  getActiveListings: (offset?: number, limit?: number) => Promise<void>;
  listNFTForSale: (tokenId: number, price: number) => Promise<void>;
  listNFTForAuction: (tokenId: number, startingBid: number, bidIncrement: number, duration: number) => Promise<void>;
  listNFTForTrade: (tokenId: number, wantedNftContracts: string[], wantedTokenIds: number[]) => Promise<void>;
  buyNFT: (listingId: number, price: number) => Promise<void>;
  placeBid: (listingId: number, bidAmount: number) => Promise<void>;
  cancelListing: (listingId: number) => Promise<void>;
  createTradeOffer: (listingId: number, offeredNftContracts: string[], offeredTokenIds: number[]) => Promise<void>;
  acceptTradeOffer: (tradeOfferId: number) => Promise<void>;
}

export interface UseGameAssetNFTReturn {
  playerAssets: GameAsset[];
  isLoading: boolean;
  error: string | null;
  gameAssetContract: any;
  getPlayerAssets: (playerAddress: string) => Promise<void>;
  getAssetDetails: (tokenId: number) => Promise<GameAsset | null>;
  mintAsset: (assetType: string, recipient?: string) => Promise<number | null>;
  getAssetDefinition: (assetType: string) => Promise<AssetDefinition | null>;
  getAssetMintCount: (assetType: string) => Promise<number>;
  approveMarketplace: (tokenId: number) => Promise<void>;
  setApprovalForAll: (approved: boolean) => Promise<void>;
  isMarketplaceApproved: (tokenId?: number) => Promise<boolean>;
  getPlayerAssetsByCategory: (playerAddress: string, category: AssetCategory) => Promise<GameAsset[]>;
}
