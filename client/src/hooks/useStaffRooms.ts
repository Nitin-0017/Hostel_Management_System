import { useState, useEffect, useCallback } from "react";
import staffService from "../services/staffService";
import type { IStaffRoom } from "../services/staffService";
import { useToast } from "../context/ToastContext";

export function useStaffRooms() {
  const [rooms, setRooms] = useState<IStaffRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAssignedRooms();
      setRooms(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch assigned rooms";
      setError(msg);
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return { rooms, loading, error, refresh: fetchRooms };
}
