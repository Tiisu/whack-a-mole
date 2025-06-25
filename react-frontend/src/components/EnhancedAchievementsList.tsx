// Enhanced NFT Achievements Component with Modern UI

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Crown, Target, Zap, Lock, Unlock, Award, Sparkles, 
  Grid3X3, List, Filter, Search, ExternalLink, Copy, Check,
  Medal, Gem, Shield, Flame, Hexagon, Eye, MoreHorizontal
} from 'lucide-react';
import { AchievementsProps } from '../types';
import { Card, CardContent, Badge, Button } from './ui';
import { cn, formatNumber, copyToClipboard } from '../lib/utils';
import '../styles/EnhancedAchievements.css';

const EnhancedAchievementsList: React.FC<AchievementsProps> = ({ 
  achievements, 
  playerData, 
  isLoading 
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterMode, setFilterMode] = useState<'all' | 'earned' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const achievementTypes = ['BEGINNER', 'PRO', 'MASTER', 'REGULAR', 'VETERAN'] as const;

  // Enhanced achievement data with better icons and descriptions
  const enhancedAchievementData = {
    BEGINNER: {
      name: 'First Steps',
      description: 'Score 1,000+ points in a single game',
      icon: <Target className="w-8 h-8" />,
      rarity: 'Common',
      color: '#10b981',
      bgGradient: 'from-green-500/20 to-emerald-600/20',
      borderGradient: 'from-green-400 to-emerald-500',
      requirement: 'Score: 1,000 points',
      reward: 'Beginner NFT Badge',
      category: 'Score',
      points: 10,
      nftId: 'WAMA-001'
    },
    PRO: {
      name: 'Pro Player',
      description: 'Score 5,000+ points in a single game',
      icon: <Trophy className="w-8 h-8" />,
      rarity: 'Epic',
      color: '#8b5cf6',
      bgGradient: 'from-purple-500/20 to-violet-600/20',
      borderGradient: 'from-purple-400 to-violet-500',
      requirement: 'Score: 5,000 points',
      reward: 'Pro Player NFT Badge',
      category: 'Score',
      points: 50,
      nftId: 'WAMA-002'
    },
    MASTER: {
      name: 'Master',
      description: 'Score 10,000+ points in a single game',
      icon: <Crown className="w-8 h-8" />,
      rarity: 'Legendary',
      color: '#f59e0b',
      bgGradient: 'from-yellow-500/20 to-orange-600/20',
      borderGradient: 'from-yellow-400 to-orange-500',
      requirement: 'Score: 10,000 points',
      reward: 'Master NFT Badge',
      category: 'Score',
      points: 100,
      nftId: 'WAMA-003'
    },
    REGULAR: {
      name: 'Regular Player',
      description: 'Play 10 or more games',
      icon: <Medal className="w-8 h-8" />,
      rarity: 'Common',
      color: '#06b6d4',
      bgGradient: 'from-cyan-500/20 to-blue-600/20',
      borderGradient: 'from-cyan-400 to-blue-500',
      requirement: 'Games: 10 played',
      reward: 'Regular Player NFT Badge',
      category: 'Activity',
      points: 25,
      nftId: 'WAMA-004'
    },
    VETERAN: {
      name: 'Veteran',
      description: 'Play 100 or more games',
      icon: <Shield className="w-8 h-8" />,
      rarity: 'Rare',
      color: '#ef4444',
      bgGradient: 'from-red-500/20 to-rose-600/20',
      borderGradient: 'from-red-400 to-rose-500',
      requirement: 'Games: 100 played',
      reward: 'Veteran NFT Badge',
      category: 'Activity',
      points: 75,
      nftId: 'WAMA-005'
    }
  };

  // Copy to clipboard functionality
  const handleCopyNftId = async (nftId: string) => {
    const success = await copyToClipboard(nftId);
    if (success) {
      setCopiedId(nftId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Filter achievements based on current filter mode
  const filteredAchievements = achievementTypes.filter(type => {
    const isEarned = achievements.includes(type);
    const matchesSearch = enhancedAchievementData[type].name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enhancedAchievementData[type].description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterMode) {
      case 'earned': return isEarned;
      case 'locked': return !isEarned;
      default: return true;
    }
  });

  const getProgressPercentage = (type: string) => {
    if (!playerData) return 0;
    
    switch (type) {
      case 'BEGINNER':
        return Math.min((playerData.highestScore / 1000) * 100, 100);
      case 'PRO':
        return Math.min((playerData.highestScore / 5000) * 100, 100);
      case 'MASTER':
        return Math.min((playerData.highestScore / 10000) * 100, 100);
      case 'REGULAR':
        return Math.min((playerData.totalGamesPlayed / 10) * 100, 100);
      case 'VETERAN':
        return Math.min((playerData.totalGamesPlayed / 100) * 100, 100);
      default:
        return 0;
    }
  };

  const isAchievementEarned = (type: string) => {
    return achievements.includes(type);
  };

  const getAchievementStatus = (type: string) => {
    const earned = isAchievementEarned(type);
    const progress = getProgressPercentage(type);
    
    if (earned) return 'earned';
    if (progress >= 100) return 'ready';
    if (progress > 0) return 'progress';
    return 'locked';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'earned': return <Unlock className="w-5 h-5" />;
      case 'ready': return <Sparkles className="w-5 h-5" />;
      case 'progress': return <Zap className="w-5 h-5" />;
      case 'locked': return <Lock className="w-5 h-5" />;
      default: return <Lock className="w-5 h-5" />;
    }
  };

  // Calculate total achievement points earned
  const totalPointsEarned = achievements.reduce((total, achievement) => {
    return total + (enhancedAchievementData[achievement as keyof typeof enhancedAchievementData]?.points || 0);
  }, 0);

  const totalPossiblePoints = Object.values(enhancedAchievementData).reduce((total, achievement) => {
    return total + achievement.points;
  }, 0);

  const completionPercentage = (achievements.length / achievementTypes.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card variant="gaming" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">NFT Achievements</h2>
              <p className="text-gray-300">Collect exclusive badges on ApeChain</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant={viewMode === 'grid' ? 'gaming' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              icon={<Grid3X3 className="w-4 h-4" />}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'gaming' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              icon={<List className="w-4 h-4" />}
            >
              List
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="text-green-400 text-sm font-medium">Earned</div>
            <div className="text-2xl font-bold text-white">{achievements.length}</div>
            <div className="text-xs text-gray-400">of {achievementTypes.length} total</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-blue-400 text-sm font-medium">Completion</div>
            <div className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</div>
            <div className="text-xs text-gray-400">Achievement progress</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="text-purple-400 text-sm font-medium">Points</div>
            <div className="text-2xl font-bold text-white">{totalPointsEarned}</div>
            <div className="text-xs text-gray-400">of {totalPossiblePoints} total</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="text-orange-400 text-sm font-medium">Rarest</div>
            <div className="text-2xl font-bold text-white">
              {achievements.includes('MASTER') ? 'Legendary' : 
               achievements.includes('PRO') ? 'Epic' : 
               achievements.includes('VETERAN') ? 'Rare' : 'Common'}
            </div>
            <div className="text-xs text-gray-400">Highest rarity owned</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2">
            {(['all', 'earned', 'locked'] as const).map((filter) => (
              <Button
                key={filter}
                variant={filterMode === filter ? 'gaming' : 'outline'}
                size="sm"
                onClick={() => setFilterMode(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card variant="gaming" className="p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            <span className="text-gray-300">Loading NFT achievements...</span>
          </div>
        </Card>
      )}

      {/* Achievements Grid/List */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        <AnimatePresence>
          {filteredAchievements.map((type, index) => {
            const achievement = enhancedAchievementData[type];
            const isEarned = isAchievementEarned(type);
            const progress = getProgressPercentage(type);
            const status = getAchievementStatus(type);
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="gaming"
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:scale-105",
                    isEarned ? "ring-2 ring-green-500/50" : "opacity-80",
                    viewMode === 'list' ? "flex items-center p-4" : "p-6"
                  )}
                  onClick={() => setSelectedAchievement(selectedAchievement === type ? null : type)}
                >
                  {/* Rarity Border Effect */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `linear-gradient(135deg, ${achievement.color}20, transparent)`
                    }}
                  />
                  
                  {/* Achievement Content */}
                  <div className={cn(
                    "relative z-10",
                    viewMode === 'list' ? "flex items-center space-x-4 flex-1" : "text-center"
                  )}>
                    {/* Icon */}
                    <div className={cn(
                      "relative",
                      viewMode === 'list' ? "flex-shrink-0" : "mb-4 flex justify-center"
                    )}>
                      <div 
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-300",
                          isEarned ? "bg-gradient-to-br shadow-lg" : "bg-gray-800/50 border-gray-600"
                        )}
                        style={{
                          background: isEarned ? achievement.bgGradient : undefined,
                          borderColor: isEarned ? achievement.color : undefined,
                          boxShadow: isEarned ? `0 0 20px ${achievement.color}40` : undefined
                        }}
                      >
                        <div style={{ color: isEarned ? achievement.color : '#6b7280' }}>
                          {achievement.icon}
                        </div>
                        
                        {/* Status Badge */}
                        <div className="absolute -top-2 -right-2">
                          <div 
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                              isEarned ? "bg-green-500" : status === 'ready' ? "bg-yellow-500" : "bg-gray-600"
                            )}
                          >
                            {getStatusIcon(status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Achievement Info */}
                    <div className={cn(
                      viewMode === 'list' ? "flex-1" : ""
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{achievement.name}</h3>
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: `${getRarityColor(achievement.rarity)}20`,
                            color: getRarityColor(achievement.rarity),
                            borderColor: getRarityColor(achievement.rarity)
                          }}
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3">{achievement.description}</p>
                      
                      {/* Progress Bar */}
                      {!isEarned && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${progress}%`,
                                background: `linear-gradient(90deg, ${achievement.color}, ${achievement.color}80)`
                              }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Achievement Details */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {achievement.points} points • {achievement.category}
                        </div>
                        
                        {isEarned && (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyNftId(achievement.nftId);
                              }}
                              icon={copiedId === achievement.nftId ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            >
                              {copiedId === achievement.nftId ? 'Copied!' : achievement.nftId}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {selectedAchievement === type && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-gray-600"
                      >
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Requirement:</span>
                            <span className="text-white">{achievement.requirement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Reward:</span>
                            <span className="text-white">{achievement.reward}</span>
                          </div>
                          {isEarned && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">NFT ID:</span>
                              <span className="text-green-400 font-mono">{achievement.nftId}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && !isLoading && (
        <Card variant="gaming" className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No achievements found matching your criteria.</p>
          </div>
          <Button onClick={() => { setFilterMode('all'); setSearchTerm(''); }}>
            Show All Achievements
          </Button>
        </Card>
      )}
    </div>
  );
};

export default EnhancedAchievementsList;