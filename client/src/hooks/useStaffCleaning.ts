import { useState, useEffect, useCallback } from "react";
import staffService from "../services/staffService";
import type { IStaffCleaningRequest } from "../services/staffService";
import { useToast } from "../context/ToastContext";

export function useStaffCleaning() {
  const [requests, setRequests] = useState<IStaffCleaningRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getCleaningRequests();
      setRequests(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch cleaning requests";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const startCleaning = async (id: string) => {
    try {
      setUpdatingId(id);
      const updated = await staffService.updateCleaningStatus(id, "IN_PROGRESS");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status } : r))
      );
      addToast("Cleaning started!", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const completeCleaning = async (id: string) => {
    try {
      setUpdatingId(id);
      const updated = await staffService.updateCleaningStatus(id, "COMPLETED");
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: updated.status, completedAt: updated.completedAt } : r))
      );
      addToast("Marked as completed! ✅", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    requests,
    loading,
    error,
    updatingId,
    startCleaning,
    completeCleaning,
    refresh: fetchRequests,
  };
}
