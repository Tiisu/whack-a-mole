import { useState, useCallback, useEffect } from 'react';
import { MarketplaceListing, GameAsset, UseMarketplaceReturn } from '../types';
import { useMarketplace } from './useMarketplace';
import { useMetaMaskSimulation } from './useMetaMaskSimulation';
import { 
  generateDummyAssets, 
  generateDummyListings, 
  generatePlayerDummyAssets 
} from '../services/dummyDataService';

interface UseEnhancedMarketplaceReturn extends UseMarketplaceReturn {
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  playerDemoAssets: GameAsset[];
  refreshDemoData: () => void;
  // MetaMask simulation
  metaMaskSimulation: ReturnType<typeof useMetaMaskSimulation>;
}

export const useEnhancedMarketplace = (account: string | null): UseEnhancedMarketplaceReturn => {
  const originalMarketplace = useMarketplace(account);
  const metaMaskSimulation = useMetaMaskSimulation();
  const [demoMode, setDemoMode] = useState(false);
  const [demoListings, setDemoListings] = useState<MarketplaceListing[]>([]);
  const [playerDemoAssets, setPlayerDemoAssets] = useState<GameAsset[]>([]);

  // Initialize demo data
  const refreshDemoData = useCallback(() => {
    const dummyAssets = generateDummyAssets(20);
    const dummyListings = generateDummyListings(dummyAssets);
    const playerAssets = generatePlayerDummyAssets(8);
    
    setDemoListings(dummyListings);
    setPlayerDemoAssets(playerAssets);
  }, []);

  // Initialize demo data on mount
  useEffect(() => {
    refreshDemoData();
  }, [refreshDemoData]);

  // Enhanced getActiveListings that can use demo data
  const getActiveListings = useCallback(async (offset: number = 0, limit: number = 50): Promise<void> => {
    if (demoMode) {
      // Use demo data
      console.log('Using demo marketplace data');
      return Promise.resolve();
    } else {
      // Use real blockchain data
      return originalMarketplace.getActiveListings(offset, limit);
    }
  }, [demoMode, originalMarketplace.getActiveListings]);

  // Enhanced buy function with demo support
  const buyNFT = useCallback(async (listingId: number, price: number): Promise<void> => {
    if (demoMode) {
      // Find the listing to get asset name
      const listing = demoListings.find(l => l.listingId === listingId);
      const assetName = listing?.asset?.name || 'NFT Asset';
      
      // Show MetaMask simulation
      return new Promise<void>((resolve, reject) => {
        metaMaskSimulation.simulateBuy(
          assetName,
          price,
          () => {
            // On success: complete the purchase
            console.log('Demo: Buying NFT', { listingId, price });
            
            // Remove the listing from demo data
            setDemoListings(prev => prev.filter(listing => listing.listingId !== listingId));
            
            // Add the asset to player's demo assets
            const boughtListing = demoListings.find(listing => listing.listingId === listingId);
            if (boughtListing && boughtListing.asset) {
              setPlayerDemoAssets(prev => [...prev, boughtListing.asset!]);
            }
            
            resolve();
          },
          (error) => {
            // On error: reject the promise
            reject(new Error(error));
          }
        );
      });
    } else {
      return originalMarketplace.buyNFT(listingId, price);
    }
  }, [demoMode, originalMarketplace.buyNFT, demoListings, metaMaskSimulation]);

  // Enhanced listing function with demo support
  const listNFTForSale = useCallback(async (tokenId: number, price: number): Promise<void> => {
    if (demoMode) {
      // Find the asset in player's demo assets
      const asset = playerDemoAssets.find(a => a.tokenId === tokenId);
      const assetName = asset?.name || 'NFT Asset';
      
      // Show MetaMask simulation
      return new Promise<void>((resolve, reject) => {
        metaMaskSimulation.simulateList(
          assetName,
          price,
          () => {
            // On success: create the listing
            console.log('Demo: Listing NFT for sale', { tokenId, price });
            
            if (asset) {
              // Create new demo listing
              const newListing: MarketplaceListing = {
                listingId: demoListings.length + 1,
                seller: account || '0x0000000000000000000000000000000000000000',
                nftContract: '0x0000000000000000000000000000000000000000',
                tokenId: tokenId,
                listingType: 'FIXED_PRICE',
                price: price,
                startTime: Date.now(),
                endTime: 0,
                status: 'ACTIVE',
                isActive: true,
                asset: asset
              };
              
              setDemoListings(prev => [...prev, newListing]);
              // Remove from player assets
              setPlayerDemoAssets(prev => prev.filter(a => a.tokenId !== tokenId));
            }
            
            resolve();
          },
          (error) => {
            reject(new Error(error));
          }
        );
      });
    } else {
      return originalMarketplace.listNFTForSale(tokenId, price);
    }
  }, [demoMode, originalMarketplace.listNFTForSale, playerDemoAssets, demoListings, account, metaMaskSimulation]);

  // Enhanced auction listing with demo support
  const listNFTForAuction = useCallback(async (
    tokenId: number, 
    startingBid: number, 
    bidIncrement: number, 
    duration: number
  ): Promise<void> => {
    if (demoMode) {
      console.log('Demo: Listing NFT for auction', { tokenId, startingBid, bidIncrement, duration });
      
      const asset = playerDemoAssets.find(a => a.tokenId === tokenId);
      if (asset) {
        const newListing: MarketplaceListing = {
          listingId: demoListings.length + 1,
          seller: account || '0x0000000000000000000000000000000000000000',
          nftContract: '0x0000000000000000000000000000000000000000',
          tokenId: tokenId,
          listingType: 'AUCTION',
          price: startingBid,
          startTime: Date.now(),
          endTime: Date.now() + duration * 1000,
          status: 'ACTIVE',
          isActive: true,
          currentBid: startingBid,
          currentBidder: null,
          asset: asset
        };
        
        setDemoListings(prev => [...prev, newListing]);
        setPlayerDemoAssets(prev => prev.filter(a => a.tokenId !== tokenId));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } else {
      return originalMarketplace.listNFTForAuction(tokenId, startingBid, bidIncrement, duration);
    }
  }, [demoMode, originalMarketplace.listNFTForAuction, playerDemoAssets, demoListings, account]);

  // Enhanced bid placing with demo support
  const placeBid = useCallback(async (listingId: number, bidAmount: number): Promise<void> => {
    if (demoMode) {
      console.log('Demo: Placing bid', { listingId, bidAmount });
      
      // Update the listing with new bid
      setDemoListings(prev => prev.map(listing => 
        listing.listingId === listingId 
          ? { 
              ...listing, 
              currentBid: bidAmount,
              currentBidder: account || '0x0000000000000000000000000000000000000000'
            }
          : listing
      ));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } else {
      return originalMarketplace.placeBid(listingId, bidAmount);
    }
  }, [demoMode, originalMarketplace.placeBid, account]);

  // Enhanced cancel listing with demo support
  const cancelListing = useCallback(async (listingId: number): Promise<void> => {
    if (demoMode) {
      console.log('Demo: Cancelling listing', { listingId });
      
      // Find the listing and return asset to player
      const listing = demoListings.find(l => l.listingId === listingId);
      if (listing && listing.asset && listing.seller === account) {
        setPlayerDemoAssets(prev => [...prev, listing.asset!]);
        setDemoListings(prev => prev.filter(l => l.listingId !== listingId));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return Promise.resolve();
    } else {
      return originalMarketplace.cancelListing(listingId);
    }
  }, [demoMode, originalMarketplace.cancelListing, demoListings, account]);

  // Return appropriate data based on mode
  const listings = demoMode ? demoListings : originalMarketplace.listings;
  const isLoading = demoMode ? false : originalMarketplace.isLoading;
  const error = demoMode ? null : originalMarketplace.error;

  return {
    ...originalMarketplace,
    listings,
    isLoading,
    error,
    getActiveListings,
    buyNFT,
    listNFTForSale,
    listNFTForAuction,
    placeBid,
    cancelListing,
    demoMode,
    setDemoMode,
    playerDemoAssets,
    refreshDemoData,
    metaMaskSimulation
  };
};