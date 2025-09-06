import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

const WelcomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          {/* Language Switcher */}
          <div className="d-flex justify-content-end pt-3">
            <LanguageSwitcher />
          </div>
          
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-3 fw-bold text-dark mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                  {t('welcomeTitle')} <span className="text-success">{t('farmVerse')}</span>
                </h1>
                <p className="lead text-dark mb-4" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)', fontWeight: '500'}}>
                  {t('welcomeSubtitle')}
                </p>
                <div className="hero-features mb-5">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-center">
                        <i className="fas fa-seedling text-success me-3 fs-4"></i>
                        <span className="text-dark fw-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>{t('sustainableFarming')}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-center">
                        <i className="fas fa-trophy text-warning me-3 fs-4"></i>
                        <span className="text-dark fw-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>{t('gamifiedLearning')}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-center">
                        <i className="fas fa-users text-info me-3 fs-4"></i>
                        <span className="text-dark fw-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>{t('communityDriven')}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="feature-item d-flex align-items-center">
                        <i className="fas fa-gift text-danger me-3 fs-4"></i>
                        <span className="text-dark fw-semibold" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.2)'}}>{t('realRewards')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hero-buttons text-center">
                  <Link to="/register" className="btn btn-success btn-lg px-5">
                    <i className="fas fa-user-plus me-2"></i>{t('joinNow')}
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image text-center">
                {/* Empty space to let the background show through */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold text-success mb-3">{t('whyChooseFarmVerse')}</h2>
              <p className="lead text-muted">{t('whyChooseSubtitle')}</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-gamepad text-success"></i>
                </div>
                <h5 className="fw-bold">{t('gamifiedExperience')}</h5>
                <p className="text-muted">{t('gamifiedExperienceDesc')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-brain text-warning"></i>
                </div>
                <h5 className="fw-bold">{t('smartLearning')}</h5>
                <p className="text-muted">{t('smartLearningDesc')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">
                  <i className="fas fa-gift text-info"></i>
                </div>
                <h5 className="fw-bold">{t('realRewards')}</h5>
                <p className="text-muted">{t('realRewardsDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section py-5 bg-success text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">1000+</h3>
                <p className="mb-0">{t('activeFarmers')}</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">50+</h3>
                <p className="mb-0">{t('farmingQuests')}</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">25+</h3>
                <p className="mb-0">{t('partnerRewards')}</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="stat-item">
                <h3 className="display-4 fw-bold">95%</h3>
                <p className="mb-0">{t('successRate')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold text-success mb-3">{t('readyToTransform')}</h2>
              <p className="lead text-muted mb-4">
                {t('readyToTransformDesc')}
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-success btn-lg me-3 px-5">
                  <i className="fas fa-rocket me-2"></i>{t('startYourJourney')}
                </Link>
                <Link to="/login" className="btn btn-outline-success btn-lg px-5">
                  <i className="fas fa-sign-in-alt me-2"></i>{t('signIn')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
