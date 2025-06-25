import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/Navbar.css';

interface NavbarProps {
  currentPage: 'game' | 'marketplace' | 'landing';
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  const { navigateToGame, navigateToMarketplace, navigateToLanding } = useAppContext();
  const { web3State, disconnect } = useWeb3();

  const handleDisconnect = async () => {
    await disconnect();
    navigateToLanding();
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand" onClick={navigateToLanding}>
          <span className="brand-icon">🎮</span>
          <span className="brand-text">Whac-A-Mole Web3</span>
        </div>

        {/* Navigation Links */}
        <div className="navbar-nav">
          <button 
            className={`nav-link ${currentPage === 'game' ? 'active' : ''}`}
            onClick={navigateToGame}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Game</span>
          </button>
          
          <button 
            className={`nav-link ${currentPage === 'marketplace' ? 'active' : ''}`}
            onClick={navigateToMarketplace}
          >
            <span className="nav-icon">🛒</span>
            <span className="nav-text">NFT Marketplace</span>
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="navbar-user">
          {web3State.isConnected && web3State.account ? (
            <div className="user-info">
              <div className="wallet-info">
                <span className="wallet-icon">👤</span>
                <span className="wallet-address">{formatAddress(web3State.account)}</span>
                <div className="connection-status connected">
                  <span className="status-dot"></span>
                  <span className="status-text">Connected</span>
                </div>
              </div>
              <button className="disconnect-btn" onClick={handleDisconnect}>
                <span className="disconnect-icon">🚪</span>
                <span className="disconnect-text">Disconnect</span>
              </button>
            </div>
          ) : (
            <div className="user-info">
              <div className="connection-status disconnected">
                <span className="status-dot"></span>
                <span className="status-text">Demo Mode</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;