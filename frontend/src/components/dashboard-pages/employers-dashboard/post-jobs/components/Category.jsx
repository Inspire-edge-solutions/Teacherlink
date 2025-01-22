import React, { useState } from 'react';
import Select from 'react-select';

const Category = () => {
  const [jobPreferences, setJobPreferences] = useState({
    jobTitle: '',
    categories: null,
    jobCategory: null,
    partTimeSchedule: [],
    tuitionMode: []
  });

  // Options for dropdowns
  const categoryOptions = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
    { value: 'category3', label: 'Category 3' }
    // Add more categories as needed
  ];

  const jobCategoryOptions = [
    { value: 'fullTime', label: 'Full Time' },
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

  const handleJobCategoryChange = (selected) => {
    setJobPreferences(prev => ({
      ...prev,
      jobCategory: selected,
      // Reset related fields when employment type changes
      partTimeSchedule: [],
      tuitionMode: []
    }));
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

      {/* Employment Type */}
      <div className="form-group col-lg-6 col-md-12">
        <Select
          name="jobCategory"
          options={jobCategoryOptions}
          value={jobPreferences.jobCategory}
          onChange={handleJobCategoryChange}
          placeholder="Job Category"
        />
      </div>

      {/* Part Time Schedule - Shows only if Part Time is selected */}
      {jobPreferences.jobCategory?.value === 'partTime' && (
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            name="partTimeSchedule"
            options={partTimeOptions}
            value={jobPreferences.partTimeSchedule}
            onChange={(selected) => setJobPreferences(prev => ({
              ...prev,
              partTimeSchedule: selected
            }))}
            placeholder="Select Schedule"
          />
        </div>
      )}

      {/* Tuition Modes - Shows only if Tuitions is selected */}
      {jobPreferences.jobCategory?.value === 'tuitions' && (
        <div className="form-group col-lg-6 col-md-12">
          <Select
            isMulti
            name="tuitionMode"
            options={tuitionOptions}
            value={jobPreferences.tuitionMode}
            onChange={(selected) => setJobPreferences(prev => ({
              ...prev,
              tuitionMode: selected
            }))}
            placeholder="Select Tuition Mode"
          />
        </div>
      )}
    </div>
  );
};

export default Category;