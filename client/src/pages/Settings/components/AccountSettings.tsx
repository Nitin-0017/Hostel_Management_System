import React, { useState, useEffect } from "react";
import userService from "../../../services/userService";
import { useToast } from "../../../context/ToastContext";
import type { IUser } from "../../../types";

interface AccountSettingsProps {
  user: IUser | null;
  role?: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user: initialUser, role }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialUser) {
      setFirstName(initialUser.firstName || "");
      setLastName(initialUser.lastName || "");
      setEmail(initialUser.email || "");
    }
  }, [initialUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await userService.updateUser({ firstName, lastName }, role);
      setSaved(true);
      showToast("Profile updated successfully", "success");
      
      // Reset "Saved" state after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2>Account Settings</h2>
        <p>Manage your personal information and email address.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            title="Email cannot be changed"
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`save-btn ${saved ? "saved" : ""}`}
            disabled={saving}
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
