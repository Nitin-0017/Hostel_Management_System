import React from "react";

interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const filters = ["ALL", "PENDING", "APPROVED", "REJECTED"];

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? "active" : ""}`}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
