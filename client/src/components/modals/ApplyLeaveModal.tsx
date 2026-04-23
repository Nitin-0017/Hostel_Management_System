import React, { useState, useMemo } from "react";
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

  const today = new Date().toISOString().split("T")[0];

  const daysCount = useMemo(() => {
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      if (end >= start) {
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    return 0;
  }, [fromDate, toDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (daysCount <= 0) {
      addToast("Invalid date range", "error");
      return;
    }
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
        <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>From Date</label>
            <input
              type="date"
              value={fromDate}
              min={today}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>To Date</label>
            <input
              type="date"
              value={toDate}
              min={fromDate || today}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>
        </div>

        {daysCount > 0 && (
          <div className="leave-duration-preview" style={{ padding: '12px', background: 'var(--color-background-alt)', borderRadius: '8px', fontSize: '0.95rem', marginBottom: '16px', color: 'var(--color-primary)', fontWeight: 500 }}>
            Duration: {daysCount} {daysCount === 1 ? "day" : "days"}
          </div>
        )}

        <div className="form-group">
          <label>Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please provide a detailed reason for your leave..."
            rows={4}
            required
          />
        </div>

        <div className="modal-actions">
          <Button label="Cancel" variant="ghost" onClick={onClose} type="button" />
          <Button label={isSubmitting ? "Submitting..." : "Apply Leave"} variant="primary" type="submit" disabled={isSubmitting || daysCount <= 0} />
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
