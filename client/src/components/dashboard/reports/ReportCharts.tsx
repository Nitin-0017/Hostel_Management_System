import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";
import "./ReportCharts.css";

interface ReportChartsProps {
  type: "OCCUPANCY" | "COMPLAINT" | "LEAVE";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const COLORS = ['#2F4156', '#567C8D', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const ReportCharts: React.FC<ReportChartsProps> = ({ type, data }) => {

  const renderOccupancyCharts = () => {
    const pieData = [
      { name: 'Occupied', value: data.occupiedBeds || 0 },
      { name: 'Vacant', value: data.vacantBeds || 0 },
    ];

    const blockData = data.blockWise ? Object.keys(data.blockWise).map(block => ({
      name: block,
      Occupied: data.blockWise[block].occupied || 0,
      Vacant: data.blockWise[block].vacant || 0,
    })) : [];

    return (
      <div className="charts-container">
        <div className="chart-box">
          <h4>Occupancy Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4>Block-wise Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={blockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Occupied" stackId="a" fill="var(--color-navy)" />
              <Bar dataKey="Vacant" stackId="a" fill="var(--color-border)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderComplaintCharts = () => {
    const pieData = [
      { name: 'Resolved', value: data.resolvedComplaints || 0 },
      { name: 'In Progress', value: data.inProgressComplaints || 0 },
      { name: 'Open', value: data.openComplaints || 0 },
    ];

    const categoryData = data.categoryBreakdown ? Object.keys(data.categoryBreakdown).map(cat => ({
      name: cat,
      Count: data.categoryBreakdown[cat] || 0,
    })) : [];

    return (
      <div className="charts-container">
        <div className="chart-box">
          <h4>Status Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4>Category Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="Count" fill="var(--color-navy)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderLeaveCharts = () => {
    const pieData = [
      { name: 'Approved', value: data.approvedRequests || 0 },
      { name: 'Pending', value: data.pendingRequests || 0 },
      { name: 'Rejected', value: data.rejectedRequests || 0 },
    ];

    // Dummy trend data since backend may not provide timeline for leaves directly
    const trendData = data.timeline || [
      { day: 'Mon', requests: 4 },
      { day: 'Tue', requests: 7 },
      { day: 'Wed', requests: 2 },
      { day: 'Thu', requests: 5 },
      { day: 'Fri', requests: 12 },
      { day: 'Sat', requests: 15 },
      { day: 'Sun', requests: 8 },
    ];

    return (
      <div className="charts-container">
        <div className="chart-box">
          <h4>Approval Ratio</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-box">
          <h4>Requests Timeline</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="var(--color-navy)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (type === "OCCUPANCY") return renderOccupancyCharts();
  if (type === "COMPLAINT") return renderComplaintCharts();
  if (type === "LEAVE") return renderLeaveCharts();

  return null;
};

export default ReportCharts;
