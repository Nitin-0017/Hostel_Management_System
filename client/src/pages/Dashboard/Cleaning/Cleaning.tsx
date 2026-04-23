import React, { useState } from 'react';
import { useCleaning } from '../../../hooks/useCleaning';
import Skeleton from '../../../components/ui/Skeleton';
import FilterBar from './components/FilterBar';
import CleaningCard from './components/CleaningCard';
import CleaningModal from './components/CleaningModal';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Icon from '../../../components/dashboard/Icon';
import './Cleaning.css';

const Cleaning: React.FC = () => {
  const { requests, loading, error, isSubmitting, submitRequest } = useCleaning();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const completedCount = requests.filter(r => r.status === 'COMPLETED').length;
  
  const lastCleaned = requests
    .filter(r => r.status === 'COMPLETED' && r.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];

  const calculateDaysAgo = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return request.status === 'PENDING';
    if (filter === 'In Progress') return request.status === 'IN_PROGRESS';
    if (filter === 'Completed') return request.status === 'COMPLETED';
    return true;
  });

  return (
    <DashboardLayout>
      <div className="cleaning-page">
        <div className="cleaning-header">
          <div>
          <h1>Cleaning Requests</h1>
          <p>Manage and track your room cleaning services</p>
        </div>
        <button className="request-btn" onClick={() => setIsModalOpen(true)}>
          <Icon name="zap" size="sm" /> Request Cleaning
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Icon name="clock" color="#f59e0b" />
          </div>
          <div className="cleaning-stat-info">
            <h3>Pending</h3>
            <p>{loading ? <Skeleton width="40px" height="24px" /> : pendingCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <Icon name="check-circle" color="#10b981" />
          </div>
          <div className="cleaning-stat-info">
            <h3>Completed</h3>
            <p>{loading ? <Skeleton width="40px" height="24px" /> : completedCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon time">
            <Icon name="calendar" color="#6366f1" />
          </div>
          <div className="cleaning-stat-info">
            <h3>Last Cleaned</h3>
            <p>{loading ? <Skeleton width="100px" height="24px" /> : calculateDaysAgo(lastCleaned?.completedAt)}</p>
          </div>
        </div>
      </div>

      <FilterBar currentFilter={filter} setFilter={setFilter} />

      <div className="requests-list">
        {loading ? (
          <>
            <Skeleton height="100px" borderRadius="12px" />
            <Skeleton height="100px" borderRadius="12px" />
            <Skeleton height="100px" borderRadius="12px" />
          </>
        ) : error ? (
          <div className="empty-state">
            <h3 style={{ color: '#ef4444' }}>Error Loading Data</h3>
            <p>{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state">
            <h3>No requests found</h3>
            <p>You don't have any {filter !== 'All' ? filter.toLowerCase() : ''} cleaning requests at the moment.</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <CleaningCard key={request.id} request={request} />
          ))
        )}
      </div>

      <CleaningModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={submitRequest}
        isSubmitting={isSubmitting}
      />
    </div>
    </DashboardLayout>
  );
};

export default Cleaning;
