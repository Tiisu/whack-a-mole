// MetaMask Popup Simulation for Demo Mode
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/MetaMaskSimulation.css';

interface MetaMaskSimulationProps {
  isVisible: boolean;
  transactionType: 'buy' | 'sell' | 'mint' | 'bid' | 'approve' | 'list';
  assetName?: string;
  price?: number;
  onConfirm: () => void;
  onReject: () => void;
  autoConfirm?: boolean;
  autoConfirmDelay?: number;
}

interface TransactionDetails {
  title: string;
  description: string;
  gasEstimate: string;
  totalCost: string;
  icon: string;
}

export const MetaMaskSimulation: React.FC<MetaMaskSimulationProps> = ({
  isVisible,
  transactionType,
  assetName = 'NFT Asset',
  price = 0,
  onConfirm,
  onReject,
  autoConfirm = false,
  autoConfirmDelay = 3000
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [countdown, setCountdown] = useState(autoConfirmDelay / 1000);

  // Auto-confirm functionality for demo
  useEffect(() => {
    if (isVisible && autoConfirm && step === 'confirm') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, autoConfirm, step]);

  // Reset state when popup becomes visible
  useEffect(() => {
    if (isVisible) {
      setStep('confirm');
      setCountdown(autoConfirmDelay / 1000);
    }
  }, [isVisible, autoConfirmDelay]);

  const getTransactionDetails = (): TransactionDetails => {
    const gasEstimate = '0.0023 APE (~$0.02)';
    
    switch (transactionType) {
      case 'buy':
        return {
          title: 'Confirm Purchase',
          description: `Buy ${assetName} for ${price} APE`,
          gasEstimate,
          totalCost: `${(price + 0.0023).toFixed(4)} APE`,
          icon: '🛒'
        };
      case 'sell':
        return {
          title: 'List for Sale',
          description: `List ${assetName} for ${price} APE`,
          gasEstimate,
          totalCost: gasEstimate,
          icon: '💰'
        };
      case 'mint':
        return {
          title: 'Mint NFT',
          description: `Mint ${assetName}`,
          gasEstimate,
          totalCost: `${(price + 0.0023).toFixed(4)} APE`,
          icon: '⚡'
        };
      case 'bid':
        return {
          title: 'Place Bid',
          description: `Bid ${price} APE on ${assetName}`,
          gasEstimate,
          totalCost: `${(price + 0.0023).toFixed(4)} APE`,
          icon: '🏆'
        };
      case 'approve':
        return {
          title: 'Approve NFT',
          description: `Approve marketplace to transfer ${assetName}`,
          gasEstimate,
          totalCost: gasEstimate,
          icon: '✅'
        };
      case 'list':
        return {
          title: 'Create Listing',
          description: `List ${assetName} on marketplace`,
          gasEstimate,
          totalCost: gasEstimate,
          icon: '📋'
        };
      default:
        return {
          title: 'Confirm Transaction',
          description: 'Confirm this transaction',
          gasEstimate,
          totalCost: gasEstimate,
          icon: '🔄'
        };
    }
  };

  const handleConfirm = () => {
    setStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConfirm();
      }, 1500);
    }, 2000);
  };

  const handleReject = () => {
    onReject();
  };

  const details = getTransactionDetails();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="metamask-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && handleReject()}
      >
        <motion.div
          className="metamask-popup"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="metamask-header">
            <div className="metamask-logo">
              <img src="/metamask-fox.svg" alt="MetaMask" className="metamask-icon" />
              <span>MetaMask</span>
            </div>
            <button className="metamask-close" onClick={handleReject}>×</button>
          </div>

          {/* Content based on step */}
          {step === 'confirm' && (
            <div className="metamask-content">
              <div className="transaction-header">
                <div className="transaction-icon">{details.icon}</div>
                <h3>{details.title}</h3>
                <p className="transaction-description">{details.description}</p>
              </div>

              <div className="transaction-details">
                <div className="detail-row">
                  <span>From:</span>
                  <span className="address">0x742d...C2e3</span>
                </div>
                <div className="detail-row">
                  <span>To:</span>
                  <span className="address">0x1234...5678</span>
                </div>
                <div className="detail-row">
                  <span>Network:</span>
                  <span>ApeChain Testnet</span>
                </div>
              </div>

              <div className="gas-section">
                <div className="gas-header">
                  <span>Gas (estimated)</span>
                  <span className="gas-edit">Edit</span>
                </div>
                <div className="gas-details">
                  <div className="gas-option active">
                    <div className="gas-type">
                      <span>⚡ Fast</span>
                      <span className="gas-time">~15 seconds</span>
                    </div>
                    <span className="gas-cost">{details.gasEstimate}</span>
                  </div>
                </div>
              </div>

              <div className="total-section">
                <div className="total-row">
                  <span>Total</span>
                  <div className="total-amount">
                    <span className="amount">{details.totalCost}</span>
                    <span className="usd-amount">~${(parseFloat(details.totalCost) * 1.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {autoConfirm && (
                <div className="auto-confirm-notice">
                  <span>🎮 Demo Mode: Auto-confirming in {countdown}s</span>
                </div>
              )}

              <div className="metamask-actions">
                <button className="btn-reject" onClick={handleReject}>
                  Reject
                </button>
                <button className="btn-confirm" onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="metamask-content processing">
              <div className="processing-animation">
                <div className="spinner"></div>
              </div>
              <h3>Processing Transaction</h3>
              <p>Your transaction is being processed on ApeChain...</p>
              <div className="processing-details">
                <div className="detail-row">
                  <span>Transaction Hash:</span>
                  <span className="hash">0xabc123...def456</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span className="status pending">Pending</span>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="metamask-content success">
              <div className="success-animation">
                <div className="checkmark">✓</div>
              </div>
              <h3>Transaction Successful!</h3>
              <p>Your transaction has been confirmed on ApeChain.</p>
              <div className="success-details">
                <div className="detail-row">
                  <span>Transaction Hash:</span>
                  <span className="hash">0xabc123...def456</span>
                </div>
                <div className="detail-row">
                  <span>Block:</span>
                  <span>1,234,567</span>
                </div>
                <div className="detail-row">
                  <span>Gas Used:</span>
                  <span>21,000</span>
                </div>
              </div>
              <button className="btn-view-explorer">
                View on Explorer
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MetaMaskSimulation;