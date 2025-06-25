import { useState, useCallback, useMemo } from 'react';
import { ethers } from 'ethers';
import { MarketplaceListing, UseMarketplaceReturn, ListingType, ListingStatus } from '../types';
import { 
  getCurrentContractAddresses, 
  ERROR_MESSAGES,
  isMetaMaskInstalled 
} from '../config/web3Config';

// Marketplace contract ABI
const MARKETPLACE_ABI = [
  // Listing functions
  "function listForSale(address nftContract, uint256 tokenId, uint256 price) external returns (uint256)",
  "function listForAuction(address nftContract, uint256 tokenId, uint256 startingBid, uint256 bidIncrement, uint256 duration) external returns (uint256)",
  "function listForTrade(address nftContract, uint256 tokenId, address[] memory wantedNftContracts, uint256[] memory wantedTokenIds) external returns (uint256)",
  
  // Buying/bidding functions
  "function buyNow(uint256 listingId) external payable",
  "function placeBid(uint256 listingId) external payable",
  "function endAuction(uint256 listingId) external",
  
  // Trading functions
  "function createTradeOffer(uint256 listingId, address[] memory offeredNftContracts, uint256[] memory offeredTokenIds) external returns (uint256)",
  "function acceptTradeOffer(uint256 tradeOfferId) external",
  
  // Management functions
  "function cancelListing(uint256 listingId) external",
  "function getActiveListings(uint256 offset, uint256 limit) external view returns (tuple(uint256 listingId, address seller, address nftContract, uint256 tokenId, uint8 listingType, uint256 price, uint256 startTime, uint256 endTime, uint8 status, bool isActive)[])",
  "function getTradeOffers(uint256 listingId) external view returns (uint256[])",
  
  // View functions
  "function listings(uint256 listingId) external view returns (tuple(uint256 listingId, address seller, address nftContract, uint256 tokenId, uint8 listingType, uint256 price, uint256 startTime, uint256 endTime, uint8 status, bool isActive))",
  "function auctions(uint256 listingId) external view returns (tuple(uint256 listingId, uint256 startingBid, uint256 currentBid, address currentBidder, uint256 bidIncrement))",
  "function tradeOffers(uint256 tradeOfferId) external view returns (tuple(uint256 listingId, address[] wantedNftContracts, uint256[] wantedTokenIds, address[] offeredNftContracts, uint256[] offeredTokenIds, address offerer, bool isAccepted))",
  
  // Configuration
  "function marketplaceFee() external view returns (uint256)",
  "function supportedNftContracts(address) external view returns (bool)",
  
  // Events
  "event ItemListed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint8 listingType, uint256 price)",
  "event ItemSold(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price)",
  "event BidPlaced(uint256 indexed listingId, address indexed bidder, uint256 bidAmount)",
  "event TradeOfferCreated(uint256 indexed tradeOfferId, uint256 indexed listingId, address indexed offerer)",
  "event TradeOfferAccepted(uint256 indexed tradeOfferId, uint256 indexed listingId)"
];

export const useMarketplace = (account: string | null): UseMarketplaceReturn => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get marketplace contract instance
  const marketplaceContract = useMemo(() => {
    if (!account || !isMetaMaskInstalled()) {
      console.log('Marketplace contract not available: account or MetaMask not available');
      return null;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const addresses = getCurrentContractAddresses();

      if (!addresses.MARKETPLACE_CONTRACT || addresses.MARKETPLACE_CONTRACT === '') {
        console.warn('Marketplace contract address not configured');
        return null;
      }

      console.log('Creating marketplace contract instance:', {
        address: addresses.MARKETPLACE_CONTRACT,
        account: account
      });

      const contract = new ethers.Contract(
        addresses.MARKETPLACE_CONTRACT,
        MARKETPLACE_ABI,
        signer
      );

      console.log('Marketplace contract instance created successfully');
      return contract;
    } catch (err) {
      console.error('Failed to create marketplace contract instance:', err);
      setError(`Failed to initialize marketplace contract: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    }
  }, [account]);

  // Get active listings
  const getActiveListings = useCallback(async (offset: number = 0, limit: number = 50): Promise<void> => {
    if (!marketplaceContract) {
      console.log('Marketplace contract not available for getting listings');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching active listings...');
      const result = await marketplaceContract.getActiveListings(offset, limit);
      
      // Convert the result to our MarketplaceListing type
      const formattedListings: MarketplaceListing[] = result.map((listing: any) => ({
        listingId: listing.listingId.toNumber(),
        seller: listing.seller,
        nftContract: listing.nftContract,
        tokenId: listing.tokenId.toNumber(),
        listingType: Object.values(ListingType)[listing.listingType] as ListingType,
        price: parseFloat(ethers.utils.formatEther(listing.price)),
        startTime: listing.startTime.toNumber(),
        endTime: listing.endTime.toNumber(),
        status: Object.values(ListingStatus)[listing.status] as ListingStatus,
        isActive: listing.isActive,
        currentBid: 0, // Will be fetched separately for auctions
        currentBidder: null,
        asset: null // Will be fetched separately
      }));

      setListings(formattedListings);
      console.log('Active listings fetched:', formattedListings.length);
    } catch (err) {
      console.error('Failed to fetch active listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract]);

  // List NFT for fixed price sale
  const listNFTForSale = useCallback(async (tokenId: number, price: number): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Listing NFT for sale:', { tokenId, price });
      
      const addresses = getCurrentContractAddresses();
      const priceInWei = ethers.utils.parseEther(price.toString());
      
      const tx = await marketplaceContract.listForSale(
        addresses.GAME_ASSET_NFT_CONTRACT, // Assuming we're listing game assets
        tokenId,
        priceInWei
      );

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('NFT listed for sale successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to list NFT for sale:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to list NFT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // List NFT for auction
  const listNFTForAuction = useCallback(async (
    tokenId: number, 
    startingBid: number, 
    bidIncrement: number, 
    duration: number
  ): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Listing NFT for auction:', { tokenId, startingBid, bidIncrement, duration });
      
      const addresses = getCurrentContractAddresses();
      const startingBidInWei = ethers.utils.parseEther(startingBid.toString());
      const bidIncrementInWei = ethers.utils.parseEther(bidIncrement.toString());
      
      const tx = await marketplaceContract.listForAuction(
        addresses.GAME_ASSET_NFT_CONTRACT,
        tokenId,
        startingBidInWei,
        bidIncrementInWei,
        duration
      );

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('NFT listed for auction successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to list NFT for auction:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to list NFT for auction';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // List NFT for trade
  const listNFTForTrade = useCallback(async (
    tokenId: number,
    wantedNftContracts: string[],
    wantedTokenIds: number[]
  ): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Listing NFT for trade:', { tokenId, wantedNftContracts, wantedTokenIds });
      
      const addresses = getCurrentContractAddresses();
      
      const tx = await marketplaceContract.listForTrade(
        addresses.GAME_ASSET_NFT_CONTRACT,
        tokenId,
        wantedNftContracts,
        wantedTokenIds
      );

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('NFT listed for trade successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to list NFT for trade:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to list NFT for trade';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // Buy NFT
  const buyNFT = useCallback(async (listingId: number, price: number): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Buying NFT:', { listingId, price });
      
      const priceInWei = ethers.utils.parseEther(price.toString());
      
      const tx = await marketplaceContract.buyNow(listingId, {
        value: priceInWei
      });

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('NFT purchased successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to buy NFT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy NFT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // Place bid on auction
  const placeBid = useCallback(async (listingId: number, bidAmount: number): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Placing bid:', { listingId, bidAmount });
      
      const bidInWei = ethers.utils.parseEther(bidAmount.toString());
      
      const tx = await marketplaceContract.placeBid(listingId, {
        value: bidInWei
      });

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Bid placed successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to place bid:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // Cancel listing
  const cancelListing = useCallback(async (listingId: number): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Cancelling listing:', listingId);
      
      const tx = await marketplaceContract.cancelListing(listingId);

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Listing cancelled successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to cancel listing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel listing';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  // Create trade offer
  const createTradeOffer = useCallback(async (
    listingId: number,
    offeredNftContracts: string[],
    offeredTokenIds: number[]
  ): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating trade offer:', { listingId, offeredNftContracts, offeredTokenIds });
      
      const tx = await marketplaceContract.createTradeOffer(
        listingId,
        offeredNftContracts,
        offeredTokenIds
      );

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Trade offer created successfully');
    } catch (err) {
      console.error('Failed to create trade offer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create trade offer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account]);

  // Accept trade offer
  const acceptTradeOffer = useCallback(async (tradeOfferId: number): Promise<void> => {
    if (!marketplaceContract || !account) {
      throw new Error('Marketplace contract or account not available');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Accepting trade offer:', tradeOfferId);
      
      const tx = await marketplaceContract.acceptTradeOffer(tradeOfferId);

      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Trade offer accepted successfully');

      // Refresh listings
      await getActiveListings();
    } catch (err) {
      console.error('Failed to accept trade offer:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept trade offer';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [marketplaceContract, account, getActiveListings]);

  return {
    listings,
    isLoading,
    error,
    getActiveListings,
    listNFTForSale,
    listNFTForAuction,
    listNFTForTrade,
    buyNFT,
    placeBid,
    cancelListing,
    createTradeOffer,
    acceptTradeOffer
  };
};