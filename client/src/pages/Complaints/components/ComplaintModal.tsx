import React, { useState } from 'react';
import type { ISubmitComplaint } from '../../../services/complaintService';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ISubmitComplaint) => Promise<boolean>;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "Maintenance (Electrical, Plumbing, Carpentry)", value: "MAINTENANCE" },
  { label: "Cleanliness",                                  value: "CLEANLINESS" },
  { label: "Food",                                         value: "FOOD"        },
  { label: "Security",                                     value: "SECURITY"    },
  { label: "Noise",                                        value: "NOISE"       },
  { label: "Others",                                       value: "OTHER"       },
];

const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit({ subject, category, description });
    setIsSubmitting(false);

    if (success) {
      setSubject("");
      setDescription("");
      setCategory(CATEGORIES[0].value);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Raise a Complaint</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g., Fan not working"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting || !subject.trim() || !description.trim()}>
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
