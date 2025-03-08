import React, { useState } from 'react';
import Select from 'react-select';
import './postJobs.css';
import Fulltime from './Fulltime';
import Parttime from './Parttime';
import Tutions from './Tutions';

const Category = () => {
  const [jobPreferences, setJobPreferences] = useState({
    jobTitle: '',
    categories: null,
    jobCategory: null,
    partTimeSchedule: [],
    tuitionMode: []
  });


  const jobCategoryOptions = [
    { value: 'fullTime', label: 'Full Time' },
    { value: 'fullPart', label: 'Full Time / Part Time' },
    { value: 'partTime', label: 'Part Time' },
    { value: 'tuitions', label: 'Tuitions' }
  ];

  const partTimeOptions = [
    { value: 'weekDays', label: 'Week days' },
    { value: 'weekEnds', label: 'Week ends' },
    { value: 'vacations', label: 'Vacations' }
  ];

  const tuitionOptions = [
    { value: 'homeTuitionsOffline', label: 'Home Tuitions Offline (One-One at students home)' },
    { value: 'privateTuitionsOffline', label: 'Private Tuitions Offline (One-One at teachers home)' },
    { value: 'groupTuitionsOffline', label: 'Group Tuitions Offline (at teachers home)' },
    { value: 'privateTuitionsOnline', label: 'Private Tuitions Online (One-One)' },
    { value: 'groupTuitionsOnline', label: 'Group Tuitions Online (from teacher as tuitions)' }
  ];

  const handleJobCategoryChange = (value) => {
    setJobPreferences(prev => ({
      ...prev,
      jobCategory: { value, label: jobCategoryOptions.find(opt => opt.value === value).label },
      // Reset related fields when employment type changes
      partTimeSchedule: [],
      tuitionMode: []
    }));
  };

  // Helper function to check if full time options are selected
  const isFullTimeOption = (value) => {
    return value === 'fullTime' || value === 'fullPart';
  };

  return (
    <div className="row">
      {/* Job Title */}
      <div className="form-group col-lg-12">
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={jobPreferences.jobTitle}
          onChange={(e) => setJobPreferences(prev => ({
            ...prev,
            jobTitle: e.target.value
          }))}
          className="form-control"
        />
      </div>

      {/* Employment Type - Radio Buttons */}
      <div className="form-group col-lg-12">
        <div className="radio-group">
          <label>Job Category:</label>
          {jobCategoryOptions.map((option) => (
            <div key={option.value} className="radio-option">
              <input
                type="radio"
                id={option.value}
                name="jobCategory"
                value={option.value}
                checked={jobPreferences.jobCategory?.value === option.value}
                onChange={(e) => handleJobCategoryChange(e.target.value)}
              />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Show appropriate component based on selection */}
      {jobPreferences.jobCategory && (
        <>
          {isFullTimeOption(jobPreferences.jobCategory.value) && <Fulltime />}
          {jobPreferences.jobCategory.value === 'partTime' && <Parttime />}
          {jobPreferences.jobCategory.value === 'tuitions' && <Tutions />}
        </>
      )}

      
    </div>
  );
};

export default Category;