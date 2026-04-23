import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../dashboard/Button";
import complaintService from "../../services/complaintService";
import { useToast } from "../../context/ToastContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubmitComplaintModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [category, setCategory] = useState("MAINTENANCE");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await complaintService.submitComplaint({ category, subject, description });
      addToast("Complaint submitted successfully!", "success");
      setSubject("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.message || "Failed to submit complaint", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit a Complaint">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="CLEANLINESS">Cleanliness</option>
            <option value="FOOD">Food & Mess</option>
            <option value="SECURITY">Security</option>
            <option value="NOISE">Noise Disturbance</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="E.g., Fan not working in room"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide more details..."
            rows={4}
            required
          />
        </div>

        <div className="modal-actions">
          <Button label="Cancel" variant="ghost" onClick={onClose} type="button" />
          <Button label={isSubmitting ? "Submitting..." : "Submit"} variant="primary" type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

export default SubmitComplaintModal;
