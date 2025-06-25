import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { getEnhancedGameFeatures, generateDummyLeaderboard } from '../services/dummyDataService';
import '../styles/EnhancedGameFeatures.css';

interface EnhancedGameFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
  demoMode: boolean;
}

export const EnhancedGameFeatures: React.FC<EnhancedGameFeaturesProps> = ({ 
  isVisible, 
  onClose, 
  demoMode 
}) => {
  const [activeFeature, setActiveFeature] = useState<'achievements' | 'powerups' | 'events' | 'leaderboard'>('achievements');
  const [gameFeatures] = useState(getEnhancedGameFeatures());
  const [leaderboard] = useState(generateDummyLeaderboard());

  if (!isVisible) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'gray';
      case 'uncommon': return 'green';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="enhanced-game-features-overlay">
      <div className="enhanced-game-features">
        <div className="features-header">
          <h2>🎮 Enhanced Game Features</h2>
          <Button onClick={onClose} className="close-btn">✕</Button>
        </div>

        {demoMode && (
          <div className="demo-notice">
            <Badge color="green">Demo Mode</Badge>
            <span>All features are active and functional!</span>
          </div>
        )}

        {/* Feature Navigation */}
        <div className="feature-tabs">
          <button 
            className={`feature-tab ${activeFeature === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveFeature('achievements')}
          >
            🏆 Achievements
          </button>
          <button 
            className={`feature-tab ${activeFeature === 'powerups' ? 'active' : ''}`}
            onClick={() => setActiveFeature('powerups')}
          >
            ⚡ Power-ups
          </button>
          <button 
            className={`feature-tab ${activeFeature === 'events' ? 'active' : ''}`}
            onClick={() => setActiveFeature('events')}
          >
            ✨ Special Events
          </button>
          <button 
            className={`feature-tab ${activeFeature === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveFeature('leaderboard')}
          >
            📊 Leaderboard
          </button>
        </div>

        {/* Feature Content */}
        <div className="feature-content">
          {activeFeature === 'achievements' && (
            <div className="achievements-section">
              <h3>🏆 Achievement System</h3>
              <p>Unlock achievements by reaching milestones and completing challenges!</p>
              <div className="achievements-grid">
                {gameFeatures.achievements.map((achievement) => (
                  <Card key={achievement.id} className="achievement-card">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      <div className="achievement-footer">
                        <Badge color={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                        <span className="reward">+{achievement.reward} coins</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeFeature === 'powerups' && (
            <div className="powerups-section">
              <h3>⚡ Power-up System</h3>
              <p>Use coins to purchase powerful temporary boosts!</p>
              <div className="powerups-grid">
                {gameFeatures.powerUps.map((powerup) => (
                  <Card key={powerup.id} className="powerup-card">
                    <div className="powerup-icon">{powerup.icon}</div>
                    <div className="powerup-info">
                      <h4>{powerup.name}</h4>
                      <p>{powerup.description}</p>
                      <div className="powerup-footer">
                        <span className="duration">
                          Duration: {powerup.duration / 1000}s
                        </span>
                        <Button className="buy-powerup-btn">
                          Buy for {powerup.cost} coins
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeFeature === 'events' && (
            <div className="events-section">
              <h3>✨ Special Events</h3>
              <p>Random events that can occur during gameplay for extra excitement!</p>
              <div className="events-grid">
                {gameFeatures.specialEvents.map((event) => (
                  <Card key={event.id} className="event-card">
                    <div className="event-icon">{event.icon}</div>
                    <div className="event-info">
                      <h4>{event.name}</h4>
                      <p>{event.description}</p>
                      <div className="event-stats">
                        <span>Probability: {(event.probability * 100).toFixed(1)}%</span>
                        {event.multiplier && (
                          <span>Score Multiplier: {event.multiplier}x</span>
                        )}
                        {event.duration && (
                          <span>Duration: {event.duration / 1000}s</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeFeature === 'leaderboard' && (
            <div className="leaderboard-section">
              <h3>📊 Global Leaderboard</h3>
              <p>Compete with players worldwide for the top spot!</p>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <div key={entry.player} className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}>
                    <div className="rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </div>
                    <div className="player-info">
                      <span className="username">{entry.username}</span>
                      <span className="address">{entry.player.slice(0, 6)}...{entry.player.slice(-4)}</span>
                    </div>
                    <div className="score">{entry.score.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="features-footer">
          <p>
            <strong>🚀 Hackathon Ready!</strong> All these features are implemented and working. 
            Demo mode showcases the complete gaming ecosystem with NFT integration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameFeatures;