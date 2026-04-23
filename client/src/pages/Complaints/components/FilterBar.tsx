import React from 'react';

type FilterStatus = "ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED";

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="filter-bar">
      <div className="status-filters">
        <button
          className={`filter-btn ${currentFilter === "ALL" ? "active" : ""}`}
          onClick={() => onFilterChange("ALL")}
        >
          All
        </button>
        <button
          className={`filter-btn ${currentFilter === "OPEN" ? "active" : ""}`}
          onClick={() => onFilterChange("OPEN")}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${currentFilter === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => onFilterChange("IN_PROGRESS")}
        >
          In Progress
        </button>
        <button
          className={`filter-btn ${currentFilter === "RESOLVED" ? "active" : ""}`}
          onClick={() => onFilterChange("RESOLVED")}
        >
          Resolved
        </button>
      </div>

      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search complaints..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
