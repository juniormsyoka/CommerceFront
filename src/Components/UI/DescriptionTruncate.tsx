// Components/UI/DescriptionTruncate.tsx
import React, { useState } from 'react';

interface DescriptionTruncateProps {
  text: string;
  maxLength?: number;
}

const DescriptionTruncate: React.FC<DescriptionTruncateProps> = ({ 
  text, 
  maxLength = 150 
}) => {
  const [showModal, setShowModal] = useState(false);
  
  if (!text) return null;
  
  const needsTruncation = text.length > maxLength;
  const truncatedText = needsTruncation ? text.slice(0, maxLength) + '...' : text;

  return (
    <>
      <p className="product-description">
        {truncatedText}
        {needsTruncation && (
          <button 
            className="read-more-btn"
            onClick={() => setShowModal(true)}
          >
            Read more
          </button>
        )}
      </p>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="description-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Description</h3>
              <button 
                className="close-modal"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>{text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DescriptionTruncate;