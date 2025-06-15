import { useState } from 'react';
import { Shop, Hat } from '../lib/game/Shop';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop;
  onPurchase: (hatId: string) => void;
  onEquip: (hatId: string) => void;
}

const ShopModal = ({ isOpen, onClose, shop, onPurchase, onEquip }: ShopModalProps) => {
  const [selectedHat, setSelectedHat] = useState<Hat | null>(null);
  const shopState = shop.getState();

  if (!isOpen) return null;

  const handlePurchase = (hatId: string) => {
    if (shop.buyHat(hatId)) {
      onPurchase(hatId);
    }
  };

  const handleEquip = (hatId: string) => {
    if (shop.equipHat(hatId)) {
      onEquip(hatId);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#FFF',
        borderRadius: '15px',
        padding: '30px',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        fontFamily: 'Courier New, monospace',
        border: '4px solid #333'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>Hat Shop</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              background: '#FFD700',
              padding: '5px 15px',
              borderRadius: '20px',
              border: '2px solid #B8860B',
              fontWeight: 'bold',
              color: '#333'
            }}>
              💰 {shopState.totalCoins} coins
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#FF6B6B',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 15px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {shopState.hats.map((hat) => (
            <div
              key={hat.id}
              style={{
                border: `3px solid ${hat.unlocked ? '#4A90E2' : '#CCC'}`,
                borderRadius: '10px',
                padding: '15px',
                backgroundColor: hat.unlocked ? '#F0F8FF' : '#F5F5F5',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setSelectedHat(hat)}
            >
              <div style={{
                width: '40px',
                height: '20px',
                backgroundColor: hat.color,
                borderRadius: '10px 10px 0 0',
                margin: '0 auto 10px auto',
                border: '2px solid #333'
              }} />
              
              <h3 style={{ 
                margin: '0 0 5px 0', 
                textAlign: 'center',
                color: hat.unlocked ? '#333' : '#888'
              }}>
                {hat.name}
              </h3>
              
              <p style={{ 
                margin: '0 0 10px 0', 
                fontSize: '12px', 
                textAlign: 'center',
                color: hat.unlocked ? '#666' : '#AAA'
              }}>
                {hat.description}
              </p>
              
              <div style={{ textAlign: 'center' }}>
                {!hat.unlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(hat.id);
                    }}
                    disabled={!shop.canAfford(hat.id)}
                    style={{
                      background: shop.canAfford(hat.id) ? '#4A90E2' : '#CCC',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: shop.canAfford(hat.id) ? 'pointer' : 'not-allowed',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '12px'
                    }}
                  >
                    Buy for {hat.cost} coins
                  </button>
                ) : shopState.equippedHat === hat.id ? (
                  <div style={{
                    background: '#00FF00',
                    color: 'white',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    EQUIPPED
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquip(hat.id);
                    }}
                    style={{
                      background: '#F39C12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '12px'
                    }}
                  >
                    Equip
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {shopState.equippedHat && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#E8F5E8',
            borderRadius: '10px',
            border: '2px solid #4A90E2',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Currently Equipped</h4>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
              {shopState.hats.find(h => h.id === shopState.equippedHat)?.name}
            </p>
            <button
              onClick={() => {
                shop.unequipHat();
                onEquip('');
              }}
              style={{
                background: '#888',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace'
              }}
            >
              Remove Hat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopModal;