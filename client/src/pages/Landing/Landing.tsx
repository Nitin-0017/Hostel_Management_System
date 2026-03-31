import { useEffect, useState } from "react";
import "./Landing.css";

type SystemStatus = {
  success: boolean;
  message: string;
  uptime: number;
  timestamp: string;
};

const Landing = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/health");
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="landing">
      <div className="landing-card">
        <h1 className="title">HostelHub</h1>
        <p className="subtitle">Smart Hostel Management System</p>

        <div className="status">
          <span>Status:</span>
          {loading ? (
            <span className="badge neutral">Checking...</span>
          ) : status?.success ? (
            <span className="badge success">Running</span>
          ) : (
            <span className="badge error">Down</span>
          )}
        </div>

        {status && (
          <div className="details">
            <p><strong>Message:</strong> {status.message}</p>
            <p><strong>Uptime:</strong> {Math.floor(status.uptime)}s</p>
          </div>
        )}

        <div className="buttons">
          <button onClick={() => (window.location.href = "/login")}>
            Login
          </button>

          <button
            className="secondary"
            onClick={() => (window.location.href = "/signup")}
          >
            Signup
          </button>
        </div>

        <button className="refresh" onClick={fetchStatus}>
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default Landing;