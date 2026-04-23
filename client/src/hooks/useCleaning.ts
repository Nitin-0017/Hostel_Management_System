import { useState, useEffect, useCallback } from "react";
import type { ICleaningRequest, ISubmitCleaning } from "../services/cleaningService";
import cleaningService from "../services/cleaningService";
import { useToast } from "../context/ToastContext";

export const useCleaning = () => {
  const [requests, setRequests] = useState<ICleaningRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addToast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cleaningService.getMyCleaningRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch cleaning requests");
      addToast("Failed to load cleaning requests", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const submitRequest = async (data: ISubmitCleaning) => {
    try {
      setIsSubmitting(true);
      await cleaningService.requestCleaning(data);
      addToast("Cleaning request submitted successfully", "success");
      await fetchRequests();
      return true;
    } catch (err: any) {
      addToast(err.response?.data?.message || "Failed to submit cleaning request", "error");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    requests,
    loading,
    error,
    isSubmitting,
    submitRequest,
    refreshRequests: fetchRequests,
  };
};
