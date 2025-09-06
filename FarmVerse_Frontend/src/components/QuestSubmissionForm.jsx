import React, { useState } from 'react';
// Correcting the import path for better module resolution
import apiClient from '../api/axiosConfig'; 

const QuestSubmissionForm = ({ questId, onSuccess }) => {
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
    
    const formData = new FormData();
    formData.append('questId', questId);
    formData.append('image', file);

    try {
      await apiClient.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Quest completed successfully! Your submission is under review.');
      
      // Call the onSuccess callback to close the modal after a delay
      if (onSuccess) {
        setTimeout(onSuccess, 2000); 
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return <div className="alert alert-success mt-3">{success}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="mb-3">
        <label htmlFor={`file-upload-${questId}`} className="form-label">
          Upload Proof (Image):
        </label>
        <input
          type="file"
          className="form-control"
          id={`file-upload-${questId}`}
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
  );
};

export default QuestSubmissionForm;

