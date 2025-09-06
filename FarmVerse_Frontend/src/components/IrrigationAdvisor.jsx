import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import apiClient from '../api/axiosConfig.js';

// A helper to choose an icon (using Bootstrap Icons class names)
const getWeatherIcon = (iconName) => {
  switch (iconName) {
    case 'rain':
      return 'bi-cloud-drizzle-fill';
    case 'thermometer-sun':
      return 'bi-thermometer-sun';
    default:
      return 'bi-sun-fill';
  }
};

const IrrigationAdvisor = () => {
  const { t } = useTranslation();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await apiClient.get('/advisor/irrigation');
        setAdvice(response.data);
      } catch (err) {
        console.error('Failed to fetch irrigation advice:', err);
        setError('Could not load smart advice.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvice();
  }, []);

  if (loading) {
    return (
      <div className="card advisor-card shadow-sm mb-4">
        <div className="card-body text-center">
          <p>{t('loading')}</p>
          <div className="spinner-border" style={{color: 'var(--farm-green-dark)'}} role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-danger text-white shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title">{t('error')}</h5>
          <p className="card-text">{error}</p>
        </div>
      </div>
    );
  }

  return (
    // We'll use our custom CSS class 'advisor-card' for the main container
    <div className="card advisor-card shadow-sm mb-4">
      {/* The header now uses our custom dark green color */}
      <div className="card-header text-white" style={{backgroundColor: 'var(--farm-green-dark)'}}>
        <h5 className="mb-0 text-white fw-bold">
          <i className="fas fa-tint me-2"></i>{t('smartIrrigationAdvisor')}
        </h5>
      </div>
      <div className="card-body">
        <div className="d-flex align-items-center">
          {/* The icon now uses our custom dark green */}
          <i className={`bi ${getWeatherIcon(advice.icon)} me-3`} style={{ fontSize: '2.5rem', color: 'var(--farm-green-dark)' }}></i>
          <div>
            <h6 className="card-title mb-1">Recommendation for {advice.location} ({advice.temperature}°C)</h6>
            {/* The main advice text now uses our accent color to pop */}
            <p className="fw-bold mb-1" style={{color: 'var(--farm-accent)'}}>{advice.advice}</p>
            {/* The reason text uses our main brown color for readability */}
            <p className="card-text small mb-0" style={{color: 'var(--farm-brown)'}}>{advice.reason}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationAdvisor;

