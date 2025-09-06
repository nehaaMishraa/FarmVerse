import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Header from '../components/Header';
import ForumPostCard from '../components/ForumPostCard';
import ForumPostModal from '../components/ForumPostModal';
import ForumFilters from '../components/ForumFilters';

const ForumPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'lastActivity',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0
  });

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters
      });

      const response = await fetch(`http://localhost:5001/api/forum/posts?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, [filters]);

  const handleCreatePost = async (postData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        setShowCreateModal(false);
        fetchPosts(1); // Refresh posts
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create post');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handlePageChange = (page) => {
    fetchPosts(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="display-5 fw-bold text-success mb-2">{t('forum')}</h1>
                <p className="text-muted">{t('forumDescription')}</p>
              </div>
              <button
                className="btn btn-success btn-lg"
                onClick={() => setShowCreateModal(true)}
              >
                <i className="fas fa-plus me-2"></i>{t('createPost')}
              </button>
            </div>

            <ForumFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">{t('loading')}</span>
                </div>
                <p className="mt-2">{t('loading')}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fas fa-comments text-muted" style={{fontSize: '3rem'}}></i>
                </div>
                <h4 className="text-muted">{t('noPostsFound')}</h4>
                <p className="text-muted">{t('noPostsDescription')}</p>
                <button
                  className="btn btn-success"
                  onClick={() => setShowCreateModal(true)}
                >
                  <i className="fas fa-plus me-2"></i>{t('createFirstPost')}
                </button>
              </div>
            ) : (
              <>
                <div className="row">
                  {posts.map((post) => (
                    <div className="col-12 mb-4" key={post._id}>
                      <ForumPostCard post={post} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <nav aria-label="Forum pagination" className="mt-4">
                    <ul className="pagination justify-content-center">
                      <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={!pagination.hasPrev}
                        >
                          {t('previous')}
                        </button>
                      </li>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                        <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={!pagination.hasNext}
                        >
                          {t('next')}
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <ForumPostModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
        />
      )}
    </div>
  );
};

export default ForumPage;
