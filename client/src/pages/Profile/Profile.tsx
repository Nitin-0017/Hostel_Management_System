import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import StaffDashboardLayout from '../../components/layout/StaffDashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import ProfileHeader from './components/ProfileHeader';
import ProfileDetails from './components/ProfileDetails';
import EditProfileModal from './components/EditProfileModal';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import './Profile.css';
import type { IUser } from '../../types';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { addToast: showToast } = useToast();

  const Layout = authUser?.role === 'ADMIN' 
    ? AdminDashboardLayout 
    : authUser?.role === 'STAFF' 
      ? StaffDashboardLayout 
      : DashboardLayout;

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = authUser?.role === 'ADMIN'
        ? await userService.getMe()
        : await userService.getProfile();
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
      const updatedUser = authUser?.role === 'ADMIN' || authUser?.role === 'STAFF'
        ? await userService.updateUser(data, authUser.role)
        : await userService.updateProfile(data);
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
    <Layout>
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
    </Layout>
  );
};

export default Profile;
