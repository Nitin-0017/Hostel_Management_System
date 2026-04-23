import React from 'react';
import type { IUser } from '../../../types';
import Icon from '../../../components/dashboard/Icon';

interface ProfileDetailsProps {
  user: IUser;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="profile-details-grid">
      <div className="detail-card">
        <div className="icon-box">
          <Icon name="bell" size="md" />
        </div>
        <div className="detail-content">
          <label>Email Address</label>
          <span>{user.email}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box">
          <Icon name="activity" size="md" />
        </div>
        <div className="detail-content">
          <label>Phone Number</label>
          <span>{user.phone || 'Not provided'}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box">
          <Icon name="room" size="md" />
        </div>
        <div className="detail-content">
          <label>Member Since</label>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box">
          <Icon name="wrench" size="md" />
        </div>
        <div className="detail-content">
          <label>Account ID</label>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{user.id}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
