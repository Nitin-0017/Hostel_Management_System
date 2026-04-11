import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import "./StudentDashboard.css";

interface RoomInfo {
  roomNumber: string;
  capacity: number;
  occupancy: number;
  floor: number;
  block: string;
}

const StudentDashboard: React.FC = () => {

  const { user } = useAuth();


  const roomInfo: RoomInfo = {
    roomNumber: "B-305",
    capacity: 4,
    occupancy: 3,
    floor: 3,
    block: "B",
  };

  const [pendingComplaints] = useState(2);
  const [pendingLeave] = useState(1);

  return (
    <DashboardLayout>
      <div className="student-dashboard">
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>
                Welcome back, {user ? `${user.firstName} ${user.lastName}` : "Student"}! 
              </h1>
              <p>Here's your hostel management overview</p>
            </div>
            <div className="welcome-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </section>


        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              label="Pending Complaints"
              value={pendingComplaints}
              icon={<Icon name="complaints" size="lg" />}
              color="warning"
              trend={{ value: 100, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Leave Requests"
              value={pendingLeave}
              icon={<Icon name="leave" size="lg" />}
              color="info"
              trend={{ value: 50, direction: "down" }}
              onClick={() => {}}
            />
            <StatCard
              label="Room Occupancy"
              value="3/4"
              icon={<Icon name="room" size="lg" />}
              color="success"
              trend={{ value: 75, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Cleaning Requests"
              value="1"
              icon={<Icon name="cleaning" size="lg" />}
              color="primary"
              onClick={() => {}}
            />
          </div>
        </section>


        <div className="dashboard-grid">

          <div className="grid-column grid-column-left">

            <Card
              icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
              title="My Room Details"
              subtitle="Block B, Floor 3"
            >
              <div className="room-details">
                <div className="detail-row">
                  <span className="detail-label">Room Number:</span>
                  <span className="detail-value">{roomInfo.roomNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Floor:</span>
                  <span className="detail-value">
                    {roomInfo.floor} (Block {roomInfo.block})
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Capacity:</span>
                  <span className="detail-value">
                    {roomInfo.occupancy}/{roomInfo.capacity} Occupied
                  </span>
                </div>
                <div className="occupancy-bar">
                  <div
                    className="occupancy-fill"
                    style={{
                      width: `${(roomInfo.occupancy / roomInfo.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <footer className="card-action-footer">
                <Button label="View Roommates" variant="ghost" size="sm" />
              </footer>
            </Card>


            <Card icon={<Icon name="activity" size="lg" color="var(--color-navy)" />} title="Recent Activity">
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon">
                    <Icon name="mail" size="md" color="var(--color-teal)" />
                  </span>
                  <div className="activity-content">
                    <p className="activity-title">Fee Receipt Uploaded</p>
                    <p className="activity-time">2 hours ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">
                    <Icon name="check-circle" size="md" color="var(--color-success)" />
                  </span>
                  <div className="activity-content">
                    <p className="activity-title">Leave Request Approved</p>
                    <p className="activity-time">1 day ago</p>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon">
                    <Icon name="wrench" size="md" color="var(--color-warning)" />
                  </span>
                  <div className="activity-content">
                    <p className="activity-title">Maintenance Scheduled</p>
                    <p className="activity-time">3 days ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>


          <div className="grid-column grid-column-right">

            <Card icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />} title="Quick Actions">
              <div className="quick-actions">
                <Button label="Submit Complaint" icon={<Icon name="complaints" size="sm" />} fullWidth />
                <Button label="Apply for Leave" icon={<Icon name="leave" size="sm" />} fullWidth />
                <Button label="Request Cleaning" icon={<Icon name="cleaning" size="sm" />} fullWidth />
              </div>
            </Card>
          </div>
        </div>


        <section className="announcements-section">
          <Card icon={<Icon name="bell" size="lg" color="var(--color-navy)" />} title="Latest Announcements">
            <div className="announcements-list">
              <div className="announcement-item">
                <span className="announcement-badge">Important</span>
                <div>
                  <h4>Hostel Maintenance Schedule</h4>
                  <p>Water maintenance scheduled on 15th-16th April</p>
                  <small>Posted 2 days ago</small>
                </div>
              </div>
              <div className="announcement-item">
                <span className="announcement-badge">Event</span>
                <div>
                  <h4>Sports Day Next Week</h4>
                  <p>Annual sports day will be held on Saturday, 20th April</p>
                  <small>Posted 5 days ago</small>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;