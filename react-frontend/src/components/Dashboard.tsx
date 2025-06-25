// Dashboard component with stats, achievements, and leaderboard

import React, { useEffect, useRef } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useGameContext } from '../contexts/GameContext';
import EnhancedAchievementsList from './EnhancedAchievementsList';
import EnhancedLeaderboard from './EnhancedLeaderboard';
import Web3DataDebug from './Web3DataDebug';
import '../styles/Dashboard.css';
import '../styles/Web3DataDebug.css';

const Dashboard: React.FC = () => {
  const { web3State, refreshData, isLoading } = useWeb3();
  const { gameStats, gameState } = useGameContext();
  const lastRefreshRef = useRef<number>(0);

  const handleRefresh = async () => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;
    
    // Prevent manual refresh spam (minimum 1 second for manual refresh)
    if (timeSinceLastRefresh < 1000) {
      console.log('Manual refresh throttled - please wait');
      return;
    }
    
    lastRefreshRef.current = now;
    await refreshData();
  };

  // Auto-refresh dashboard when connection state changes (but not on data changes to prevent loops)
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;

    // Only auto-refresh when connection state changes and enough time has passed
    // Do NOT include data values in dependencies to prevent refresh loops
    if (web3State.isConnected &&
        web3State.account &&
        timeSinceLastRefresh > 5000) { // Increased to 5 seconds to prevent spam

      console.log('🔄 Dashboard auto-refreshing due to connection state change...');
      lastRefreshRef.current = now;
      refreshData();
    }
  }, [web3State.isConnected, web3State.account]); // Removed data dependencies to prevent loops

  // Use Web3 data if available, otherwise fall back to local stats
  const displayStats = web3State.playerData ? {
    gamesPlayed: web3State.playerData.totalGamesPlayed || 0,
    totalScore: web3State.playerData.totalScore || 0,
    highestScore: web3State.playerData.highestScore || 0,
    averageScore: web3State.playerData.totalGamesPlayed > 0 ? 
      Math.round(web3State.playerData.totalScore / web3State.playerData.totalGamesPlayed) : 0,
    molesHit: web3State.playerData.totalMolesHit || 0,
    nftCount: web3State.achievements.length || 0,
    isWeb3Data: true
  } : {
    gamesPlayed: gameStats.gamesPlayed || 0,
    totalScore: gameStats.totalScore || 0,
    highestScore: gameStats.highestLevel || 0,
    averageScore: gameStats.averageScore || 0,
    molesHit: gameStats.molesHit || 0,
    nftCount: 0,
    isWeb3Data: false
  };

  // Calculate additional stats
  const additionalStats = {
    winRate: displayStats.gamesPlayed > 0 ? 
      Math.round((displayStats.gamesPlayed / Math.max(displayStats.gamesPlayed, 1)) * 100) : 0,
    accuracy: displayStats.molesHit > 0 ? 
      Math.round((displayStats.molesHit / Math.max(displayStats.molesHit + (gameStats.plantsHit || 0), 1)) * 100) : 0,
    registrationDate: web3State.playerData?.registrationTime ? 
      web3State.playerData.registrationTime.toLocaleDateString() : null
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Game Dashboard</h2>
          {web3State.isConnected && (
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={isLoading}
              title="Refresh blockchain data"
            >
              🔄
            </button>
          )}
        </div>

        {/* Enhanced Current Game Stats Section */}
        <div className="current-game-section">
          <h3>🎮 Current Game</h3>
          <div className="current-game-stats">
            <div className="current-stat score">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-label">Score</span>
                <span className="stat-value">{gameState.score?.toLocaleString() || 0}</span>
              </div>
            </div>
            <div className="current-stat level">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <span className="stat-label">Level</span>
                <span className="stat-value">{gameState.currentLevel || 1}</span>
              </div>
            </div>
            <div className="current-stat streak">
              <div className="stat-icon">{gameState.currentStreak >= 5 ? '🔥' : '🎪'}</div>
              <div className="stat-content">
                <span className="stat-label">Streak</span>
                <span className="stat-value">{gameState.currentStreak || 0}</span>
              </div>
            </div>
            <div className="current-stat time">
              <div className="stat-icon">⏰</div>
              <div className="stat-content">
                <span className="stat-label">Time Left</span>
                <span className={`stat-value time-display ${gameState.timeLeft <= 10 && gameState.isPlaying ? 'warning' : ''}`}>
                  {gameState.timeLeft ? `${Math.floor(gameState.timeLeft / 60)}:${(gameState.timeLeft % 60).toString().padStart(2, '0')}` : '2:00'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Game Status Indicator */}
          <div className="game-status-indicator">
            <div className={`status-badge ${gameState.isPlaying ? 'playing' : gameState.isPaused ? 'paused' : 'stopped'}`}>
              {gameState.isPlaying ? '🎮 Playing' : gameState.isPaused ? '⏸️ Paused' : '⏹️ Stopped'}
            </div>
          </div>
        </div>

        {/* Player Profile Section */}
        <div className="player-profile-section">
          <h3>Player Profile</h3>

        {/* Web3 Player Info */}
        {web3State.playerData && web3State.playerData.isRegistered && (
          <div className="web3-player-info">
            <div className="player-header">
              <span className="player-username">
                {web3State.playerData.username}
              </span>
              <button 
                className="edit-btn"
                title="Edit username"
                onClick={() => {
                  const newUsername = prompt('Enter new username:');
                  if (newUsername && newUsername.trim()) {
                    // TODO: Implement username update
                    console.log('Update username to:', newUsername);
                  }
                }}
              >
                ✏️
              </button>
            </div>
            <div className="player-rank">
              <span>Rank: #</span>
              <span className="rank-value">-</span>
            </div>
          </div>
        )}
        </div>

        {/* Overall Stats Section */}
        <div className="overall-stats-section">
          <div className="section-header">
            <h3>Overall Statistics</h3>
            <div className="data-source-indicator">
              {displayStats.isWeb3Data ? (
                <div className="data-source blockchain">
                  <span className="source-icon">🔗</span>
                  <span>Blockchain Data</span>
                </div>
              ) : (
                <div className="data-source local">
                  <span className="source-icon">💻</span>
                  <span>Local Data</span>
                </div>
              )}
            </div>
          </div>

        {/* Data Loading Indicator */}
        {isLoading && (
          <div className="data-loading-indicator">
            <div className="loading-spinner"></div>
            <span>Refreshing blockchain data...</span>
          </div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="stats-grid">
          <div className="stat-item highlight">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <div className="stat-label">Games Played</div>
              <div className="stat-value">{displayStats.gamesPlayed.toLocaleString()}</div>
              <div className={`stat-source ${displayStats.isWeb3Data ? 'blockchain' : 'local'}`}>
                {displayStats.isWeb3Data ? '🔗 On-Chain' : '💻 Local'}
              </div>
            </div>
          </div>

          <div className="stat-item highlight">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <div className="stat-label">Highest Score</div>
              <div className="stat-value">{displayStats.highestScore.toLocaleString()}</div>
              <div className={`stat-source ${displayStats.isWeb3Data ? 'blockchain' : 'local'}`}>
                {displayStats.isWeb3Data ? '🔗 On-Chain' : '💻 Local'}
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">Total Score</div>
              <div className="stat-value">{displayStats.totalScore.toLocaleString()}</div>
              <div className={`stat-source ${displayStats.isWeb3Data ? 'blockchain' : 'local'}`}>
                {displayStats.isWeb3Data ? '🔗 On-Chain' : '💻 Local'}
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">{displayStats.averageScore.toLocaleString()}</div>
              <div className="stat-source calculated">📊 Calculated</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Moles Hit</div>
              <div className="stat-value">{displayStats.molesHit.toLocaleString()}</div>
              <div className={`stat-source ${displayStats.isWeb3Data ? 'blockchain' : 'local'}`}>
                {displayStats.isWeb3Data ? '🔗 On-Chain' : '💻 Local'}
              </div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🎖️</div>
            <div className="stat-content">
              <div className="stat-label">NFT Achievements</div>
              <div className="stat-value">{displayStats.nftCount}</div>
              <div className="stat-source blockchain">🔗 On-Chain</div>
            </div>
          </div>

          {additionalStats.accuracy > 0 && (
            <div className="stat-item">
              <div className="stat-icon">🎪</div>
              <div className="stat-content">
                <div className="stat-label">Accuracy</div>
                <div className="stat-value">{additionalStats.accuracy}%</div>
                <div className="stat-source calculated">📊 Calculated</div>
              </div>
            </div>
          )}

          {additionalStats.registrationDate && (
            <div className="stat-item">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <div className="stat-label">Member Since</div>
                <div className="stat-value member-date">{additionalStats.registrationDate}</div>
                <div className="stat-source blockchain">🔗 On-Chain</div>
              </div>
            </div>
          )}
        </div>
        </div>

        {/* Achievements Section */}
        <EnhancedAchievementsList 
          achievements={web3State.achievements}
          playerData={web3State.playerData}
          isLoading={isLoading}
        />

        {/* Leaderboard Section */}
        <EnhancedLeaderboard 
          leaderboard={web3State.leaderboard}
          currentPlayer={web3State.account}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />

        {/* Debug Panel - Only show in development */}
        {process.env.NODE_ENV === 'development' && <Web3DataDebug />}
      </div>
    </div>
  );
};

export default Dashboard;
