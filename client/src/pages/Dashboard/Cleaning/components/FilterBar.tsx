import React from 'react';

interface FilterBarProps {
  currentFilter: string;
  setFilter: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, setFilter }) => {
  const filters = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-btn ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => setFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
