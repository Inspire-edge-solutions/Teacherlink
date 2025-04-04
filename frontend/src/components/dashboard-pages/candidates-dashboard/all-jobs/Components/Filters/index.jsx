import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './filters.css';
/** 
 * Custom multi-select that closes on outside click, 
 * uses a pill-based UI, and "Press to select" text on hover.
 */
function CustomMultiSelect({ placeholder, options, selectedValues, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Toggle item in/out of selectedValues
  const toggleItem = (item) => {
    if (selectedValues.includes(item)) {
      onChange(selectedValues.filter((val) => val !== item));
    } else {
      onChange([...selectedValues, item]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-multiselect" ref={wrapperRef}>
      <div className="select-display" onClick={() => setIsOpen((prev) => !prev)}>
        {selectedValues.length === 0 ? (
          <span className="placeholder">{placeholder}</span>
        ) : (
          selectedValues.map((val) => (
            <div key={val} className="pill">
              {val}
              <button
                type="button"
                className="remove-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(val);
                }}
              >
                &times;
              </button>
            </div>
          ))
        )}
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      {isOpen && (
        <div className="dropdown">
          {options.length === 0 ? (
            <div className="dropdown-item no-options">No options</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                className="dropdown-item"
                title="Press to select"
                onClick={() => toggleItem(opt)}
              >
                <input type="checkbox" readOnly checked={selectedValues.includes(opt)} />
                <span className="item-label">{opt}</span>
                <span className="press-text">Press to select</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

CustomMultiSelect.propTypes = {
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

/** 
 * Custom single-select that closes on outside click, 
 * with placeholder and "Press to select" text on hover.
 */
function SingleSelect({ placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-single-select" ref={wrapperRef}>
      <div className="select-display" onClick={() => setIsOpen((prev) => !prev)}>
        {value ? <span>{value}</span> : <span className="placeholder">{placeholder}</span>}
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}` }></i>
      </div>
      {isOpen && (
        <div className="dropdown">
          {options.length === 0 ? (
            <div className="dropdown-item no-options">No options</div>
          ) : (
            options.map((opt) => (
              <div
                key={opt}
                className="dropdown-item"
                title="Press to select"
                onClick={() => handleSelect(opt)}
              >
                <span className="item-label">{opt}</span>
                <span className="press-text">Press to select</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

SingleSelect.propTypes = {
  placeholder: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function Filters() {
  // API endpoints
  const apiUrl =
    'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPostIntstitutes';
  const filterApiUrl =
    'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobFilter';

  // Field IDs
  const multiSelectIds = [
    'qualification',
    'core_subjects',
    'optional_subject',
    'job_type',
    'designations',
    'designated_grades',
    'curriculum',
    'subjects',
    'core_expertise',
    'job_shifts',
    'job_process',
  ];
  const singleSelectIds = ['country', 'state_ut', 'city'];
  const jsonFields = [
    'qualification',
    'core_subjects',
    'optional_subject',
    'designations',
    'designated_grades',
    'curriculum',
    'subjects',
    'core_expertise',
    'job_shifts',
    'job_process',
  ];

  // State for storing options
  const [fieldOptions, setFieldOptions] = useState({});
  // State for multi-select values
  const [multiSelectValues, setMultiSelectValues] = useState(() => {
    const init = {};
    multiSelectIds.forEach((id) => {
      init[id] = [];
    });
    return init;
  });
  // State for single-select values
  const [singleSelectValues, setSingleSelectValues] = useState(() => {
    const init = {};
    singleSelectIds.forEach((id) => {
      init[id] = '';
    });
    return init;
  });

  // Range states
  const [experience, setExperience] = useState('0');
  const [minSalary, setMinSalary] = useState('30000');
  const [maxSalary, setMaxSalary] = useState('80000');

  // Jobs data
  const [jobs, setJobs] = useState([]);
  // Detailed view
  const [selectedJob, setSelectedJob] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  // Popup
  const [showPopup, setShowPopup] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const allFields = [...multiSelectIds, ...singleSelectIds];
        const fieldMap = {};
        allFields.forEach((field) => {
          const opts = new Set();
          data.forEach((item) => {
            let value = item[field];
            if (value) {
              if (jsonFields.includes(field)) {
                if (typeof value === 'string') {
                  value.split(',').forEach((val) => {
                    const trimmed = val.trim();
                    if (trimmed) opts.add(trimmed);
                  });
                } else if (Array.isArray(value)) {
                  value.forEach((val) => {
                    const trimmed = String(val).trim();
                    if (trimmed) opts.add(trimmed);
                  });
                } else {
                  opts.add(String(value).trim());
                }
              } else {
                opts.add(value);
              }
            }
          });
          fieldMap[field] = Array.from(opts);
        });
        setFieldOptions(fieldMap);
      })
      .catch((err) => console.error('Error fetching job data:', err));
  }, []);

  // Gather final form data
  const collectFormData = () => {
    const data = {};
    multiSelectIds.forEach((id) => {
      data[id] = multiSelectValues[id] || [];
    });
    singleSelectIds.forEach((id) => {
      data[id] = singleSelectValues[id] || '';
    });
    data.total_experience_min_years = experience;
    data.min_salary = minSalary;
    data.max_salary = maxSalary;
    return data;
  };

  // Submit form data
  const handleSubmit = () => {
    const formData = collectFormData();
    fetch(filterApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error('Error fetching filtered data:', err);
        alert('An error occurred while fetching data.');
      });
  };

  // Render job summary cards
  const renderJobResults = () => {
    if (Array.isArray(jobs) && jobs.length > 0) {
      return (
        <>
          <div className="results-header">{jobs.length} job(s) matched</div>
          {jobs.map((job, idx) => (
            <div
              key={idx}
              className="job-card"
              onClick={() => {
                setSelectedJob(job);
                setShowFullDetails(true);
              }}
            >
              <h2>{job.job_title || 'No Title'}</h2>
              <div className="job-info">
                <div>
                  <i className="fa-solid fa-money-bill-wave"></i>{' '}
                  {job.max_salary || 'N/A'}
                </div>
                <div>
                  <i className="fa-solid fa-earth-americas"></i>{' '}
                  {job.country || 'N/A'}
                </div>
              </div>
            </div>
          ))}
        </>
      );
    } else if (jobs && jobs.message) {
      return <div>{jobs.message}</div>;
    } else {
      return <div>No matching records found</div>;
    }
  };

  // Render detailed job info
  const renderJobDetails = () => {
    if (!selectedJob) return null;
    const rows = [];
    for (const key in selectedJob) {
      if (Object.prototype.hasOwnProperty.call(selectedJob, key)) {
        if (key === 'id' || key === 'user_id') continue;
        let val = selectedJob[key];
        if (key === 'joining_date' && val) {
          const d = new Date(val);
          if (!isNaN(d)) {
            val = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
          }
        }
        rows.push(
          <tr key={key}>
            <th>{key.replace(/_/g, ' ').toUpperCase()}</th>
            <td>{val !== null && val !== undefined ? val : 'N/A'}</td>
          </tr>
        );
      }
    }
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  return (
    <>
      

      {/* Left Navigation */}
      <div className="left-nav" id="leftNav">
        <h1>Search Jobs by applying filters</h1>
        {/* Multi-select fields */}
        <label>Qualification</label>
        <CustomMultiSelect
          placeholder="Select qualification"
          options={fieldOptions['qualification'] || []}
          selectedValues={multiSelectValues['qualification']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, qualification: vals }))
          }
        />

        <label>Core Subjects</label>
        <CustomMultiSelect
          placeholder="Select core subjects"
          options={fieldOptions['core_subjects'] || []}
          selectedValues={multiSelectValues['core_subjects']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, core_subjects: vals }))
          }
        />

        <label>Optional Subject</label>
        <CustomMultiSelect
          placeholder="Select optional subject"
          options={fieldOptions['optional_subject'] || []}
          selectedValues={multiSelectValues['optional_subject']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({
              ...prev,
              optional_subject: vals,
            }))
          }
        />

        {/* Total Experience */}
        <label>Total Experience (Years)</label>
        <div className="range-container">
          <input
            type="range"
            id="total_experience_min_years"
            min="0"
            max="30"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <span id="experienceValue">{experience}</span>
        </div>

        {/* Salary Ranges */}
        <label>Minimum Salary</label>
        <div className="range-container">
          <input
            type="range"
            id="min_salary"
            min="0"
            max="100000"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
          />
          <span id="minSalaryValue">{minSalary}</span>
        </div>

        <label>Maximum Salary</label>
        <div className="range-container">
          <input
            type="range"
            id="max_salary"
            min="0"
            max="100000"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
          />
          <span id="maxSalaryValue">{maxSalary}</span>
        </div>

        {/* Single-select fields */}
        <label>Country</label>
        <SingleSelect
          placeholder="Select country"
          options={fieldOptions['country'] || []}
          value={singleSelectValues['country']}
          onChange={(val) =>
            setSingleSelectValues((prev) => ({ ...prev, country: val }))
          }
        />

        <label>State/UT</label>
        <SingleSelect
          placeholder="Select state/UT"
          options={fieldOptions['state_ut'] || []}
          value={singleSelectValues['state_ut']}
          onChange={(val) =>
            setSingleSelectValues((prev) => ({ ...prev, state_ut: val }))
          }
        />

        <label>City</label>
        <SingleSelect
          placeholder="Select city"
          options={fieldOptions['city'] || []}
          value={singleSelectValues['city']}
          onChange={(val) =>
            setSingleSelectValues((prev) => ({ ...prev, city: val }))
          }
        />

        {/* More multi-select fields */}
        <label>Job Type</label>
        <CustomMultiSelect
          placeholder="Select job type"
          options={fieldOptions['job_type'] || []}
          selectedValues={multiSelectValues['job_type']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, job_type: vals }))
          }
        />

        <label>Designations</label>
        <CustomMultiSelect
          placeholder="Select designations"
          options={fieldOptions['designations'] || []}
          selectedValues={multiSelectValues['designations']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, designations: vals }))
          }
        />

        <label>Designated Grades</label>
        <CustomMultiSelect
          placeholder="Select designated grades"
          options={fieldOptions['designated_grades'] || []}
          selectedValues={multiSelectValues['designated_grades']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({
              ...prev,
              designated_grades: vals,
            }))
          }
        />

        <label>Curriculum</label>
        <CustomMultiSelect
          placeholder="Select curriculum"
          options={fieldOptions['curriculum'] || []}
          selectedValues={multiSelectValues['curriculum']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, curriculum: vals }))
          }
        />

        <label>Subjects</label>
        <CustomMultiSelect
          placeholder="Select subjects"
          options={fieldOptions['subjects'] || []}
          selectedValues={multiSelectValues['subjects']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, subjects: vals }))
          }
        />

        <label>Core Expertise</label>
        <CustomMultiSelect
          placeholder="Select core expertise"
          options={fieldOptions['core_expertise'] || []}
          selectedValues={multiSelectValues['core_expertise']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, core_expertise: vals }))
          }
        />

        <label>Job Shifts</label>
        <CustomMultiSelect
          placeholder="Select job shifts"
          options={fieldOptions['job_shifts'] || []}
          selectedValues={multiSelectValues['job_shifts']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, job_shifts: vals }))
          }
        />

        <label>Job Process</label>
        <CustomMultiSelect
          placeholder="Select job process"
          options={fieldOptions['job_process'] || []}
          selectedValues={multiSelectValues['job_process']}
          onChange={(vals) =>
            setMultiSelectValues((prev) => ({ ...prev, job_process: vals }))
          }
        />

        <button id="submitBtn" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Right Content Area */}
      <div className="right-content" id="jobResults">
        {renderJobResults()}
      </div>

      {/* Full Detailed View Overlay */}
      <div 
        className="full-details" 
        id="fullDetails"
        style={{ display: showFullDetails ? 'block' : 'none' }}
      >
        <div className="detail-header">
          <h2 id="detailTitle">
            {selectedJob?.job_title ? selectedJob.job_title : 'Job Title'}
          </h2>
          <button
            className="back-btn"
            id="backBtn"
            onClick={() => setShowFullDetails(false)}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </button>
        </div>
        <div className="action-buttons">
          <button id="applyBtn" onClick={() => setShowPopup(true)}>
            <i className="fa-solid fa-check"></i> Apply
          </button>
          <button id="messageBtn" onClick={() => setShowPopup(true)}>
            <i className="fa-solid fa-envelope"></i> Message
          </button>
          <button id="saveBtn" onClick={() => setShowPopup(true)}>
            <i className="fa-solid fa-bookmark"></i> Save
          </button>
        </div>
        <div id="fullDetailsContent">{renderJobDetails()}</div>
      </div>

      {/* Subscription Popup */}
      <div 
        className="popup-subscription" 
        id="popupSubscription"
        style={{ display: showPopup ? 'block' : 'none' }}
      >
        <button
          className="close-popup"
          id="closePopup"
          onClick={() => setShowPopup(false)}
        >
          &times;
        </button>
        <p>Subscription is not done.</p>
        <button id="subscribeBtn">
          <i className="fa-solid fa-arrow-right"></i> Subscribe
        </button>
      </div>
    </>
  );
}

export default Filters;