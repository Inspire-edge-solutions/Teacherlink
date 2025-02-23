import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile-styles.css";
import Select from "react-select";
import csc from "countries-states-cities";

// const baseExperience = {
//   organizationName: '',
//   jobCategory: '',
//   currentlyWorking: null,
//   workPeriod: {
//     from: { month: '', year: '' },
//     to: { month: '', year: '' }
//   },
//   salary: '',
//   paySlip: null,
//   country: '',
//   state: '',
//   city: '',
//   jobProcess: '',
//   jobType: '',
//   teachingDesignation: '',
//   otherTeachingDesignation: '',
//   teachingCurriculum: '',
//   otherTeachingCurriculum: '',
//   teachingSubjects: [],
//   otherTeachingSubjects: '',
//   teachingGrades: [],
//   teachingCoreExpertise: [],
//   otherTeachingCoreExpertise: '',
//   adminDesignation: '',
//   otherAdminDesignation: '',
//   adminCurriculum: '',
//   otherAdminCurriculum: '',
//   teachingAdminDesignations: [],
//   otherTeachingAdminDesignation: '',
//   teachingAdminCurriculum: '',
//   otherTeachingAdminCurriculum: '',
//   teachingAdminSubjects: [],
//   otherTeachingAdminSubjects: '',
//   teachingAdminGrades: [],
//   teachingAdminCoreExpertise: [],
//   otherTeachingAdminCoreExpertise: '',
//   designation: '',
//   industryType: '',
//   workProfile: [],
// };

const baseExperience = {
  otherTeachingAdminCurriculum: "",
  workProfile: [],
  teachingSubjects: [],
  otherTeachingSubjects: "",
  otherTeachingCoreExpertise: "",
  currentlyWorking: "",
  otherAdminDesignation: "",
  country: "",
  jobType: "",
  work_from_year: "",
  state: "",
  city: "",
  work_from_month: "",
  teachingCurriculum: "",
  otherTeachingDesignation: "",
  paySlip: "",
  teachingAdminCoreExpertise: [],
  industryType: "",
  teachingAdminCurriculum: "",
  otherTeachingAdminDesignation: "",
  teachingGrades: [],
  otherTeachingAdminSubjects: "",
  jobProcess: "",
  salary: "",
  otherAdminCurriculum: "",
  teachingAdminGrades: [],
  designation: "",
  jobCategory: "",
  work_till_year: "",
  adminCurriculum: "",
  teachingAdminDesignations: [],
  adminDesignation: "",
  teachingCoreExpertise: [],
  work_till_month: "",
  teachingDesignation: "",
  otherTeachingCurriculum: "",
  otherTeachingAdminCoreExpertise: "",
  teachingAdminSubjects: [],
  organizationName: ""
};


const Experience = ({ excludeAdditionalDetails, excludeTeachingCurriculum,excludeAdminCurriculum, excludeTeachingAdminCurriculum }) => {

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

  const [experienceEntries, setExperienceEntries] = useState([]);

  const addNewExperience = () => {
    setExperienceEntries(prev => [...prev, baseExperience]);
  };

  const yearOptions = [
    ...Array.from({ length: 31 }, (_, i) => (
      <option key={i} value={i}>{i} Years</option>
    )),
    <option key="31" value="31">{'>30 Years'}</option>
  ];    

  const removeExperience = (indexToRemove) => {
    setExperienceEntries(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const [otherTeachingExp, setOtherTeachingExp] = useState({
    edTechCompany: null,
    online: null,
    coachingTuition: null,
    groupTuitions: null,
    privateTuitions: null,
    homeTuitions: null
  });

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  

  const countries = csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name,
  }));

  const states = country
    ? csc.getStatesOfCountry(country.value).map((state) => ({
        value: state.id,
        label: state.name,
      }))
    : [];

  const cities = state
    ? csc.getCitiesOfState(state.value).map((city) => ({
        value: city.id,
        label: city.name,
      }))
    : [];
  
  // for fetching subjects,designations,grades,core expertise,curriculum from the backend
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

  const submitExperienceData = async () => {
    if (experienceEntries.length === 0) {
      alert("Please add at least one work experience.");
      return;
    }
    const experienceData = {
      // dynamoDB: {
      //   jobProcess: baseExperience.jobProcess,
      //   coaching_tuitions_center: otherTeachingExp.coachingTuition,
      //   on_line: otherTeachingExp.online,
      //   designation: baseExperience.designation,
      //   private_tuitions: otherTeachingExp.privateTuitions,
      //   Ed_Tech_Company: otherTeachingExp.edTechCompany,
      //   home_tuitions: otherTeachingExp.homeTuitions,
      //   group_tuitions: otherTeachingExp.groupTuitions,
      //   country: baseExperience.country,
      //   state: baseExperience.state,
      //   city: baseExperience.city,
      //   industryType: baseExperience.industryType,
      //   createdAt: new Date().toISOString()
      // },
      dynamoDB: [baseExperience],
      mysqlDB: {
        total_experience_years: workExperience.total.years,
        total_experience_months: workExperience.total.months,
        teaching_experience_years: workExperience.teaching.years,
        teaching_experience_months: workExperience.teaching.months,
        teaching_exp_fulltime_years: workExperience.details.teaching.fullTime.years,
        teaching_exp_fulltime_months: workExperience.details.teaching.fullTime.months,
        teaching_exp_partime_years: workExperience.details.teaching.partTime.years,
        teaching_exp_partime_months: workExperience.details.teaching.partTime.months,
        administration_fulltime_years: workExperience.details.administration.fullTime.years,
        administration_fulltime_months: workExperience.details.administration.fullTime.months,
        administration_partime_years: workExperience.details.administration.partTime.years,
        administration_parttime_months: workExperience.details.administration.partTime.months,
        anyrole_fulltime_years: workExperience.details.nonEducation.fullTime.years,
        anyrole_fulltime_months: workExperience.details.nonEducation.fullTime.months,
        anyrole_partime_years: workExperience.details.nonEducation.partTime.years,
        anyrole_parttime_months: workExperience.details.nonEducation.partTime.months,
        Ed_Tech_Company: otherTeachingExp.edTechCompany,
        on_line: otherTeachingExp.online,
        coaching_tuitions_center: otherTeachingExp.coachingTuition,
        group_tuitions: otherTeachingExp.groupTuitions,
        private_tuitions: otherTeachingExp.privateTuitions,
        home_tuitions: otherTeachingExp.homeTuitions,
      }
    };
  
    try {
      const response = await axios.post(
        "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience",
        experienceData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Payload being sent:", JSON.stringify(experienceData, null, 2));

      console.log("Data submitted successfully:", response.data);
      alert("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data");
    }
  };
  
  useEffect(() => {
    subjectList();
    fetchDesignations();
  }, []);

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
              required
            >
              {yearOptions}
            
            </select>
            <select 
              value={workExperience.total.months}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                total: { ...prev.total, months: e.target.value }
              }))}
              required
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
              required
            >
              {yearOptions}
            </select>
            <select 
              value={workExperience.teaching.months}
              onChange={(e) => setWorkExperience(prev => ({
                ...prev,
                teaching: { ...prev.teaching, months: e.target.value }
              }))}
              required
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{i} Months</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional Details Table */}
      {excludeAdditionalDetails && (
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
      )}
     

      {/* Experience Details Forms */}
      {experienceEntries.map((baseExperience, index) => (
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
                value={baseExperience.organizationName}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    organizationName: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
                placeholder="Name of the organization"
              />
            </div>

            {/* Job Category */}
            <div className="form-group col-lg-6 col-md-12">
              <div className={`radio-group ${!baseExperience.jobCategory ? 'required' : ''}`}>
                <label>
                  <input
                    type="radio"
                    name={`jobCategory-${index}`}
                    value="fullTime"
                    checked={baseExperience.jobCategory === 'fullTime'}
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
                    checked={baseExperience.jobCategory === 'partTime'}
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
                value={baseExperience.jobType}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    jobType: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
              >
                <option value="">Job Type</option>
                <option value="teaching">Education - Teaching</option>
                <option value="administration">Education - Administration</option>
                <option value="teachingAndAdministration">Education - Teaching + Administration</option>
                <option value="nonEducation">Non-Education (Any Role)</option>
              </select>
            </div>

            {/* Currently Working */}
            <div className="form-group col-lg-6 col-md-12">
              
              <div className={`radio-group ${!baseExperience.currentlyWorking ? 'required' : ''}`}>
              <label>Are you currently working here?</label>
                <label>
                  <input
                    type="radio"
                    name={`currentlyWorking-${index}`}
                    value="yes"
                    checked={baseExperience.currentlyWorking === true}
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
                    checked={baseExperience.currentlyWorking === false}
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
                  value={baseExperience.work_from_month}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      work_from_month: e.target.value
                    };
                    setExperienceEntries(newEntries);
                  }}
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={baseExperience.work_from_year}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      work_from_year: e.target.value
                    };
                    setExperienceEntries(newEntries);
                  }}
                  required
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

            {!baseExperience.currentlyWorking && (
              <div className="form-group col-lg-6 col-md-12">
                <label>Worked till</label>
                <div className="date-selector">
                  {/* Similar month/year selectors as above */}
                  <select
                  value={baseExperience.work_till_month}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].work_till_month,
                        month: e.target.value
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
                  required
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={baseExperience.work_till_year}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      workPeriod: {
                        ...newEntries[index].work_till_year,
                        year: e.target.value
                      }
                    };
                    setExperienceEntries(newEntries);
                  }}
                  required
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
                  value={baseExperience.salary}
                  onChange={(e) => {
                    const newEntries = [...experienceEntries];
                    newEntries[index] = {
                      ...newEntries[index],
                      salary: e.target.value
                    };
                    setExperienceEntries(newEntries);
                  }}
                  required
                  placeholder="Salary"
                  style={{ maxWidth: '200px' }}
                />
              
                <span className="mx-2">
                  {baseExperience.jobCategory === 'fullTime' ? 'in LPA' : 'per hour'}
                </span>
                {baseExperience.jobCategory === 'fullTime' ? 
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

            {/* Teaching specific fields */}
            {baseExperience.jobType === 'teaching' && (
              <div className="row">
                {/* Teaching Designation and Curriculum in first row */}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={teachingDesignations}
                      value={teachingDesignations.find(option => option.value === baseExperience.teachingDesignation) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingDesignation: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.teachingDesignation ? 'required' : ''}`}
                      placeholder="Teaching designation"
                      isClearable
                    />
                </div>
                {baseExperience.teachingDesignation === 'Others' && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingDesignation || ''}
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingDesignation: e.target.value })}
                      placeholder="Specify other designation"
                      required
                    />
                  </div>
                )}
                {excludeTeachingCurriculum && (
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={curriculum}
                      value={curriculum.find(option => option.value === baseExperience.teachingCurriculum) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingCurriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      placeholder="Curriculum"
                      isClearable
                    />
                </div>
                )}
                {baseExperience.teachingCurriculum === 'Others' && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingCurriculum || ''}
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingCurriculum: e.target.value })}
                      placeholder="Specify other curriculum"
                    />
                  </div>
                )}

                {/* Subjects and Grades*/}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={subjectsOptions}
                      value={subjectsOptions.filter(option => 
                        baseExperience.teachingSubjects.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingSubjects: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.subjectsOptions ? 'required' : ''}`}
                      placeholder="Subjects you handled"
                      isClearable
                    />
                </div>
                {baseExperience.teachingSubjects.includes('Others') && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingSubjects || ''}  
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingSubjects: e.target.value })}
                      placeholder="Specify other subjects"
                    />
                  </div>
                )}


                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={grades}
                      value={grades.filter(option => baseExperience.teachingGrades.includes(option.value))}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingGrades: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.grades ? 'required' : ''}`}
                      placeholder="Grades you handled"
                      isClearable
                    />
                </div>

                {/* Core Expertise in third row */}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={coreExpertise}
                        value={coreExpertise.filter(option => 
                        baseExperience.teachingCoreExpertise.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingCoreExpertise: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.coreExpertise ? 'required' : ''}`}
                      placeholder="Core Expertise"
                      isClearable
                    />
                </div>

                {baseExperience.teachingCoreExpertise.includes('Others') && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingCoreExpertise || ''} 
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingCoreExpertise: e.target.value })}
                      placeholder="Specify other core expertise"
                      required
                    />
                  </div>
                )}

              </div>
            )}

            {/* Administration specific fields */}
            {baseExperience.jobType === 'administration' && (
              <div className="row">
                {/* Designation */}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={adminDesignations}
                      value={adminDesignations.find(option => 
                        option.value === baseExperience.adminDesignation
                      ) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          adminDesignation: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.adminDesignations ? 'required' : ''}`}
                      placeholder="Designation"
                      isClearable
                    />
                </div>
                {baseExperience.adminDesignation === 'Others' && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherAdminDesignation || ''}  
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherAdminDesignation: e.target.value })}
                      placeholder="Specify other designation"
                      required
                    />
                  </div>
                )}


                {/* Curriculum/Board/University */}
                {excludeAdminCurriculum && (
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={curriculum}
                      value={curriculum.find(option => 
                        option.value === baseExperience.adminCurriculum
                      ) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          adminCurriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      placeholder="Curriculum/Board/University"
                      isClearable
                    />
                </div>
                )}

                {baseExperience.adminCurriculum === 'Others' && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherAdminCurriculum || ''} 
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherAdminCurriculum: e.target.value })}
                      placeholder="Specify other curriculum"
                    />
                  </div>
                )}
                  </div>
                )}  
            
            {baseExperience.jobType === 'teachingAndAdministration' && (
              <div className="row">
                {/* Teaching and Admin Designation with multi-select */}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={teachingAdminDesignations}
                      value={teachingAdminDesignations.filter(option => 
                        baseExperience.teachingAdminDesignations?.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingAdminDesignations: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${baseExperience.teachingAdminDesignations ? 'required' : ''}`}
                      placeholder="Designation"
                      isClearable
                    />
                </div>
                {baseExperience.teachingAdminDesignations.includes('Others') && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingAdminDesignation || ''}  
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingAdminDesignation: e.target.value })}
                      placeholder="Specify other designation"
                      required
                    />
                  </div>
                )}

                {excludeTeachingAdminCurriculum && (
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={curriculum}
                      value={curriculum.find(option => option.value === baseExperience.teachingAdminCurriculum) || ''}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingAdminCurriculum: selected?.value || ''
                        };
                        setExperienceEntries(newEntries);
                      }}
                      placeholder="Curriculum"
                      isClearable
                    />
                </div>
                )}

                {baseExperience.teachingAdminCurriculum === 'Others' && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingAdminCurriculum || ''} 
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingAdminCurriculum: e.target.value })}
                      placeholder="Specify other curriculum"
                    />
                  </div>
                )}

                {/* Subjects and Grades in second row */}
                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={subjectsOptions}
                      value={subjectsOptions.filter(option => 
                        baseExperience.teachingAdminSubjects.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingAdminSubjects: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.subjectsOptions ? 'required' : ''}`}
                      placeholder="Subjects you handled"
                      isClearable
                    />
                </div>
                {baseExperience.teachingAdminSubjects.includes('Others') && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingAdminSubjects || ''} 
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingAdminSubjects: e.target.value })}
                      placeholder="Specify other subjects"
                    />
                  </div>
                )}


                <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={grades}
                      value={grades.filter(option => 
                        baseExperience.teachingAdminGrades.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingAdminGrades: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                        }}
                      className={`custom-select ${!baseExperience.grades ? 'required' : ''}`}
                      placeholder="Grades you handled"
                      isClearable
                    />
                </div>

                {/* Core Expertise in third row */}
                <div className="form-group col-lg-6 col-md-12">
                
                    <Select
                      isMulti
                      options={coreExpertise}
                      value={coreExpertise.filter(option => 
                        baseExperience.teachingAdminCoreExpertise.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const newEntries = [...experienceEntries];
                        newEntries[index] = {
                          ...newEntries[index],
                          teachingAdminCoreExpertise: selected ? selected.map(item => item.value) : []
                        };
                        setExperienceEntries(newEntries);
                      }}
                      className={`custom-select ${!baseExperience.coreExpertise ? 'required' : ''}`}
                      placeholder="Core Expertise"
                      isClearable
                    />
                </div>

                {baseExperience.teachingAdminCoreExpertise.includes('Others') && (
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={baseExperience.otherTeachingAdminCoreExpertise || ''}  
                      onChange={(e) => setExperienceEntries({ ...experienceEntries, otherTeachingAdminCoreExpertise: e.target.value })}
                      placeholder="Specify other core expertise"
                      required
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Industry Type */}
             {baseExperience.jobType === 'nonEducation' && (
             <div className="row">
            
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Designation"
                className="form-control"
                maxLength="20"
                value={baseExperience.designation}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    designation: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Industry Type"
                className="form-control"
                maxLength="20"
                value={baseExperience.industryType}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    industryType: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
              />
            </div>

            {/* Work Profile */}
            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                placeholder="Work Profile"
                className="form-control"
                maxLength="40"
                value={baseExperience.workProfile}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    workProfile: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
              />
              </div>
            </div>
            )}

            {/* Country */}
            <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="Country"
        options={countries}
        value={country}
        onChange={(option) => {
          setCountry(option);
          setState(null); // Reset state when country changes
          setCity(null);  // Reset city when country changes
        }}
        className={`custom-select ${!baseExperience.country ? 'required' : ''}`}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="State/UT"
        options={states}
        value={state}
        onChange={(option) => {
          setState(option);
          setCity(null); // Reset city when state changes
        }}
        className={`custom-select ${!baseExperience.state ? 'required' : ''}`}
      />
    </div>
    <div className="form-group col-lg-6 col-md-12">
      <Select
      placeholder="City"
        options={cities}
        value={city}
        onChange={(option) => setCity(option)}
        className={`custom-select ${!baseExperience.city ? 'required' : ''}`}
      />
    </div>

            {/* Job Process */}
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="form-select"
                value={baseExperience.jobProcess}
                onChange={(e) => {
                  const newEntries = [...experienceEntries];
                  newEntries[index] = {
                    ...newEntries[index],
                    jobProcess: e.target.value
                  };
                  setExperienceEntries(newEntries);
                }}
                required
              >
                <option value="">Job Process</option>
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

      {/* Other Teaching Experience Section */}
      <div className="other-teaching-experience mt-4">
        <h4>Other Teaching Experiences</h4>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Experience</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'edTechCompany', label: 'Ed. Tech company' },
                { key: 'online', label: 'Online' },
                { key: 'coachingTuition', label: 'Coaching / Tuition Centers' },
                { key: 'groupTuitions', label: 'Group Tuitions' },
                { key: 'privateTuitions', label: 'Private Tuitions' },
                { key: 'homeTuitions', label: 'Home Tuitions' }
              ].map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <div className={`radio-group ${!otherTeachingExp[key] === null ? 'required' : ''}`}>
                      <label className="me-3">
                        <input
                          type="radio"
                          name={key}
                          value="yes"
                          checked={otherTeachingExp[key] === true}
                          onChange={() => setOtherTeachingExp(prev => ({
                            ...prev,
                            [key]: true
                          }))}
                        />
                        <span className="ms-1">Yes</span>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={key}
                          value="no"
                          checked={otherTeachingExp[key] === false}
                          onChange={() => setOtherTeachingExp(prev => ({
                            ...prev,
                            [key]: false
                          }))}
                        />
                        <span className="ms-1">No</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button className="theme-btn btn-style-three" onClick={submitExperienceData}>
          Save Experience Details
        </button>
    </div>
  );
};

export default Experience;