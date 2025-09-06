import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const MyCoupons = () => {
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyCoupons = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/coupons/my-coupons');
      setRedeemedCoupons(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch my coupons:', err);
      setError('Could not load your redeemed coupons. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Discount code copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard. Please copy manually: ' + text);
    });
  };

  useEffect(() => {
    fetchMyCoupons();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your coupons...</p>
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
    <div className="my-coupons">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Redeemed Coupons</h2>
        <button 
          className="btn btn-outline-success btn-sm"
          onClick={fetchMyCoupons}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-1"></i>Refresh
        </button>
      </div>
      
      {redeemedCoupons.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="fas fa-ticket-alt text-muted" style={{fontSize: '4rem'}}></i>
          </div>
          <h4 className="text-muted">No coupons redeemed yet</h4>
          <p className="text-muted">Complete quests and quizzes to earn points and redeem exciting rewards!</p>
        </div>
      ) : (
        <div className="row">
          {redeemedCoupons.map((redeemedCoupon, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-success">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <i className="fas fa-check-circle fs-4"></i>
                  <small>Redeemed on {new Date(redeemedCoupon.redeemedAt).toLocaleDateString()}</small>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{redeemedCoupon.couponId?.title || 'Coupon'}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {redeemedCoupon.couponId?.description || 'Description not available'}
                  </p>
                  
                  {redeemedCoupon.couponId?.sponsor && (
                    <div className="mb-3">
                      <small className="text-muted">Sponsored by: <strong>{redeemedCoupon.couponId.sponsor}</strong></small>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={redeemedCoupon.discountCode}
                        readOnly
                        placeholder="Discount Code"
                      />
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={() => copyToClipboard(redeemedCoupon.discountCode)}
                      >
                        <i className="fas fa-copy me-1"></i>Copy
                      </button>
                    </div>
                    <small className="text-muted mt-1 d-block">
                      Use this code when making your purchase
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCoupons;
