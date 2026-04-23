import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/dashboard/Button';
import type { IUser } from '../../../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
  onSave: (data: { firstName: string; lastName: string; phone: string }) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Information">
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="input-row">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. John"
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="input-group">
          <label>Email Address (ReadOnly)</label>
          <input
            type="email"
            value={user.email}
            disabled
            style={{ cursor: 'not-allowed', opacity: 0.6 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Button label="Cancel" variant="ghost" onClick={onClose} disabled={isSubmitting} />
          <Button label={isSubmitting ? "Saving..." : "Save Changes"} variant="primary" type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
