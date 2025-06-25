import React, { useState } from 'react';
import { generateDummyAssets, generateDummyListings } from '../services/dummyDataService';
import { nftAssetTemplates } from '../data/nftAssets';

const DemoNFTPreview: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const demoAssets = generateDummyAssets(14);
  const demoListings = generateDummyListings(demoAssets);

  if (!showPreview) {
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 1000,
        backgroundColor: '#ff6b35',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }} onClick={() => setShowPreview(true)}>
        🎮 Preview Demo NFTs
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      zIndex: 2000,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #eee',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>🎯 Hackathon Demo - NFT Preview</h2>
          <button 
            onClick={() => setShowPreview(false)}
            style={{
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2d5a2d' }}>✅ Integration Status</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>📁 {nftAssetTemplates.length} NFT templates loaded</li>
            <li>🖼️ {demoAssets.length} demo assets generated</li>
            <li>🛒 {demoListings.length} marketplace listings created</li>
            <li>🎮 Demo mode ready for hackathon!</li>
          </ul>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {demoAssets.slice(0, 14).map((asset, index) => (
            <div key={asset.tokenId} style={{
              border: '2px solid #ddd',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: '150px',
                height: '150px',
                margin: '0 auto 10px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #ddd'
              }}>
                <img 
                  src={asset.imageURI} 
                  alt={asset.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.backgroundColor = '#ffebee';
                    (e.target as HTMLImageElement).alt = '❌ Failed to load';
                  }}
                />
              </div>
              
              <h4 style={{ 
                margin: '5px 0', 
                fontSize: '13px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                {asset.name}
              </h4>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '5px',
                marginBottom: '8px'
              }}>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  backgroundColor: getRarityColor(asset.rarity),
                  color: 'white'
                }}>
                  {asset.rarity}
                </span>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2'
                }}>
                  {asset.category}
                </span>
              </div>
              
              <div style={{ 
                fontSize: '11px', 
                color: '#666',
                display: 'flex',
                justifyContent: 'space-around'
              }}>
                <span>⚡{asset.power}</span>
                <span>🏃{asset.speed}</span>
                <span>🍀{asset.luck}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#fff3e0',
          borderRadius: '8px',
          border: '2px solid #ff9800'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#e65100' }}>🚀 Ready for Hackathon Demo!</h3>
          <p style={{ margin: '0 0 10px 0' }}>
            <strong>Next Steps:</strong>
          </p>
          <ol style={{ marginLeft: '20px', color: '#333' }}>
            <li>Navigate to the NFT Marketplace in your app</li>
            <li>Enable "Demo Mode" using the toggle switch</li>
            <li>Your real NFT images will appear in the marketplace</li>
            <li>Demonstrate buying, selling, and trading functionality</li>
          </ol>
          <p style={{ 
            margin: '15px 0 0 0', 
            padding: '10px', 
            backgroundColor: '#e8f5e8', 
            borderRadius: '6px',
            fontSize: '14px'
          }}>
            💡 <strong>Pro Tip:</strong> All 14 of your custom NFT images are now integrated and will show up automatically in demo mode!
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function for rarity colors
const getRarityColor = (rarity: string): string => {
  switch (rarity.toUpperCase()) {
    case 'MYTHIC': return '#9c27b0';
    case 'LEGENDARY': return '#ff9800';
    case 'EPIC': return '#673ab7';
    case 'RARE': return '#2196f3';
    case 'UNCOMMON': return '#4caf50';
    case 'COMMON': return '#757575';
    default: return '#757575';
  }
};

export default DemoNFTPreview;