import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import StaffDashboardLayout from "../../components/layout/StaffDashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "./StaffDashboard.css";

interface Task {
  id: string;
  title: string;
  room: string;
  priority: "high" | "medium" | "low";
  type: "cleaning" | "maintenance" | "inspection";
  due: string;
}

interface ComplaintItem {
  id: string;
  student: string;
  room: string;
  issue: string;
  status: "open" | "in-progress" | "resolved";
  time: string;
}

interface WeeklyPoint {
  day: string;
  tasks: number;
  resolved: number;
}

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();

  const weeklyData: WeeklyPoint[] = [
    { day: "Mon", tasks: 8, resolved: 7 },
    { day: "Tue", tasks: 6, resolved: 6 },
    { day: "Wed", tasks: 10, resolved: 8 },
    { day: "Thu", tasks: 5, resolved: 5 },
    { day: "Fri", tasks: 9, resolved: 7 },
    { day: "Sat", tasks: 4, resolved: 4 },
    { day: "Sun", tasks: 2, resolved: 2 },
  ];

  const [tasks] = useState<Task[]>([
    { id: "1", title: "Deep clean common area", room: "Block A – Ground Floor", priority: "high", type: "cleaning", due: "Today, 2:00 PM" },
    { id: "2", title: "Fix leaking tap", room: "Room B-204", priority: "high", type: "maintenance", due: "Today, 4:00 PM" },
    { id: "3", title: "Monthly room inspection", room: "Block C – All rooms", priority: "medium", type: "inspection", due: "Tomorrow" },
    { id: "4", title: "Replace corridor bulbs", room: "Block D – Floor 2", priority: "low", type: "maintenance", due: "This week" },
    { id: "5", title: "Clean washrooms", room: "Block B – Floor 1", priority: "medium", type: "cleaning", due: "Today, 6:00 PM" },
  ]);

  const [complaints] = useState<ComplaintItem[]>([
    { id: "1", student: "Rahul Mehta", room: "A-101", issue: "WiFi not working", status: "open", time: "30 min ago" },
    { id: "2", student: "Priya Sharma", room: "B-205", issue: "Water heater broken", status: "in-progress", time: "2 hours ago" },
    { id: "3", student: "Karan Patel", room: "C-310", issue: "Window latch broken", status: "open", time: "5 hours ago" },
    { id: "4", student: "Anita Singh", room: "D-102", issue: "Noisy AC unit", status: "resolved", time: "1 day ago" },
  ]);

  const priorityColor: Record<Task["priority"], string> = {
    high: "var(--color-error)",
    medium: "var(--color-warning)",
    low: "var(--color-success)",
  };

  const typeIcon: Record<Task["type"], React.ReactNode> = {
    cleaning: <Icon name="cleaning" size="md" color="var(--color-teal)" />,
    maintenance: <Icon name="wrench" size="md" color="var(--color-warning)" />,
    inspection: <Icon name="check-circle" size="md" color="var(--color-info)" />,
  };

  const statusClass: Record<ComplaintItem["status"], string> = {
    open: "status-open",
    "in-progress": "status-progress",
    resolved: "status-resolved",
  };

  const statusLabel: Record<ComplaintItem["status"], string> = {
    open: "Open",
    "in-progress": "In Progress",
    resolved: "Resolved",
  };

  return (
    <StaffDashboardLayout>
      <div className="staff-dashboard">

        {/* Welcome */}
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>Good day, {user ? user.firstName : "Staff"}!</h1>
              <p>Here's your shift overview for today</p>
            </div>
            <div className="welcome-right">
              <div className="welcome-date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <span className="role-badge">Staff Member</span>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              label="Tasks Today"
              value="9"
              icon={<Icon name="bolt" size="lg" />}
              color="primary"
              trend={{ value: 12, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Open Complaints"
              value="4"
              icon={<Icon name="complaints" size="lg" />}
              color="warning"
              trend={{ value: 2, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Rooms Inspected"
              value="18"
              icon={<Icon name="room" size="lg" />}
              color="success"
              trend={{ value: 20, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Leave Requests"
              value="2"
              icon={<Icon name="leave" size="lg" />}
              color="info"
              onClick={() => {}}
            />
          </div>
        </section>

        {/* Chart + Quick Actions row */}
        <div className="staff-top-grid">
          <Card
            icon={<Icon name="activity" size="lg" color="var(--color-navy)" />}
            title="Weekly Task Summary"
            subtitle="Tasks assigned vs resolved"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }}
                />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tasks" name="Assigned" fill="#2F4156" radius={[4, 4, 0, 0]} maxBarSize={20} />
                <Bar dataKey="resolved" name="Resolved" fill="#567C8D" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card
            icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />}
            title="Quick Actions"
          >
            <div className="quick-actions">
              <Button label="Log Cleaning Done" icon={<Icon name="cleaning" size="sm" />} fullWidth />
              <Button label="Report Maintenance" icon={<Icon name="wrench" size="sm" />} fullWidth />
              <Button label="Mark Room Inspected" icon={<Icon name="check-circle" size="sm" />} fullWidth />
              <Button label="Apply for Leave" icon={<Icon name="leave" size="sm" />} fullWidth />
              <Button label="Post Announcement" icon={<Icon name="bell" size="sm" />} fullWidth />
            </div>
          </Card>
        </div>

        {/* Tasks + Complaints grid */}
        <div className="dashboard-grid">
          <div className="grid-column grid-column-left">
            <Card
              icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />}
              title="Today's Tasks"
              subtitle="Assigned to you"
            >
              <div className="task-list">
                {tasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <span className="task-type-icon">{typeIcon[task.type]}</span>
                    <div className="task-content">
                      <p className="task-title">{task.title}</p>
                      <p className="task-meta">
                        <Icon name="room" size="sm" /> {task.room} &nbsp;·&nbsp; {task.due}
                      </p>
                    </div>
                    <span
                      className="task-priority"
                      style={{ color: priorityColor[task.priority] }}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <Button label="Done" variant="ghost" size="sm" onClick={() => {}} />
                  </div>
                ))}
              </div>
              <footer className="card-action-footer">
                <Button label="View All Tasks" variant="ghost" size="sm" />
              </footer>
            </Card>
          </div>

          <div className="grid-column grid-column-right">
            <Card
              icon={<Icon name="complaints" size="lg" color="var(--color-navy)" />}
              title="Complaint Queue"
              subtitle="Requires your attention"
            >
              <div className="complaint-list">
                {complaints.map((c) => (
                  <div key={c.id} className="complaint-item">
                    <div className="complaint-info">
                      <p className="complaint-student">{c.student} — Room {c.room}</p>
                      <p className="complaint-issue">{c.issue}</p>
                      <p className="complaint-time">{c.time}</p>
                    </div>
                    <div className="complaint-right">
                      <span className={`complaint-status ${statusClass[c.status]}`}>
                        {statusLabel[c.status]}
                      </span>
                      {c.status !== "resolved" && (
                        <Button label="Resolve" variant="primary" size="sm" onClick={() => {}} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <footer className="card-action-footer">
                <Button label="View All Complaints" variant="ghost" size="sm" />
              </footer>
            </Card>
          </div>
        </div>

        {/* Announcements */}
        <section className="announcements-section">
          <Card
            icon={<Icon name="bell" size="lg" color="var(--color-navy)" />}
            title="Announcements"
          >
            <div className="announcements-list">
              {[
                { badge: "Important", title: "Water Maintenance 15th–16th April", time: "2 days ago" },
                { badge: "Event", title: "Staff Meeting — Friday 5:00 PM", time: "3 days ago" },
                { badge: "Notice", title: "New cleaning schedule effective Monday", time: "1 week ago" },
              ].map((a, i) => (
                <div key={i} className="announcement-item">
                  <span className="announcement-badge">{a.badge}</span>
                  <div className="announcement-content">
                    <h4>{a.title}</h4>
                    <small>{a.time}</small>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </StaffDashboardLayout>
  );
};

export default StaffDashboard;
