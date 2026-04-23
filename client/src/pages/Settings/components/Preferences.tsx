import React, { useState, useEffect } from "react";
import { useToast } from "../../../context/ToastContext";

const Preferences: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { showToast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    const storedNotifications = localStorage.getItem("notifications") !== "false"; // Default true
    
    setDarkMode(storedDarkMode);
    setNotifications(storedNotifications);
    
    // Apply dark mode to body for immediate feedback
    if (storedDarkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, []);

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("darkMode", String(newValue));
    
    if (newValue) {
      document.body.classList.add("dark-theme");
      showToast("Dark mode enabled", "success");
    } else {
      document.body.classList.remove("dark-theme");
      showToast("Light mode enabled", "success");
    }
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem("notifications", String(newValue));
    showToast(newValue ? "Notifications enabled" : "Notifications disabled", "success");
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2>Application Preferences</h2>
        <p>Customize your experience with the application.</p>
      </div>

      <div className="preferences-list">
        <div className="preference-item">
          <div className="preference-info">
            <h3>Dark Mode</h3>
            <p>Switch between light and dark themes.</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={handleDarkModeToggle} 
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="preference-item">
          <div className="preference-info">
            <h3>Push Notifications</h3>
            <p>Receive alerts about room cleaning, fee updates, etc.</p>
          </div>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={handleNotificationsToggle} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
