import React, { useState } from 'react';
// Correcting the import path to be absolute from the project root
import apiClient from '/src/api/axiosConfig.js';

const QuestCard = ({ quest }) => {
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to submit.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('questId', quest._id);
    // This 'image' MUST match the backend field name
    formData.append('image', file);

    try {
      const response = await apiClient.post('/submissions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Quest completed successfully! Your submission is under review.');
      setShowForm(false);
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{quest.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{quest.category}</h6>
        <p className="card-text flex-grow-1">{quest.description}</p>
        
        {success && <div className="alert alert-success mt-3">{success}</div>}

        {!success && (
          <>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className="badge bg-success p-2">+{quest.points} Points</span>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? 'Cancel' : 'Complete Quest'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mt-3 border-top pt-3">
                <div className="mb-3">
                  <label htmlFor={`file-upload-${quest._id}`} className="form-label">
                    Upload Proof (Image):
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id={`file-upload-${quest._id}`}
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                <button 
                  type="submit" 
                  className="btn btn-success w-100" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Proof'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestCard;

