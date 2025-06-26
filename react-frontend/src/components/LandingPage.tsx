// Enhanced Landing Page Component with Modern UI

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Gamepad2, Trophy, Target, Zap, Wallet, Play, Moon, Sun, Palette,
  Star, Users, Coins, Shield, ArrowRight, ChevronDown, Sparkles,
  TrendingUp, Award, Globe, Rocket, Heart, CheckCircle
} from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, CardContent, Badge } from './ui';
import LandingPageParticles from './LandingPageParticles';
import '../styles/LandingPage.css';

interface LandingPageProps {
  onStartTrial: () => void;
  onConnectWallet: () => void;
  onNavigateToGame: () => void;
  onNavigateToMarketplace: () => void;
  trialUsed: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onStartTrial,
  onConnectWallet,
  onNavigateToGame,
  onNavigateToMarketplace,
  trialUsed
}) => {
  const { web3State, isLoading } = useWeb3();
  const { theme, toggleTheme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "The most addictive Web3 game I've played! Love earning NFTs while having fun.",
      author: "CryptoGamer",
      role: "NFT Collector",
      avatar: "🎮"
    },
    {
      text: "Finally, a blockchain game that's actually fun to play. The leaderboard is so competitive!",
      author: "MoleHunter",
      role: "Top Player",
      avatar: "🏆"
    },
    {
      text: "Great way to get started with Web3 gaming. The trial mode is perfect for beginners.",
      author: "NewToWeb3",
      role: "Community Member",
      avatar: "🌟"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Active Players" },
    { icon: <Trophy className="w-6 h-6" />, value: "50,000+", label: "Games Played" },
    { icon: <Award className="w-6 h-6" />, value: "5,000+", label: "NFTs Minted" },
    { icon: <Coins className="w-6 h-6" />, value: "$100K+", label: "Volume Traded" }
  ];

  const handleGetStarted = () => {
    if (web3State.isConnected) {
      // User is connected, navigate to game
      onNavigateToGame();
    } else if (!trialUsed) {
      // Allow trial play
      onStartTrial();
    } else {
      // Trial used, require wallet connection
      onConnectWallet();
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun className="w-4 h-4" />
      case 'dark': return <Moon className="w-4 h-4" />
      default: return <Palette className="w-4 h-4" />
    }
  };

  return (
    <div className="landing-page">
      {/* Particle Background */}
      <LandingPageParticles />
      
      {/* Enhanced Navigation Header */}
      <motion.nav
        className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <motion.div
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Whac-A-Mole Web3</span>
          </motion.div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#nfts" className="nav-link">NFTs</a>
            <button onClick={onNavigateToMarketplace} className="nav-link">Marketplace</button>
            <a href="#roadmap" className="nav-link">Roadmap</a>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              icon={getThemeIcon()}
              className="mr-2"
            />

            <Button
              variant={web3State.isConnected ? "outline" : "gaming"}
              size="md"
              loading={isLoading}
              onClick={onConnectWallet}
              disabled={isLoading}
              icon={<Wallet className="w-4 h-4" />}
            >
              {web3State.isConnected ?
                `${web3State.account?.slice(0, 6)}...${web3State.account?.slice(-4)}` :
                'Connect Wallet'
              }
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-container"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Badge variant="gaming" size="lg" animated icon={<Sparkles className="w-4 h-4" />}>
                🎉 Now Live on ApeChain Testnet!
              </Badge>
            </motion.div>
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Future of
              <span className="hero-title-highlight"> Arcade Gaming</span>
              <br />
              is Here
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Experience the beloved Whac-A-Mole game reimagined for Web3. 
              Compete globally, earn NFT achievements, and trade assets on ApeChain. 
              <span className="subtitle-highlight">Play to earn, play to own.</span>
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button
                variant="gaming"
                size="xl"
                onClick={handleGetStarted}
                icon={<Play className="w-5 h-5" />}
                animated
              >
                {web3State.isConnected ?
                  'Play Now' :
                  trialUsed ?
                    'Connect Wallet to Play' :
                    'Try Free Demo'
                }
              </Button>

              {!web3State.isConnected && !trialUsed && (
                <Button
                  variant="outline"
                  size="xl"
                  onClick={onConnectWallet}
                  icon={<Wallet className="w-5 h-5" />}
                  animated
                >
                  Connect Wallet
                </Button>
              )}
            </motion.div>

            {!web3State.isConnected && (
              <motion.div
                className="hero-notice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Badge
                  variant={trialUsed ? "warning" : "gaming"}
                  size="lg"
                  animated
                  icon={trialUsed ? "🎮" : "🎯"}
                >
                  {trialUsed ?
                    "Trial completed! Connect your wallet to continue playing and unlock Web3 features." :
                    "Try the game once for free, then connect your wallet for full access!"
                  }
                </Badge>
              </motion.div>
            )}

            {/* Scroll Indicator */}
            <motion.div
              className="scroll-indicator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </motion.div>
              <span className="scroll-text">Scroll to explore</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card variant="gaming" padding="lg" animated hover glow>
              <CardContent>
                <div className="game-preview">
                  <div className="preview-board">
                    {[...Array(9)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="preview-hole"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.8 + (i * 0.1),
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        {i === 2 || i === 5 || i === 7 ? (
                          <motion.div
                            className="preview-mole"
                            animate={{
                              y: [0, -10, 0],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.5
                            }}
                          >
                            🐹
                          </motion.div>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <motion.div
            className="stats-grid"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-content">
                  <motion.div
                    className="stat-value"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Game Features</h2>
            <p className="section-subtitle">
              Experience the classic game with modern Web3 enhancements
            </p>
          </motion.div>

          <div className="features-grid">
            {[
              {
                icon: <Gamepad2 className="w-8 h-8" />,
                title: "Classic Gameplay",
                description: "Enjoy the timeless Whac-A-Mole experience with smooth animations and responsive controls",
                badge: "Core",
                color: "blue"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Global Leaderboard",
                description: "Compete with players worldwide on our blockchain-powered leaderboard system",
                badge: "Competitive",
                color: "purple"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "NFT Achievements",
                description: "Unlock unique NFT achievements as you master the game and reach new milestones",
                badge: "Web3",
                color: "orange"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "ApeChain Integration",
                description: "Built on ApeChain for fast, low-cost transactions and seamless Web3 experience",
                badge: "Blockchain",
                color: "green"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Secure & Fair",
                description: "Provably fair gameplay with transparent, immutable results stored on blockchain",
                badge: "Security",
                color: "red"
              },
              {
                icon: <Coins className="w-8 h-8" />,
                title: "NFT Marketplace",
                description: "Trade your achievements and game assets with other players in our integrated marketplace",
                badge: "Economy",
                color: "yellow"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="gaming" padding="lg" animated hover glow>
                  <CardContent className="text-center space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="feature-icon text-primary-orange">
                        {feature.icon}
                      </div>
                      <Badge variant="gaming" size="sm">
                        {feature.badge}
                      </Badge>
                    </div>
                    <h3 className="feature-title text-xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="feature-description text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">What Players Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied players in the Web3 gaming revolution
            </p>
          </motion.div>

          <motion.div
            className="testimonials-carousel"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="testimonial-card"
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonials[currentTestimonial].text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div className="author-info">
                    <div className="author-name">{testimonials[currentTestimonial].author}</div>
                    <div className="author-role">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* NFT Showcase Section */}
      <section id="nfts" className="nft-section">
        <div className="section-container">
          <h2 className="section-title">NFT Achievements</h2>
          <p className="section-subtitle">
            Collect unique NFT achievements as you master the game
          </p>
          <div className="nft-showcase">
            <div className="nft-card">
              <div className="nft-image">🏆</div>
              <h4 className="nft-title">First Victory</h4>
              <p className="nft-description">Complete your first game</p>
            </div>
            <div className="nft-card">
              <div className="nft-image">⚡</div>
              <h4 className="nft-title">Speed Demon</h4>
              <p className="nft-description">Hit 10 moles in 5 seconds</p>
            </div>
            <div className="nft-card">
              <div className="nft-image">🎯</div>
              <h4 className="nft-title">Perfect Accuracy</h4>
              <p className="nft-description">100% hit rate in a game</p>
            </div>
            <div className="nft-card">
              <div className="nft-image">👑</div>
              <h4 className="nft-title">Leaderboard King</h4>
              <p className="nft-description">Reach #1 on leaderboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="roadmap-section">
        <div className="section-container">
          <h2 className="section-title">Roadmap</h2>
          <div className="roadmap-timeline">
            <div className="roadmap-phase">
              <div className="phase-number">1</div>
              <div className="phase-content">
                <h3 className="phase-title">Launch Phase</h3>
                <ul className="phase-items">
                  <li>✅ Core game mechanics</li>
                  <li>✅ ApeChain integration</li>
                  <li>✅ Basic NFT achievements</li>
                </ul>
              </div>
            </div>
            <div className="roadmap-phase">
              <div className="phase-number">2</div>
              <div className="phase-content">
                <h3 className="phase-title">Enhancement Phase</h3>
                <ul className="phase-items">
                  <li>🔄 Advanced achievements</li>
                  <li>🔄 Tournament system</li>
                  <li>🔄 Social features</li>
                </ul>
              </div>
            </div>
            <div className="roadmap-phase">
              <div className="phase-number">3</div>
              <div className="phase-content">
                <h3 className="phase-title">Expansion Phase</h3>
                <ul className="phase-items">
                  <li>📋 Mobile app</li>
                  <li>📋 Multiplayer modes</li>
                  <li>📋 Token rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Playing?</h2>
            <p className="cta-description">
              Join thousands of players competing on ApeChain
            </p>
            <button
              className="cta-button"
              onClick={handleGetStarted}
            >
              {web3State.isConnected ?
                'Enter Game' :
                trialUsed ?
                  'Connect Wallet' :
                  'Start Free Trial'
              }
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Whac-A-Mole Web3</span>
            </div>
            <div className="footer-links">
              <button className="footer-link">Privacy Policy</button>
              <button className="footer-link">Terms of Service</button>
              <button className="footer-link">Support</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Whac-A-Mole Web3. Built on ApeChain.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
