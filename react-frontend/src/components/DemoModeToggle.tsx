import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import '../styles/DemoModeToggle.css';

interface DemoModeToggleProps {
  onToggle: (enabled: boolean) => void;
  isEnabled: boolean;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ onToggle, isEnabled }) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="demo-mode-toggle">
      <div className="demo-toggle-container">
        <Button
          onClick={() => onToggle(!isEnabled)}
          className={`demo-toggle-btn ${isEnabled ? 'active' : ''}`}
        >
          {isEnabled ? '🎮 Demo Mode ON' : '🎮 Enable Demo Mode'}
        </Button>
        
        <Button
          onClick={() => setShowInfo(!showInfo)}
          className="demo-info-btn"
          variant="outline"
        >
          ℹ️
        </Button>
      </div>

      {isEnabled && (
        <div className="demo-status">
          <Badge color="green">
            ✨ Hackathon Demo Active
          </Badge>
          <span className="demo-description">
            Showcasing all features with dummy data
          </span>
        </div>
      )}

      {showInfo && (
        <div className="demo-info-panel">
          <h3>🎮 Demo Mode Features</h3>
          <ul>
            <li>✅ Pre-loaded NFT assets in your inventory</li>
            <li>✅ Active marketplace with dummy listings</li>
            <li>✅ Enhanced game features and power-ups</li>
            <li>✅ Achievement system with rewards</li>
            <li>✅ Leaderboard with sample players</li>
            <li>✅ All trading and minting features functional</li>
            <li>✅ Special events and rare mole spawns</li>
            <li>✅ Complete Web3 integration showcase</li>
          </ul>
          <p className="demo-note">
            <strong>Perfect for hackathon judging!</strong> This mode demonstrates 
            all implemented features without requiring actual blockchain transactions.
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoModeToggle;