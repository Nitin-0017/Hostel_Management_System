import React from 'react';
import type { IUser } from '../../../types';
import Icon from '../../../components/dashboard/Icon';
import Button from '../../../components/dashboard/Button';

interface ProfileHeaderProps {
  user: IUser;
  onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onEdit }) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) {
      // Fallback if names are missing
      const emailInitial = user.email?.charAt(0).toUpperCase() || '?';
      return emailInitial;
    }
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="profile-header-card">
      <div className="header-main">
        <div className="avatar-circle">
          {getInitials(user.firstName, user.lastName)}
        </div>
        <div className="user-meta">
          <h1>{user.firstName} {user.lastName}</h1>
          <div className="badge-container">
            <span className="badge role">{user.role}</span>
            <span className="badge status">Active</span>
          </div>
        </div>
      </div>
      <div className="header-actions">
        <Button 
          label="Edit Profile" 
          variant="primary" 
          icon={<Icon name="wrench" size="sm" />} 
          onClick={onEdit} 
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
