import React, { useState } from 'react';
import './postJobs.css';
import Select from 'react-select';

const Details = () => {
  const [salaryRange, setSalaryRange] = useState({
    minSalary: '',
    maxSalary: ''
  });
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({
    minSalary: '',
    maxSalary: '',
    locations: ''
  });

  const [formData, setFormData] = useState({
    jobType: null,
    designations: [],
    grades: [],
    curriculum: []
  });

  const [additionalData, setAdditionalData] = useState({
    subjects: [],
    coreExpertise: [],
    jobShift: [],
    jobProcess: [],
    jobSubCategory: [],
    numberOfOpenings: '',
    jobDescription: '',
    joiningDate: '',
    selectionProcess: [],
    interviewMode: []
  });

  const jobTypeOptions = [
    { value: '', label: 'Job Type' },
    { value: 'Teaching', label: 'Teaching' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Teaching + Administration', label: 'Teaching + Administration' }
  ];
  
  const designationOptions = [
    { value: 'Home Tutor', label: 'Home Tutor' },
    { value: 'Tuition Teacher', label: 'Tuition Teacher' },
    { value: 'Nursery Teacher', label: 'Nursery Teacher' },
    { value: 'Montessori Teacher', label: 'Montessori Teacher' },
    { value: 'NEET faculty', label: 'NEET faculty' },
    { value: 'JEE faculty', label: 'JEE faculty' },
    { value: 'CET faculty', label: 'CET faculty' },
    { value: 'Other', label: 'Other' }
  ];

  const gradeOptions = [
    { value: 'Pre School', label: 'Pre School' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: 'Degree', label: 'Degree' },
    { value: 'PG', label: 'PG' },
    { value: 'Not Applicable', label: 'Not Applicable' }
  ];

  const curriculumOptions = [
    { value: 'State Board', label: 'State Board' },
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'IGCSE', label: 'IGCSE' },
    { value: 'Not Applicable', label: 'Not Applicable' }
  ];

  const subjectOptions = [
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Others', label: 'Others' }
  ];

  const expertiseOptions = [
    { value: 'NEET', label: 'NEET' },
    { value: 'JEE(Mains)', label: 'JEE(Mains)' },
    { value: 'JEE(Advanced)', label: 'JEE(Advanced)' },
    { value: 'CET', label: 'CET (state level entrance)' },
    { value: 'Foundation', label: 'Foundation' },
    { value: 'Spoken English', label: 'Spoken English' },
    { value: 'Robotics Lab', label: 'Robotics Lab' },
    { value: 'Junior IAS', label: 'Junior IAS' },
    { value: 'Practical classes', label: 'Practical classes' }
  ];

  const shiftOptions = [
    { value: 'Week days', label: 'Week days' },
    { value: 'All days', label: 'All days' },
    { value: 'week ends', label: 'Week ends' },
    { value: 'Vacations', label: 'Vacations' }
  ];

  const processOptions = [
    { value: 'Regular', label: 'Regular (Offline)' },
    { value: 'Online', label: 'Online' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  const subCategoryOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'tuition Center', label: 'Tuition Center' },
    { value: 'Group tuition', label: 'Group tuition' },
    { value: 'Private tuitions', label: 'Private tuitions' },
    { value: 'Home Tuitions', label: 'Home Tuitions' }
  ];

  const selectionProcessOptions = [
    { value: 'Demo', label: 'Demo' },
    { value: 'Written test', label: 'Written test' },
    { value: 'Personal Interview', label: 'Personal Interview' },
    { value: 'Subject Interview', label: 'Subject Interview' },
    { value: 'HR interview', label: 'HR interview' },
    { value: 'Management Interview', label: 'Management Interview' }
  ];

  const interviewModeOptions = [
    { value: 'Online', label: 'Online' },
    { value: 'Offline', label: 'Offline' },
    { value: 'Hybrid', label: 'Hybrid' }
  ];

  const [date, setDate] = useState('text');
  const handleFocus = () => setDate('date');
  const handleBlur = (event) => {
    if (!event.target.value) setDate('text');
  };


  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 50,
      marginBottom: 20,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#1967d2',
      borderRadius: 4,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: 'white',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: 'white',
      ':hover': {
        backgroundColor: '#1967d2',
        color: 'white',
      },
    }),
  };

  const validateInput = (name, value) => {
    if (!value) {
      return `${name === 'minSalary' ? 'Minimum' : 'Maximum'} salary is required`;
    }
    if (value <= 0) {
      return 'Salary must be greater than 0';
    }
    if (name === 'maxSalary' && parseFloat(value) <= parseFloat(salaryRange.minSalary)) {
      return 'Maximum salary must be greater than minimum salary';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalaryRange(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateInput(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      setLocations(prev => [...prev, value.trim()]);
      e.target.value = ''; // Clear input after adding
      setErrors(prev => ({ ...prev, locations: '' }));
    }
  };

  const removeLocation = (indexToRemove) => {
    setLocations(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleJobTypeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      jobType: e.target.value
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));

  };

  return (
    <div>
      <div className="form-group">
       
        <div className="row">
        <small className="form-text text-muted mt-3">
          Enter salary in LPA with one decimal if Job Type is Full Time, or per hour if Job Type is Part Time
        </small>
          <div className="col-md-6">
         
            <input
              type="number"
              name="minSalary"
              placeholder="Minimum Salary"
              className={`form-control ${errors.minSalary ? 'is-invalid' : ''}`}
              value={salaryRange.minSalary}
              onChange={handleChange}
            />
            {errors.minSalary && (
              <div className="invalid-feedback">{errors.minSalary}</div>
            )}
          </div>
          <div className="col-md-6">
            <input
              type="number"
              name="maxSalary"
              placeholder="Maximum Salary"
              className={`form-control ${errors.maxSalary ? 'is-invalid' : ''}`}
              value={salaryRange.maxSalary}
              onChange={handleChange}
            />
            {errors.maxSalary && (
              <div className="invalid-feedback">{errors.maxSalary}</div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
      <div className="form-group col-lg-6 col-md-12">
        <div className="location-input-wrapper">
          <input
            type="text"
            className="form-control"
            placeholder="Location (Area, City, State)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLocationChange(e);
              }
            }}
          />
        </div>
        {locations.length > 0 && (
          <div className="selected-locations mt-2">
            {locations.map((location, index) => (
              <span key={index} className="badge btn-style-one me-2 mb-2">
                {location}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => removeLocation(index)}
                  aria-label="Remove location"
                  style={{ 
                    fontSize: '0.75rem',
                    opacity: '1',
                    textShadow: 'none',
                    fontWeight: 'bold',
                    padding: '2px',
                  }}
                >×</button>
              </span>
            ))}
          </div>
        )}
        {errors.locations && (
          <div className="invalid-feedback d-block">{errors.locations}</div>
        )}
      </div>

      <div className="form-group col-lg-6 col-md-12">
        <Select
          value={formData.jobType}
          onChange={(option) => setFormData(prev => ({ ...prev, jobType: option }))}
          options={jobTypeOptions}
          styles={customStyles}
          placeholder="Job Type"
        />
      </div>

        <div className="form-group col-lg-6 col-md-12">
        <Select
          isMulti
          value={formData.designations}
          onChange={(options) => setFormData(prev => ({ ...prev, designations: options }))}
          options={designationOptions}
          styles={customStyles}
          placeholder="Designations"
        />
      </div>

      <div className="form-group col-lg-6 col-md-12">
        <Select
          isMulti
          value={formData.grades}
          onChange={(options) => setFormData(prev => ({ ...prev, grades: options }))}
          options={gradeOptions}
          styles={customStyles}
          placeholder="Designated Grades"
        />
      </div>

      <div className="form-group col-lg-6 col-md-12">
        <Select
          isMulti
          value={formData.curriculum}
          onChange={(options) => setFormData(prev => ({ ...prev, curriculum: options }))}
          options={curriculumOptions}
          styles={customStyles}
          placeholder="Curriculum"
        />
      </div>
   

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.subjects}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, subjects: options }))}
        options={subjectOptions}
        styles={customStyles}
        placeholder="Subjects"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.coreExpertise}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, coreExpertise: options }))}
        options={expertiseOptions}
        styles={customStyles}
        placeholder="Core Expertise"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.jobShift}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, jobShift: options }))}
        options={shiftOptions}
        styles={customStyles}
        placeholder="Job Shift"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.jobProcess}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, jobProcess: options }))}
        options={processOptions}
        styles={customStyles}
        placeholder="Job Process"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.jobSubCategory}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, jobSubCategory: options }))}
        options={subCategoryOptions}
        styles={customStyles}
        placeholder="Job Sub Category"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <input
        type="number"
        className="form-control"
        value={additionalData.numberOfOpenings}
        onChange={(e) => setAdditionalData(prev => ({ ...prev, numberOfOpenings: e.target.value }))}
        placeholder="Number of openings"
      />
    </div>

    <div className="form-group">
      <textarea
        className="form-control"
        value={additionalData.jobDescription}
        onChange={(e) => setAdditionalData(prev => ({ ...prev, jobDescription: e.target.value }))}
        placeholder="Enter job description"
        rows="2"
        maxLength="100"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      
        <input
          type={date}
          placeholder="Joining date - dd/mm/yyyy"
          value={additionalData.joiningDate}
          onChange={(e)=>setAdditionalData(prev=> ({...prev, joiningDate:e.target.value}))}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
    
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.selectionProcess}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, selectionProcess: options }))}
        options={selectionProcessOptions}
        styles={customStyles}
        placeholder="Selection Process"
      />
    </div>

    <div className="form-group col-lg-6 col-md-12">
      <Select
        isMulti
        value={additionalData.interviewMode}
        onChange={(options) => setAdditionalData(prev => ({ ...prev, interviewMode: options }))}
        options={interviewModeOptions}
        styles={customStyles}
        placeholder="Interview Mode"
      />
    </div>
    </div>
    </div>
  );
};

export default Details;
