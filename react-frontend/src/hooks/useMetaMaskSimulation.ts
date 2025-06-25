// Hook for managing MetaMask simulation in demo mode
import { useState, useCallback } from 'react';

export interface MetaMaskTransaction {
  type: 'buy' | 'sell' | 'mint' | 'bid' | 'approve' | 'list';
  assetName: string;
  price: number;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export const useMetaMaskSimulation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<MetaMaskTransaction | null>(null);

  const showMetaMaskPopup = useCallback((transaction: MetaMaskTransaction) => {
    setCurrentTransaction(transaction);
    setIsVisible(true);
  }, []);

  const hideMetaMaskPopup = useCallback(() => {
    setIsVisible(false);
    setCurrentTransaction(null);
  }, []);

  const confirmTransaction = useCallback(() => {
    if (currentTransaction) {
      currentTransaction.onSuccess();
    }
    hideMetaMaskPopup();
  }, [currentTransaction, hideMetaMaskPopup]);

  const rejectTransaction = useCallback(() => {
    if (currentTransaction?.onError) {
      currentTransaction.onError('User rejected transaction');
    }
    hideMetaMaskPopup();
  }, [currentTransaction, hideMetaMaskPopup]);

  // Convenience methods for different transaction types
  const simulateBuy = useCallback((assetName: string, price: number, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'buy',
      assetName,
      price,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  const simulateSell = useCallback((assetName: string, price: number, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'sell',
      assetName,
      price,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  const simulateMint = useCallback((assetName: string, price: number, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'mint',
      assetName,
      price,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  const simulateBid = useCallback((assetName: string, bidAmount: number, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'bid',
      assetName,
      price: bidAmount,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  const simulateApprove = useCallback((assetName: string, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'approve',
      assetName,
      price: 0,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  const simulateList = useCallback((assetName: string, price: number, onSuccess: () => void, onError?: (error: string) => void) => {
    showMetaMaskPopup({
      type: 'list',
      assetName,
      price,
      onSuccess,
      onError
    });
  }, [showMetaMaskPopup]);

  return {
    isVisible,
    currentTransaction,
    showMetaMaskPopup,
    hideMetaMaskPopup,
    confirmTransaction,
    rejectTransaction,
    // Convenience methods
    simulateBuy,
    simulateSell,
    simulateMint,
    simulateBid,
    simulateApprove,
    simulateList
  };
};