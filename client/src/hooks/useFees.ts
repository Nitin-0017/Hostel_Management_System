import { useState, useEffect, useCallback } from "react";
import feeService from "../services/feeService";
import type { IFeeRecord, IFeeSummary } from "../services/feeService";
import { useToast } from "../context/ToastContext";

export const useFees = () => {
  const [fees, setFees]       = useState<IFeeRecord[]>([]);
  const [summary, setSummary] = useState<IFeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchFees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [feesData, summaryData] = await Promise.all([
        feeService.getMyFees(),
        feeService.getMyFeeSummary(),
      ]);
      setFees(feesData);
      setSummary(summaryData);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to load fee records";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchFees(); }, [fetchFees]);

  return { fees, summary, loading, error, refresh: fetchFees };
};
