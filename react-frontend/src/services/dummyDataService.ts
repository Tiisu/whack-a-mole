// Dummy data service for hackathon demo
import { GameAsset, MarketplaceListing, AssetCategory, AssetRarity } from '../types';

// Generate dummy NFT assets
export const generateDummyAssets = (count: number = 20): GameAsset[] => {
  const assets: GameAsset[] = [];
  
  const assetTemplates = [
    // Legendary Hammers
    {
      name: "Thor's Mjolnir",
      description: "The legendary hammer of the Norse god of thunder. Grants incredible power and lightning speed.",
      category: AssetCategory.HAMMER,
      rarity: AssetRarity.LEGENDARY,
      power: 95,
      speed: 85,
      luck: 90,
      imageURI: "https://via.placeholder.com/300x300/FFD700/000000?text=⚡🔨"
    },
    {
      name: "Golden Mallet Supreme",
      description: "A supreme golden mallet forged from celestial gold. Increases all stats significantly.",
      category: AssetCategory.HAMMER,
      rarity: AssetRarity.MYTHIC,
      power: 100,
      speed: 95,
      luck: 100,
      imageURI: "https://via.placeholder.com/300x300/FFD700/000000?text=👑🔨"
    },
    {
      name: "Crystal Hammer",
      description: "A beautiful crystal hammer that sparkles with magical energy.",
      category: AssetCategory.HAMMER,
      rarity: AssetRarity.EPIC,
      power: 80,
      speed: 75,
      luck: 85,
      imageURI: "https://via.placeholder.com/300x300/9932CC/FFFFFF?text=💎🔨"
    },
    
    // Power-ups
    {
      name: "Lightning Bolt",
      description: "Harness the power of lightning to move at incredible speeds!",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.RARE,
      power: 60,
      speed: 100,
      luck: 70,
      imageURI: "https://via.placeholder.com/300x300/1E90FF/FFFFFF?text=⚡💨"
    },
    {
      name: "Lucky Clover",
      description: "A four-leaf clover that brings incredible luck to the bearer.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.UNCOMMON,
      power: 40,
      speed: 50,
      luck: 95,
      imageURI: "https://via.placeholder.com/300x300/32CD32/FFFFFF?text=🍀✨"
    },
    {
      name: "Time Warp Orb",
      description: "Manipulate time itself to gain an advantage in the game.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.LEGENDARY,
      power: 85,
      speed: 90,
      luck: 80,
      imageURI: "https://via.placeholder.com/300x300/8A2BE2/FFFFFF?text=🔮⏰"
    },
    
    // Mole Skins
    {
      name: "Cyber Mole",
      description: "A futuristic mole skin with neon accents and digital effects.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.EPIC,
      power: 70,
      speed: 80,
      luck: 75,
      imageURI: "https://via.placeholder.com/300x300/00FFFF/000000?text=🤖🐹"
    },
    {
      name: "Rainbow Mole",
      description: "A magical mole that shimmers with all colors of the rainbow.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.LEGENDARY,
      power: 75,
      speed: 85,
      luck: 90,
      imageURI: "https://via.placeholder.com/300x300/FF69B4/FFFFFF?text=🌈🐹"
    },
    {
      name: "Pirate Mole",
      description: "Ahoy! This mole is ready to sail the seven seas.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.RARE,
      power: 65,
      speed: 70,
      luck: 80,
      imageURI: "https://via.placeholder.com/300x300/8B4513/FFFFFF?text=🏴‍☠️🐹"
    },
    {
      name: "Ninja Mole",
      description: "A stealthy mole trained in the ancient arts of ninjutsu.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.EPIC,
      power: 85,
      speed: 95,
      luck: 70,
      imageURI: "https://via.placeholder.com/300x300/2F4F4F/FFFFFF?text=🥷🐹"
    },
    
    // Backgrounds
    {
      name: "Space Odyssey",
      description: "Journey through the cosmos with this stunning space background.",
      category: AssetCategory.BACKGROUND,
      rarity: AssetRarity.LEGENDARY,
      power: 60,
      speed: 70,
      luck: 85,
      imageURI: "https://via.placeholder.com/300x300/191970/FFFFFF?text=🌌🚀"
    },
    {
      name: "Underwater Paradise",
      description: "Dive into an underwater world filled with marine life.",
      category: AssetCategory.BACKGROUND,
      rarity: AssetRarity.RARE,
      power: 55,
      speed: 65,
      luck: 75,
      imageURI: "https://via.placeholder.com/300x300/008B8B/FFFFFF?text=🌊🐠"
    },
    {
      name: "Volcanic Eruption",
      description: "Feel the heat with this intense volcanic background.",
      category: AssetCategory.BACKGROUND,
      rarity: AssetRarity.EPIC,
      power: 90,
      speed: 60,
      luck: 70,
      imageURI: "https://via.placeholder.com/300x300/DC143C/FFFFFF?text=🌋🔥"
    },
    
    // Special Items
    {
      name: "Dragon's Eye",
      description: "A mystical gem that contains the power of an ancient dragon.",
      category: AssetCategory.SPECIAL,
      rarity: AssetRarity.MYTHIC,
      power: 100,
      speed: 90,
      luck: 95,
      imageURI: "https://via.placeholder.com/300x300/FF4500/FFFFFF?text=🐉👁️"
    },
    {
      name: "Phoenix Feather",
      description: "A rare feather from the legendary phoenix, granting rebirth powers.",
      category: AssetCategory.SPECIAL,
      rarity: AssetRarity.LEGENDARY,
      power: 85,
      speed: 95,
      luck: 90,
      imageURI: "https://via.placeholder.com/300x300/FF6347/FFFFFF?text=🔥🪶"
    },
    
    // Common items for variety
    {
      name: "Basic Hammer",
      description: "A simple but reliable hammer for beginners.",
      category: AssetCategory.HAMMER,
      rarity: AssetRarity.COMMON,
      power: 30,
      speed: 25,
      luck: 20,
      imageURI: "https://via.placeholder.com/300x300/808080/FFFFFF?text=🔨"
    },
    {
      name: "Speed Potion",
      description: "A basic potion that slightly increases your speed.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.COMMON,
      power: 20,
      speed: 40,
      luck: 25,
      imageURI: "https://via.placeholder.com/300x300/90EE90/000000?text=🧪💨"
    },
    {
      name: "Forest Background",
      description: "A peaceful forest setting for your game.",
      category: AssetCategory.BACKGROUND,
      rarity: AssetRarity.COMMON,
      power: 25,
      speed: 30,
      luck: 35,
      imageURI: "https://via.placeholder.com/300x300/228B22/FFFFFF?text=🌲🌳"
    },
    {
      name: "Regular Mole",
      description: "The classic mole skin that everyone knows and loves.",
      category: AssetCategory.MOLE_SKIN,
      rarity: AssetRarity.COMMON,
      power: 25,
      speed: 30,
      luck: 25,
      imageURI: "https://via.placeholder.com/300x300/8B4513/FFFFFF?text=🐹"
    },
    {
      name: "Power Gloves",
      description: "Special gloves that enhance your hitting power.",
      category: AssetCategory.POWERUP,
      rarity: AssetRarity.UNCOMMON,
      power: 55,
      speed: 35,
      luck: 40,
      imageURI: "https://via.placeholder.com/300x300/4169E1/FFFFFF?text=🧤💪"
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
  
  // Give player some good assets for demo
  const playerAssets = [
    allAssets[0], // Thor's Mjolnir
    allAssets[3], // Lightning Bolt
    allAssets[6], // Cyber Mole
    allAssets[14], // Basic Hammer
    allAssets[15]  // Speed Potion
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