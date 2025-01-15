import React, { useState } from "react";
import "./profile-styles.css";
import Select from "react-select";

const designationOptions = [
  { value: 'designation1', label: 'Designation 1' },
  { value: 'designation2', label: 'Designation 2' },
];

const industryTypeOptions = [
  { value: 'industry1', label: 'Industry 1' },
  { value: 'industry2', label: 'Industry 2' },
];

const workProfileOptions = [
  { value: 'profile1', label: 'Profile 1' },
  { value: 'profile2', label: 'Profile 2' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    height: '50px',
    backgroundColor: '#F0F5F7',
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      border: 'none',
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#1967D2' : provided.backgroundColor,
    '&:hover': {
      backgroundColor: state.isSelected ? '#1967D2' : '#F3F3F3',
    }
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#1967D2',
    borderRadius: '3px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      backgroundColor: '#1967D2',
      color: 'white',
    },
  }),
};

const teachingDesignationOptions = [
  { value: 'nurseryTeacher', label: 'Nursery Teacher' },
  { value: 'montessoriTeacher', label: 'Montessori Teacher' },
  { value: 'neetFaculty', label: 'NEET faculty' },
  { value: 'jeeFaculty', label: 'JEE faculty' },
  { value: 'cetFaculty', label: 'CET faculty' }
];

const curriculumOptions = [
  { value: 'stateBoard', label: 'State Board' },
  { value: 'cbse', label: 'CBSE' },
  { value: 'icse', label: 'ICSE' },
  { value: 'others', label: 'Others' },
  { value: 'affiliatedUniversity', label: 'Affiliated University' },
  { value: 'deemedUniversity', label: 'Deemed University' }
];

const subjectsOptions = [
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'biology', label: 'Biology' },
  { value: 'others', label: 'Others' }
];

const gradesOptions = [
  { value: 'prePrimary', label: 'Pre-Primary' },
  { value: 'primary', label: 'Primary' },
  { value: 'middleSchool', label: 'Middle School' },
  { value: 'highSchool', label: 'High School' },
  { value: 'grade1', label: 'Grade 1' },
  { value: 'grade2', label: 'Grade 2' },
  { value: 'grade3', label: 'Grade 3' },
  { value: 'grade4', label: 'Grade 4' },
  { value: 'grade5', label: 'Grade 5' },
  { value: 'grade6', label: 'Grade 6' },
  { value: 'grade7', label: 'Grade 7' },
  { value: 'grade8', label: 'Grade 8' },
  { value: 'grade9', label: 'Grade 9' },
  { value: 'grade10', label: 'Grade 10' },
  { value: 'grade11', label: 'Grade 11' },
  { value: 'grade12', label: 'Grade 12' },
  { value: 'degree', label: 'Degree' },
  { value: 'masterDegree', label: 'Master Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'mphil', label: 'MPhil' },
  { value: 'bed', label: 'B.Ed' },
  { value: 'ded', label: 'D.Ed' }
];

const expertiseOptions = [
  { value: 'neet', label: 'NEET' },
  { value: 'jeeMains', label: 'JEE(Mains)' },
  { value: 'jeeAdvanced', label: 'JEE (Advanced)' },
  { value: 'cet', label: 'CET (state level entrance)' },
  { value: 'foundation', label: 'Foundation' },
  { value: 'spokenEnglish', label: 'Spoken English' },
  { value: 'roboticsLab', label: 'Robotics Lab' },
  { value: 'juniorIAS', label: 'Junior IAS' },
  { value: 'practicalClasses', label: 'Practical classes' }
];

const Experience = () => {
  const [workExperience, setWorkExperience] = useState({
    total: { years: '0', months: '0' },
    teaching: { years: '0', months: '0' },
    details: {
      teaching: {
        fullTime: { years: '0', months: '0' },
        partTime: { years: '0', months: '0' }
      },
      administration: {
        fullTime: { years: '0', months: '0' },
        partTime: { years: '0', months: '0' }
      },
      nonEducation: {
        fullTime: { years: '0', months: '0' },
        partTime: { years: '0', months: '0' }
      }
    }
  });

  const initialState = {
    organizationName: '',
    jobCategory: '',
    jobType: '',
    designation: '',
    industryType: '',
    workProfile: [],
    curriculum: '',
    subjectsHandled: [],
    gradesHandled: [],
    coreExpertise: [],
    adminDesignation: '',
    adminCurriculum: '',
    currentlyWorking: null,
    workPeriod: {
      from: { month: '', year: '' },
      to: { month: '', year: '' }
    },
    salary: '',
    paySlip: null
  };

  const [experienceDetails, setExperienceDetails] = useState(initialState);

  const yearOptions = [
    ...Array.from({ length: 31 }, (_, i) => (
      <option key={i} value={i}>{i} Years</option>
    )),
    <option key="31" value="31">{'>30 Years'}</option>
  ];

  const validateForm = () => {
    const errors = {};
    
    if (experienceDetails.jobType === 'non-education') {
      if (!experienceDetails.generalDesignation) {
        errors.generalDesignation = 'General designation is required';
      }
      if (!experienceDetails.roleDesignation) {
        errors.roleDesignation = 'Role designation is required';
      }
      if (!experienceDetails.industryType) {
        errors.industryType = 'Industry type is required';
      }
      if (!experienceDetails.workProfile) {
        errors.workProfile = 'Work profile is required';
      }
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', experienceDetails);
    } else {
      console.log('Form errors:', errors);
    }
  };

  return (
    <div className="work-experience-section">
      {/* Total and Teaching Experience Row */}
      <h3>Work Experience</h3>
      <div className="experience-row">
        <div className="experience-col">
          <h4>Total Experience (Full Time + Part Time)</h4>
          <div className="duration-selector">
            <select 
              value={workExperience.total.years}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                total: { ...prev.total, years: e.target.value }
              }))}
            >
              {yearOptions}
            </select>
            <select 
              value={workExperience.total.months}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                total: { ...prev.total, months: e.target.value }
              }))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i} Months</option>
              ))}
            </select>
          </div>
        </div>

        <div className="experience-col">
          <h4>Teaching Experience (Full Time + Part Time)</h4>
          <div className="duration-selector">
            <select 
              placeholder="Years"
              value={workExperience.teaching.years}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                teaching: { ...prev.teaching, years: e.target.value }
              }))}
            >
              {yearOptions}
            </select>
            <select 
              value={workExperience.teaching.months}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                teaching: { ...prev.teaching, months: e.target.value }
              }))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i} Months</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional Details Table */}
      <div className="experience-details">
        <h4>Additional Details</h4>
        <table className="experience-table">
          <thead>
            <tr>
              <th>Job Category</th>
              <th>Full Time</th>
              <th>Part Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries({
              'teaching': 'Education - Teaching',
              'administration': 'Education - Administration',
              'nonEducation': 'Non-Education (Any Role)'
            }).map(([key, label]) => (
              <tr key={key}>
                <td>{label}</td>
                <td>
                  <div className="duration-selector">
                    <select 
                      value={workExperience.details[key].fullTime.years}
                      onChange={(e) => setWorkExperience(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          [key]: {
                            ...prev.details[key],
                            fullTime: { ...prev.details[key].fullTime, years: e.target.value }
                          }
                        }
                      }))}
                    >
                      {yearOptions}
                    </select>
                    <select 
                      value={workExperience.details[key].fullTime.months}
                      onChange={(e) => setWorkExperience(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          [key]: {
                            ...prev.details[key],
                            fullTime: { ...prev.details[key].fullTime, months: e.target.value }
                          }
                        }
                      }))}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i} Months</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div className="duration-selector">
                    <select 
                      value={workExperience.details[key].partTime.years}
                      onChange={(e) => setWorkExperience(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          [key]: {
                            ...prev.details[key],
                            partTime: { ...prev.details[key].partTime, years: e.target.value }
                          }
                        }
                      }))}
                    >
                      {yearOptions}
                    </select>
                    <select 
                      value={workExperience.details[key].partTime.months}
                      onChange={(e) => setWorkExperience(prev => ({
                        ...prev,
                        details: {
                          ...prev.details,
                          [key]: {
                            ...prev.details[key],
                            partTime: { ...prev.details[key].partTime, months: e.target.value }
                          }
                        }
                      }))}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i}>{i} Months</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Experience Details Button */}
      <div className="add-experience-btn-wrapper">
        <button type="button" className="theme-btn btn-style-one">
          Add Experience Details +
        </button>
      </div>

      {/* Experience Details Form */}
      
        <h4>Experience Details</h4>
        <div className="row">
          {/* Organization Name */}
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              maxLength="20"
              pattern="[A-Za-z0-9 ]+"
              value={experienceDetails.organizationName}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                organizationName: e.target.value
              }))}
              placeholder="Enter organization name"
            />
            <small>Alpha numeric, max 20 characters</small>
          </div>

          {/* Job Category */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="jobCategory"
                  value="fullTime"
                  checked={experienceDetails.jobCategory === 'fullTime'}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    jobCategory: e.target.value
                  }))}
                />
                Full Time
              </label>
              <label>
                <input
                  type="radio"
                  name="jobCategory"
                  value="partTime"
                  checked={experienceDetails.jobCategory === 'partTime'}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    jobCategory: e.target.value
                  }))}
                />
                Part Time
              </label>
            </div>
          </div>

          {/* Job Type */}
          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-select"
              value={experienceDetails.jobType}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                jobType: e.target.value
              }))}
            >
              <option value="">Select Job Type</option>
              <option value="teaching">Education - Teaching</option>
              <option value="administration">Education - Administration</option>
              <option value="teachingAndAdmin">Education - Teaching + Administration</option>
              <option value="nonEducation">Non-Education (Any Role)</option>
            </select>
          </div>

          {/* Currently Working */}
          <div className="form-group col-lg-6 col-md-12">
            
            <div className="radio-group">
            <label>Are you currently working here?</label>
              <label>
                <input
                  type="radio"
                  name="currentlyWorking"
                  value="yes"
                  checked={experienceDetails.currentlyWorking === true}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    currentlyWorking: e.target.value === 'yes'
                  }))}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="currentlyWorking"
                  value="no"
                  checked={experienceDetails.currentlyWorking === false}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    currentlyWorking: e.target.value === 'yes'
                  }))}
                />
                No
              </label>
            </div>
          </div>

          {/* Work Period */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Worked from</label>
            <div className="date-selector">
              <select
                value={experienceDetails.workPeriod.from.month}
                onChange={(e) => setExperienceDetails(prev => ({
                  ...prev,
                  workPeriod: {
                    ...prev.workPeriod,
                    from: { ...prev.workPeriod.from, month: e.target.value }
                  }
                }))}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={experienceDetails.workPeriod.from.year}
                onChange={(e) => setExperienceDetails(prev => ({
                  ...prev,
                  workPeriod: {
                    ...prev.workPeriod,
                    from: { ...prev.workPeriod.from, year: e.target.value }
                  }
                }))}
              >
                <option value="">Year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!experienceDetails.currentlyWorking && (
            <div className="form-group col-lg-6 col-md-12">
              <label>Worked till</label>
              <div className="date-selector">
                {/* Similar month/year selectors as above */}
                <select
                value={experienceDetails.workPeriod.from.month}
                onChange={(e) => setExperienceDetails(prev => ({
                  ...prev,
                  workPeriod: {
                    ...prev.workPeriod,
                    from: { ...prev.workPeriod.from, month: e.target.value }
                  }
                }))}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <select
                value={experienceDetails.workPeriod.from.year}
                onChange={(e) => setExperienceDetails(prev => ({
                  ...prev,
                  workPeriod: {
                    ...prev.workPeriod,
                    from: { ...prev.workPeriod.from, year: e.target.value }
                  }
                }))}
              >
                <option value="">Year</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i} value={new Date().getFullYear() - i}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
              </div>
            </div>
          )}

          {/* Salary */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Salary</label>
            <div className="salary-input">
              {experienceDetails.jobCategory === 'fullTime' ? (
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    step="0.1"
                    value={experienceDetails.salary}
                    onChange={(e) => setExperienceDetails(prev => ({
                      ...prev,
                      salary: e.target.value
                    }))}
                    placeholder="Enter LPA"
                  />
                  <span className="input-group-text">LPA</span>
                </div>
              ) : (
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    className="form-control"
                    value={experienceDetails.salary}
                    onChange={(e) => setExperienceDetails(prev => ({
                      ...prev,
                      salary: e.target.value
                    }))}
                    placeholder="Amount"
                  />
                  <span className="input-group-text">per hour</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Pay Slip */}
          <div className="form-group col-lg-6 col-md-12">
            <label>Upload Pay Slip</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                paySlip: e.target.files[0]
              }))}
            />
          </div>

          {/* Non-Education specific fields */}
          {experienceDetails.jobType === 'non-education' && (
            <>
              <div className="row">
                {/* Designation */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={designationOptions}
                      value={designationOptions.find(option => option.value === experienceDetails.designation) || ''}
                      onChange={(selected) => setExperienceDetails(prev => ({
                        ...prev,
                        designation: selected?.value || ''
                      }))}
                      styles={customStyles}
                      placeholder="Select designation"
                      isClearable
                    />
                    <span className="text-muted small">Alpha numeric, max 20 characters</span>
                  </div>
                </div>

                {/* Industry Type */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={industryTypeOptions}
                      value={industryTypeOptions.find(option => option.value === experienceDetails.industryType) || ''}
                      onChange={(selected) => setExperienceDetails(prev => ({
                        ...prev,
                        industryType: selected?.value || ''
                      }))}
                      styles={customStyles}
                      placeholder="Select industry type"
                      isClearable
                    />
                    <span className="text-muted small">Alpha numeric, max 20 characters</span>
                  </div>
                </div>
              </div>

              {/* Work Profile */}
              <div className="col-lg-12 col-md-12">
                <div className="mb-4">
                  <Select
                    isMulti
                    options={workProfileOptions}
                    value={workProfileOptions.filter(option => 
                      experienceDetails.workProfile.includes(option.value)
                    )}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      workProfile: selected ? selected.map(item => item.value) : []
                    }))}
                    styles={customStyles}
                    placeholder="Select work profile"
                    isClearable
                  />
                  <span className="text-muted small">Alpha numeric, max 40 characters</span>
                </div>
              </div>
            </>
          )}

          {/* Teaching specific fields */}
          {experienceDetails.jobType === 'teaching' && (
            <div className="row">
              {/* Teaching Designation and Curriculum in first row */}
              <div className="col-lg-6 col-md-12">
                <div className="mb-4">
                  <Select
                    options={teachingDesignationOptions}
                    value={teachingDesignationOptions.find(option => option.value === experienceDetails.teachingDesignation) || ''}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      teachingDesignation: selected?.value || ''
                    }))}
                    styles={customStyles}
                    placeholder="Select teaching designation"
                    isClearable
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                <div className="mb-4">
                  <Select
                    options={curriculumOptions}
                    value={curriculumOptions.find(option => option.value === experienceDetails.curriculum) || ''}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      curriculum: selected?.value || ''
                    }))}
                    styles={customStyles}
                    placeholder="Select curriculum"
                    isClearable
                  />
                </div>
              </div>

              {/* Subjects and Grades in second row */}
              <div className="col-lg-6 col-md-12">
                <div className="mb-4">
                  <Select
                    isMulti
                    options={subjectsOptions}
                    value={subjectsOptions.filter(option => 
                      experienceDetails.subjectsHandled.includes(option.value)
                    )}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      subjectsHandled: selected ? selected.map(item => item.value) : []
                    }))}
                    styles={customStyles}
                    placeholder="Select subjects you handled"
                    isClearable
                  />
                </div>
              </div>

              <div className="col-lg-6 col-md-12">
                <div className="mb-4">
                  <Select
                    isMulti
                    options={gradesOptions}
                    value={gradesOptions.filter(option => 
                      experienceDetails.gradesHandled.includes(option.value)
                    )}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      gradesHandled: selected ? selected.map(item => item.value) : []
                    }))}
                    styles={customStyles}
                    placeholder="Select grades you handled"
                    isClearable
                  />
                </div>
              </div>

              {/* Core Expertise in third row */}
              <div className="col-lg-12 col-md-12">
                <div className="mb-4">
                  <Select
                    isMulti
                    options={expertiseOptions}
                    value={expertiseOptions.filter(option => 
                      experienceDetails.coreExpertise.includes(option.value)
                    )}
                    onChange={(selected) => setExperienceDetails(prev => ({
                      ...prev,
                      coreExpertise: selected ? selected.map(item => item.value) : []
                    }))}
                    styles={customStyles}
                    placeholder="Select coreexpertise"
                    isClearable
                  />
                </div>
              </div>
            </div>
          )}

          {/* Administration specific fields */}
          {experienceDetails.jobType === 'administration' && (
            <>
              {/* Administrative Designation */}
              <div className="form-group col-lg-6 col-md-12     ">
                <label>Designation</label>
                <select
                  className="form-select"
                  value={experienceDetails.adminDesignation}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    adminDesignation: e.target.value
                  }))}
                >
                  <option value="">Select Administrative Designation</option>
                  {adminDesignationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Administrative Curriculum */}
              <div className="form-group col-lg-6 col-md-12 ">
                <label>Curriculum / Board / University</label>
                <select
                  className="form-select"
                  value={experienceDetails.adminCurriculum}
                  onChange={(e) => setExperienceDetails(prev => ({
                    ...prev,
                    adminCurriculum: e.target.value
                  }))}
                >
                  <option value="">Select Curriculum</option>
                  {adminCurriculumOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Industry Type */}
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="Industry Type"
              className="form-control"
              maxLength="20"
              value={experienceDetails.industryType}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                industryType: e.target.value
              }))}
            />
          </div>

          {/* Work Profile */}
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              placeholder="Work Profile"
              className="form-control"
              maxLength="40"
              value={experienceDetails.workProfile}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                workProfile: e.target.value
              }))}
            />
          </div>

          {/* City */}
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="City"
              value={experienceDetails.city}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                city: e.target.value
              }))}
            />
          </div>

          {/* Country */}
          <div className="form-group col-lg-6 col-md-12">
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              value={experienceDetails.country}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                country: e.target.value
              }))}
            />
          </div>

          {/* Job Process */}
          <div className="form-group col-lg-6 col-md-12">
            <select
              className="form-select"
              value={experienceDetails.jobProcess}
              onChange={(e) => setExperienceDetails(prev => ({
                ...prev,
                jobProcess: e.target.value
              }))}
            >
              <option value="">Select Job Process</option>
              <option value="regular">Regular (Offline)</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
      </div>
    </div>
  );
};

export default Experience;
