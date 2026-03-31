import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>HostelHub</h2>
        <ul>
          <li>🏠 Dashboard</li>
          <li>👨‍🎓 Students</li>
          <li>🏢 Rooms</li>
          <li>💰 Fees</li>
          <li>📢 Complaints</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <h1>Dashboard</h1>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>120</p>
          </div>

          <div className="card">
            <h3>Available Rooms</h3>
            <p>15</p>
          </div>

          <div className="card">
            <h3>Pending Complaints</h3>
            <p>8</p>
          </div>

          <div className="card">
            <h3>Fees Collected</h3>
            <p>₹2,50,000</p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome">
          <h2>Welcome to HostelHub 🚀</h2>
          <p>Manage students, rooms, fees and complaints easily.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;