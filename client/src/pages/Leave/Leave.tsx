import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useLeave } from "../../hooks/useLeave";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import Skeleton from "../../components/ui/Skeleton";
import ApplyLeaveModal from "../../components/modals/ApplyLeaveModal";
import FilterBar from "./components/FilterBar";
import LeaveCard from "./components/LeaveCard";
import "./Leave.css";

const Leave: React.FC = () => {
  const { leaves, isLoading, error, refresh } = useLeave();
  const [filter, setFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "ALL") return true;
    return leave.status === filter;
  });

  return (
    <DashboardLayout>
      <div className="leave-page">
        <div className="leave-header">
          <div>
            <h1>Leave Requests</h1>
            <p>Manage and track your leave applications</p>
          </div>
          <Button
            label="Apply Leave"
            icon={<Icon name="leave" size="sm" />}
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {error && (
          <div className="leave-error">
            <Icon name="bell" size="md" color="var(--color-danger)" />
            <p>{error}</p>
            <Button label="Retry" variant="ghost" size="sm" onClick={refresh} />
          </div>
        )}

        <div className="leave-content">
          <FilterBar currentFilter={filter} onFilterChange={setFilter} />

          <div className="leave-list">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div className="leave-card skeleton-card" key={i}>
                  <Skeleton height="30px" width="100%" />
                  <Skeleton height="20px" width="60%" />
                  <Skeleton height="40px" width="100%" />
                </div>
              ))
            ) : filteredLeaves.length > 0 ? (
              filteredLeaves.map((leave) => (
                <LeaveCard key={leave.id} leave={leave} />
              ))
            ) : (
              <div className="leave-empty-state">
                <Icon name="leave" size="xl" color="#567C8D" />
                <h3>No Leave Requests Found</h3>
                <p>
                  {filter === "ALL"
                    ? "You haven't applied for any leaves yet."
                    : `You have no ${filter.toLowerCase()} leave requests.`}
                </p>
                {filter === "ALL" && (
                  <Button
                    label="Apply Now"
                    variant="primary"
                    onClick={() => setIsModalOpen(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyLeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </DashboardLayout>
  );
};

export default Leave;
