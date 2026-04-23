import { useState, useCallback, useEffect } from "react";
import leaveService, { type ILeaveResponse, type IApplyLeave } from "../services/leaveService";
import { useToast } from "../context/ToastContext";

export const useLeave = () => {
  const [leaves, setLeaves] = useState<ILeaveResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchLeaves = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await leaveService.getMyLeaves();
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLeaves(sorted);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to load leave requests";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const submitLeave = async (data: IApplyLeave): Promise<boolean> => {
    try {
      await leaveService.applyLeave(data);
      addToast("Leave request submitted successfully!", "success");
      await fetchLeaves(); // Refresh the list
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to submit leave request";
      addToast(msg, "error");
      return false;
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return { leaves, isLoading, error, refresh: fetchLeaves, submitLeave };
};
