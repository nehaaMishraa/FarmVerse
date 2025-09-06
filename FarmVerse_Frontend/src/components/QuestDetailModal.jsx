import React from 'react';
// Correcting the import path for better module resolution
import QuestSubmissionForm from './QuestSubmissionForm'; 

const QuestDetailModal = ({ quest, onClose }) => {
  if (!quest) return null;

  return (
    <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{quest.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6>Why this is important:</h6>
              <p>{quest.learningMaterial}</p>
              {quest.externalLink && (
                <a href={quest.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                  <i className="bi bi-youtube me-2"></i>Watch a Helpful Video
                </a>
              )}
            </div>
            <div className="border-top pt-3">
              <h6>Complete the Quest:</h6>
              <p className="text-muted small">{quest.description}</p>
              <QuestSubmissionForm questId={quest._id} onSuccess={onClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestDetailModal;

