import React from 'react';
import TierBadge from './TierBadge';

const TierProgress = ({ tier, tierProgress, points, className = '' }) => {
  const getTierInfo = (tier) => {
    const tierInfo = {
      Bronze: { next: 'Silver', threshold: 200, color: '#CD7F32' },
      Silver: { next: 'Gold', threshold: 500, color: '#C0C0C0' },
      Gold: { next: 'Platinum', threshold: 1000, color: '#FFD700' },
      Platinum: { next: null, threshold: null, color: '#E5E4E2' }
    };
    return tierInfo[tier] || tierInfo.Bronze;
  };

  const tierInfo = getTierInfo(tier);
  const isMaxTier = tier === 'Platinum';

  return (
    <div className={`tier-progress ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <TierBadge tier={tier} size="sm" />
          <span className="ms-2 fw-bold text-muted">
            {isMaxTier ? 'MAXIMUM TIER ACHIEVED!' : `Progress to ${tierInfo.next}`}
          </span>
        </div>
        <span className="badge bg-secondary">
          {points} Points
        </span>
      </div>
      
      {!isMaxTier && (
        <div className="progress mb-2" style={{ height: '12px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${tierProgress.percentage}%`,
              backgroundColor: tierInfo.color,
              background: `linear-gradient(90deg, ${tierInfo.color}, ${tierInfo.color}dd)`,
              transition: 'width 0.6s ease-in-out'
            }}
            aria-valuenow={tierProgress.percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <span className="progress-text">
              {tierProgress.percentage}%
            </span>
          </div>
        </div>
      )}
      
      {!isMaxTier && (
        <div className="d-flex justify-content-between text-muted small">
          <span>{tierProgress.current} points earned</span>
          <span>{tierInfo.threshold - points} points to go</span>
        </div>
      )}
      
      {isMaxTier && (
        <div className="text-center">
          <div className="alert alert-success mb-0">
            <strong>🏆 Congratulations!</strong> You've reached the highest tier!
            <br />
            <small>You're a true agricultural innovator!</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default TierProgress;
