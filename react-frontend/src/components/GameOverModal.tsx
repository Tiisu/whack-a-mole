// Game Over Modal Component

import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import { useWeb3 } from '../contexts/Web3Context';
import '../styles/GameOverModal.css';

interface GameOverModalProps {
  isVisible: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isVisible, onPlayAgain, onClose }) => {
  const { gameState, gameStats } = useGameContext();
  const { web3State } = useWeb3();

  if (!isVisible) return null;

  // Calculate game statistics
  const timePlayed = 120 - gameState.timeLeft;
  const accuracy = gameState.molesHit > 0 ? Math.round((gameState.molesHit / (gameState.molesHit + gameState.plantsHit)) * 100) : 0;
  const pointsPerSecond = timePlayed > 0 ? Math.round(gameState.score / timePlayed) : 0;
  const totalHits = gameState.molesHit + gameState.plantsHit;
  const averageScore = gameStats.gamesPlayed > 0 ? Math.round(gameStats.totalScore / gameStats.gamesPlayed) : 0;
  const isPersonalBest = gameState.score > averageScore;

  // Determine Web3 status
  const isWeb3Connected = web3State.isConnected && web3State.playerData?.isRegistered;
  const web3StatusIcon = isWeb3Connected ? '✅' : '⚠️';
  const web3StatusText = isWeb3Connected ? 'Saved to ApeChain' : 'Local game only';
  const web3StatusClass = isWeb3Connected ? 'web3-connected' : 'web3-local';

  // Enhanced performance rating with more tiers
  const getPerformanceRating = (score: number) => {
    if (score >= 15000) return { 
      rating: 'GODLIKE', 
      emoji: '⚡', 
      color: '#ff0080', 
      gradient: 'linear-gradient(135deg, #ff0080, #7928ca)',
      description: 'Absolutely incredible!'
    };
    if (score >= 10000) return { 
      rating: 'LEGENDARY', 
      emoji: '👑', 
      color: '#ffd700', 
      gradient: 'linear-gradient(135deg, #ffd700, #ffed4e)',
      description: 'You are a legend!'
    };
    if (score >= 7500) return { 
      rating: 'MASTERFUL', 
      emoji: '🔥', 
      color: '#ff6b35', 
      gradient: 'linear-gradient(135deg, #ff6b35, #f97316)',
      description: 'Master level skills!'
    };
    if (score >= 5000) return { 
      rating: 'EPIC', 
      emoji: '🏆', 
      color: '#6c5ce7', 
      gradient: 'linear-gradient(135deg, #6c5ce7, #8b5cf6)',
      description: 'Epic performance!'
    };
    if (score >= 2500) return { 
      rating: 'GREAT', 
      emoji: '🎯', 
      color: '#00b894', 
      gradient: 'linear-gradient(135deg, #00b894, #10b981)',
      description: 'Great job!'
    };
    if (score >= 1000) return { 
      rating: 'GOOD', 
      emoji: '👍', 
      color: '#74b9ff', 
      gradient: 'linear-gradient(135deg, #74b9ff, #3b82f6)',
      description: 'Good work!'
    };
    return { 
      rating: 'KEEP TRYING', 
      emoji: '💪', 
      color: '#fdcb6e', 
      gradient: 'linear-gradient(135deg, #fdcb6e, #f59e0b)',
      description: 'Practice makes perfect!'
    };
  };

  const performance = getPerformanceRating(gameState.score);

  // Calculate score progress (for visual representation)
  const maxPossibleScore = 15000; // Theoretical max for visual purposes
  const scoreProgress = Math.min((gameState.score / maxPossibleScore) * 100, 100);

  return (
    <div className="modal-overlay game-over-overlay">
      <div className="game-over-modal">
        {/* Decorative particles */}
        <div className="modal-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>

        {/* Header */}
        <div className="game-over-header">
          <h1 className="game-over-title">GAME OVER!</h1>
          <div className="performance-badge" style={{ 
            background: performance.gradient,
            borderColor: performance.color,
            boxShadow: `0 0 20px ${performance.color}40`
          }}>
            <span className="performance-emoji">{performance.emoji}</span>
            <span className="performance-text">{performance.rating}</span>
          </div>
          <div className="performance-description">{performance.description}</div>
        </div>

        {/* Final Score with Progress Bar */}
        <div className="final-score-section">
          <div className="final-score-label">Final Score</div>
          <div className="final-score-value">{gameState.score.toLocaleString()}</div>
          <div className="score-progress-container">
            <div className="score-progress-bar">
              <div 
                className="score-progress-fill" 
                style={{ 
                  width: `${scoreProgress}%`,
                  background: performance.gradient
                }}
              ></div>
            </div>
            <div className="score-progress-label">
              {scoreProgress.toFixed(1)}% of theoretical max
            </div>
          </div>
          {isPersonalBest && (
            <div className="personal-best-indicator">
              <span className="best-icon">🌟</span>
              <span className="best-text">Personal Best!</span>
            </div>
          )}
        </div>

        {/* Game Statistics */}
        <div className="game-stats-section">
          <h3 className="stats-title">Game Statistics</h3>
          <div className="game-stats-grid">
            <div className="stat-item stat-highlight">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{gameState.molesHit}</div>
              <div className="stat-label">Moles Hit</div>
              <div className="stat-progress">
                <div 
                  className="stat-progress-fill" 
                  style={{ width: `${totalHits > 0 ? (gameState.molesHit / totalHits) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-item stat-warning">
              <div className="stat-icon">🌱</div>
              <div className="stat-value">{gameState.plantsHit}</div>
              <div className="stat-label">Plants Hit</div>
              <div className="stat-progress">
                <div 
                  className="stat-progress-fill stat-progress-danger" 
                  style={{ width: `${totalHits > 0 ? (gameState.plantsHit / totalHits) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">📊</div>
              <div className="stat-value">Level {gameState.currentLevel}</div>
              <div className="stat-label">Level Reached</div>
              <div className="stat-badge">
                {gameState.currentLevel >= 10 ? '🏆' : gameState.currentLevel >= 5 ? '🥉' : '🎮'}
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">⏱️</div>
              <div className="stat-value">{timePlayed}s</div>
              <div className="stat-label">Time Played</div>
              <div className="stat-subtext">{Math.floor(timePlayed / 60)}m {timePlayed % 60}s</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">🎲</div>
              <div className="stat-value">{accuracy}%</div>
              <div className="stat-label">Accuracy</div>
              <div className="accuracy-indicator">
                <div className="accuracy-bar">
                  <div 
                    className="accuracy-fill" 
                    style={{ 
                      width: `${accuracy}%`,
                      backgroundColor: accuracy >= 80 ? '#00b894' : accuracy >= 60 ? '#fdcb6e' : '#e17055'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{pointsPerSecond}</div>
              <div className="stat-label">Points/Sec</div>
              <div className="stat-subtext">
                {pointsPerSecond >= 100 ? 'Lightning Fast!' : pointsPerSecond >= 50 ? 'Great Speed!' : 'Keep Going!'}
              </div>
            </div>

            <div className="stat-item stat-streak">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{gameState.bestStreak}</div>
              <div className="stat-label">Best Streak</div>
              <div className="streak-indicator">
                {Array.from({ length: Math.min(gameState.bestStreak, 5) }, (_, i) => (
                  <span key={i} className="streak-flame">🔥</span>
                ))}
                {gameState.bestStreak > 5 && <span className="streak-more">+{gameState.bestStreak - 5}</span>}
              </div>
            </div>

            <div className="stat-item stat-total">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{totalHits}</div>
              <div className="stat-label">Total Hits</div>
              <div className="stat-subtext">Moles + Plants</div>
            </div>
          </div>
        </div>

        {/* Web3 Status */}
        <div className={`web3-status ${web3StatusClass}`}>
          <span className="web3-status-icon">{web3StatusIcon}</span>
          <span className="web3-status-text">{web3StatusText}</span>
        </div>

        {/* Action Buttons */}
        <div className="game-over-actions">
          <button 
            className="btn game-over-btn play-again-btn enhanced-btn"
            onClick={onPlayAgain}
          >
            <span className="btn-icon">🎮</span>
            <span className="btn-text">Play Again</span>
            <div className="btn-glow"></div>
          </button>
          
          <button 
            className="btn game-over-btn close-btn enhanced-btn"
            onClick={onClose}
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-text">Back to Menu</span>
            <div className="btn-glow"></div>
          </button>
        </div>

        {/* Achievement Badges */}
        <div className="achievement-badges">
          {accuracy >= 90 && (
            <div className="achievement-badge accuracy-master">
              <span className="achievement-icon">🎯</span>
              <span className="achievement-text">Accuracy Master</span>
            </div>
          )}
          {gameState.bestStreak >= 10 && (
            <div className="achievement-badge streak-king">
              <span className="achievement-icon">🔥</span>
              <span className="achievement-text">Streak King</span>
            </div>
          )}
          {pointsPerSecond >= 100 && (
            <div className="achievement-badge speed-demon">
              <span className="achievement-icon">⚡</span>
              <span className="achievement-text">Speed Demon</span>
            </div>
          )}
          {gameState.currentLevel >= 10 && (
            <div className="achievement-badge level-master">
              <span className="achievement-icon">🏆</span>
              <span className="achievement-text">Level Master</span>
            </div>
          )}
        </div>

        {/* High Score Indicator */}
        {isPersonalBest && (
          <div className="new-record-badge enhanced-record">
            <div className="record-sparkles">
              <span className="sparkle">✨</span>
              <span className="sparkle">⭐</span>
              <span className="sparkle">✨</span>
            </div>
            <span className="record-icon">🎉</span>
            <span className="record-text">Personal Best!</span>
            <div className="record-glow"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameOverModal;
