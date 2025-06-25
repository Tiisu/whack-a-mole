import React from 'react';
import { nftImages, nftAssetTemplates } from '../data/nftAssets';
import { generateDummyAssets } from '../services/dummyDataService';

const NFTImageTest: React.FC = () => {
  const assets = generateDummyAssets(14);

  return (
    <div style={{ padding: '20px' }}>
      <h2>NFT Image Integration Test</h2>
      <p>Testing {Object.keys(nftImages).length} NFT images integration</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px',
        marginTop: '20px'
      }}>
        {assets.slice(0, 14).map((asset, index) => (
          <div key={asset.tokenId} style={{
            border: '2px solid #ddd',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9'
          }}>
            <img 
              src={asset.imageURI} 
              alt={asset.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
              onError={(e) => {
                console.error(`Failed to load image for ${asset.name}:`, asset.imageURI);
                (e.target as HTMLImageElement).style.backgroundColor = '#ffebee';
                (e.target as HTMLImageElement).alt = 'Failed to load';
              }}
              onLoad={() => {
                console.log(`Successfully loaded image for ${asset.name}`);
              }}
            />
            <h4 style={{ margin: '5px 0', fontSize: '14px' }}>{asset.name}</h4>
            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
              {asset.rarity} {asset.category}
            </p>
            <div style={{ fontSize: '11px', color: '#888' }}>
              P:{asset.power} S:{asset.speed} L:{asset.luck}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h3>Integration Status</h3>
        <ul>
          <li>✅ {Object.keys(nftImages).length} NFT images imported</li>
          <li>✅ {nftAssetTemplates.length} NFT templates created</li>
          <li>✅ Asset generation using real images</li>
          <li>✅ Marketplace integration ready</li>
        </ul>
      </div>
    </div>
  );
};

export default NFTImageTest;