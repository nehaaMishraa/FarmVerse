import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import apiClient from '../api/axiosConfig';
import Header from '../components/Header'; // We'll reuse the header
import TierBadge from '../components/TierBadge';

const LeaderboardPage = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await apiClient.get('/leaderboard');
        setLeaderboard(response.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Could not load the leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center mb-4">
              <h2 className="display-5 fw-bold text-success mb-3">{t('communityLeaderboard')}</h2>
              <p className="lead text-muted">{t('leaderboardSubtitle')}</p>
            </div>
            
            <div className="row justify-content-center mb-4">
              <div className="col-lg-10">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="text-success fw-bold mb-2">{t('tierSystem')}</h6>
                        <p className="text-muted small mb-0">
                          {t('tierSystemDesc')}
                        </p>
                      </div>
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => window.location.reload()}
                        disabled={loading}
                      >
                        <i className="fas fa-sync-alt me-1"></i>{t('refresh')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading && <p>{t('loading')}</p>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        {!loading && !error && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg">
                                        <div className="card-header bg-success text-dark">
                          <h5 className="mb-0 text-center">{t('topFarmers')}</h5>
                        </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-center" style={{width: '80px'}}>{t('rank')}</th>
                          <th scope="col" className="ps-4">{t('farmer')}</th>
                          <th scope="col" className="text-center" style={{width: '120px'}}>{t('tier')}</th>
                          <th scope="col" className="text-center" style={{width: '150px'}}>{t('location')}</th>
                          <th scope="col" className="text-center" style={{width: '100px'}}>{t('points')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((user, index) => (
                          <tr key={user._id} className="leaderboard-row">
                            <td className="text-center">
                              <span className="rank-number">
                                {index + 1}
                              </span>
                            </td>
                            <td className="ps-4">
                              <strong className="text-dark">{user.name}</strong>
                            </td>
                            <td className="text-center">
                              <TierBadge tier={user.tier} size="sm" />
                            </td>
                            <td className="text-center text-muted">
                              {user.location.panchayat}
                            </td>
                            <td className="text-center">
                              <span className="points-badge">{user.points}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
