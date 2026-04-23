import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfileHeader from './components/ProfileHeader';
import ProfileDetails from './components/ProfileDetails';
import EditProfileModal from './components/EditProfileModal';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import './Profile.css';
import type { IUser } from '../../types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getProfile();
      setUser(data);
    } catch (error: any) {
      showToast(error.message || 'Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data: { firstName: string; lastName: string; phone: string }) => {
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
      
      // Update local storage to keep session in sync
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...parsed, ...updatedUser }));
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to update profile', 'error');
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <div className="profile-container">
        {isLoading ? (
          <>
            <div className="skeleton-profile-header" />
            <div className="skeleton-grid">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          </>
        ) : user ? (
          <>
            <ProfileHeader user={user} onEdit={() => setIsEditModalOpen(true)} />
            <ProfileDetails user={user} />
            
            <EditProfileModal 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
              user={user}
              onSave={handleUpdateProfile}
            />
          </>
        ) : (
          <div className="empty-state">
            <h3>Something went wrong</h3>
            <p>We couldn't retrieve your profile data.</p>
            <button onClick={fetchProfile} className="btn-primary">Retry</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
