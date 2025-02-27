import  { useState, useEffect } from 'react';
import Select from 'react-select';
import csc from "countries-states-cities";
import axios from 'axios';

const JobPreference = () => {
  const [preferences, setPreferences] = useState({
    jobShift: {
      Full_time: { offline: null, online: null },
      part_time_weekdays: { offline: null, online: null },
      part_time_weekends: { offline: null, online: null },
      part_time_vacations: { offline: null, online: null }
    },
    organizationType: {
      school_college_university: { offline: null, online: null },
      coaching_institute: { offline: null, online: null },
       Ed_TechCompanies: { offline: null, online: null }
    },
    parentGuardian: {
      Home_Tutor: { offline: null, online: null },
      Private_Tutor: { offline: null, online: null },
      Group_Tutor_offline: { offline: null, online: null },
      Private_Tutions_online: { offline: null, online: null },
      Group_Tutor_online: { offline: null, online: null },
      coaching_institute: { offline: null, online: null }
    }
  });

  const [jobSearchStatus, setJobSearchStatus] = useState({
    Full_time: {
      offline: '',
      online: ''
    },
    part_time_weekdays: {
      offline: '',
      online: ''
    }
  });

  const [jobDetails, setJobDetails] = useState({
    Job_Type: '',
    expected_salary: '',
    teachingDesignation: [],
    teachingCurriculum: [],
    teachingSubjects: [],
    teachingGrades: [],
    teachingCoreExpertise: [],
    adminDesignations: [],
    adminCurriculum: [],
    teachingAdminDesignations: [],
    teachingAdminCurriculum: [],
    teachingAdminSubjects: [],
    teachingAdminGrades: [],
    teachingAdminCoreExpertise: [],
    preferred_country: '',
    preferred_state: '',
    preferred_city: '',
    notice_period: '',
  });

  const Job_TypeOptions = [
    { value: 'teaching', label: 'Education - Teaching' },
    { value: 'administration', label: 'Education - Administration' },
    { value: 'teachingAndAdmin', label: 'Education - Teaching + Administration' }
  ];
  const salaryRanges = [
    { value: "less_than_40k", label: "Less than 40K" },
    { value: "40k_70k", label: "40-70 K" },
    { value: "50k_80k", label: "50-80 K" },
    { value: "60k_90k", label: "60-90 K" },
    { value: "70k_100k", label: "70-100 K" },
    { value: "more_than_100k", label: "More than 100K" }
  ];

  const countries = csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const states = jobDetails.preferred_country
    ? csc.getStatesOfCountry(jobDetails.preferred_country.value).map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];

  const cities = jobDetails.preferred_state
    ? csc.getCitiesOfState(jobDetails.preferred_state.value).map((city) => ({
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

  const [subjectsOptions, setSubjectsOptions] = useState([]);
  const [teachingDesignations, setTeachingDesignations] = useState([]);
  const [adminDesignations, setAdminDesignations] = useState([]);
  const [teachingAdminDesignations, setTeachingAdminDesignations] = useState([]);
  const [coreExpertise, setCoreExpertise] = useState([]);
  const [grades, setGrades] = useState([]);
  const [curriculum, setCurriculum] = useState([]);

  const subjectList = async () => {
    try {
        const response = await axios.get("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/education-data");
        console.log("Fetched subjects:", response.data);
        const formattedSubjects = response.data.map(subject => ({
            value: subject.value, 
            label: subject.label,
        }));
        setSubjectsOptions(formattedSubjects);
      } catch (error) {
          console.error("Error fetching subjects:", error);
      }
  };
  useEffect(() => {
    subjectList();
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch('https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/constants');
        const data = await response.json();
        const transformedData = data.map(item => ({
          category: item.category,
          value: item.value,
          label: item.label
        }));
        //console.log(transformedData);
        // Set the state for each designation type
        setTeachingDesignations(transformedData.filter(item => item.category === "Teaching") || []);
        setAdminDesignations(transformedData.filter(item => item.category === "Administration") || []);
        setTeachingAdminDesignations(transformedData.filter(item => (item.category === "Teaching" || item.category === "Administration")) || []);
        setCoreExpertise(transformedData.filter(item => item.category === "Core Expertise") || []);
        setGrades(transformedData.filter(item => item.category === "Grades") || []);
        setCurriculum(transformedData.filter(item => item.category === "Curriculum") || []);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };

    fetchDesignations();
  }, []);

  const renderJobDetailsSection = () => (
    <div className="form-group col-lg-12">
      <div className="form-box">
        <h3 className="form-title">Expected Job preferences</h3>
        <div className="row">
          {/* Job Type */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              placeholder="Job Type"
              options={Job_TypeOptions}
              value={Job_TypeOptions.find(option => option.value === jobDetails.Job_Type)}
              onChange={(selected) => {
                console.log('Selected job type:', selected?.value);
                setJobDetails(prev => ({
                  ...prev,
                  Job_Type: selected?.value
                }));
              }}
              className={`custom-select ${!jobDetails.Job_Type ? 'required' : ''}`}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <select 
            placeholder="Expected salary(INR)"
              required
              value={jobDetails.expected_salary}
              onChange={(e) => setJobDetails(prev => ({
                ...prev,
                expected_salary: e.target.value
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
                  value={jobDetails.notice_period}
                  onChange={(selected) => setJobDetails(prev => ({
                    ...prev,
                    notice_period: selected
                  }))}
                  className={`custom-select ${!jobDetails.notice_period ? 'required' : ''}`}
                />
              </div>
      <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred Country"
        options={countries}
        value={jobDetails.preferred_country}
        onChange={(option) => {
          setJobDetails(prev => ({
            ...prev,
            preferred_country: option
          }));
          setJobDetails(prev => ({
            ...prev,
            preferred_state: null
          }));
        }}
        className={`custom-select ${!jobDetails.preferred_country ? 'required' : ''}`}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred State/UT"
        options={states}
        value={jobDetails.preferred_state}
        onChange={(option) => {
          setJobDetails(prev => ({
            ...prev,
            preferred_state: option
          }));
          setJobDetails(prev => ({
            ...prev,
            preferred_city: null
          }));
        }}
        className={`custom-select ${!jobDetails.preferred_state ? 'required' : ''}`}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Preferred City"
        options={cities}
        value={jobDetails.preferred_city}
        onChange={(option) => setJobDetails(prev => ({
          ...prev,
          preferred_city: option
        }))}
        className={`custom-select ${!jobDetails.preferred_city ? 'required' : ''}`}
      />
    </div>

          {jobDetails.Job_Type && (
            <>
              {/* Teaching and Administration Combined Fields */}
              {jobDetails.Job_Type === 'teachingAndAdmin' && (
                <div className='row'>
                  {/* Teaching and Admin Designation */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Teaching & Administrative Designation(s)"
                      options={teachingAdminDesignations}
                      value={jobDetails.teachingAdminDesignations.map(value => {
                        const option = teachingAdminDesignations.find(opt => opt.value === value);
                        return option ? {
                          value: option.value,
                          label: option.label
                        } : null;
                      }).filter(Boolean)}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingAdminDesignations: selected ? selected.map(item => item.value) : []
                      }))}
                      className={`custom-select ${jobDetails.teachingAdminDesignations ? 'required' : ''}`}
                    />
                  </div>

                  {/* curriculum/Board/University */}
                  <div className="form-group col-lg-6 col-md-12"> 
                    <Select
                      isMulti
                      placeholder="curriculum/Board/University"
                      options={curriculum}
                        value={jobDetails.teachingAdminCurriculum.map(value => ({
                        value,
                          label: curriculum.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingAdminCurriculum: selected ? selected.map(item => item.value) : []
                      }))}
                    />
                  </div>

                  {/* subjects */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Subjects"
                      options={subjectsOptions}
                      value={jobDetails.teachingAdminSubjects.map(value => ({
                        value,
                        label: subjectsOptions.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingAdminSubjects: selected ? selected.map(item => item.value) : []
                      }))}
                      className={`custom-select ${jobDetails.teachingAdminSubjects ? 'required' : ''}`}
                    />
                  </div>

                  {/* grades */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Grades"
                      options={grades}
                      value={jobDetails.teachingAdminGrades.map(value => ({
                        value,
                        label: grades.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingGrades: selected ? selected.map(item => item.value) : []
                      }))}
                      className={`custom-select ${jobDetails.teachingAdminGrades ? 'required' : ''}`}
                    />
                  </div>

                  {/* Core Expertise */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      placeholder="Core Expertise"
                      options={coreExpertise}
                      value={jobDetails.teachingAdminCoreExpertise.map(value => ({
                        value,
                        label: coreExpertise.find(opt => opt.value === value)?.label
                      }))}
                      onChange={(selected) => setJobDetails(prev => ({
                        ...prev,
                        teachingAdminCoreExpertise: selected ? selected.map(item => item.value) : []
                      }))}
                      className={`custom-select ${jobDetails.teachingAdminCoreExpertise ? 'required' : ''}`}
                    />
                  </div>
                </div>
              )}
            </>
          )}

 {/* Teaching Related Fields */}
 {jobDetails.Job_Type === 'teaching' && (
        <>
          {/* Teaching Designation */}
          <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Teaching Designation(s)"
              options={teachingDesignations}
              value={teachingDesignations.filter(option => 
                jobDetails.teachingDesignation.includes(option.value)
              )}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingDesignation: selected ? selected.map(item => item.value) : []
              }))}
              className={`custom-select ${jobDetails.teachingDesignation ? 'required' : ''}`}
            />
          </div>

          {/* curriculum/Board/University */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Curriculum/Board/University"
              options={curriculum}
              value={jobDetails.teachingCurriculum.map(value => ({
                value,
                label: curriculum.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingCurriculum: selected ? selected.map(item => item.value) : []
              }))}
            />
          </div>

          {/* subjects */}
          <div className="form-group col-lg-6 col-md- 12">
            <Select
              isMulti
              placeholder="Subjects"
              options={subjectsOptions}
              value={jobDetails.teachingSubjects.map(value => ({
                value,
                label: subjectsOptions.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingSubjects: selected ? selected.map(item => item.value) : []
              }))}
              className={`custom-select ${jobDetails.teachingSubjects ? 'required' : ''}`}
            />
          </div>

          {/* grades */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Grades"
              options={grades}
              value={jobDetails.teachingGrades.map(value => ({
                value,
                label: grades.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingGrades: selected ? selected.map(item => item.value) : []
              }))}
              className={`custom-select ${jobDetails.teachingGrades ? 'required' : ''}`}
            />
          </div>

          {/* Core Expertise */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Core Expertise"
              options={coreExpertise}
              value={jobDetails.teachingCoreExpertise.map(value => ({
                value,
                label: coreExpertise.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                teachingCoreExpertise: selected ? selected.map(item => item.value) : []
              }))}
              className={`custom-select ${jobDetails.teachingCoreExpertise ? 'required' : ''}`}
            />
          </div>
          </div>
        </>
      )}

      {/* Administration Related Fields */}
      {jobDetails.Job_Type === 'administration' && (
        <>
          {/* Administrative Designation */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Administrative Designation(s)"
                options={adminDesignations}
              value={jobDetails.adminDesignations.map(value => ({
                value,
                label: adminDesignations.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                adminDesignations: selected ? selected.map(item => item.value) : []
              }))}
              className={`custom-select ${jobDetails.adminDesignations ? 'required' : ''}`}
            />
          </div>

          {/* Administrative curriculum/Board/University */}
          <div className="form-group col-lg-6 col-md-12">
            <Select
              isMulti
              placeholder="Curriculum/Board/University"
              options={curriculum}  // Using the same curriculum options as teaching
                value={jobDetails.adminCurriculum.map(value => ({
                value,
                label: curriculum.find(opt => opt.value === value)?.label
              }))}
              onChange={(selected) => setJobDetails(prev => ({
                ...prev,
                adminCurriculum: selected ? selected.map(item => item.value) : []
              }))}
            />
          </div>
        </>
      )}
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

   
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      
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
                        value={jobDetails.Full_time }
                        onChange={(e) => handlePreferenceChange('jobShift', 'Full_time', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.Full_time.online === null ? '' : preferences.jobShift.Full_time.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'Full_time', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.jobShift.part_time_weekdays.offline === null ? '' : preferences.jobShift.part_time_weekdays.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_weekdays', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.part_time_weekdays.online === null ? '' : preferences.jobShift.part_time_weekdays.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_weekdays', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.jobShift.part_time_weekends.offline === null ? '' : preferences.jobShift.part_time_weekends.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_weekends', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.part_time_weekends.online === null ? '' : preferences.jobShift.part_time_weekends.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_weekends', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.jobShift.part_time_vacations.offline === null ? '' : preferences.jobShift.part_time_vacations.offline}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_vacations', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.jobShift.part_time_vacations.online === null ? '' : preferences.jobShift.part_time_vacations.online}
                        onChange={(e) => handlePreferenceChange('jobShift', 'part_time_vacations', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.organizationType.school_college_university.offline === null ? '' : preferences.organizationType.school_college_university.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'school_college_university', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.school_college_university.online === null ? '' : preferences.organizationType.school_college_university.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'school_college_university', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.organizationType.coaching_institute.offline === null ? '' : preferences.organizationType.coaching_institute.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coaching_institute', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.coaching_institute.online === null ? '' : preferences.organizationType.coaching_institute.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'coaching_institute', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                     required
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
                        value={preferences.organizationType.Ed_TechCompanies.offline === null ? '' : preferences.organizationType.Ed_TechCompanies.offline}
                        onChange={(e) => handlePreferenceChange('organizationType', 'Ed_TechCompanies', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.organizationType.Ed_TechCompanies.online === null ? '' : preferences.organizationType.Ed_TechCompanies.online}
                        onChange={(e) => handlePreferenceChange('organizationType', 'Ed_TechCompanies', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                  </tr>

                  {/* Add similar rows for coaching_institute and  Ed_TechCompanies */}
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
                    <td>Home Tutor (One-to-One at Students Home)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.Home_Tutor.offline === null ? '' : preferences.parentGuardian.Home_Tutor.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'Home_Tutor', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      
                      required>
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </td>
                    <td className="disabled">-</td>
                  </tr>
                  <tr>
                    <td>Private Tutor (One-to-One at Tutors Place)</td>
                    <td>
                      <select 
                        className="form-select"
                        value={preferences.parentGuardian.Private_Tutor.offline === null ? '' : preferences.parentGuardian.Private_Tutor.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'Private_Tutor', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.parentGuardian.Group_Tutor_offline.offline === null ? '' : preferences.parentGuardian.Group_Tutor_offline.offline}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'Group_Tutor_offline', 'offline', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.parentGuardian.Private_Tutions_online.online === null ? '' : preferences.parentGuardian.Private_Tutions_online.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'Private_Tutions_online', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                        value={preferences.parentGuardian.Group_Tutor_online.online === null ? '' : preferences.parentGuardian.Group_Tutor_online.online}
                        onChange={(e) => handlePreferenceChange('parentGuardian', 'Group_Tutor_online', 'online', e.target.value === '' ? null : e.target.value === 'true')}
                      required
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
                    value={jobSearchStatus.Full_time.offline}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      Full_time: {
                        ...prev.Full_time,
                        offline: e.target.value
                      }
                    }))}
                    required
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
                    value={jobSearchStatus.Full_time.online}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      Full_time: {
                        ...prev.Full_time,
                        online: e.target.value
                      }
                    }))}
                    required
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
                    value={jobSearchStatus.part_time_weekdays.offline}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      part_time_weekdays: {
                        ...prev.part_time_weekdays,
                        offline: e.target.value
                      }
                    }))}
                    required
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
                    value={jobSearchStatus.part_time_weekdays.online}
                    onChange={(e) => setJobSearchStatus(prev => ({
                      ...prev,
                      part_time_weekdays: {
                        ...prev.part_time_weekdays,
                        online: e.target.value
                      }
                    }))}
                    required
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