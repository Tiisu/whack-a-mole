// Enhanced Global Leaderboard Component with Modern UI

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Crown, Medal, Star, TrendingUp, Users, Zap, 
  RefreshCw, Filter, Search, ExternalLink, Copy, Check,
  ChevronUp, ChevronDown, Award, Target, Flame
} from 'lucide-react';
import { LeaderboardProps } from '../types';
import { Card, CardContent, Badge, Button } from './ui';
import { cn, formatNumber, formatAddress, copyToClipboard } from '../lib/utils';
import '../styles/EnhancedLeaderboard.css';

const EnhancedLeaderboard: React.FC<LeaderboardProps> = ({ 
  leaderboard, 
  currentPlayer, 
  isLoading, 
  onRefresh 
}) => {
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [showCount, setShowCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null);

  // Filter and sort leaderboard
  const filteredLeaderboard = leaderboard
    .filter(entry => 
      entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.player.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return b.score - a.score;
    })
    .slice(0, showCount);

  // Copy address to clipboard
  const handleCopyAddress = async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

  // Format time ago
  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  // Get rank styling
  const getRankStyling = (position: number) => {
    switch (position) {
      case 1:
        return {
          icon: <Crown className="w-6 h-6" />,
          color: 'text-yellow-400',
          bg: 'from-yellow-500/20 to-orange-500/20',
          border: 'border-yellow-500/50',
          glow: 'shadow-yellow-500/25'
        };
      case 2:
        return {
          icon: <Medal className="w-6 h-6" />,
          color: 'text-gray-300',
          bg: 'from-gray-400/20 to-gray-500/20',
          border: 'border-gray-400/50',
          glow: 'shadow-gray-400/25'
        };
      case 3:
        return {
          icon: <Award className="w-6 h-6" />,
          color: 'text-amber-600',
          bg: 'from-amber-600/20 to-amber-700/20',
          border: 'border-amber-600/50',
          glow: 'shadow-amber-600/25'
        };
      default:
        return {
          icon: <span className="text-lg font-bold">#{position}</span>,
          color: 'text-gray-400',
          bg: 'from-gray-600/10 to-gray-700/10',
          border: 'border-gray-600/30',
          glow: ''
        };
    }
  };

  // Calculate stats
  const totalPlayers = leaderboard.length;
  const averageScore = totalPlayers > 0 ? Math.round(leaderboard.reduce((sum, entry) => sum + entry.score, 0) / totalPlayers) : 0;
  const topScore = leaderboard.length > 0 ? leaderboard[0].score : 0;
  const currentPlayerRank = currentPlayer ? leaderboard.findIndex(entry => 
    entry.player.toLowerCase() === currentPlayer.toLowerCase()
  ) + 1 : 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card variant="gaming" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
              <p className="text-gray-300">Top players on ApeChain blockchain</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              icon={<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium">Total Players</div>
            <div className="text-2xl font-bold text-white">{formatNumber(totalPlayers)}</div>
            <div className="text-xs text-gray-400">Competing globally</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium">Top Score</div>
            <div className="text-2xl font-bold text-white">{formatNumber(topScore)}</div>
            <div className="text-xs text-gray-400">Highest recorded</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-medium">Average Score</div>
            <div className="text-2xl font-bold text-white">{formatNumber(averageScore)}</div>
            <div className="text-xs text-gray-400">Among all players</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="text-orange-400 text-sm font-medium">Your Rank</div>
            <div className="text-2xl font-bold text-white">
              {currentPlayerRank > 0 ? `#${currentPlayerRank}` : '--'}
            </div>
            <div className="text-xs text-gray-400">
              {currentPlayerRank > 0 ? 'Current position' : 'Not ranked yet'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={sortBy === 'score' ? 'gaming' : 'outline'}
              size="sm"
              onClick={() => setSortBy('score')}
              icon={<TrendingUp className="w-4 h-4" />}
            >
              By Score
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'gaming' : 'outline'}
              size="sm"
              onClick={() => setSortBy('recent')}
              icon={<Zap className="w-4 h-4" />}
            >
              Recent
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card variant="gaming" className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span className="text-gray-300">Loading blockchain leaderboard...</span>
          </div>
        </Card>
      )}

      {/* Leaderboard List */}
      {!isLoading && (
        <Card variant="gaming" className="overflow-hidden">
          {filteredLeaderboard.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg">No players found</p>
                <p className="text-sm">Be the first to score 100+ points and claim the top spot!</p>
              </div>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              <AnimatePresence>
                {filteredLeaderboard.map((entry, index) => {
                  const position = sortBy === 'score' ? index + 1 : 
                    leaderboard.findIndex(e => e.player === entry.player) + 1;
                  const isCurrentPlayer = currentPlayer && 
                    entry.player.toLowerCase() === currentPlayer.toLowerCase();
                  const rankStyling = getRankStyling(position);
                  const isExpanded = expandedPlayer === entry.player;
                  
                  return (
                    <motion.div
                      key={entry.player}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 hover:bg-white/5 transition-all duration-200 cursor-pointer",
                        isCurrentPlayer && "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-l-4 border-blue-500"
                      )}
                      onClick={() => setExpandedPlayer(isExpanded ? null : entry.player)}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-xl border-2 bg-gradient-to-br shadow-lg",
                          rankStyling.bg,
                          rankStyling.border,
                          rankStyling.glow,
                          rankStyling.color
                        )}>
                          {rankStyling.icon}
                        </div>

                        {/* Player Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-white truncate">
                              {entry.username || 'Anonymous Player'}
                            </h3>
                            {isCurrentPlayer && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                YOU
                              </Badge>
                            )}
                            {position <= 3 && (
                              <Badge className={cn(
                                "border",
                                position === 1 && "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                                position === 2 && "bg-gray-400/20 text-gray-300 border-gray-400/30",
                                position === 3 && "bg-amber-600/20 text-amber-600 border-amber-600/30"
                              )}>
                                {position === 1 ? 'CHAMPION' : position === 2 ? 'RUNNER-UP' : 'THIRD'}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="font-mono">{formatAddress(entry.player)}</span>
                            <span>•</span>
                            <span>{formatTimeAgo(entry.timestamp)}</span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {formatNumber(entry.score)}
                          </div>
                          <div className="text-xs text-gray-400">points</div>
                        </div>

                        {/* Expand Icon */}
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-gray-700"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400">Full Address</div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-white">{entry.player}</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyAddress(entry.player);
                                    }}
                                    icon={copiedAddress === entry.player ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-gray-400">Score Achieved</div>
                                <div className="text-white font-semibold">{formatNumber(entry.score)} points</div>
                              </div>
                              
                              <div>
                                <div className="text-gray-400">Timestamp</div>
                                <div className="text-white">{entry.timestamp.toLocaleDateString()}</div>
                              </div>
                              
                              <div>
                                <div className="text-gray-400">Blockchain</div>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-white">ApeChain</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Load More */}
          {filteredLeaderboard.length === showCount && leaderboard.length > showCount && (
            <div className="p-4 border-t border-gray-700 text-center">
              <Button
                variant="outline"
                onClick={() => setShowCount(prev => prev + 10)}
              >
                Load More Players
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Call to Action for Non-Connected Users */}
      {!currentPlayer && !isLoading && (
        <Card variant="gaming" className="p-6 text-center">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 inline-block">
              <Trophy className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Join the Competition!</h3>
              <p className="text-gray-300 mb-4">
                Connect your wallet to compete for the top spot and earn NFT achievements.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>On-chain verified</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Real-time updates</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>NFT rewards</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EnhancedLeaderboard;