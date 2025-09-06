import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';

const RegisterPage = () => {
  const { t } = useTranslation();
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    password: '',
    state: '',
    district: '',
    panchayat: '',
    farmSize: '',
    primaryCrops: '',
  });

  // State for loading and error messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hook for navigation
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Prepare data for the backend
    const userData = {
      ...formData,
      primaryCrops: formData.primaryCrops.split(',').map(crop => crop.trim()),
      farmSize: Number(formData.farmSize),
      location: {
        state: formData.state,
        district: formData.district,
        panchayat: formData.panchayat,
      },
    };

    try {
      // Send registration request to the backend
      const response = await axios.post('http://localhost:5001/api/auth/register', userData);
      
      console.log('Server Response:', response.data); // DEBUG: Log the entire response

      // **IMPROVED LOGIC**: Check if a token was actually received
      if (response.data && response.data.token) {
        console.log('Token received:', response.data.token);
        
        // Save the token to localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token saved successfully.');

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        // This handles cases where registration is successful but no token is sent back
        console.error('Registration successful, but no token was received from the server.');
        setError('Account created, but auto-login failed. Please go to the login page.');
      }

    } catch (err) {
      // Log detailed error from the backend if available
      console.error('An error occurred during registration:', err.response ? err.response.data : err.message);
      setError('Registration failed. This mobile number may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="card-title mb-2">{t('joinNow')}</h2>
              <p className="card-subtitle text-muted mb-0">{t('welcomeSubtitle')}</p>
            </div>
            <LanguageSwitcher />
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">{t('name')}</label>
                <input type="text" className="form-control" id="name" name="name" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="mobileNumber" className="form-label">{t('phone')}</label>
                <input type="text" className="form-control" id="mobileNumber" name="mobileNumber" onChange={handleChange} required />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password"  className="form-label">{t('password')}</label>
              <input type="password"  className="form-control" id="password" name="password" onChange={handleChange} required />
            </div>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label htmlFor="state" className="form-label">{t('state')}</label>
                <input type="text" className="form-control" id="state" name="state" onChange={handleChange} required />
              </div>
               <div className="col-md-4 mb-3">
                <label htmlFor="district" className="form-label">{t('district')}</label>
                <input type="text" className="form-control" id="district" name="district" onChange={handleChange} required />
              </div>
               <div className="col-md-4 mb-3">
                <label htmlFor="panchayat" className="form-label">{t('panchayat')}</label>
                <input type="text" className="form-control" id="panchayat" name="panchayat" onChange={handleChange} required />
              </div>
            </div>
             <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="farmSize" className="form-label">{t('farmSize')}</label>
                <input type="number" className="form-control" id="farmSize" name="farmSize" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="primaryCrops" className="form-label">{t('primaryCrops')}</label>
                <input type="text" className="form-control" id="primaryCrops" name="primaryCrops" onChange={handleChange} required />
              </div>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-success" disabled={isLoading}>
                {isLoading ? t('registering') : t('register')}
              </button>
            </div>
          </form>
          <p className="mt-3 text-center">
            {t('alreadyHaveAccount')} <Link to="/login">{t('login')}</Link>
          </p>
          <div className="text-center mt-2">
            <Link to="/" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-arrow-left me-1"></i>{t('backToWelcome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

