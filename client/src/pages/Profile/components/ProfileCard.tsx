import React from 'react';
import type { IUser } from '../../../types';
import Icon from '../../../components/dashboard/Icon';
import Button from '../../../components/dashboard/Button';

interface ProfileCardProps {
  user: IUser;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEdit }) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return '??';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to safely get student details if present
  const student = (user as any).student;
  const room = (user as any).room;

  return (
    <div className="profile-card-container">
      <div className="profile-card-banner"></div>
      <div className="profile-card-content">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div className="profile-badge">Active</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-navy)', margin: 0 }}>
              {user.firstName} {user.lastName}
            </h2>
            <p style={{ color: 'var(--color-text-light)', marginTop: '0.25rem' }}>
              {user.role} &middot; {user.email}
            </p>
          </div>
          <Button 
            label="Edit Profile" 
            variant="secondary" 
            size="sm" 
            icon={<Icon name="wrench" size="sm" />} 
            onClick={onEdit} 
          />
        </div>

        <div className="profile-info-grid">
          <div className="info-group">
            <span className="info-label">Email Address</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Phone Number</span>
            <span className="info-value">{user.phone || 'Not provided'}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Member Since</span>
            <span className="info-value">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </span>
          </div>
          <div className="info-group">
            <span className="info-label">Account ID</span>
            <span className="info-value" style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
              #{user.id.substring(0, 8)}...
            </span>
          </div>
        </div>

        {user.role === 'STUDENT' && student && (
          <div className="room-details-section">
            <h3>Student & Room Information</h3>
            <div className="room-info-cards">
              <div className="room-info-item">
                <span className="room-info-label">Enrollment</span>
                <span className="room-info-value">{student.enrollmentNumber}</span>
              </div>
              <div className="room-info-item">
                <span className="room-info-label">Course</span>
                <span className="room-info-value">{student.course} ({student.year} Year)</span>
              </div>
              <div className="room-info-item">
                <span className="room-info-label">Room</span>
                <span className="room-info-value">{room ? room.roomNumber : 'Not Allocated'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
