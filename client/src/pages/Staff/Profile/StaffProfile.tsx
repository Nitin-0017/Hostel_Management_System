import React, { useState, useEffect } from "react";
import StaffDashboardLayout from "../../../components/layout/StaffDashboardLayout";
import Icon from "../../../components/dashboard/Icon";
import { useAuth } from "../../../hooks/useAuth";
import { useToast } from "../../../context/ToastContext";
import userService from "../../../services/userService";
import type { IUser } from "../../../types";
import "./StaffProfile.css";

const StaffProfile: React.FC = () => {
  const { user: authUser } = useAuth();
  const { addToast } = useToast();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getMe();
      setUser(data);
      setForm({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phone: data.phone ?? "",
      });
    } catch (err: any) {
      addToast(err.message || "Failed to load profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const updated = await userService.updateUser(form);
      setUser(updated);
      // Sync localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({ ...parsed, ...updated }));
      }
      addToast("Profile updated successfully!", "success");
      setIsEditing(false);
    } catch (err: any) {
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : authUser
    ? `${authUser.firstName?.[0] ?? ""}${authUser.lastName?.[0] ?? ""}`.toUpperCase()
    : "S";

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : authUser
    ? `${authUser.firstName} ${authUser.lastName}`
    : "Staff Member";

  return (
    <StaffDashboardLayout>
      <div className="staff-page profile-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>
              <Icon name="user" size="lg" color="var(--color-teal)" /> My Profile
            </h1>
            <p>Manage your personal information</p>
          </div>
        </div>

        {isLoading ? (
          <div className="profile-skeleton">
            <div className="skeleton-avatar" />
            <div className="skeleton-info">
              <div className="skeleton-line wide" />
              <div className="skeleton-line medium" />
              <div className="skeleton-line narrow" />
            </div>
          </div>
        ) : (
          <div className="profile-content">
            {/* Avatar card */}
            <div className="profile-hero">
              <div className="profile-avatar-ring">
                <div className="profile-avatar">{initials}</div>
              </div>
              <div className="profile-hero-info">
                <h2>{fullName}</h2>
                <span className="role-chip">
                  <Icon name="staff" size="sm" /> Staff Member
                </span>
                <p className="profile-email">{user?.email ?? authUser?.email ?? "—"}</p>
              </div>
              <button
                className="btn-edit"
                onClick={() => {
                  setIsEditing(true);
                  setForm({
                    firstName: user?.firstName ?? "",
                    lastName: user?.lastName ?? "",
                    phone: user?.phone ?? "",
                  });
                }}
              >
                <Icon name="settings" size="sm" /> Edit Profile
              </button>
            </div>

            {/* Details grid */}
            <div className="profile-grid">
              {/* Personal Info */}
              <div className="profile-card">
                <div className="pc-header">
                  <Icon name="user" size="md" color="var(--color-teal)" />
                  <h3>Personal Information</h3>
                </div>
                <div className="pc-body">
                  <div className="info-row">
                    <span className="info-label">First Name</span>
                    <span className="info-value">{user?.firstName ?? "—"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Name</span>
                    <span className="info-value">{user?.lastName ?? "—"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Role</span>
                    <span className="info-value">
                      <span className="role-pill">STAFF</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="profile-card">
                <div className="pc-header">
                  <Icon name="mail" size="md" color="var(--color-teal)" />
                  <h3>Contact Information</h3>
                </div>
                <div className="pc-body">
                  <div className="info-row">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{user?.email ?? "—"}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone Number</span>
                    <span className="info-value">{user?.phone ?? "Not provided"}</span>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="profile-card">
                <div className="pc-header">
                  <Icon name="settings" size="md" color="var(--color-teal)" />
                  <h3>Account Details</h3>
                </div>
                <div className="pc-body">
                  <div className="info-row">
                    <span className="info-label">Account Status</span>
                    <span className="info-value">
                      <span className="active-pill">● Active</span>
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit slide-in panel */}
        {isEditing && (
          <div className="modal-overlay" onClick={() => setIsEditing(false)}>
            <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
              <div className="edit-panel-header">
                <h3>Edit Profile</h3>
                <button className="close-btn" onClick={() => setIsEditing(false)}>
                  <Icon name="close" size="md" />
                </button>
              </div>

              <div className="edit-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="First name"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    placeholder="Last name"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                  />
                </div>
              </div>

              <div className="edit-panel-footer">
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button
                  className="btn-save"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffDashboardLayout>
  );
};

export default StaffProfile;
