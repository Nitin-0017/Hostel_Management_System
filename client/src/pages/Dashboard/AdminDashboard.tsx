import React from "react";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./AdminDashboard.css";



interface BlockInfo {
  block: string;
  occupied: number;
  total: number;
}

interface ActivityItem {
  icon: "bell" | "mail" | "complaints" | "check-circle" | "wrench" | "user" | "room" | "leave" | "cleaning" | "activity" | "bolt";
  iconColor: string;
  title: string;
  time: string;
}

interface PendingApproval {
  icon: "leave" | "room" | "user" | "mail" | "cleaning" | "complaints" | "check-circle" | "wrench" | "bell" | "activity" | "bolt";
  iconColor: string;
  name: string;
  detail: string;
}

interface Announcement {
  badge: string;
  title: string;
  body: string;
  time: string;
}

interface OccupancyPoint {
  month: string;
  rate: number;
}

interface IntakePoint {
  month: string;
  students: number;
}

interface ComplaintSlice {
  name: string;
  value: number;
  color: string;
}



const AdminDashboard: React.FC = () => {
  const { user } = useAuth();



  const occupancyData: OccupancyPoint[] = [
    { month: "Nov", rate: 68 },
    { month: "Dec", rate: 74 },
    { month: "Jan", rate: 80 },
    { month: "Feb", rate: 77 },
    { month: "Mar", rate: 85 },
    { month: "Apr", rate: 82 },
  ];

  const complaintData: ComplaintSlice[] = [
    { name: "Resolved", value: 18, color: "#10B981" },
    { name: "In Progress", value: 9, color: "#F59E0B" },
    { name: "Open", value: 7, color: "#EF4444" },
    { name: "On Hold", value: 3, color: "#567C8D" },
  ];

  const intakeData: IntakePoint[] = [
    { month: "Nov", students: 12 },
    { month: "Dec", students: 5 },
    { month: "Jan", students: 28 },
    { month: "Feb", students: 19 },
    { month: "Mar", students: 23 },
    { month: "Apr", students: 16 },
  ];

  const blockInfo: BlockInfo[] = [
    { block: "Block A", occupied: 45, total: 50 },
    { block: "Block B", occupied: 22, total: 25 },
    { block: "Block C", occupied: 18, total: 25 },
    { block: "Block D", occupied: 12, total: 20 },
  ];

  const activityItems: ActivityItem[] = [
    {
      icon: "user",
      iconColor: "var(--color-success)",
      title: "New student checked in — Room B-204",
      time: "30 min ago",
    },
    {
      icon: "mail",
      iconColor: "var(--color-info)",
      title: "Fee payment received — ₹12,000",
      time: "1 hour ago",
    },
    {
      icon: "complaints",
      iconColor: "var(--color-warning)",
      title: "Complaint raised — WiFi issue, Block A",
      time: "2 hours ago",
    },
    {
      icon: "check-circle",
      iconColor: "var(--color-success)",
      title: "Leave approved — Priya Sharma",
      time: "3 hours ago",
    },
    {
      icon: "wrench",
      iconColor: "var(--color-warning)",
      title: "Maintenance done — Room C-101",
      time: "5 hours ago",
    },
    {
      icon: "bell",
      iconColor: "var(--color-info)",
      title: "Announcement posted — Sports Day",
      time: "1 day ago",
    },
  ];

  const pendingApprovals: PendingApproval[] = [
    {
      icon: "leave",
      iconColor: "var(--color-warning)",
      name: "Rahul Mehta",
      detail: "3-day leave request",
    },
    {
      icon: "room",
      iconColor: "var(--color-info)",
      name: "Anita Singh",
      detail: "Room transfer B-102 → C-205",
    },
    {
      icon: "user",
      iconColor: "var(--color-success)",
      name: "Karan Patel",
      detail: "Guest permission (1 day)",
    },
  ];

  const announcements: Announcement[] = [
    {
      badge: "Important",
      title: "Water Maintenance 15th–16th April",
      body: "",
      time: "2 days ago",
    },
    {
      badge: "Event",
      title: "Sports Day — Saturday 20th April",
      body: "",
      time: "5 days ago",
    },
    {
      badge: "Notice",
      title: "Fee deadline extended to 30th April",
      body: "",
      time: "1 week ago",
    },
  ];


  const getPercentage = (occupied: number, total: number): number => {
    return Math.round((occupied / total) * 100);
  };


  const getOccupancyColor = (percentage: number): string => {
    if (percentage >= 85) return "var(--color-navy)";
    if (percentage >= 70) return "var(--color-teal)";
    return "var(--color-success)";
  };



  return (
    <AdminDashboardLayout>
      <div className="admin-dashboard">
     
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>
                Welcome back, {user ? `${user.firstName}` : "Admin"}!
              </h1>
              <p>Here's your hostel management overview</p>
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
              <span className="role-badge">Administrator</span>
            </div>
          </div>
        </section>

        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              label="Total Students"
              value="248"
              icon={<Icon name="user" size="lg" />}
              color="primary"
              trend={{ value: 12, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Rooms Occupied"
              value="82/100"
              icon={<Icon name="room" size="lg" />}
              color="success"
              trend={{ value: 5, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Fee Collected"
              value="₹4.2L"
              icon={<Icon name="mail" size="lg" />}
              color="info"
              trend={{ value: 8, direction: "up" }}
              onClick={() => {}}
            />
            <StatCard
              label="Open Complaints"
              value="7"
              icon={<Icon name="complaints" size="lg" />}
              color="warning"
              trend={{ value: 3, direction: "up" }}
              onClick={() => {}}
            />
          </div>
        </section>


        <section className="charts-row">

          <Card
            icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
            title="Occupancy Trend"
            subtitle="Last 6 months"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }}
                />
                <YAxis
                  domain={[50, 100]}
                  unit="%"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    background: "white",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2F4156"
                  strokeWidth={2.5}
                  dot={{ fill: "#2F4156", r: 4 }}
                  activeDot={{ r: 6, fill: "#567C8D" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>


          <Card
            icon={
              <Icon name="complaints" size="lg" color="var(--color-navy)" />
            }
            title="Complaint Status"
            subtitle="Current month"
          >
            <div className="chart-donut-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={complaintData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {complaintData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => value}
                    contentStyle={{
                      background: "white",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--color-text)",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-donut-center">
                <div className="donut-total">37</div>
                <div className="donut-label">Total</div>
              </div>
            </div>
          </Card>


          <Card
            icon={<Icon name="user" size="lg" color="var(--color-navy)" />}
            title="Student Intake"
            subtitle="Monthly admissions"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={intakeData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                  formatter={(value) => value}
                  contentStyle={{
                    background: "white",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="students"
                  fill="#2F4156"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </section>

        <div className="dashboard-grid">

          <div className="grid-column grid-column-left">

            <Card
              icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
              title="Room Occupancy"
              subtitle="Block-wise breakdown"
            >
              <div className="room-occupancy">
                {blockInfo.map((block) => {
                  const percentage = getPercentage(block.occupied, block.total);
                  const color = getOccupancyColor(percentage);
                  return (
                    <div key={block.block} className="block-row">
                      <span className="block-label">{block.block}</span>
                      <span className="block-count">
                        {block.occupied}/{block.total}
                      </span>
                      <div className="block-bar-wrap">
                        <div className="occupancy-bar">
                          <div
                            className="occupancy-fill"
                            style={{
                              width: `${percentage}%`,
                              background: color,
                            }}
                          />
                        </div>
                      </div>
                      <span className="block-percent">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
              <footer className="card-action-footer">
                <Button label="Manage Rooms" variant="ghost" size="sm" />
              </footer>
            </Card>


            <Card
              icon={<Icon name="activity" size="lg" color="var(--color-navy)" />}
              title="Recent Activity"
            >
              <div className="activity-list">
                {activityItems.map((item, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">
                      <Icon
                        name={item.icon}
                        size="md"
                        color={item.iconColor}
                      />
                    </span>
                    <div className="activity-content">
                      <p className="activity-title">{item.title}</p>
                      <p className="activity-time">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>


          <div className="grid-column grid-column-right">

            <Card
              icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />}
              title="Quick Actions"
            >
              <div className="quick-actions">
                <Button
                  label="Add New Student"
                  icon={<Icon name="user" size="sm" />}
                  fullWidth
                />
                <Button
                  label="Allocate Room"
                  icon={<Icon name="room" size="sm" />}
                  fullWidth
                />
                <Button
                  label="Record Fee Payment"
                  icon={<Icon name="mail" size="sm" />}
                  fullWidth
                />
                <Button
                  label="Post Announcement"
                  icon={<Icon name="bell" size="sm" />}
                  fullWidth
                />
              </div>
            </Card>


            <Card
              icon={<Icon name="leave" size="lg" color="var(--color-navy)" />}
              title="Pending Approvals"
              subtitle="Requires your action"
            >
              <div className="approvals-list">
                {pendingApprovals.map((approval, index) => (
                  <div key={index} className="approval-item">
                    <div className="approval-info">
                      <span className="approval-icon">
                        <Icon
                          name={approval.icon}
                          size="md"
                          color={approval.iconColor}
                        />
                      </span>
                      <div className="approval-text">
                        <p>{approval.name}</p>
                        <small>{approval.detail}</small>
                      </div>
                    </div>
                    <div className="approval-actions">
                      <Button
                        label="Reject"
                        variant="ghost"
                        size="sm"
                        onClick={() => {}}
                      />
                      <Button
                        label="Approve"
                        variant="primary"
                        size="sm"
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <footer className="card-action-footer">
                <Button
                  label="View All Requests"
                  variant="ghost"
                  size="sm"
                />
              </footer>
            </Card>
          </div>
        </div>


        <section className="announcements-section">
          <Card
            icon={<Icon name="bell" size="lg" color="var(--color-navy)" />}
            title="Manage Announcements"
          >
            <div className="announcements-list">
              {announcements.map((announcement, index) => (
                <div key={index} className="announcement-item">
                  <span className="announcement-badge">
                    {announcement.badge}
                  </span>
                  <div className="announcement-content">
                    <h4>{announcement.title}</h4>
                    {announcement.body && <p>{announcement.body}</p>}
                    <small>{announcement.time}</small>
                  </div>
                </div>
              ))}
            </div>
            <Button
              label="Post New Announcement"
              fullWidth
              onClick={() => {}}
            />
          </Card>
        </section>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;