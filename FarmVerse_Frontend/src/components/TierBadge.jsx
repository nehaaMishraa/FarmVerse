import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const TierBadge = ({ tier, size = 'md', showText = true }) => {
  const { t } = useTranslation();
  const getTierConfig = (tier) => {
    const configs = {
      Bronze: {
        color: '#8B4513',
        bgColor: '#8B4513',
        textColor: 'white',
        icon: '🌱',
        gradient: 'linear-gradient(135deg, #8B4513, #A0522D)',
        borderColor: '#654321'
      },
      Silver: {
        color: '#708090',
        bgColor: '#708090',
        textColor: 'white',
        icon: '🌾',
        gradient: 'linear-gradient(135deg, #708090, #5F6A6A)',
        borderColor: '#556B6B'
      },
      Gold: {
        color: '#DAA520',
        bgColor: '#DAA520',
        textColor: 'white',
        icon: '🌻',
        gradient: 'linear-gradient(135deg, #DAA520, #B8860B)',
        borderColor: '#B8860B'
      },
      Platinum: {
        color: '#2F4F4F',
        bgColor: '#2F4F4F',
        textColor: 'white',
        icon: '🌿',
        gradient: 'linear-gradient(135deg, #2F4F4F, #1C3A3A)',
        borderColor: '#1C3A3A'
      }
    };
    return configs[tier] || configs.Bronze;
  };

  const config = getTierConfig(tier);
  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
    xl: 'badge-xl'
  };

  return (
    <span 
      className={`badge ${sizeClasses[size] || sizeClasses.md} tier-badge`}
      style={{
        background: config.gradient,
        color: config.textColor,
        border: `1px solid ${config.borderColor}`,
        boxShadow: `0 2px 4px rgba(0,0,0,0.1)`,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        borderRadius: '8px',
        padding: '0.3rem 0.6rem',
        fontSize: '0.7rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.2rem',
        transition: 'all 0.2s ease',
        minWidth: '60px',
        justifyContent: 'center'
      }}
    >
      <span style={{ fontSize: '0.8em' }}>{config.icon}</span>
      {showText && <span>{t(tier.toLowerCase())}</span>}
    </span>
  );
};

export default TierBadge;
