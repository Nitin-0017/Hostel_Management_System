import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useRoomData } from "../../hooks/useRoomData";

import RoomCard from "./components/RoomCard";
import Roommates from "./components/Roommates";
import Facilities from "./components/Facilities";
import CleaningCard from "./components/CleaningCard";
import ComplaintSection from "./components/ComplaintSection";

import SubmitComplaintModal from "../../components/modals/SubmitComplaintModal";
import RequestCleaningModal from "../../components/modals/RequestCleaningModal";

import "./MyRoom.css";

const MyRoom: React.FC = () => {
  const { room, complaints, cleanings, isLoading, error, refresh } = useRoomData();

  const [isCleaningModalOpen, setCleaningModalOpen] = useState(false);
  const [isComplaintModalOpen, setComplaintModalOpen] = useState(false);

  const hasRoom = !!room;

  return (
    <DashboardLayout>
      <div className="my-room-page">
        <div className="my-room-header">
          <h1>My Room</h1>
          <p>Manage your room details, roommates, and requests</p>
        </div>

        {error && (
          <div className="dashboard-error" style={{ marginBottom: "24px", color: "var(--color-danger)" }}>
            <p>{error}</p>
          </div>
        )}

        <div className="my-room-grid">
          {/* Main Column */}
          <div className="my-room-col">
            <RoomCard room={room} isLoading={isLoading} />
            <Facilities hasRoom={hasRoom} />
            <ComplaintSection 
              complaints={complaints} 
              isLoading={isLoading} 
              hasRoom={hasRoom} 
              onRaiseComplaint={() => setComplaintModalOpen(true)} 
            />
          </div>

          {/* Side Column */}
          <div className="my-room-col">
            <Roommates isLoading={isLoading} hasRoom={hasRoom} />
            <CleaningCard 
              cleanings={cleanings} 
              isLoading={isLoading} 
              hasRoom={hasRoom} 
              onRequestCleaning={() => setCleaningModalOpen(true)} 
            />
          </div>
        </div>
      </div>

      <SubmitComplaintModal 
        isOpen={isComplaintModalOpen} 
        onClose={() => setComplaintModalOpen(false)} 
        onSuccess={refresh} 
      />
      
      <RequestCleaningModal 
        isOpen={isCleaningModalOpen} 
        onClose={() => setCleaningModalOpen(false)} 
        onSuccess={refresh} 
      />
    </DashboardLayout>
  );
};

export default MyRoom;
