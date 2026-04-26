import React, { useState } from "react";
import supportService from "../../../services/supportService";
import { useToast } from "../../../context/ToastContext";
import Icon from "../../../components/dashboard/Icon";

interface SupportFormProps {
  onSuccess: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onSuccess }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast: showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      await supportService.createTicket({ subject, message });
      showToast("Ticket raised successfully", "success");
      setSubject("");
      setMessage("");
      onSuccess();
    } catch (error: any) {
      showToast(error.message || "Failed to raise ticket", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-form-card">
      <h2>
        <Icon name="help" size="sm" />
        Raise a New Ticket
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            placeholder="e.g., Wifi not working"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            rows={5}
            placeholder="Describe your issue in detail..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-ticket-btn" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};

export default SupportForm;
