import { useState, useEffect, useCallback } from "react";
import staffService from "../services/staffService";
import type {
  IStaffRoom,
  IStaffCleaningRequest,
  IStaffNotification,
} from "../services/staffService";

export interface IStaffDashboardData {
  rooms: IStaffRoom[];
  cleaningRequests: IStaffCleaningRequest[];
  notifications: IStaffNotification[];
}

export function useStaffDashboard() {
  const [data, setData] = useState<IStaffDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rooms, cleaningRequests, notifResult] = await Promise.all([
        staffService.getAssignedRooms().catch(() => [] as IStaffRoom[]),
        staffService.getCleaningRequests().catch(() => [] as IStaffCleaningRequest[]),
        staffService.getNotifications(1, 20).catch(() => ({ data: [] as IStaffNotification[], total: 0 })),
      ]);
      setData({
        rooms,
        cleaningRequests,
        notifications: notifResult.data,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, isLoading, error, refresh: fetchAll };
}
