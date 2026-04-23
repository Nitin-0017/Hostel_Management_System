import React, { useState, useMemo } from 'react';
import { useComplaints } from '../../hooks/useComplaints';
import FilterBar from './components/FilterBar';
import ComplaintCard from './components/ComplaintCard';
import ComplaintModal from './components/ComplaintModal';
import DashboardLayout from '../../components/layout/DashboardLayout';
import './Complaints.css';

type FilterStatus = "ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED";

const Complaints: React.FC = () => {
  const { complaints, loading, error, submitComplaint, refreshComplaints } = useComplaints();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      // 1. Status Filter
      if (filterStatus !== "ALL" && complaint.status !== filterStatus) {
        return false;
      }
      
      // 2. Search Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return (
          complaint.subject.toLowerCase().includes(query) ||
          complaint.description.toLowerCase().includes(query) ||
          complaint.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, filterStatus, searchQuery]);

  return (
    <DashboardLayout>
      <div className="complaints-page">
        <div className="complaints-header">
        <h1 className="complaints-title">My Complaints</h1>
        <button 
          className="raise-complaint-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Raise Complaint
        </button>
      </div>

      <FilterBar 
        currentFilter={filterStatus}
        onFilterChange={setFilterStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error && (
        <div className="error-message" style={{ color: '#dc2626', marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
          {error}
          <button onClick={refreshComplaints} style={{ marginLeft: '1rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="complaints-list">
          {[1, 2, 3].map(i => <div key={i} className="loading-skeleton" />)}
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          ) : (
            <div className="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h3>No complaints found</h3>
              <p>
                {searchQuery || filterStatus !== "ALL" 
                  ? "Try adjusting your filters or search term."
                  : "You haven't raised any complaints yet."}
              </p>
            </div>
          )}
        </div>
      )}

      <ComplaintModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={submitComplaint}
      />
      </div>
    </DashboardLayout>
  );
};

export default Complaints;
