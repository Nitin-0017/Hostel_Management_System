import { useState, useEffect, useCallback } from "react";
import staffService from "../services/staffService";
import type { IStaffComplaint } from "../services/staffService";
import { useToast } from "../context/ToastContext";

export function useStaffComplaints() {
  const [complaints, setComplaints] = useState<IStaffComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getComplaints();
      setComplaints(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch complaints";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const markInProgress = async (id: string) => {
    try {
      setUpdatingId(id);
      const updated = await staffService.markComplaintInProgress(id);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c))
      );
      addToast("Complaint marked as In Progress", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to update complaint", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const resolveComplaint = async (id: string, note: string) => {
    try {
      setUpdatingId(id);
      const updated = await staffService.resolveComplaint(id, note);
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: updated.status } : c))
      );
      addToast("Complaint resolved! ✅", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to resolve complaint", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    complaints,
    loading,
    error,
    updatingId,
    markInProgress,
    resolveComplaint,
    refresh: fetchComplaints,
  };
}
