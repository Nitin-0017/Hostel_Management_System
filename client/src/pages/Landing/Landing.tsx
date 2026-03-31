import { useEffect, useState } from "react";
import "./Landing.css";

const texts = [
  "Manage rooms, services, and student life effortlessly ",
  "A modern hostel experience powered by technology",
  "Smart living starts with HostelHub"
];

const Landing = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">

      {/* 🔥 TITLE */}
      <h1 className="title">HostelHub</h1>

      {/* 🔥 ANIMATED TEXT */}
      <p key={textIndex} className="animated-text">
        {texts[textIndex]}
      </p>

      {/* 🔥 CARDS */}
      <div className="card-container">

        <div
          className="role-card admin"
          onClick={() => (window.location.href = "/login/admin")}
        >
          <div className="card-overlay">
            <h2>Admin Portal</h2>
          </div>
        </div>

        <div
          className="role-card student"
          onClick={() => (window.location.href = "/login/student")}
        >
          <div className="card-overlay">
            <h2>Student Portal</h2>
          </div>
        </div>

      </div>

      {/* 🔥 FOOTER */}
      <footer className="footer">
        <p>© 2026 HostelHub</p>
        <p>Smart Hostel Management System</p>
        <p>Contact: support@hostelhub.com</p>
      </footer>
    </div>
  );
};

export default Landing;