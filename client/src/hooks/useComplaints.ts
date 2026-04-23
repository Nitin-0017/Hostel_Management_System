import { useState, useEffect, useCallback } from "react";
import complaintService from "../services/complaintService";
import type { IComplaintResponse, ISubmitComplaint } from "../services/complaintService";
import { useToast } from "../context/ToastContext";

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<IComplaintResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await complaintService.getMyComplaints();
      setComplaints(data);
    } catch (err: any) {
      console.error("Error fetching complaints:", err);
      setError(err.response?.data?.message || "Failed to fetch complaints");
      addToast(err.response?.data?.message || "Failed to fetch complaints", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = async (data: ISubmitComplaint): Promise<boolean> => {
    try {
      await complaintService.submitComplaint(data);
      addToast("Complaint submitted successfully", "success");
      await fetchComplaints(); // Refresh the list
      return true;
    } catch (err: any) {
      console.error("Error submitting complaint:", err);
      addToast(err.response?.data?.message || "Failed to submit complaint", "error");
      return false;
    }
  };

  return {
    complaints,
    loading,
    error,
    submitComplaint,
    refreshComplaints: fetchComplaints
  };
};
