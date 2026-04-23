import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../dashboard/Button";
import cleaningService from "../../services/cleaningService";
import { useToast } from "../../context/ToastContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RequestCleaningModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await cleaningService.requestCleaning({ notes });
      addToast("Cleaning requested successfully!", "success");
      setNotes("");
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.message || "Failed to request cleaning", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Room Cleaning">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Additional Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Please empty the dustbin, mop the floor properly..."
            rows={4}
          />
        </div>

        <div className="modal-actions">
          <Button label="Cancel" variant="ghost" onClick={onClose} type="button" />
          <Button label={isSubmitting ? "Requesting..." : "Submit Request"} variant="primary" type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

export default RequestCleaningModal;
