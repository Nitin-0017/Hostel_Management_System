import React, { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../dashboard/Button";
import leaveService from "../../services/leaveService";
import { useToast } from "../../context/ToastContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyLeaveModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await leaveService.applyLeave({
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
        reason,
      });
      addToast("Leave request submitted successfully!", "success");
      setFromDate("");
      setToDate("");
      setReason("");
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast(err.message || "Failed to submit leave request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you taking leave?"
            rows={3}
            required
          />
        </div>

        <div className="modal-actions">
          <Button label="Cancel" variant="ghost" onClick={onClose} type="button" />
          <Button label={isSubmitting ? "Submitting..." : "Apply"} variant="primary" type="submit" disabled={isSubmitting} />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
