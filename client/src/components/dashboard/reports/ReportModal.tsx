import React, { useState } from "react";
import Icon from "../Icon";
import Button from "../Button";
import adminService from "../../../services/adminService";
import { useToast } from "../../../context/ToastContext";
import "./ReportModal.css";

interface ReportModalProps {
  type: "OCCUPANCY" | "COMPLAINT" | "LEAVE";
  onClose: () => void;
  onSuccess: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ type, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("last30");
  const { addToast } = useToast();

  const titleMap = {
    OCCUPANCY: "Generate Occupancy Report",
    COMPLAINT: "Generate Complaint Report",
    LEAVE: "Generate Leave Report",
  };

  const descMap = {
    OCCUPANCY: "This will capture the current state of room allocations, total capacity, and block-wise occupancy.",
    COMPLAINT: "This will summarize all complaints within the selected time frame, their statuses, and resolution metrics.",
    LEAVE: "This will compile all leave requests, their approval status, and peak periods.",
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      if (type === "OCCUPANCY") {
        await adminService.generateOccupancyReport();
      } else if (type === "COMPLAINT") {
        await adminService.generateComplaintReport();
      } else if (type === "LEAVE") {
        await adminService.generateLeaveReport();
      }
      addToast("Report generated successfully", "success");
      onSuccess();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      addToast(err.message || "Failed to generate report", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="report-modal">
        <div className="modal-header">
          <h2>{titleMap[type]}</h2>
          <button className="close-btn" onClick={onClose}>
            <Icon name="close" size="md" />
          </button>
        </div>
        
        <div className="modal-content">
          <p className="report-desc">{descMap[type]}</p>
          
          <div className="form-group">
            <label>Date Range</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select"
            >
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <div className="filters-preview">
            <p className="filters-title">Included Filters:</p>
            <div className="filter-tags">
              <span className="tag">All Blocks</span>
              <span className="tag">All Statuses</span>
              {type === "COMPLAINT" && <span className="tag">All Categories</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button label="Cancel" variant="ghost" onClick={onClose} disabled={loading} />
          <Button 
            label={loading ? "Generating..." : "Generate Report"} 
            variant="primary" 
            onClick={handleGenerate} 
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
