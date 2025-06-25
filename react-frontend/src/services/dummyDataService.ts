// Dummy data service for hackathon demo
import { GameAsset, MarketplaceListing, AssetCategory, AssetRarity } from '../types';
import { nftAssetTemplates, getRandomNFTImage, getNFTImageByCategory } from '../data/nftAssets';

// Generate dummy NFT assets using real images
export const generateDummyAssets = (count: number = 20): GameAsset[] => {
  const assets: GameAsset[] = [];
  
  // Use the real NFT asset templates
  const assetTemplates = [
    ...nftAssetTemplates,
    // Add some additional common items for variety
    {
      name: "Basic Hammer",
      description: "A simple but reliable hammer for beginners.",
      category: AssetCategory.HAMMER,
      rarity: AssetRarity.COMMON,
      power: 30,
      speed: 25,
      luck: 20,
      imageURI: getRandomNFTImage()
    },
    {
      name: "Speed Potion",
      description: "A basic potion that slightly increases your speed.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.COMMON,
      power: 20,
      speed: 40,
      luck: 25,
      imageURI: getRandomNFTImage()
    },
    {
      name: "Forest Background",
      description: "A peaceful forest setting for your game.",
      category: AssetCategory.BACKGROUND,
      rarity: AssetRarity.COMMON,
      power: 25,
      speed: 30,
      luck: 35,
      imageURI: getRandomNFTImage()
    },
    {
      name: "Regular Mole",
      description: "The classic mole skin that everyone knows and loves.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.COMMON,
      power: 25,
      speed: 30,
      luck: 25,
      imageURI: getRandomNFTImage()
    },
    {
      name: "Power Gloves",
      description: "Special gloves that enhance your hitting power.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.UNCOMMON,
      power: 55,
      speed: 35,
      luck: 40,
      imageURI: getRandomNFTImage()
    },
    {
      name: "Phoenix Feather",
      description: "A rare feather from the legendary phoenix, granting rebirth powers.",
      category: AssetCategory.SPECIAL,
      rarity: AssetRarity.LEGENDARY,
      power: 85,
      speed: 95,
      luck: 90,
      imageURI: getRandomNFTImage()
    }
  ];
  
  // Generate assets with unique token IDs
  for (let i = 0; i < Math.min(count, assetTemplates.length); i++) {
    const template = assetTemplates[i];
    assets.push({
      tokenId: i + 1,
      name: template.name,
      description: template.description,
      category: template.category,
      rarity: template.rarity,
      power: template.power,
      speed: template.speed,
      luck: template.luck,
      imageURI: template.imageURI,
      isActive: true,
      createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random time in last 30 days
      creator: "0x" + Math.random().toString(16).substr(2, 40) // Random address
    });
  }
  
  return assets;
};

// Generate dummy marketplace listings
export const generateDummyListings = (assets: GameAsset[]): MarketplaceListing[] => {
  const listings: MarketplaceListing[] = [];
  
  // Create listings for about 60% of the assets
  const listingCount = Math.floor(assets.length * 0.6);
  
  for (let i = 0; i < listingCount; i++) {
    const asset = assets[i];
    const listingTypes: ('FIXED_PRICE' | 'AUCTION' | 'TRADE_OFFER')[] = ['FIXED_PRICE', 'AUCTION', 'TRADE_OFFER'];
    const listingType = listingTypes[Math.floor(Math.random() * listingTypes.length)];
    
    // Price based on rarity
    let basePrice = 0.1;
    switch (asset.rarity) {
      case AssetRarity.COMMON:
        basePrice = 0.1 + Math.random() * 0.4; // 0.1 - 0.5 APE
        break;
      case AssetRarity.UNCOMMON:
        basePrice = 0.5 + Math.random() * 1; // 0.5 - 1.5 APE
        break;
      case AssetRarity.RARE:
        basePrice = 1 + Math.random() * 2; // 1 - 3 APE
        break;
      case AssetRarity.EPIC:
        basePrice = 3 + Math.random() * 5; // 3 - 8 APE
        break;
      case AssetRarity.LEGENDARY:
        basePrice = 8 + Math.random() * 12; // 8 - 20 APE
        break;
      case AssetRarity.MYTHIC:
        basePrice = 20 + Math.random() * 30; // 20 - 50 APE
        break;
    }
    
    const price = Math.round(basePrice * 100) / 100; // Round to 2 decimals
    const currentTime = Date.now();
    
    listings.push({
      listingId: i + 1,
      seller: "0x" + Math.random().toString(16).substr(2, 40), // Random seller address
      nftContract: "0x" + Math.random().toString(16).substr(2, 40), // Random contract address
      tokenId: asset.tokenId,
      listingType: listingType,
      price: price,
      startTime: currentTime - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random time in last 7 days
      endTime: listingType === 'AUCTION' ? currentTime + 24 * 60 * 60 * 1000 : 0, // 24 hours for auctions
      status: 'ACTIVE',
      isActive: true,
      currentBid: listingType === 'AUCTION' ? price + Math.random() * price * 0.5 : undefined,
      currentBidder: listingType === 'AUCTION' ? "0x" + Math.random().toString(16).substr(2, 40) : null,
      asset: asset
    });
  }
  
  return listings;
};

// Generate player's dummy assets (smaller subset)
export const generatePlayerDummyAssets = (count: number = 5): GameAsset[] => {
  const allAssets = generateDummyAssets(20);
  
  // Give player some good assets for demo - mix of rarities
  const playerAssets = [
    allAssets[0], // Thor's Mjolnir (Legendary)
    allAssets[3], // Lightning Bolt Essence (Rare)
    allAssets[6], // Cyber Mole X-1 (Epic)
    allAssets[1], // Golden Mallet Supreme (Mythic)
    allAssets[4]  // Lucky Clover of Fortune (Uncommon)
  ].slice(0, count);
  
  return playerAssets;
};

// Enhanced game features data
export const getEnhancedGameFeatures = () => {
  return {
    achievements: [
      {
        id: 'first_hit',
        name: 'First Strike',
        description: 'Hit your first mole!',
        icon: '🎯',
        rarity: 'common',
        reward: 10
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Hit 10 moles in 5 seconds',
        icon: '⚡',
        rarity: 'rare',
        reward: 50
      },
      {
        id: 'legendary_striker',
        name: 'Legendary Striker',
        description: 'Achieve a score of 1000+',
        icon: '👑',
        rarity: 'legendary',
        reward: 200
      },
      {
        id: 'nft_collector',
        name: 'NFT Collector',
        description: 'Own 5 different NFT assets',
        icon: '🎨',
        rarity: 'epic',
        reward: 100
      },
      {
        id: 'marketplace_trader',
        name: 'Marketplace Trader',
        description: 'Complete your first NFT trade',
        icon: '💰',
        rarity: 'uncommon',
        reward: 75
      }
    ],
    powerUps: [
      {
        id: 'double_points',
        name: 'Double Points',
        description: 'Double your score for 10 seconds',
        duration: 10000,
        icon: '✨',
        cost: 50
      },
      {
        id: 'slow_motion',
        name: 'Slow Motion',
        description: 'Slow down time for easier hits',
        duration: 8000,
        icon: '🐌',
        cost: 75
      },
      {
        id: 'auto_hit',
        name: 'Auto Hit',
        description: 'Automatically hit moles for 5 seconds',
        duration: 5000,
        icon: '🤖',
        cost: 100
      }
    ],
    specialEvents: [
      {
        id: 'golden_mole',
        name: 'Golden Mole Event',
        description: 'Rare golden moles appear worth 5x points!',
        probability: 0.05,
        multiplier: 5,
        icon: '🥇'
      },
      {
        id: 'mole_frenzy',
        name: 'Mole Frenzy',
        description: 'More moles appear at once!',
        probability: 0.1,
        duration: 15000,
        icon: '🌪️'
      }
    ]
  };
};

// Leaderboard dummy data
export const generateDummyLeaderboard = () => {
  const names = [
    'CryptoMaster', 'NFTHunter', 'MoleSlayer', 'DigitalWarrior', 'BlockchainBoss',
    'Web3Wizard', 'TokenTrader', 'GameGuru', 'MetaPlayer', 'ChainChampion'
  ];
  
  return names.map((name, index) => ({
    player: "0x" + Math.random().toString(16).substr(2, 40),
    username: name,
    score: Math.floor(Math.random() * 2000) + 500,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
  })).sort((a, b) => b.score - a.score);
};