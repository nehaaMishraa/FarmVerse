import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const ForumPostModal = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/forum/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await onSubmit(postData);
    } catch (err) {
      console.error('Error submitting post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('createNewPost')}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">{t('postTitle')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength="200"
                  placeholder={t('postTitlePlaceholder')}
                />
                <div className="form-text">
                  {formData.title.length}/200 {t('characters')}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">{t('category')}</label>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {t(`category.${category.value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">{t('postContent')}</label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  rows="8"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  maxLength="5000"
                  placeholder={t('postContentPlaceholder')}
                ></textarea>
                <div className="form-text">
                  {formData.content.length}/5000 {t('characters')}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="tags" className="form-label">{t('tags')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder={t('tagsPlaceholder')}
                />
                <div className="form-text">
                  {t('tagsDescription')}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    {t('creating')}
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus me-2"></i>
                    {t('createPost')}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumPostModal;
