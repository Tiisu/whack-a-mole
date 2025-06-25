// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title GameAssetNFT
 * @dev NFT contract for tradeable in-game assets (weapons, skins, power-ups, etc.)
 */
contract GameAssetNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Strings for uint256;
    
    // Asset categories
    enum AssetCategory { WEAPON, SKIN, POWERUP, BACKGROUND, MOLE_SKIN, HAMMER, SPECIAL }
    
    // Asset rarity levels
    enum AssetRarity { COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC }
    
    struct GameAsset {
        string name;
        string description;
        AssetCategory category;
        AssetRarity rarity;
        uint256 power; // For weapons/power-ups
        uint256 speed; // For speed-related assets
        uint256 luck; // For luck-based assets
        string imageURI;
        bool isActive; // Can be used in game
        uint256 createdAt;
        address creator; // Who created/minted this asset
    }
    
    // Asset definitions for minting
    struct AssetDefinition {
        string name;
        string description;
        AssetCategory category;
        AssetRarity rarity;
        uint256 power;
        uint256 speed;
        uint256 luck;
        string imageURI;
        uint256 mintPrice; // Price to mint in wei
        uint256 maxSupply; // 0 = unlimited
        bool isActive;
    }
    
    // Mappings
    mapping(uint256 => GameAsset) public gameAssets;
    mapping(string => AssetDefinition) public assetDefinitions;
    mapping(string => uint256) public assetMintCount; // Track minted count per asset type
    mapping(address => mapping(AssetCategory => uint256[])) public playerAssetsByCategory;
    mapping(uint256 => bool) public isMarketplaceListed;
    
    // State variables
    uint256 private _nextTokenId = 1;
    address public gameContract;
    address public marketplaceContract;
    string private _baseTokenURI;
    uint256 public mintingFee = 0.001 ether; // Base minting fee
    
    // Events
    event AssetMinted(address indexed to, uint256 indexed tokenId, string assetType, AssetRarity rarity);
    event AssetDefinitionAdded(string assetType, AssetCategory category, AssetRarity rarity);
    event AssetDefinitionUpdated(string assetType);
    event MarketplaceListingToggled(uint256 indexed tokenId, bool isListed);
    event AssetUsedInGame(address indexed player, uint256 indexed tokenId, uint256 gameId);
    
    constructor(
        address initialOwner,
        string memory baseURI
    ) ERC721("Whac-A-Mole Game Assets", "WAMGA") Ownable(initialOwner) {
        _baseTokenURI = baseURI;
        _initializeAssetDefinitions();
    }
    
    /**
     * @dev Initialize default asset definitions
     */
    function _initializeAssetDefinitions() internal {
        // Weapons
        _addAssetDefinition("GOLDEN_HAMMER", "Golden Hammer", AssetCategory.HAMMER, AssetRarity.LEGENDARY, 150, 120, 110, "golden_hammer.png", 0.05 ether, 100);
        _addAssetDefinition("SILVER_HAMMER", "Silver Hammer", AssetCategory.HAMMER, AssetRarity.EPIC, 120, 110, 100, "silver_hammer.png", 0.02 ether, 500);
        _addAssetDefinition("BRONZE_HAMMER", "Bronze Hammer", AssetCategory.HAMMER, AssetRarity.RARE, 110, 105, 100, "bronze_hammer.png", 0.01 ether, 1000);
        _addAssetDefinition("WOODEN_HAMMER", "Wooden Hammer", AssetCategory.HAMMER, AssetRarity.COMMON, 100, 100, 100, "wooden_hammer.png", 0.005 ether, 0);
        
        // Power-ups
        _addAssetDefinition("SPEED_BOOST", "Speed Boost Potion", AssetCategory.POWERUP, AssetRarity.UNCOMMON, 100, 150, 100, "speed_boost.png", 0.008 ether, 0);
        _addAssetDefinition("LUCK_CHARM", "Lucky Charm", AssetCategory.POWERUP, AssetRarity.RARE, 100, 100, 150, "luck_charm.png", 0.015 ether, 2000);
        _addAssetDefinition("DOUBLE_POINTS", "Double Points Multiplier", AssetCategory.POWERUP, AssetRarity.EPIC, 200, 100, 100, "double_points.png", 0.03 ether, 1000);
        _addAssetDefinition("TIME_FREEZE", "Time Freeze Crystal", AssetCategory.POWERUP, AssetRarity.LEGENDARY, 100, 100, 100, "time_freeze.png", 0.08 ether, 50);
        
        // Skins
        _addAssetDefinition("RAINBOW_MOLE", "Rainbow Mole Skin", AssetCategory.MOLE_SKIN, AssetRarity.MYTHIC, 100, 100, 100, "rainbow_mole.png", 0.1 ether, 10);
        _addAssetDefinition("CYBER_MOLE", "Cyber Mole Skin", AssetCategory.MOLE_SKIN, AssetRarity.LEGENDARY, 100, 100, 100, "cyber_mole.png", 0.04 ether, 200);
        _addAssetDefinition("PIRATE_MOLE", "Pirate Mole Skin", AssetCategory.MOLE_SKIN, AssetRarity.EPIC, 100, 100, 100, "pirate_mole.png", 0.02 ether, 500);
        
        // Backgrounds
        _addAssetDefinition("SPACE_BG", "Space Background", AssetCategory.BACKGROUND, AssetRarity.RARE, 100, 100, 100, "space_bg.png", 0.012 ether, 1500);
        _addAssetDefinition("UNDERWATER_BG", "Underwater Background", AssetCategory.BACKGROUND, AssetRarity.UNCOMMON, 100, 100, 100, "underwater_bg.png", 0.008 ether, 0);
        _addAssetDefinition("VOLCANO_BG", "Volcano Background", AssetCategory.BACKGROUND, AssetRarity.EPIC, 100, 100, 100, "volcano_bg.png", 0.025 ether, 800);
    }
    
    /**
     * @dev Add new asset definition (only owner)
     */
    function addAssetDefinition(
        string memory assetType,
        string memory name,
        AssetCategory category,
        AssetRarity rarity,
        uint256 power,
        uint256 speed,
        uint256 luck,
        string memory imageURI,
        uint256 mintPrice,
        uint256 maxSupply
    ) external onlyOwner {
        _addAssetDefinition(assetType, name, category, rarity, power, speed, luck, imageURI, mintPrice, maxSupply);
    }
    
    /**
     * @dev Internal function to add asset definition
     */
    function _addAssetDefinition(
        string memory assetType,
        string memory name,
        AssetCategory category,
        AssetRarity rarity,
        uint256 power,
        uint256 speed,
        uint256 luck,
        string memory imageURI,
        uint256 mintPrice,
        uint256 maxSupply
    ) internal {
        require(bytes(assetType).length > 0, "Asset type cannot be empty");
        require(!assetDefinitions[assetType].isActive, "Asset definition already exists");
        
        assetDefinitions[assetType] = AssetDefinition({
            name: name,
            description: "",
            category: category,
            rarity: rarity,
            power: power,
            speed: speed,
            luck: luck,
            imageURI: imageURI,
            mintPrice: mintPrice,
            maxSupply: maxSupply,
            isActive: true
        });
        
        emit AssetDefinitionAdded(assetType, category, rarity);
    }
    
    /**
     * @dev Set contract addresses (only owner)
     */
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }
    
    function setMarketplaceContract(address _marketplaceContract) external onlyOwner {
        marketplaceContract = _marketplaceContract;
    }
    
    /**
     * @dev Mint asset NFT (public with payment)
     */
    function mintAsset(
        string memory assetType,
        address to
    ) external payable nonReentrant returns (uint256) {
        AssetDefinition memory definition = assetDefinitions[assetType];
        require(definition.isActive, "Asset type not available");
        
        // Check supply limit
        if (definition.maxSupply > 0) {
            require(assetMintCount[assetType] < definition.maxSupply, "Max supply reached");
        }
        
        // Check payment
        uint256 totalCost = definition.mintPrice + mintingFee;
        require(msg.value >= totalCost, "Insufficient payment");
        
        uint256 tokenId = _nextTokenId++;
        
        // Create game asset
        gameAssets[tokenId] = GameAsset({
            name: definition.name,
            description: definition.description,
            category: definition.category,
            rarity: definition.rarity,
            power: definition.power,
            speed: definition.speed,
            luck: definition.luck,
            imageURI: definition.imageURI,
            isActive: true,
            createdAt: block.timestamp,
            creator: msg.sender
        });
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        // Update tracking
        assetMintCount[assetType]++;
        playerAssetsByCategory[to][definition.category].push(tokenId);
        
        // Set token URI
        string memory uri = _generateTokenURI(tokenId, assetType);
        _setTokenURI(tokenId, uri);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit AssetMinted(to, tokenId, assetType, definition.rarity);
        return tokenId;
    }
    
    /**
     * @dev Mint asset for free (only game contract or owner)
     */
    function mintAssetForFree(
        string memory assetType,
        address to
    ) external returns (uint256) {
        require(msg.sender == gameContract || msg.sender == owner(), "Not authorized");
        
        AssetDefinition memory definition = assetDefinitions[assetType];
        require(definition.isActive, "Asset type not available");
        
        // Check supply limit
        if (definition.maxSupply > 0) {
            require(assetMintCount[assetType] < definition.maxSupply, "Max supply reached");
        }
        
        uint256 tokenId = _nextTokenId++;
        
        // Create game asset
        gameAssets[tokenId] = GameAsset({
            name: definition.name,
            description: definition.description,
            category: definition.category,
            rarity: definition.rarity,
            power: definition.power,
            speed: definition.speed,
            luck: definition.luck,
            imageURI: definition.imageURI,
            isActive: true,
            createdAt: block.timestamp,
            creator: msg.sender
        });
        
        // Mint NFT
        _safeMint(to, tokenId);
        
        // Update tracking
        assetMintCount[assetType]++;
        playerAssetsByCategory[to][definition.category].push(tokenId);
        
        // Set token URI
        string memory uri = _generateTokenURI(tokenId, assetType);
        _setTokenURI(tokenId, uri);
        
        emit AssetMinted(to, tokenId, assetType, definition.rarity);
        return tokenId;
    }
    
    /**
     * @dev Generate token URI for asset
     */
    function _generateTokenURI(
        uint256 tokenId,
        string memory assetType
    ) internal view returns (string memory) {
        GameAsset memory asset = gameAssets[tokenId];
        
        // Create JSON metadata
        string memory json = string(abi.encodePacked(
            '{"name": "', asset.name, '",',
            '"description": "', asset.description, '",',
            '"image": "', _baseTokenURI, asset.imageURI, '",',
            '"attributes": [',
                '{"trait_type": "Category", "value": "', _getCategoryString(asset.category), '"},',
                '{"trait_type": "Rarity", "value": "', _getRarityString(asset.rarity), '"},',
                '{"trait_type": "Power", "value": ', asset.power.toString(), '},',
                '{"trait_type": "Speed", "value": ', asset.speed.toString(), '},',
                '{"trait_type": "Luck", "value": ', asset.luck.toString(), '},',
                '{"trait_type": "Asset Type", "value": "', assetType, '"},',
                '{"trait_type": "Created At", "value": ', asset.createdAt.toString(), '}',
            ']}'
        ));
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            _base64Encode(bytes(json))
        ));
    }
    
    /**
     * @dev Get category as string
     */
    function _getCategoryString(AssetCategory category) internal pure returns (string memory) {
        if (category == AssetCategory.WEAPON) return "Weapon";
        if (category == AssetCategory.SKIN) return "Skin";
        if (category == AssetCategory.POWERUP) return "Power-up";
        if (category == AssetCategory.BACKGROUND) return "Background";
        if (category == AssetCategory.MOLE_SKIN) return "Mole Skin";
        if (category == AssetCategory.HAMMER) return "Hammer";
        if (category == AssetCategory.SPECIAL) return "Special";
        return "Unknown";
    }
    
    /**
     * @dev Get rarity as string
     */
    function _getRarityString(AssetRarity rarity) internal pure returns (string memory) {
        if (rarity == AssetRarity.COMMON) return "Common";
        if (rarity == AssetRarity.UNCOMMON) return "Uncommon";
        if (rarity == AssetRarity.RARE) return "Rare";
        if (rarity == AssetRarity.EPIC) return "Epic";
        if (rarity == AssetRarity.LEGENDARY) return "Legendary";
        if (rarity == AssetRarity.MYTHIC) return "Mythic";
        return "Unknown";
    }
    
    /**
     * @dev Simple base64 encode placeholder
     */
    function _base64Encode(bytes memory /* data */) internal pure returns (string memory) {
        return "base64-encoded-data";
    }
    
    /**
     * @dev Toggle marketplace listing status
     */
    function toggleMarketplaceListing(uint256 tokenId, bool isListed) external {
        require(ownerOf(tokenId) == msg.sender || msg.sender == marketplaceContract, "Not authorized");
        isMarketplaceListed[tokenId] = isListed;
        emit MarketplaceListingToggled(tokenId, isListed);
    }
    
    /**
     * @dev Use asset in game (only game contract)
     */
    function useAssetInGame(address player, uint256 tokenId, uint256 gameId) external {
        require(msg.sender == gameContract, "Only game contract");
        require(ownerOf(tokenId) == player, "Player doesn't own asset");
        require(gameAssets[tokenId].isActive, "Asset not active");
        
        emit AssetUsedInGame(player, tokenId, gameId);
    }
    
    /**
     * @dev Get player's assets by category
     */
    function getPlayerAssetsByCategory(address player, AssetCategory category) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return playerAssetsByCategory[player][category];
    }
    
    /**
     * @dev Get all player's assets
     */
    function getPlayerAssets(address player) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(player);
        uint256[] memory assets = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            assets[i] = tokenOfOwnerByIndex(player, i);
        }
        
        return assets;
    }
    
    /**
     * @dev Get asset details
     */
    function getAssetDetails(uint256 tokenId) external view returns (GameAsset memory) {
        require(_ownerOf(tokenId) != address(0), "Asset does not exist");
        return gameAssets[tokenId];
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Set minting fee (only owner)
     */
    function setMintingFee(uint256 _fee) external onlyOwner {
        mintingFee = _fee;
    }
    
    /**
     * @dev Set base URI (only owner)
     */
    function setBaseURI(string memory _baseURI) external onlyOwner {
        _baseTokenURI = _baseURI;
    }
    
    /**
     * @dev Override required functions
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        override(ERC721, ERC721URIStorage, ERC721Enumerable) 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
    
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }
}