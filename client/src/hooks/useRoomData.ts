import { useState, useEffect, useCallback } from "react";
import type { IRoomAllocationResponse } from "../services/roomService";
import roomService from "../services/roomService";
import type { IComplaintResponse } from "../services/complaintService";
import complaintService from "../services/complaintService";
import type { ICleaningResponse } from "../services/cleaningService";
import cleaningService from "../services/cleaningService";

export const useRoomData = () => {
  const [room, setRoom] = useState<IRoomAllocationResponse | null>(null);
  const [complaints, setComplaints] = useState<IComplaintResponse[]>([]);
  const [cleanings, setCleanings] = useState<ICleaningResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [roomData, complaintsData, cleaningsData] = await Promise.all([
        roomService.getMyRoom().catch(() => null),
        complaintService.getMyComplaints().catch(() => []),
        cleaningService.getMyCleaning().catch(() => []),
      ]);

      setRoom(roomData);
      setComplaints(complaintsData);
      setCleanings(cleaningsData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch room data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { room, complaints, cleanings, isLoading, error, refresh: fetchData };
};
