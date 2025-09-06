import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
// Correcting import paths for better module resolution
import apiClient from '../api/axiosConfig';
import Header from '../components/Header';
import QuestCard from '../components/QuestCard';
import IrrigationAdvisor from '../components/IrrigationAdvisor';
import ProgressTracker from '../components/ProgressTracker';
import QuestDetailModal from '../components/QuestDetailModal';

const DashboardPage = () => {
  const { t } = useTranslation();
  const [quests, setQuests] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleViewQuest = (quest) => {
    setSelectedQuest(quest);
  };

  const handleCloseModal = () => {
    setSelectedQuest(null);
    fetchData(); // Refresh data after a submission to update points, etc.
  };

  const fetchData = async () => {
    try {
      // Set loading to true only if it's the initial load
      if (quests.length === 0) setLoading(true);
      
      const [questsRes, quizzesRes] = await Promise.all([
        apiClient.get('/quests'),
        apiClient.get('/quizzes')
      ]);
      setQuests(questsRes.data);
      setQuizzes(quizzesRes.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Could not load dashboard content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="row mb-4">
          <div className="col-lg-8">
            <IrrigationAdvisor />
          </div>
          <div className="col-lg-4">
            <ProgressTracker />
          </div>
        </div>

        {/* --- REWARDS & COUPONS SECTION --- */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="card-title mb-3">{t('rewardsCoupons')}</h2>
                <p className="card-text text-muted mb-4">
                  {t('rewardsDescription')}
                </p>
                <Link to="/rewards" className="btn btn-success btn-lg">
                  <i className="fas fa-gift me-2"></i>{t('viewAllRewards')}
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* --- KNOWLEDGE HUB (QUIZZES) SECTION --- */}
        {quizzes.length > 0 && (
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="mb-4 text-center">{t('knowledgeHub')}</h2>
              <div className="row">
                  {quizzes.map((quiz) => (
                      <div className="col-md-6 col-lg-4 mb-4" key={quiz._id}>
                          <div className="card h-100 shadow-sm">
                              <div className="card-body text-center d-flex flex-column">
                                  <h5 className="card-title">{quiz.title}</h5>
                                  <p className="card-text flex-grow-1 text-muted">{quiz.category}</p>
                                  <Link to={`/quiz/${quiz._id}`} className="btn btn-outline-success mt-auto">
                                      <i className="fas fa-brain me-2"></i>{t('takeQuiz')} (+{quiz.points} {t('points')})
                                  </Link>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        {/* --- QUESTS SECTION --- */}
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 text-center">{t('yourAvailableQuests')}</h2>
            
            {loading && <p className="text-center">{t('loading')}</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row">
              {quests.map((quest) => (
                <div className="col-md-6 col-lg-4 mb-4" key={quest._id}>
                  <QuestCard quest={quest} onViewDetails={() => handleViewQuest(quest)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Render the Modal for quest details and submission */}
      <QuestDetailModal quest={selectedQuest} onClose={handleCloseModal} />
    </div>
  );
};

export default DashboardPage;

