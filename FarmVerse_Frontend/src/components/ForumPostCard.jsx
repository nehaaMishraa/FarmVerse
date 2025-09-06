import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import TierBadge from './TierBadge';

const ForumPostCard = ({ post }) => {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const getCategoryIcon = (category) => {
    const icons = {
      'general': 'fas fa-comments',
      'crops': 'fas fa-seedling',
      'irrigation': 'fas fa-tint',
      'equipment': 'fas fa-tools',
      'pests': 'fas fa-bug',
      'weather': 'fas fa-cloud-sun',
      'success-stories': 'fas fa-trophy',
      'questions': 'fas fa-question-circle'
    };
    return icons[category] || 'fas fa-comments';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'general': 'primary',
      'crops': 'success',
      'irrigation': 'info',
      'equipment': 'warning',
      'pests': 'danger',
      'weather': 'secondary',
      'success-stories': 'success',
      'questions': 'primary'
    };
    return colors[category] || 'primary';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/forum/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const truncateContent = (content, maxLength = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Link to={`/forum/post/${post._id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm border-0 forum-post-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="d-flex align-items-center">
              <i className={`${getCategoryIcon(post.category)} text-${getCategoryColor(post.category)} me-2`}></i>
              <span className={`badge bg-${getCategoryColor(post.category)} me-2`}>
                {t(`category.${post.category}`)}
              </span>
              {post.isPinned && (
                <span className="badge bg-warning me-2">
                  <i className="fas fa-thumbtack me-1"></i>{t('pinned')}
                </span>
              )}
            </div>
            <div className="text-muted small">
              {formatDate(post.lastActivity)}
            </div>
          </div>

          <h5 className="card-title text-dark mb-2">{post.title}</h5>
          <p className="card-text text-muted mb-3">
            {truncateContent(post.content)}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="mb-3">
              {post.tags.map((tag, index) => (
                <span key={index} className="badge bg-light text-dark me-1 mb-1">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <div className="avatar-circle me-2">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="fw-bold text-dark small">{post.author.name}</div>
                  <TierBadge tier={post.author.tier} size="sm" />
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center text-muted">
              <button
                className={`btn btn-sm me-3 ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={handleLike}
              >
                <i className={`fas fa-heart me-1 ${isLiked ? 'fas' : 'far'}`}></i>
                {likeCount}
              </button>
              
              <span className="me-3">
                <i className="fas fa-comment me-1"></i>
                {post.commentCount || 0}
              </span>
              
              <span>
                <i className="fas fa-eye me-1"></i>
                {post.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ForumPostCard;
