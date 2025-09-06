import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Header';
import CouponSection from '../components/CouponSection';

const RewardsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold text-success mb-3">{t('rewardsCoupons')}</h1>
              <p className="text-muted">
                {t('rewardsDescription')}
              </p>
            </div>
          </div>
        </div>
        
        <CouponSection />
      </div>
    </div>
  );
};

export default RewardsPage;
