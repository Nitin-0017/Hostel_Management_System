import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import AccountSettings from "./components/AccountSettings";
import SecuritySettings from "./components/SecuritySettings";
import Preferences from "./components/Preferences";
import { useAuth } from "../../hooks/useAuth";
import userService from "../../services/userService";
import type { IUser } from "../../types";
import Icon from "../../components/dashboard/Icon";
import "./Settings.css";

type SettingsTab = "account" | "security" | "preferences";

const Settings: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<IUser | null>(authUser || null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [loading, setLoading] = useState(false);

  const Layout = authUser?.role === "ADMIN" ? AdminDashboardLayout : DashboardLayout;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userData = await userService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings user={user} />;
      case "security":
        return <SecuritySettings />;
      case "preferences":
        return <Preferences />;
      default:
        return <AccountSettings user={user} />;
    }
  };

  return (
    <Layout>
      <div className="settings-page">
        <header className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account settings and preferences.</p>
        </header>

        <div className="settings-container">
          <aside className="settings-sidebar">
            <button
              className={`settings-nav-item ${activeTab === "account" ? "active" : ""}`}
              onClick={() => setActiveTab("account")}
            >
              <Icon name="user" size="sm" />
              Account
            </button>
            <button
              className={`settings-nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Icon name="lock" size="sm" />
              Security
            </button>
            <button
              className={`settings-nav-item ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <Icon name="settings" size="sm" />
              Preferences
            </button>
          </aside>

          <main className="settings-content">
            {loading ? (
              <div className="settings-card">
                <p>Loading settings...</p>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
