// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NFTMarketplace
 * @dev Marketplace for buying, selling, and trading NFTs
 */
contract NFTMarketplace is IERC721Receiver, Ownable, ReentrancyGuard, Pausable {
    
    // Listing types
    enum ListingType { FIXED_PRICE, AUCTION, TRADE_OFFER }
    enum ListingStatus { ACTIVE, SOLD, CANCELLED, EXPIRED }
    
    struct Listing {
        uint256 listingId;
        address seller;
        address nftContract;
        uint256 tokenId;
        ListingType listingType;
        uint256 price; // For fixed price listings
        uint256 startTime;
        uint256 endTime; // For auctions
        ListingStatus status;
        bool isActive;
    }
    
    struct Auction {
        uint256 listingId;
        uint256 startingBid;
        uint256 currentBid;
        address currentBidder;
        uint256 bidIncrement;
        mapping(address => uint256) bids; // Track all bids for refunds
        address[] bidders; // Array of bidders for refunds
    }
    
    struct TradeOffer {
        uint256 listingId;
        address[] wantedNftContracts;
        uint256[] wantedTokenIds;
        address[] offeredNftContracts;
        uint256[] offeredTokenIds;
        address offerer;
        bool isAccepted;
    }
    
    // State variables
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => TradeOffer) public tradeOffers;
    mapping(uint256 => uint256[]) public listingTradeOffers; // listingId => tradeOfferIds
    
    uint256 public nextListingId = 1;
    uint256 public nextTradeOfferId = 1;
    uint256 public marketplaceFee = 250; // 2.5% in basis points
    uint256 public constant MAX_FEE = 1000; // 10% maximum fee
    
    // Supported NFT contracts
    mapping(address => bool) public supportedNftContracts;
    
    // Events
    event ItemListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        ListingType listingType,
        uint256 price
    );
    
    event ItemSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    
    event ListingCancelled(uint256 indexed listingId);
    
    event BidPlaced(
        uint256 indexed listingId,
        address indexed bidder,
        uint256 bidAmount
    );
    
    event AuctionEnded(
        uint256 indexed listingId,
        address indexed winner,
        uint256 winningBid
    );
    
    event TradeOfferCreated(
        uint256 indexed tradeOfferId,
        uint256 indexed listingId,
        address indexed offerer
    );
    
    event TradeOfferAccepted(
        uint256 indexed tradeOfferId,
        uint256 indexed listingId
    );
    
    event TradeOfferRejected(
        uint256 indexed tradeOfferId,
        uint256 indexed listingId
    );
    
    constructor(address initialOwner) Ownable(initialOwner) {}
    
    /**
     * @dev Add supported NFT contract
     */
    function addSupportedNftContract(address nftContract) external onlyOwner {
        supportedNftContracts[nftContract] = true;
    }
    
    /**
     * @dev Remove supported NFT contract
     */
    function removeSupportedNftContract(address nftContract) external onlyOwner {
        supportedNftContracts[nftContract] = false;
    }
    
    /**
     * @dev List NFT for fixed price sale
     */
    function listForSale(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(supportedNftContracts[nftContract], "NFT contract not supported");
        require(price > 0, "Price must be greater than 0");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.isApprovedForAll(msg.sender, address(this)) || 
                nft.getApproved(tokenId) == address(this), "Marketplace not approved");
        
        uint256 listingId = nextListingId++;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            listingType: ListingType.FIXED_PRICE,
            price: price,
            startTime: block.timestamp,
            endTime: 0,
            status: ListingStatus.ACTIVE,
            isActive: true
        });
        
        // Transfer NFT to marketplace
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit ItemListed(listingId, msg.sender, nftContract, tokenId, ListingType.FIXED_PRICE, price);
        return listingId;
    }
    
    /**
     * @dev List NFT for auction
     */
    function listForAuction(
        address nftContract,
        uint256 tokenId,
        uint256 startingBid,
        uint256 bidIncrement,
        uint256 duration
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(supportedNftContracts[nftContract], "NFT contract not supported");
        require(startingBid > 0, "Starting bid must be greater than 0");
        require(duration >= 1 hours && duration <= 30 days, "Invalid auction duration");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.isApprovedForAll(msg.sender, address(this)) || 
                nft.getApproved(tokenId) == address(this), "Marketplace not approved");
        
        uint256 listingId = nextListingId++;
        uint256 endTime = block.timestamp + duration;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            listingType: ListingType.AUCTION,
            price: startingBid,
            startTime: block.timestamp,
            endTime: endTime,
            status: ListingStatus.ACTIVE,
            isActive: true
        });
        
        auctions[listingId].listingId = listingId;
        auctions[listingId].startingBid = startingBid;
        auctions[listingId].currentBid = 0;
        auctions[listingId].bidIncrement = bidIncrement;
        
        // Transfer NFT to marketplace
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit ItemListed(listingId, msg.sender, nftContract, tokenId, ListingType.AUCTION, startingBid);
        return listingId;
    }
    
    /**
     * @dev List NFT for trade
     */
    function listForTrade(
        address nftContract,
        uint256 tokenId,
        address[] memory wantedNftContracts,
        uint256[] memory wantedTokenIds
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(supportedNftContracts[nftContract], "NFT contract not supported");
        require(wantedNftContracts.length == wantedTokenIds.length, "Arrays length mismatch");
        require(wantedNftContracts.length > 0, "Must specify wanted NFTs");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.isApprovedForAll(msg.sender, address(this)) || 
                nft.getApproved(tokenId) == address(this), "Marketplace not approved");
        
        uint256 listingId = nextListingId++;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            listingType: ListingType.TRADE_OFFER,
            price: 0,
            startTime: block.timestamp,
            endTime: 0,
            status: ListingStatus.ACTIVE,
            isActive: true
        });
        
        // Transfer NFT to marketplace
        nft.safeTransferFrom(msg.sender, address(this), tokenId);
        
        emit ItemListed(listingId, msg.sender, nftContract, tokenId, ListingType.TRADE_OFFER, 0);
        return listingId;
    }
    
    /**
     * @dev Buy NFT at fixed price
     */
    function buyNow(uint256 listingId) external payable whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.listingType == ListingType.FIXED_PRICE, "Not a fixed price listing");
        require(listing.status == ListingStatus.ACTIVE, "Listing not available");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFee) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Update listing status
        listing.status = ListingStatus.SOLD;
        listing.isActive = false;
        
        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);
        
        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);
        
        // Refund excess payment
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit ItemSold(listingId, msg.sender, listing.seller, listing.price);
    }
    
    /**
     * @dev Place bid on auction
     */
    function placeBid(uint256 listingId) external payable whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        Auction storage auction = auctions[listingId];
        
        require(listing.isActive, "Listing not active");
        require(listing.listingType == ListingType.AUCTION, "Not an auction");
        require(listing.status == ListingStatus.ACTIVE, "Auction not active");
        require(block.timestamp < listing.endTime, "Auction ended");
        require(msg.sender != listing.seller, "Seller cannot bid");
        
        uint256 minBid = auction.currentBid == 0 ? 
            auction.startingBid : 
            auction.currentBid + auction.bidIncrement;
        
        require(msg.value >= minBid, "Bid too low");
        
        // Refund previous bidder
        if (auction.currentBidder != address(0)) {
            payable(auction.currentBidder).transfer(auction.currentBid);
        }
        
        // Update auction state
        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;
        
        // Track bid for potential refunds
        if (auction.bids[msg.sender] == 0) {
            auction.bidders.push(msg.sender);
        }
        auction.bids[msg.sender] = msg.value;
        
        emit BidPlaced(listingId, msg.sender, msg.value);
    }
    
    /**
     * @dev End auction (can be called by anyone after auction ends)
     */
    function endAuction(uint256 listingId) external whenNotPaused nonReentrant {
        Listing storage listing = listings[listingId];
        Auction storage auction = auctions[listingId];
        
        require(listing.listingType == ListingType.AUCTION, "Not an auction");
        require(listing.status == ListingStatus.ACTIVE, "Auction not active");
        require(block.timestamp >= listing.endTime, "Auction still ongoing");
        
        listing.status = ListingStatus.SOLD;
        listing.isActive = false;
        
        if (auction.currentBidder != address(0)) {
            // Calculate fees
            uint256 fee = (auction.currentBid * marketplaceFee) / 10000;
            uint256 sellerAmount = auction.currentBid - fee;
            
            // Transfer NFT to winner
            IERC721(listing.nftContract).safeTransferFrom(address(this), auction.currentBidder, listing.tokenId);
            
            // Transfer payment to seller
            payable(listing.seller).transfer(sellerAmount);
            
            emit AuctionEnded(listingId, auction.currentBidder, auction.currentBid);
        } else {
            // No bids, return NFT to seller
            IERC721(listing.nftContract).safeTransferFrom(address(this), listing.seller, listing.tokenId);
            listing.status = ListingStatus.EXPIRED;
        }
    }
    
    /**
     * @dev Create trade offer
     */
    function createTradeOffer(
        uint256 listingId,
        address[] memory offeredNftContracts,
        uint256[] memory offeredTokenIds
    ) external whenNotPaused nonReentrant returns (uint256) {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.listingType == ListingType.TRADE_OFFER, "Not a trade listing");
        require(listing.status == ListingStatus.ACTIVE, "Listing not available");
        require(offeredNftContracts.length == offeredTokenIds.length, "Arrays length mismatch");
        require(offeredNftContracts.length > 0, "Must offer NFTs");
        require(msg.sender != listing.seller, "Cannot trade with yourself");
        
        // Verify ownership and approvals
        for (uint256 i = 0; i < offeredNftContracts.length; i++) {
            IERC721 nft = IERC721(offeredNftContracts[i]);
            require(nft.ownerOf(offeredTokenIds[i]) == msg.sender, "Not owner of offered NFT");
            require(nft.isApprovedForAll(msg.sender, address(this)) || 
                    nft.getApproved(offeredTokenIds[i]) == address(this), "NFT not approved");
        }
        
        uint256 tradeOfferId = nextTradeOfferId++;
        
        tradeOffers[tradeOfferId] = TradeOffer({
            listingId: listingId,
            wantedNftContracts: new address[](0),
            wantedTokenIds: new uint256[](0),
            offeredNftContracts: offeredNftContracts,
            offeredTokenIds: offeredTokenIds,
            offerer: msg.sender,
            isAccepted: false
        });
        
        listingTradeOffers[listingId].push(tradeOfferId);
        
        emit TradeOfferCreated(tradeOfferId, listingId, msg.sender);
        return tradeOfferId;
    }
    
    /**
     * @dev Accept trade offer
     */
    function acceptTradeOffer(uint256 tradeOfferId) external whenNotPaused nonReentrant {
        TradeOffer storage tradeOffer = tradeOffers[tradeOfferId];
        Listing storage listing = listings[tradeOffer.listingId];
        
        require(listing.seller == msg.sender, "Only seller can accept");
        require(listing.isActive, "Listing not active");
        require(!tradeOffer.isAccepted, "Trade already accepted");
        
        // Transfer offered NFTs to seller
        for (uint256 i = 0; i < tradeOffer.offeredNftContracts.length; i++) {
            IERC721(tradeOffer.offeredNftContracts[i]).safeTransferFrom(
                tradeOffer.offerer,
                msg.sender,
                tradeOffer.offeredTokenIds[i]
            );
        }
        
        // Transfer listed NFT to offerer
        IERC721(listing.nftContract).safeTransferFrom(address(this), tradeOffer.offerer, listing.tokenId);
        
        // Update states
        tradeOffer.isAccepted = true;
        listing.status = ListingStatus.SOLD;
        listing.isActive = false;
        
        emit TradeOfferAccepted(tradeOfferId, tradeOffer.listingId);
    }
    
    /**
     * @dev Cancel listing
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Only seller can cancel");
        require(listing.isActive, "Listing not active");
        
        if (listing.listingType == ListingType.AUCTION) {
            Auction storage auction = auctions[listingId];
            require(auction.currentBidder == address(0), "Cannot cancel auction with bids");
        }
        
        listing.status = ListingStatus.CANCELLED;
        listing.isActive = false;
        
        // Return NFT to seller
        IERC721(listing.nftContract).safeTransferFrom(address(this), listing.seller, listing.tokenId);
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Get active listings
     */
    function getActiveListings(uint256 offset, uint256 limit) 
        external 
        view 
        returns (Listing[] memory) 
    {
        uint256 activeCount = 0;
        
        // Count active listings
        for (uint256 i = 1; i < nextListingId; i++) {
            if (listings[i].isActive) {
                activeCount++;
            }
        }
        
        // Calculate actual limit
        uint256 actualLimit = limit;
        if (offset >= activeCount) {
            return new Listing[](0);
        }
        if (offset + limit > activeCount) {
            actualLimit = activeCount - offset;
        }
        
        Listing[] memory result = new Listing[](actualLimit);
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;
        
        for (uint256 i = 1; i < nextListingId && resultIndex < actualLimit; i++) {
            if (listings[i].isActive) {
                if (currentIndex >= offset) {
                    result[resultIndex] = listings[i];
                    resultIndex++;
                }
                currentIndex++;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get trade offers for listing
     */
    function getTradeOffers(uint256 listingId) external view returns (uint256[] memory) {
        return listingTradeOffers[listingId];
    }
    
    /**
     * @dev Set marketplace fee (only owner)
     */
    function setMarketplaceFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_FEE, "Fee too high");
        marketplaceFee = _fee;
    }
    
    /**
     * @dev Withdraw marketplace fees (only owner)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Pause marketplace (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause marketplace (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Handle NFT transfers
     */
    function onERC721Received(
        address /* operator */,
        address /* from */,
        uint256 /* tokenId */,
        bytes calldata /* data */
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}