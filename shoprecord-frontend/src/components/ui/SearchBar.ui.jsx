'use client';

import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search...', className = '' }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const containerStyles = {
    position: 'relative',
    marginBottom: '20px',
  };

  const inputStyles = {
    width: '100%',
    padding: '10px 40px 10px 40px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
  };

  const iconStyles = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6b7280',
    fontSize: '18px',
  };

  const clearButtonStyles = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    fontSize: '18px',
    padding: '4px',
    display: searchTerm ? 'block' : 'none',
  };

  return (
    <div style={containerStyles} className={className}>
      <span style={iconStyles}>🔍</span>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        style={inputStyles}
      />
      <button onClick={handleClear} style={clearButtonStyles}>
        ×
      </button>
    </div>
  );
}
