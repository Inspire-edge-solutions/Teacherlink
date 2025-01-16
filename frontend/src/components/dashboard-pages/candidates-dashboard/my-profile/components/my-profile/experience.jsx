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

const adminDesignationOptions = [
  { value: 'principal', label: 'Principal' },
  { value: 'vicePrincipal', label: 'Vice Principal' },
  { value: 'director', label: 'Director' },
  { value: 'academicCoordinator', label: 'Academic Coordinator' },
  { value: 'disciplineCoordinator', label: 'Discipline Coordinator' },
  { value: 'dean', label: 'Dean' }
];

const teachingAdminDesignationOptions = [
  { value: 'principal', label: 'Principal' },
  { value: 'vicePrincipal', label: 'Vice Principal' },
  { value: 'director', label: 'Director' },
  { value: 'academicCoordinator', label: 'Academic Coordinator' },
  { value: 'disciplineCoordinator', label: 'Discipline Coordinator' },
  { value: 'dean', label: 'Dean' },
  { value: 'nurseryTeacher', label: 'Nursery Teacher' },
  { value: 'montessoriTeacher', label: 'Montessori Teacher' },
  { value: 'neetFaculty', label: 'NEET faculty' },
  { value: 'jeeFaculty', label: 'JEE faculty' },
  { value: 'cetFaculty', label: 'CET faculty' }
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

  const [experienceEntries, setExperienceEntries] = useState([{
    ...initialState,
    adminDesignation: '',
    curriculum: ''
  }]);

  const addNewExperience = () => {
    setExperienceEntries(prev => [...prev, {
      ...initialState,
      adminDesignation: '',
      curriculum: ''
    }]);
  };

  const yearOptions = [
    ...Array.from({ length: 31 }, (_, i) => (
      <option key={i} value={i}>{i} Years</option>
    )),
    <option key="31" value="31">{'>30 Years'}</option>
  ];

  const validateForm = (entry) => {
    const errors = {};
    
    if (entry.jobType === 'non-education') {
      if (!entry.generalDesignation) {
        errors.generalDesignation = 'General designation is required';
      }
      if (!entry.roleDesignation) {
        errors.roleDesignation = 'Role designation is required';
      }
      if (!entry.industryType) {
        errors.industryType = 'Industry type is required';
      }
      if (!entry.workProfile) {
        errors.workProfile = 'Work profile is required';
      }
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = experienceEntries.map(entry => validateForm(entry));
    
    if (errors.every(error => Object.keys(error).length === 0)) {
      console.log('Form submitted:', experienceEntries);
    } else {
      console.log('Form errors:', errors);
    }
  };

  const removeExperience = (indexToRemove) => {
    setExperienceEntries(prev => prev.filter((_, index) => index !== indexToRemove));
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

     

      {/* Experience Details Forms */}
      {experienceEntries.map((experience, index) => (
        <div key={index} className="experience-entry">
          <div className="d-flex justify-content-between align-items-center">
            <h4>Experience Details {index + 1}</h4>
            {experienceEntries.length > 1 && (
              <div>
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeExperience(index)}
              >
                Remove
              </button>
              </div>
            )}
          </div>
          <div className="row">
            {/* Organization Name */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                maxLength="20"
                pattern="[A-Za-z0-9 ]+"
                value={experience.organizationName}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    organizationName: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                placeholder="Enter organization name"
              />
            </div>

            {/* Job Category */}
            <div className="form-group col-lg-6 col-md-12">
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={`jobCategory-${index}`}
                    value="fullTime"
                    checked={experience.jobCategory === 'fullTime'}
                    onChange={(e) => {
                      const newEntries = [...experienceEntries];
                      newEntries[index] = {
                        ...newEntries[index],
                        jobCategory: e.target.value
                      };
                      setExperienceEntries(newEntries);
                    }}
                  />
                  Full Time
                </label>
                <label>
                  <input
                    type="radio"
                    name={`jobCategory-${index}`}
                    value="partTime"
                    checked={experience.jobCategory === 'partTime'}
                    onChange={(e) => {
                      const newEntries = [...experienceEntries];
                      newEntries[index] = {
                        ...newEntries[index],
                        jobCategory: e.target.value
                      };
                      setExperienceEntries(newEntries);
                    }}
                  />
                  Part Time
                </label>
              </div>
            </div>

            {/* Job Type */}
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-select"
                value={experience.jobType}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    jobType: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              >
                <option value="">Select Job Type</option>
                <option value="teaching">Education - Teaching</option>
                <option value="administration">Education - Administration</option>
                <option value="teachingAndAdministration">Education - Teaching + Administration</option>
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
                    name={`currentlyWorking-${index}`}
                    value="yes"
                    checked={experience.currentlyWorking === true}
                    onChange={(e) => {
                      const newEntries = [...experienceEntries];
                      newEntries[index] = {
                        ...newEntries[index],
                        currentlyWorking: e.target.value === 'yes'
                      };
                      setExperienceEntries(newEntries);
                    }}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`currentlyWorking-${index}`}
                    value="no"
                    checked={experience.currentlyWorking === false}
                    onChange={(e) => {
                      const newEntries = [...experienceEntries];
                      newEntries[index] = {
                        ...newEntries[index],
                        currentlyWorking: e.target.value === 'yes'
                      };
                      setExperienceEntries(newEntries);
                    }}
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
                  value={experience.workPeriod.from.month}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].workPeriod,
                        from: { ...newEntries[index].workPeriod.from, month: e.target.value }
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={experience.workPeriod.from.year}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].workPeriod,
                        from: { ...newEntries[index].workPeriod.from, year: e.target.value }
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
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

            {!experience.currentlyWorking && (
              <div className="form-group col-lg-6 col-md-12">
                <label>Worked till</label>
                <div className="date-selector">
                  {/* Similar month/year selectors as above */}
                  <select
                  value={experience.workPeriod.from.month}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].workPeriod,
                        from: { ...newEntries[index].workPeriod.from, month: e.target.value }
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={experience.workPeriod.from.year}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].workPeriod,
                        from: { ...newEntries[index].workPeriod.from, year: e.target.value }
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
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
              <div className="salary-input d-flex align-items-center">
              <span>Rs.</span>
                <input
                  type="number"
                  className="form-control"
                  step="0.1"
                  min="0"
                  value={experience.salary}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      salary: e.target.value
                    };
                    setExperienceEntries(newEntries);
                  }}
                  placeholder="Enter salary"
                  style={{ maxWidth: '200px' }}
                />
              
                <span className="mx-2">
                  {experience.jobCategory === 'fullTime' ? 'in LPA' : 'per hour'}
                </span>
                {experience.jobCategory === 'fullTime' ? 
                  <span className="text-muted"></span> : 
                  <span className="text-muted"></span>
                }
              </div>
            </div>

            {/* Upload Pay Slip */}
            <div className="form-group col-lg-6 col-md-12">
              <label>Upload Pay Slip</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    paySlip: e.target.files[0]
                  };
                  setExperienceEntries(newEntries);
                }}
              />
            </div>

            {/* Non-Education specific fields */}
            {experience.jobType === 'non-education' && (
              <>
                <div className="row">
                  {/* Designation */}
                  <div className="col-lg-6 col-md-12">
                    <div className="mb-4">
                      <Select
                        options={designationOptions}
                        value={designationOptions.find(option => option.value === experience.designation) || ''}
                        onChange={(selected) => {
                          const newEntries = [...experienceEntries];
                          newEntries[index] = {
                            ...newEntries[index],
                            designation: selected?.value || ''
                          };
                          setExperienceEntries(newEntries);
                        }}
                        styles={customStyles}
                        placeholder="Select designation"
                        isClearable
                      />
                    </div>
                  </div>

                  {/* Industry Type */}
                  <div className="col-lg-6 col-md-12">
                    <div className="mb-4">
                      <Select
                        options={industryTypeOptions}
                        value={industryTypeOptions.find(option => option.value === experience.industryType) || ''}
                        onChange={(selected) => {
                          const newEntries = [...experienceEntries];
                          newEntries[index] = {
                            ...newEntries[index],
                            industryType: selected?.value || ''
                          };
                          setExperienceEntries(newEntries);
                        }}
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
                        experience.workProfile.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          workProfile: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
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
            {experience.jobType === 'teaching' && (
              <div className="row">
                {/* Teaching Designation and Curriculum in first row */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={teachingDesignationOptions}
                      value={teachingDesignationOptions.find(option => option.value === experience.teachingDesignation) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingDesignation: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                      value={curriculumOptions.find(option => option.value === experience.curriculum) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          curriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.subjectsHandled.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          subjectsHandled: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.gradesHandled.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          gradesHandled: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.coreExpertise.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          coreExpertise: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      styles={customStyles}
                      placeholder="Select core expertise"
                      isClearable
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Administration specific fields */}
            {experience.jobType === 'administration' && (
              <div className="row">
                {/* Designation */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={adminDesignationOptions}
                      value={adminDesignationOptions.find(option => 
                        option.value === experience.adminDesignation
                      ) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          adminDesignation: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      styles={customStyles}
                      placeholder="Select designation"
                      isClearable
                    />
                  </div>
                </div>

                {/* Curriculum/Board/University */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={curriculumOptions}
                      value={curriculumOptions.find(option => 
                        option.value === experience.curriculum
                      ) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          curriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      styles={customStyles}
                      placeholder="Select curriculum/board/university"
                      isClearable
                    />
                  </div>
                </div>
              </div>
            )}
            
            
            {experience.jobType === 'teachingAndAdministration' && (
              <div className="row">
                {/* Teaching Designation and Curriculum in first row */}
                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={teachingAdminDesignationOptions}
                      value={teachingAdminDesignationOptions.find(option => option.value === experience.teachingAdminDesignation) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingDesignation: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      styles={customStyles}
                      placeholder="Select designation"
                      isClearable
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-12">
                  <div className="mb-4">
                    <Select
                      options={curriculumOptions}
                      value={curriculumOptions.find(option => option.value === experience.curriculum) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          curriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.subjectsHandled.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          subjectsHandled: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.gradesHandled.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          gradesHandled: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
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
                        experience.coreExpertise.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          coreExpertise: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      styles={customStyles}
                      placeholder="Select core expertise"
                      isClearable
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Industry Type */}
             {experience.jobType === 'nonEducation' && (
             <div className="row">
            
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Designation"
                className="form-control"
                maxLength="20"
                value={experience.designation}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    designation: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Industry Type"
                className="form-control"
                maxLength="20"
                value={experience.industryType}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    industryType: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              />
            </div>

            {/* Work Profile */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Work Profile"
                className="form-control"
                maxLength="40"
                value={experience.workProfile}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    workProfile: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              />
              </div>
            </div>
            )}

            {/* City */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="City"
                value={experience.city}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    city: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              />
            </div>

            {/* Country */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                value={experience.country}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    country: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              />
            </div>

            {/* Job Process */}
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-select"
                value={experience.jobProcess}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    jobProcess: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
              >
                <option value="">Select Job Process</option>
                <option value="regular">Regular (Offline)</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
        </div>
      </div>
      ))}

      {/* Add Experience Details Button */}
      <div className="add-experience-btn-wrapper">
        <button 
          type="button" 
          className="theme-btn btn-style-three"
          onClick={addNewExperience}
        >
          Add Experience Details +
        </button>
      </div>
    </div>
  );
};

export default Experience;