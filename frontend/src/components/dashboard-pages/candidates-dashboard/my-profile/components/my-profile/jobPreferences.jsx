import React, { useState } from 'react';
import Select from 'react-select';
import csc from "countries-states-cities";

const JobPreference = () => {
  const [preferences, setPreferences] = useState({
    jobShift: {
      fullTime: { offline: null, online: null },
      partTimeWeekdays: { offline: null, online: null },
      partTimeWeekends: { offline: null, online: null },
      partTimeVacations: { offline: null, online: null }
    },
    organizationType: {
      schoolCollegeUniversity: { offline: null, online: null },
      coachingCentersInstitutes: { offline: null, online: null },
      edTechCompanies: { offline: null, online: null }
    },
    parentGuardian: {
      homeTuitionsOffline: { offline: null, online: null },
      privateTuitionsOffline: { offline: null, online: null },
      groupTuitionsOffline: { offline: null, online: null },
      privateTuitionsOnline: { offline: null, online: null },
      groupTuitionsOnline: { offline: null, online: null },
      coachingClassesOffline: { offline: null, online: null }
    }
  });

  const [jobSearchStatus, setJobSearchStatus] = useState({
    fullTime: {
      offline: '',
      online: ''
    },
    partTimeWeekdays: {
      offline: '',
      online: ''
    }
  });

  const [salaryDetails, setSalaryDetails] = useState({
    expectedSalary: "",
   
  });

  const [jobDetails, setJobDetails] = useState({
    jobType: '',
    teachingDesignations: [],
    curriculum: [],
    subjects: [],
    grades: [],
    coreExpertise: [],
    adminDesignations: [],
    adminCurriculum: [],
    teachingAndAdminDesignation: [],
    expectedSalary: '',
    preferredLocations: [],
    preferredCountries: [],
    noticePeriod: '',
    location: '',
    country: '',
  });

  const jobTypeOptions = [
    { value: 'teaching', label: 'Education - Teaching' },
    { value: 'administration', label: 'Education - Administration' },
    { value: 'teachingAndAdmin', label: 'Education - Teaching + Administration' }
  ];

  const teachingDesignations = [
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

  const subjectOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'others', label: 'Others' }
  ];

  const gradeOptions = [
    { value: 'prePrimary', label: 'Pre-Primary' },
    { value: 'primary', label: 'Primary' },
    { value: 'middleSchool', label: 'Middle School' },
    { value: 'highSchool', label: 'High School' },
    { value: 'grade1', label: 'Grade 1' },
    { value: 'grade2', label: 'Grade 2' },
    { value: 'grade12', label: 'Grade 12' },
    { value: 'degree', label: 'Degree' },
    { value: 'masterDegree', label: 'Master Degree' },
    { value: 'phd', label: 'PhD' },
    { value: 'mphil', label: 'MPhil' },
    { value: 'bed', label: 'B.Ed' },
    { value: 'ded', label: 'D.Ed' }
  ];

  const coreExpertiseOptions = [
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

  const teachingAndAdminDesignationOptions = [
    ...teachingDesignations.map(option => ({
      ...option,
      group: 'Teaching'
    })),
    ...adminDesignationOptions.map(option => ({
      ...option,
      group: 'Administration'
    }))
  ];

  const salaryRanges = [
    { value: "less_than_40k", label: "Less than 40K" },
    { value: "40k_70k", label: "40-70 K" },
    { value: "50k_80k", label: "50-80 K" },
    { value: "60k_90k", label: "60-90 K" },
    { value: "70k_100k", label: "70-100 K" },
    { value: "more_than_100k", label: "More than 100K" }
  ];

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  

  const countries = csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const states = selectedCountry
    ? csc.getStatesOfCountry(selectedCountry.value).map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];

  const cities = selectedState
    ? csc.getCitiesOfState(selectedState.value).map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];

  const handlePreferenceChange = (category, field, mode, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: {
          ...prev[category][field],
          [mode]: value
        }
      }
    }));
  };

  const renderJobDetailsSection = () => (
    <div className="form-group col-lg-12">
      <div className="form-box">
        <h3 className="form-title">Expected Job preferences</h3>
        <div className="row">
          {/* Job Type */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              placeholder="Job Type"
              options={jobTypeOptions}
              value={jobTypeOptions.find(option => option.value === jobDetails.jobType)}
              onChange={(selected) => {
                console.log('Selected job type:', selected?.value);
                setJobDetails(prev => ({
                  ...prev,
                  jobType: selected?.value
                }));
              }}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <select 
            placeholder="Expected salary(INR)"
              required
              value={salaryDetails.expectedSalary}
              onChange={(e) => setSalaryDetails(prev => ({
                ...prev,
                expectedSalary: e.target.value
              }))}
            >
              <option value="">Expected salary(INR)</option>
              {salaryRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>


              {/* Notice Period */}
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  placeholder="Notice Period"
                  options={[
                    { value: '', label: 'Notice Period' },
                    { value: 'immediateJoiner', label: 'Immediate Joiner' },
                    { value: 'lessThan7', label: '< 7 days' },
                    { value: 'lessThan15', label: '< 15 days' },
                    { value: 'lessThan1Month', label: '< 1 month' },
                    { value: 'moreThan1Month', label: '> 1 Month' }
                  ]}
                  value={jobDetails.noticePeriod}
                  onChange={(selected) => setJobDetails(prev => ({
                    ...prev,
                    noticePeriod: selected
                  }))}
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred Country"
        options={countries}
        value={selectedCountry}
        onChange={(option) => {
          setSelectedCountry(option);
          setSelectedState(null); // Reset state when country changes
          setSelectedCity(null);  // Reset city when country changes
        }}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred State/UT"
        options={states}
        value={selectedState}
        onChange={(option) => {
          setSelectedState(option);
          setSelectedCity(null); // Reset city when state changes
        }}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred City"
        options={cities}
        value={selectedCity}
        onChange={(option) => setSelectedCity(option)}
      />
    </div>

          {jobDetails.jobType && (
            <>
              {/* Teaching and Administration Combined Fields */}
              {jobDetails.jobType === 'teachingAndAdmin' && (
                <div className='row'>
                  {/* Teaching and Admin Designation */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Teaching & Administrative Designation(s)"
                      options={[
                        {
                          label: 'Teaching Designations',
                          options: teachingDesignations
                        },
                        {
                          label: 'Administrative Designations',
                          options: adminDesignationOptions
                        }
                      ]}
                      value={jobDetails.teachingAndAdminDesignation.map(value => {
                        const option = teachingAndAdminDesignationOptions.find(opt => opt.value === value);
                        return option ? {
                          value: option.value,
                          label: option.label
                        } : null;
                      }).filter(Boolean)}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingAndAdminDesignation: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>

                  {/* Curriculum/Board/University */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Curriculum/Board/University"
                      options={curriculumOptions}
                      value={jobDetails.curriculum.map(value => ({
                        value,
                        label: curriculumOptions.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        curriculum: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>

                  {/* Subjects */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Subjects"
                      options={subjectOptions}
                      value={jobDetails.subjects.map(value => ({
                        value,
                        label: subjectOptions.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        subjects: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>

                  {/* Grades */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Grades"
                      options={gradeOptions}
                      value={jobDetails.grades.map(value => ({
                        value,
                        label: gradeOptions.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        grades: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>

                  {/* Core Expertise */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Core Expertise"
                      options={coreExpertiseOptions}
                      value={jobDetails.coreExpertise.map(value => ({
                        value,
                        label: coreExpertiseOptions.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        coreExpertise: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>
                </div>
              )}
            </>
          )}

 {/* Teaching Related Fields */}
 {jobDetails.jobType === 'teaching' && (
        <>
          {/* Teaching Designation */}
          <div className='row'>
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Teaching Designation(s)"
              options={teachingDesignations}
              value={jobDetails.teachingDesignations.map(value => ({
                value,
                label: teachingDesignations.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingDesignations: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>

          {/* Curriculum/Board/University */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Curriculum/Board/University"
              options={curriculumOptions}
              value={jobDetails.curriculum.map(value => ({
                value,
                label: curriculumOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                curriculum: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>

          {/* Subjects */}
          <div className="form-group col-lg-6 col-md- 12">
            <Select
              isMulti
              placeholder="Subjects"
              options={subjectOptions}
              value={jobDetails.subjects.map(value => ({
                value,
                label: subjectOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                subjects: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>

          {/* Grades */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Grades"
              options={gradeOptions}
              value={jobDetails.grades.map(value => ({
                value,
                label: gradeOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                grades: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>

          {/* Core Expertise */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Core Expertise"
              options={coreExpertiseOptions}
              value={jobDetails.coreExpertise.map(value => ({
                value,
                label: coreExpertiseOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                coreExpertise: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>
          </div>
        </>
      )}

{/* Administration Related Fields */}
{jobDetails.jobType === 'administration' && (
        <>
          {/* Administrative Designation */}
          <div className='row'>
          <div className="form form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Administrative Designation(s)"
              options={adminDesignationOptions}
              value={jobDetails.adminDesignations.map(value => ({
                value,
                label: adminDesignationOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                adminDesignations: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>

          {/* Administrative Curriculum/Board/University */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Curriculum/Board/University"
              options={curriculumOptions}  // Using the same curriculum options as teaching
              value={jobDetails.adminCurriculum.map(value => ({
                value,
                label: curriculumOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                adminCurriculum: selected ? selected.map(item => item.value) : []
              }))}
              className="form-select"
            />
          </div>
          </div>
        </>
      )}

        </div>
      </div>
    </div>
  );

  return (
    <form className="default-form">
      
      
      <div className="row">
        {/* Job Shift & Job Category Section */}
        <div className="form-group col-md-6 col-lg-12">
          <h3>Job Preferences</h3>
          <div className="form-box">
            <h3 className="form-title">Job Shift & Job Category</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Full time</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.fullTime.offline === null ? '' : preferences.jobShift.fullTime.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'fullTime', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.fullTime.online === null ? '' : preferences.jobShift.fullTime.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'fullTime', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Part time (Weekdays)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekdays.offline === null ? '' : preferences.jobShift.partTimeWeekdays.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekdays', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekdays.online === null ? '' : preferences.jobShift.partTimeWeekdays.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekdays', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Part time (Weekends)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekends.offline === null ? '' : preferences.jobShift.partTimeWeekends.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekends', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeWeekends.online === null ? '' : preferences.jobShift.partTimeWeekends.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeWeekends', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Part time (vacations)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeVacations.offline === null ? '' : preferences.jobShift.partTimeVacations.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeVacations', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.partTimeVacations.online === null ? '' : preferences.jobShift.partTimeVacations.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'partTimeVacations', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {/* Similar rows for other job shifts */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Organization Type Section */}
        <div className="form-group col-lg-12">
          <div className="form-box">
            <h3 className="form-title">Organization Type</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>School / College / University</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.schoolCollegeUniversity.offline === null ? '' : preferences.organizationType.schoolCollegeUniversity.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'schoolCollegeUniversity', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.schoolCollegeUniversity.online === null ? '' : preferences.organizationType.schoolCollegeUniversity.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'schoolCollegeUniversity', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>Coaching Centers / Institutes</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.coachingCentersInstitutes.offline === null ? '' : preferences.organizationType.coachingCentersInstitutes.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coachingCentersInstitutes', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.coachingCentersInstitutes.online === null ? '' : preferences.organizationType.coachingCentersInstitutes.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coachingCentersInstitutes', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td>EdTech Companies</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.edTechCompanies.offline === null ? '' : preferences.organizationType.edTechCompanies.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'edTechCompanies', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.edTechCompanies.online === null ? '' : preferences.organizationType.edTechCompanies.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'edTechCompanies', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {/* Add similar rows for coachingCentersInstitutes and edTechCompanies */}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Parent / Guardian Section */}
        <div className="form-group col-lg-12">
          <div className="form-box">
            <h3 className="form-title">Parent / Guardian looking for tuitions</h3>
            <div className="preference-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Offline</th>
                    <th>Online</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Home Tutor (One-to-One at Student's Home)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.homeTuitionsOffline.offline === null ? '' : preferences.parentGuardian.homeTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'homeTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Private Tutor (One-to-One at Tutor's Place)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.privateTuitionsOffline.offline === null ? '' : preferences.parentGuardian.privateTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'privateTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Group Tuitions Offline (at teachers home)
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.groupTuitionsOffline.offline === null ? '' : preferences.parentGuardian.groupTuitionsOffline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'groupTuitionsOffline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Private Tuitions Online (One-One)</td>
                    <td className="disabled">-</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.privateTuitionsOnline.online === null ? '' : preferences.parentGuardian.privateTuitionsOnline.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'privateTuitionsOnline', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Group Tuitions Online (from teacher as tutor)</td>
                    <td className="disabled">-</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.groupTuitionsOnline.online === null ? '' : preferences.parentGuardian.groupTuitionsOnline.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'groupTuitionsOnline', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {renderJobDetailsSection()}
      {/* Job Search Status Section */}
      <div className="job-search-status">
        <h3>Job Search Status</h3>
        <div className="preference-table">
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Offline</th>
                <th>Online</th>
              </tr>
            </thead>
            <tbody>
              {/* Full Time Row */}
              <tr>
                <td>Full Time</td>
                <td>
                  <select
                    className="form-select"
                    value={jobSearchStatus.fullTime.offline}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      fullTime: {
                        ...prev.fullTime,
                        offline: e.target.value
                      }
                    }))}
                  >
                    <option value="">Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={jobSearchStatus.fullTime.online}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      fullTime: {
                        ...prev.fullTime,
                        online: e.target.value
                      }
                    }))}
                  >
                    <option value="">Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
              </tr>

              {/* Part Time Weekdays Row */}
              <tr>
                <td>Part Time(Weekdays)</td>
                <td>
                  <select
                    className="form-select"
                    value={jobSearchStatus.partTimeWeekdays.offline}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      partTimeWeekdays: {
                        ...prev.partTimeWeekdays,
                        offline: e.target.value
                      }
                    }))}
                  >
                    <option value="">Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={jobSearchStatus.partTimeWeekdays.online}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      partTimeWeekdays: {
                        ...prev.partTimeWeekdays,
                        online: e.target.value
                      }
                    }))}
                  >
                    <option value="">Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
      <button type="submit" className="theme-btn btn-style-three">Save Job Preferences</button>
      </div>
    </form>
  );
};

export default JobPreference; 