import React from 'react';
import type { IUser } from '../../../types';
import Icon from '../../../components/dashboard/Icon';

interface ProfileDetailsProps {
  user: IUser & {
    enrollmentNumber?: string;
    course?: string;
    year?: number;
    joiningDate?: string;
    employeeId?: string;
    designation?: string;
    department?: string;
    room?: { roomNumber: string; building?: string; floor?: number } | null;
  };
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ user }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isStudent = user.role === 'STUDENT';
  const isStaff   = user.role === 'STAFF';

  return (
    <div className="profile-details-grid">

      {/* Always shown */}
      <div className="detail-card">
        <div className="icon-box"><Icon name="bell" size="md" /></div>
        <div className="detail-content">
          <label>Email Address</label>
          <span>{user.email || 'N/A'}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box"><Icon name="activity" size="md" /></div>
        <div className="detail-content">
          <label>Phone Number</label>
          <span>{user.phone || 'Not provided'}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box"><Icon name="room" size="md" /></div>
        <div className="detail-content">
          <label>Member Since</label>
          <span>{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="detail-card">
        <div className="icon-box"><Icon name="wrench" size="md" /></div>
        <div className="detail-content">
          <label>Account Status</label>
          <span>{user.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      {/* Student-specific */}
      {isStudent && (
        <>
          <div className="detail-card">
            <div className="icon-box"><Icon name="user" size="md" /></div>
            <div className="detail-content">
              <label>Enrollment Number</label>
              <span>{user.enrollmentNumber || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="reports" size="md" /></div>
            <div className="detail-content">
              <label>Course</label>
              <span>{user.course || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="activity" size="md" /></div>
            <div className="detail-content">
              <label>Year</label>
              <span>{user.year ? `Year ${user.year}` : 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="room" size="md" /></div>
            <div className="detail-content">
              <label>Allocated Room</label>
              <span>
                {user.room
                  ? `${user.room.building ? user.room.building + '-' : ''}${user.room.roomNumber}`
                  : 'Not allocated'}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="bell" size="md" /></div>
            <div className="detail-content">
              <label>Joining Date</label>
              <span>{formatDate(user.joiningDate)}</span>
            </div>
          </div>
        </>
      )}

      {/* Staff-specific */}
      {isStaff && (
        <>
          <div className="detail-card">
            <div className="icon-box"><Icon name="staff" size="md" /></div>
            <div className="detail-content">
              <label>Employee ID</label>
              <span>{user.employeeId || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="reports" size="md" /></div>
            <div className="detail-content">
              <label>Designation</label>
              <span>{user.designation || 'N/A'}</span>
            </div>
          </div>

          <div className="detail-card">
            <div className="icon-box"><Icon name="users" size="md" /></div>
            <div className="detail-content">
              <label>Department</label>
              <span>{user.department || 'N/A'}</span>
            </div>
          </div>
        </>
      )}

      {/* Account ID always at the end */}
      <div className="detail-card">
        <div className="icon-box"><Icon name="settings" size="md" /></div>
        <div className="detail-content">
          <label>Account ID</label>
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{user.id}</span>
        </div>
      </div>

    </div>
  );
};

export default ProfileDetails;
