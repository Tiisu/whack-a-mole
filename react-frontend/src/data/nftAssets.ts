// NFT Assets mapping for actual images
import { AssetCategory, AssetRarity } from '../types';

// Import all NFT images
import nft22 from '../nfts/Image_fx (22).jpg';
import nft25 from '../nfts/Image_fx (25).jpg';
import nft26 from '../nfts/Image_fx (26).jpg';
import nft27 from '../nfts/Image_fx (27).jpg';
import nft28 from '../nfts/Image_fx (28).jpg';
import nft29 from '../nfts/Image_fx (29).jpg';
import nft30 from '../nfts/Image_fx (30).jpg';
import nft31 from '../nfts/Image_fx (31).jpg';
import nft32 from '../nfts/Image_fx (32).jpg';
import nft33 from '../nfts/Image_fx (33).jpg';
import nft35 from '../nfts/Image_fx (35).jpg';
import nft36 from '../nfts/Image_fx (36).jpg';
import nft37 from '../nfts/Image_fx (37).jpg';
import nft38 from '../nfts/Image_fx (38).jpg';

// NFT Asset Templates with real images
export const nftAssetTemplates = [
  // Legendary Hammers
  {
    name: "Thor's Mjolnir",
    description: "The legendary hammer of the Norse god of thunder. Grants incredible power and lightning speed.",
    category: AssetCategory.HAMMER,
    rarity: AssetRarity.LEGENDARY,
    power: 95,
    speed: 85,
    luck: 90,
    imageURI: nft22
  },
  {
    name: "Golden Mallet Supreme",
    description: "A supreme golden mallet forged from celestial gold. Increases all stats significantly.",
    category: AssetCategory.HAMMER,
    rarity: AssetRarity.MYTHIC,
    power: 100,
    speed: 95,
    luck: 100,
    imageURI: nft25
  },
  {
    name: "Crystal Hammer of Eternity",
    description: "A beautiful crystal hammer that sparkles with magical energy and eternal power.",
    category: AssetCategory.HAMMER,
    rarity: AssetRarity.EPIC,
    power: 80,
    speed: 75,
    luck: 85,
    imageURI: nft26
  },
  
  // Power-ups
  {
    name: "Lightning Bolt Essence",
    description: "Harness the power of lightning to move at incredible speeds!",
    category: AssetCategory.POWERUP,
    rarity: AssetRarity.RARE,
    power: 60,
    speed: 100,
    luck: 70,
    imageURI: nft27
  },
  {
    name: "Lucky Clover of Fortune",
    description: "A four-leaf clover that brings incredible luck to the bearer.",
    category: AssetCategory.POWERUP,
    rarity: AssetRarity.UNCOMMON,
    power: 40,
    speed: 50,
    luck: 95,
    imageURI: nft28
  },
  {
    name: "Time Warp Orb",
    description: "Manipulate time itself to gain an advantage in the game.",
    category: AssetCategory.POWERUP,
    rarity: AssetRarity.LEGENDARY,
    power: 85,
    speed: 90,
    luck: 80,
    imageURI: nft29
  },
  
  // Mole Skins
  {
    name: "Cyber Mole X-1",
    description: "A futuristic mole skin with neon accents and digital effects.",
    category: AssetCategory.MOLE_SKIN,
    rarity: AssetRarity.EPIC,
    power: 70,
    speed: 80,
    luck: 75,
    imageURI: nft30
  },
  {
    name: "Rainbow Mole Mystic",
    description: "A magical mole that shimmers with all colors of the rainbow.",
    category: AssetCategory.MOLE_SKIN,
    rarity: AssetRarity.LEGENDARY,
    power: 75,
    speed: 85,
    luck: 90,
    imageURI: nft31
  },
  {
    name: "Pirate Mole Captain",
    description: "Ahoy! This mole is ready to sail the seven seas and find treasure.",
    category: AssetCategory.MOLE_SKIN,
    rarity: AssetRarity.RARE,
    power: 65,
    speed: 70,
    luck: 80,
    imageURI: nft32
  },
  {
    name: "Ninja Mole Shadow",
    description: "A stealthy mole trained in the ancient arts of ninjutsu.",
    category: AssetCategory.MOLE_SKIN,
    rarity: AssetRarity.EPIC,
    power: 85,
    speed: 95,
    luck: 70,
    imageURI: nft33
  },
  
  // Backgrounds
  {
    name: "Space Odyssey Portal",
    description: "Journey through the cosmos with this stunning space background.",
    category: AssetCategory.BACKGROUND,
    rarity: AssetRarity.LEGENDARY,
    power: 60,
    speed: 70,
    luck: 85,
    imageURI: nft35
  },
  {
    name: "Underwater Paradise",
    description: "Dive into an underwater world filled with marine life.",
    category: AssetCategory.BACKGROUND,
    rarity: AssetRarity.RARE,
    power: 55,
    speed: 65,
    luck: 75,
    imageURI: nft36
  },
  {
    name: "Volcanic Eruption Arena",
    description: "Feel the heat with this intense volcanic background.",
    category: AssetCategory.BACKGROUND,
    rarity: AssetRarity.EPIC,
    power: 90,
    speed: 60,
    luck: 70,
    imageURI: nft37
  },
  
  // Special Items
  {
    name: "Dragon's Eye Gem",
    description: "A mystical gem that contains the power of an ancient dragon.",
    category: AssetCategory.SPECIAL,
    rarity: AssetRarity.MYTHIC,
    power: 100,
    speed: 90,
    luck: 95,
    imageURI: nft38
  }
];

// Export individual images for direct use
export const nftImages = {
  nft22,
  nft25,
  nft26,
  nft27,
  nft28,
  nft29,
  nft30,
  nft31,
  nft32,
  nft33,
  nft35,
  nft36,
  nft37,
  nft38
};

// Get random NFT image
export const getRandomNFTImage = (): string => {
  const images = Object.values(nftImages);
  return images[Math.floor(Math.random() * images.length)];
};

// Get NFT image by category
export const getNFTImageByCategory = (category: AssetCategory): string => {
  const categoryImages = nftAssetTemplates.filter(template => template.category === category);
  if (categoryImages.length > 0) {
    return categoryImages[Math.floor(Math.random() * categoryImages.length)].imageURI;
  }
  return getRandomNFTImage();
};

// Get NFT image by rarity
export const getNFTImageByRarity = (rarity: AssetRarity): string => {
  const rarityImages = nftAssetTemplates.filter(template => template.rarity === rarity);
  if (rarityImages.length > 0) {
    return rarityImages[Math.floor(Math.random() * rarityImages.length)].imageURI;
  }
  return getRandomNFTImage();
};