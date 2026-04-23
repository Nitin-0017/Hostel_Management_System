import React, { useState } from "react";
import userService from "../../../services/userService";
import { useToast } from "../../../context/ToastContext";

const SecuritySettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });
      setSaved(true);
      showToast("Password changed successfully", "success");
      
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setSaved(false), 3000);
    } catch (error: any) {
      showToast(error.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card">
      <div className="settings-card-header">
        <h2>Security Settings</h2>
        <p>Update your password to keep your account secure.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
            minLength={8}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type new password"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className={`save-btn ${saved ? "saved" : ""}`}
            disabled={saving}
          >
            {saving ? "Updating..." : saved ? "Updated" : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;
