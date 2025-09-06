import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

const ForumFilters = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/forum/categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalFilters({ ...localFilters, search: value });
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onFilterChange({ ...localFilters, search: value });
    }, 500);
  };

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      search: '',
      sortBy: 'lastActivity',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row g-3">
          {/* Search */}
          <div className="col-md-4">
            <label htmlFor="search" className="form-label">{t('search')}</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder={t('searchPlaceholder')}
                value={localFilters.search}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-md-3">
            <label htmlFor="category" className="form-label">{t('category')}</label>
            <select
              className="form-select"
              id="category"
              value={localFilters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {t(`category.${category.value}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-md-2">
            <label htmlFor="sortBy" className="form-label">{t('sortBy')}</label>
            <select
              className="form-select"
              id="sortBy"
              value={localFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="lastActivity">{t('lastActivity')}</option>
              <option value="createdAt">{t('dateCreated')}</option>
              <option value="views">{t('mostViewed')}</option>
              <option value="likeCount">{t('mostLiked')}</option>
              <option value="commentCount">{t('mostCommented')}</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="col-md-2">
            <label htmlFor="sortOrder" className="form-label">{t('order')}</label>
            <select
              className="form-select"
              id="sortOrder"
              value={localFilters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <option value="desc">{t('newest')}</option>
              <option value="asc">{t('oldest')}</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="col-md-1 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
              title={t('clearFilters')}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumFilters;
