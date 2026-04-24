import { useState, useEffect, useCallback } from "react";
import roomService from "../services/roomService";
import type { IRoomAllocationResponse } from "../services/roomService";
import complaintService from "../services/complaintService";
import type { IComplaintResponse } from "../services/complaintService";
import leaveService from "../services/leaveService";
import type { ILeaveResponse } from "../services/leaveService";
import cleaningService from "../services/cleaningService";
import type { ICleaningResponse } from "../services/cleaningService";
import notificationService from "../services/notificationService";
import type { INotification } from "../services/notificationService";

export interface IDashboardData {
  roomAllocation: IRoomAllocationResponse | null;
  complaints: IComplaintResponse[];
  leaves: ILeaveResponse[];
  cleanings: ICleaningResponse[];
  notifications: INotification[];
}

export function useDashboard() {
  const [data, setData] = useState<IDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roomAllocation, complaints, leaves, cleanings, notifResult] = await Promise.all([
        roomService.getMyRoom(),
        complaintService.getMyComplaints(),
        leaveService.getMyLeaves(),
        cleaningService.getMyCleaning(),
        notificationService.getMyNotifications(1, 20),
      ]);

      setData({
        roomAllocation,
        complaints,
        leaves,
        cleanings,
        notifications: notifResult.data,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboardData,
  };
}
