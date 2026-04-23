import React, { useState } from 'react';
import Modal from '../../../../components/ui/Modal';

interface CleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { notes?: string }) => Promise<boolean>;
  isSubmitting: boolean;
}

const CleaningModal: React.FC<CleaningModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({ notes });
    if (success) {
      setNotes('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Room Cleaning">
      <form onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label>Room Number</label>
          <input 
            type="text" 
            value="Auto-filled from your profile" 
            disabled 
            className="readonly-input" 
          />
        </div>
        
        <div className="modal-form-group">
          <label>Additional Notes (Optional)</label>
          <textarea
            placeholder="E.g., Please clean the bathroom, dust the windows..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isSubmitting}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #C8D9E6', background: '#F5EFEB', color: '#2F4156', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isSubmitting}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', background: '#567C8D', color: '#FFFFFF', fontWeight: '600', cursor: 'pointer' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CleaningModal;
