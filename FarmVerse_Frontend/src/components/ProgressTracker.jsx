import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
// Correcting the import path for better module resolution
import apiClient from '../api/axiosConfig.js';
import TierProgress from './TierProgress';

const ProgressTracker = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/users/profile');
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <p>{t('loading')}</p>
            </div>
        </div>
    );
  }

  if (!profile) {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <p>{t('error')}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">{t('yourProgress')}</h5>
        <p className="card-text">
          {t('welcomeBack')}, <span className="fw-bold">{profile.name}</span>!
        </p>
        
        {/* Tier Progress Section */}
        <TierProgress 
          tier={profile.tier}
          tierProgress={profile.tierProgress}
          points={profile.points}
          className="mb-3"
        />
        
        <p className="text-muted small">
          {t('location')}: {profile.location.panchayat}
        </p>
      </div>
    </div>
  );
};

export default ProgressTracker;

