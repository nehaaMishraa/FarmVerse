import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import TierBadge from './TierBadge';

const CouponCard = ({ coupon, onRedeem, loading, userTier = 'Bronze' }) => {
  const { t } = useTranslation();
  const getCategoryIcon = (category) => {
    const icons = {
      education: 'fas fa-graduation-cap',
      equipment: 'fas fa-tools',
      consultation: 'fas fa-user-tie',
      recognition: 'fas fa-trophy',
      analysis: 'fas fa-microscope'
    };
    return icons[category] || 'fas fa-gift';
  };

  const getCategoryColor = (category) => {
    const colors = {
      education: 'primary',
      equipment: 'success',
      consultation: 'info',
      recognition: 'warning',
      analysis: 'secondary'
    };
    return colors[category] || 'primary';
  };

  const getRequiredTier = (pointsRequired) => {
    if (pointsRequired >= 1000) return 'Platinum';
    if (pointsRequired >= 500) return 'Gold';
    if (pointsRequired >= 200) return 'Silver';
    return 'Bronze';
  };

  const getTierOrder = (tier) => {
    const order = { 'Bronze': 1, 'Silver': 2, 'Gold': 3, 'Platinum': 4 };
    return order[tier] || 1;
  };

  const requiredTier = getRequiredTier(coupon.pointsRequired);
  const userTierOrder = getTierOrder(userTier);
  const requiredTierOrder = getTierOrder(requiredTier);
  const hasRequiredTier = userTierOrder >= requiredTierOrder;

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className={`card h-100 shadow-sm border-${getCategoryColor(coupon.category)}`}>
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <i className={`${getCategoryIcon(coupon.category)} text-${getCategoryColor(coupon.category)}`} style={{fontSize: '1.5rem'}}></i>
          <span className={`badge bg-${getCategoryColor(coupon.category)}`}>
            {coupon.category.toUpperCase()}
          </span>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{coupon.title}</h5>
          <p className="card-text text-muted flex-grow-1">{coupon.description}</p>
          
          <div className="mb-3">
            <small className="text-muted">Sponsored by: <strong>{coupon.sponsor}</strong></small>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-dark fs-6">
              {coupon.pointsRequired} {t('points')}
            </span>
            <span className="text-muted">
              You have: <strong>{coupon.userPoints}</strong> {t('points')}
            </span>
          </div>
          
          {coupon.isRedeemed ? (
            <button className="btn btn-success" disabled>
              <i className="fas fa-check me-1"></i>{t('redeemed')}
            </button>
          ) : !hasRequiredTier ? (
            <button className="btn btn-outline-secondary" disabled style={{borderColor: '#6b8e23', color: '#6b8e23'}}>
              <i className="fas fa-lock me-1"></i>{t('getPointsToUnlock', { points: coupon.pointsRequired })}
            </button>
          ) : coupon.canRedeem ? (
            <button 
              className={`btn btn-${getCategoryColor(coupon.category)}`}
              onClick={() => onRedeem(coupon._id)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-1"></i>{t('loading')}
                </>
              ) : (
                <>
                  <i className="fas fa-gift me-1"></i>{t('redeem')}
                </>
              )}
            </button>
          ) : (
            <button className="btn btn-outline-secondary" disabled>
              <i className="fas fa-plus me-1"></i>Need {coupon.pointsRequired - coupon.userPoints} more {t('points')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
