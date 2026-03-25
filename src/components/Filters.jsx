import React from 'react';
import './Filters.css';

function Filters({ searchQuery, onSearchChange, categoryFilter, onCategoryChange, categories }) {
  return (
    <div className="filters">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск по названию..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="category-filter">
        <select value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Все категории</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Filters;