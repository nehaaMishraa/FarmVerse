import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
// Correcting the import path to be more explicit
import apiClient from '../api/axiosConfig.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // THIS IS THE NEW DIAGNOSTIC LINE
    console.log('Login form submitted. Attempting to log in...');
    
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await apiClient.post(
        '/auth/login',
        { mobileNumber, password },
        config
      );
      
      console.log('Login successful, token received:', data.token);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');

    } catch (err) {
      console.error('An error occurred during login:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg" style={{ width: '25rem' }}>
        <div className="card-body p-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="card-title mb-0">{t('login')}</h3>
            <LanguageSwitcher />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mobileNumberInput" className="form-label">{t('phone')}</label>
              <input
                type="text"
                className="form-control"
                id="mobileNumberInput"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">{t('password')}</label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? t('loading') : t('login')}
            </button>
          </form>
          <div className="text-center mt-3">
            <small>
              {t('dontHaveAccount')} <Link to="/register">{t('register')}</Link>
            </small>
            <div className="text-center mt-3">
              <Link to="/" className="btn btn-outline-secondary btn-sm">
                <i className="fas fa-arrow-left me-1"></i>{t('backToWelcome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

