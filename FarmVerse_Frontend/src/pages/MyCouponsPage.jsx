import React from 'react';
import Header from '../components/Header';
import MyCoupons from '../components/MyCoupons';

const MyCouponsPage = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <MyCoupons />
      </div>
    </div>
  );
};

export default MyCouponsPage;
