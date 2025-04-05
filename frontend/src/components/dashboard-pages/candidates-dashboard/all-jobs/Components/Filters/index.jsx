import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from '../../utils/debounce';
import './filters.css';

const API_ENDPOINTS = {
  filters: 'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobFilter',
  jobs: 'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPostIntstitutes'
};

// Simple Select Component
const Select = ({ options = [], value, onChange, placeholder, isMulti, disabled }) => (
  <select 
    value={isMulti ? value || [] : value} 
    onChange={(e) => {
      if (isMulti) {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        onChange(selectedOptions);
      } else {
        onChange(e.target.value);
      }
    }}
    multiple={isMulti}
    className={`filter-select ${isMulti ? 'multi-select' : ''}`}
    disabled={disabled}
    size={isMulti ? Math.min(options.length, 5) : 1}
  >
    {!isMulti && <option value="">{placeholder}</option>}
    {options.map(option => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

// Simple Search Component
const SearchBar = ({ value, onChange, onSearch }) => {
  // Create debounced search function on mount
  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 500),
    [onSearch]
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className="search-container">
      <i className="fas fa-search search-icon"></i>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search jobs by title, skills, or keywords..."
        className="search-input"
      />
      {value && (
        <button 
          onClick={() => {
            onChange('');
            onSearch('');
          }}
          className="clear-search"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export const Filters = () => {
  // Basic states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState({});
  const [jobs, setJobs] = useState([]);
  
  // Filter values
  const [filters, setFilters] = useState({
    country: '',
    state_ut: '',
    city: '',
    qualification: [],
    core_subjects: [],
    optional_subject: [],
    job_type: [],
    experience: '0',
    min_salary: '30000',
    max_salary: '80000'
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch initial filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Reset dependent fields when country changes
  useEffect(() => {
    if (filters.country === '') {
      setFilters(prev => ({
        ...prev,
        state_ut: '',
        city: ''
      }));
    }
  }, [filters.country]);

  // Reset city when state changes
  useEffect(() => {
    if (filters.state_ut === '') {
      setFilters(prev => ({
        ...prev,
        city: ''
      }));
    }
  }, [filters.state_ut]);

  const fetchFilterOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.jobs);
      if (!response.ok) throw new Error('Failed to fetch options');
      
      const data = await response.json();
      const options = {};
      
      Object.keys(filters).forEach(field => {
        const values = new Set();
        data.forEach(item => {
          if (item[field]) {
            if (Array.isArray(item[field])) {
              item[field].forEach(val => values.add(val));
            } else if (typeof item[field] === 'string') {
              item[field].split(',').forEach(val => values.add(val.trim()));
            } else {
              values.add(item[field]);
            }
          }
        });
        options[field] = Array.from(values).sort();
      });
      
      setFilterOptions(options);
    } catch (err) {
      setError('Failed to load options. Please refresh.');
      console.error('Error fetching options:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateFilters = () => {
    const errors = {};
    
    if (filters.min_salary && filters.max_salary) {
      if (Number(filters.min_salary) > Number(filters.max_salary)) {
        errors.salary = 'Minimum salary cannot be greater than maximum salary';
      }
    }

    if (filters.country && !filters.state_ut) {
      errors.state_ut = 'Please select a state';
    }

    if (filters.state_ut && !filters.city) {
      errors.city = 'Please select a city';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: null }));
  };

  // Search jobs
  const handleSearch = async (query = searchQuery) => {
    if (!validateFilters()) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.filters, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...filters,
          search_query: query.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
      console.error('Error searching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJobType = (jobType) => {
    if (!jobType) return 'N/A';
    if (Array.isArray(jobType)) return jobType.join(', ');
    if (typeof jobType === 'string') {
      // Handle comma-separated string
      return jobType.split(',').map(type => type.trim()).filter(Boolean).join(', ');
    }
    return String(jobType);
  };

  // Memoize job results to prevent unnecessary re-renders
  const jobResults = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return <div className="no-results">No jobs found</div>;
    }

    return (
      <div className="jobs-list">
        {jobs.map((job, index) => (
          <div key={job.id || index} className="job-card">
            <h3>{job.job_title || 'No Title'}</h3>
            <div className="job-details">
              <span>💰 {job.max_salary || 'N/A'}</span>
              <span>🌍 {job.country || 'N/A'}</span>
              <span>💼 {formatJobType(job.job_type)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }, [jobs]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="filters-container">
      <div className="filters-section">
        <h2>Search Jobs</h2>
        
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <div className="filter-groups">
          {/* Location Filters */}
          <div className="filter-group">
            <h3>Location</h3>
            <div className="filter-items">
              <div className="filter-item">
                <label>Country</label>
                <Select
                  options={filterOptions.country || []}
                  value={filters.country}
                  onChange={val => handleFilterChange('country', val)}
                  placeholder="Select country"
                />
              </div>
              <div className="filter-item">
                <label>State/UT</label>
                <Select
                  options={filterOptions.state_ut || []}
                  value={filters.state_ut}
                  onChange={val => handleFilterChange('state_ut', val)}
                  placeholder="Select state"
                  disabled={!filters.country}
                />
                {validationErrors.state_ut && (
                  <span className="error-text">{validationErrors.state_ut}</span>
                )}
              </div>
              <div className="filter-item">
                <label>City</label>
                <Select
                  options={filterOptions.city || []}
                  value={filters.city}
                  onChange={val => handleFilterChange('city', val)}
                  placeholder="Select city"
                  disabled={!filters.state_ut}
                />
                {validationErrors.city && (
                  <span className="error-text">{validationErrors.city}</span>
                )}
              </div>
            </div>
          </div>

          {/* Qualification Filters */}
          <div className="filter-group">
            <h3>Qualifications</h3>
            <div className="filter-items">
              <div className="filter-item">
                <label>Qualification</label>
                <Select
                  options={filterOptions.qualification || []}
                  value={filters.qualification}
                  onChange={val => handleFilterChange('qualification', val)}
                  placeholder="Select qualifications"
                  isMulti
                />
              </div>
              <div className="filter-item">
                <label>Core Subjects</label>
                <Select
                  options={filterOptions.core_subjects || []}
                  value={filters.core_subjects}
                  onChange={val => handleFilterChange('core_subjects', val)}
                  placeholder="Select subjects"
                  isMulti
                />
              </div>
            </div>
          </div>

          {/* Experience & Salary */}
          <div className="filter-group">
            <h3>Experience & Salary</h3>
            <div className="filter-items">
              <div className="filter-item">
                <label>Experience (Years)</label>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={filters.experience}
                  onChange={e => handleFilterChange('experience', e.target.value)}
                  className="range-input"
                />
                <span>{filters.experience} years</span>
              </div>
              <div className="filter-item">
                <label>Salary Range</label>
                <div className="salary-inputs">
                  <input
                    type="number"
                    min="0"
                    value={filters.min_salary}
                    onChange={e => handleFilterChange('min_salary', e.target.value)}
                    placeholder="Min"
                    className="salary-input"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    value={filters.max_salary}
                    onChange={e => handleFilterChange('max_salary', e.target.value)}
                    placeholder="Max"
                    className="salary-input"
                  />
                </div>
                {validationErrors.salary && (
                  <span className="error-text">{validationErrors.salary}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      <div className="results-section">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          jobResults
        )}
      </div>
    </div>
  );
};

export default Filters;