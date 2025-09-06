import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import apiClient from '../api/axiosConfig';
import CouponCard from './CouponCard';

const CouponSection = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [userTier, setUserTier] = useState('Bronze');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/coupons');
      setCoupons(response.data);
      if (response.data.length > 0) {
        setUserPoints(response.data[0].userPoints);
        // Get user tier from the first coupon's user data
        setUserTier(response.data[0].userTier || 'Bronze');
      }
      setError('');
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
      setError('Could not load coupons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId) => {
    try {
      setRedeeming(true);
      const response = await apiClient.post(`/coupons/${couponId}/redeem`);
      
      // Show success message
      alert(`Coupon redeemed successfully!\nDiscount Code: ${response.data.coupon.discountCode}`);
      
      // Refresh coupons to update the UI
      await fetchCoupons();
    } catch (err) {
      console.error('Failed to redeem coupon:', err);
      const errorMessage = err.response?.data?.message || 'Failed to redeem coupon. Please try again.';
      alert(errorMessage);
    } finally {
      setRedeeming(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </div>
        <p className="mt-2">{t('loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="coupon-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <span className="badge bg-primary fs-6 me-3">
            Your {t('points')}: {userPoints}
          </span>
          <button 
            className="btn btn-outline-success btn-sm"
            onClick={fetchCoupons}
            disabled={loading}
          >
            <i className="fas fa-sync-alt me-1"></i>{t('refresh')}
          </button>
        </div>
      </div>
      
      {coupons.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-gift text-muted" style={{fontSize: '3rem'}}></i>
          </div>
          <h4 className="text-muted">{t('noRewardsAvailable')}</h4>
          <p className="text-muted">Check back later for new exciting rewards!</p>
        </div>
      ) : (
        <div className="row">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              onRedeem={handleRedeem}
              loading={redeeming}
              userTier={userTier}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponSection;
