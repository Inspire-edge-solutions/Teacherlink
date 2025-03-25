import { useState, useEffect } from 'react';
import Select from 'react-select';
import csc from 'countries-states-cities';
import axios from 'axios';
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobPreference = () => {
  const { user } = useAuth();

  // Helper: Convert numeric from DB => "yes" or "no"
  // If DB returns "1", parseInt("1") => 1 => "yes"
  // If DB returns "0", parseInt("0") => 0 => "no"
  // If DB returns null/undefined, also "no"
  const convertYesNo = (value) => (Number(value) === 1 ? "yes" : "no");

  // Helper: Convert "yes"/"no" => 1 or 0 (or null if empty)
  const convertToInt = (value) => {
    if (value === "yes") return 1;
    if (value === "no") return 0;
    return null; // for the empty "Select" case
  };

  const [preferences, setPreferences] = useState({
    jobShift: {
      Full_time: { offline: "", online: "" },
      part_time_weekdays: { offline: "", online: "" },
      part_time_weekends: { offline: "", online: "" },
      part_time_vacations: { offline: "", online: "" }
    },
    organizationType: {
      school_college_university: { offline: "", online: "" },
      coaching_institute: { offline: "", online: "" },
      Ed_TechCompanies: { offline: "", online: "" }
    },
    parentGuardian: {
      Home_Tutor: { offline: "", online: "" },
      Private_Tutor: { offline: "", online: "" },
      Group_Tutor_offline: { offline: "", online: "" },
      Private_Tutions_online: { offline: "", online: "" },
      Group_Tutor_online: { offline: "", online: "" },
      coaching_institute: { offline: "", online: "" }
    }
  });

  const [jobSearchStatus, setJobSearchStatus] = useState({
    Full_time: { offline: '', online: '' },
    part_time_weekdays: { offline: '', online: '' }
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
    notice_period: ''
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

  // For country/state/city
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

  // Handle changes in the preference table
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

  // Subject/designation data
  const [subjectsOptions, setSubjectsOptions] = useState([]);
  const [teachingDesignations, setTeachingDesignations] = useState([]);
  const [adminDesignations, setAdminDesignations] = useState([]);
  const [teachingAdminDesignations, setTeachingAdminDesignations] = useState([]);
  const [coreExpertise, setCoreExpertise] = useState([]);
  const [grades, setGrades] = useState([]);
  const [curriculum, setCurriculum] = useState([]);

  // Fetch subjects
  const subjectList = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_DEV1_API + '/education-data');
      //console.log("Fetched subjects:", response.data);
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

  // Fetch designations
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_DEV1_API + '/constants');
        const data = await response.json();
        const transformedData = data.map(item => ({
          category: item.category,
          value: item.value,
          label: item.label
        }));
        setTeachingDesignations(
          transformedData.filter(item => item.category === "Teaching") || []
        );
        setAdminDesignations(
          transformedData.filter(item => item.category === "Administration") || []
        );
        setTeachingAdminDesignations(
          transformedData.filter(
            item => item.category === "Teaching" || item.category === "Administration"
          ) || []
        );
        setCoreExpertise(
          transformedData.filter(item => item.category === "Core Expertise") || []
        );
        setGrades(
          transformedData.filter(item => item.category === "Grades") || []
        );
        setCurriculum(
          transformedData.filter(item => item.category === "Curriculum") || []
        );
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };
    fetchDesignations();
  }, []);

  // ---------------- GET: fetch existing preferences from backend ---------------
  useEffect(() => {
    if (!user?.uid) return;

    const fetchJobPreference = async () => {
      try {
        const response = await axios.get(
          "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference",
          { params: { firebase_uid: user.uid } }
        );
        if (response.status === 200 && response.data && response.data.length > 0) {
          const record = response.data[0];

          // Convert numeric/string from DB => "yes" or "no"
          const pref = {
            jobShift: {
              Full_time: {
                offline: convertYesNo(record.full_time_offline),
                online: convertYesNo(record.full_time_online)
              },
              part_time_weekdays: {
                offline: convertYesNo(record.part_time_weekdays_offline),
                online: convertYesNo(record.part_time_weekdays_online)
              },
              part_time_weekends: {
                offline: convertYesNo(record.part_time_weekends_offline),
                online: convertYesNo(record.part_time_weekends_online)
              },
              part_time_vacations: {
                offline: convertYesNo(record.part_time_vacations_offline),
                online: convertYesNo(record.part_time_vacations_online)
              }
            },
            organizationType: {
              school_college_university: {
                offline: convertYesNo(record.school_college_university_offline),
                online: convertYesNo(record.school_college_university_online)
              },
              coaching_institute: {
                offline: convertYesNo(record.coaching_institute_offline),
                online: convertYesNo(record.coaching_institute_online)
              },
              Ed_TechCompanies: {
                offline: convertYesNo(record.Ed_TechCompanies_offline),
                online: convertYesNo(record.Ed_TechCompanies_online)
              }
            },
            parentGuardian: {
              Home_Tutor: {
                offline: convertYesNo(record.Home_Tutor_offline),
                online: convertYesNo(record.Home_Tutor_online)
              },
              Private_Tutor: {
                offline: convertYesNo(record.Private_Tutor_offline),
                online: convertYesNo(record.Private_Tutor_online)
              },
              Group_Tutor_offline: {
                offline: convertYesNo(record.Group_Tutor_offline),
                online: "" // remains blank because it's "disabled" in UI
              },
              Private_Tutions_online: {
                offline: "",
                online: convertYesNo(record.Private_Tutions_online_online)
              },
              Group_Tutor_online: {
                offline: "",
                online: convertYesNo(record.Group_Tutor_online)
              },
              coaching_institute: {
                offline: convertYesNo(record.parent_coaching_institute_offline),
                online: convertYesNo(record.parent_coaching_institute_online)
              }
            }
          };

          const jobSearch = {
            Full_time: {
              offline: record.full_time_2_offline || "",
              online: record.full_time_2_online || ""
            },
            part_time_weekdays: {
              offline: record.part_time_weekdays_2_offline || "",
              online: record.part_time_weekdays_2_online || ""
            }
          };

          const details = {
            Job_Type: record.Job_Type || "",
            expected_salary: record.expected_salary || "",
            teachingDesignation:
              record.Job_Type === 'teaching'
                ? record.teaching_designations || []
                : record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_designations || []
                : [],
            teachingCurriculum: record.teaching_curriculum || [],
            teachingSubjects: record.teaching_subjects || [],
            teachingGrades: record.teaching_grades || [],
            teachingCoreExpertise: record.teaching_coreExpertise || [],
            adminDesignations:
              record.Job_Type === 'administration'
                ? record.administrative_designations || []
                : [],
            adminCurriculum:
              record.Job_Type === 'administration'
                ? record.administrative_curriculum || []
                : [],
            teachingAdminDesignations:
              record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_designations || []
                : [],
            teachingAdminCurriculum:
              record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_curriculum || []
                : [],
            teachingAdminSubjects:
              record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_subjects || []
                : [],
            teachingAdminGrades:
              record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_grades || []
                : [],
            teachingAdminCoreExpertise:
              record.Job_Type === 'teachingAndAdmin'
                ? record.teaching_administrative_coreExpertise || []
                : [],
            preferred_country: record.preferred_country
              ? { label: record.preferred_country, value: record.preferred_country }
              : "",
            preferred_state: record.preferred_state
              ? { label: record.preferred_state, value: record.preferred_state }
              : "",
            preferred_city: record.preferred_city
              ? { label: record.preferred_city, value: record.preferred_city }
              : "",
            notice_period: record.notice_period || ""
          };

          setPreferences(pref);
          setJobSearchStatus(jobSearch);
          setJobDetails(details);
        }
      } catch (error) {
        console.error("Error fetching job preference:", error);
      }
    };

    fetchJobPreference();
  }, [user?.uid]);

  // ---------------- POST/PUT: Save (Upsert) preferences ---------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      firebase_uid: user.uid,
      // Convert "yes"/"no" => 1/0
      full_time_offline: convertToInt(preferences.jobShift.Full_time.offline),
      full_time_online: convertToInt(preferences.jobShift.Full_time.online),
      part_time_weekdays_offline: convertToInt(preferences.jobShift.part_time_weekdays.offline),
      part_time_weekdays_online: convertToInt(preferences.jobShift.part_time_weekdays.online),
      part_time_weekends_offline: convertToInt(preferences.jobShift.part_time_weekends.offline),
      part_time_weekends_online: convertToInt(preferences.jobShift.part_time_weekends.online),
      part_time_vacations_offline: convertToInt(preferences.jobShift.part_time_vacations.offline),
      part_time_vacations_online: convertToInt(preferences.jobShift.part_time_vacations.online),

      school_college_university_offline: convertToInt(preferences.organizationType.school_college_university.offline),
      school_college_university_online: convertToInt(preferences.organizationType.school_college_university.online),
      coaching_institute_offline: convertToInt(preferences.organizationType.coaching_institute.offline),
      coaching_institute_online: convertToInt(preferences.organizationType.coaching_institute.online),
      Ed_TechCompanies_offline: convertToInt(preferences.organizationType.Ed_TechCompanies.offline),
      Ed_TechCompanies_online: convertToInt(preferences.organizationType.Ed_TechCompanies.online),

      Home_Tutor_offline: convertToInt(preferences.parentGuardian.Home_Tutor.offline),
      Home_Tutor_online: convertToInt(preferences.parentGuardian.Home_Tutor.online),
      Private_Tutor_offline: convertToInt(preferences.parentGuardian.Private_Tutor.offline),
      Private_Tutor_online: convertToInt(preferences.parentGuardian.Private_Tutor.online),
      Group_Tutor_offline: convertToInt(preferences.parentGuardian.Group_Tutor_offline.offline),
      Group_Tutor_online: convertToInt(preferences.parentGuardian.Group_Tutor_online.online),
      Private_Tutions_online_online: convertToInt(preferences.parentGuardian.Private_Tutions_online.online),
      parent_coaching_institute_offline: convertToInt(preferences.parentGuardian.coaching_institute.offline),
      parent_coaching_institute_online: convertToInt(preferences.parentGuardian.coaching_institute.online),

      // Job details
      Job_Type: jobDetails.Job_Type,
      expected_salary: jobDetails.expected_salary,
      notice_period: jobDetails.notice_period?.value || jobDetails.notice_period,
      preferred_country: jobDetails.preferred_country
        ? jobDetails.preferred_country.label
        : "",
      preferred_state: jobDetails.preferred_state
        ? jobDetails.preferred_state.label
        : "",
      preferred_city: jobDetails.preferred_city
        ? jobDetails.preferred_city.label
        : "",

      // Teaching/Administration arrays
      teaching_designations:
        jobDetails.Job_Type === 'teaching'
          ? jobDetails.teachingDesignation
          : jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminDesignations
          : [],
      teaching_curriculum: jobDetails.teachingCurriculum,
      teaching_subjects: jobDetails.teachingSubjects,
      teaching_grades: jobDetails.teachingGrades,
      teaching_coreExpertise: jobDetails.teachingCoreExpertise,
      administrative_designations:
        jobDetails.Job_Type === 'administration'
          ? jobDetails.adminDesignations
          : [],
      administrative_curriculum:
        jobDetails.Job_Type === 'administration'
          ? jobDetails.adminCurriculum
          : [],
      teaching_administrative_designations:
        jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminDesignations
          : [],
      teaching_administrative_curriculum:
        jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminCurriculum
          : [],
      teaching_administrative_subjects:
        jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminSubjects
          : [],
      teaching_administrative_grades:
        jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminGrades
          : [],
      teaching_administrative_coreExpertise:
        jobDetails.Job_Type === 'teachingAndAdmin'
          ? jobDetails.teachingAdminCoreExpertise
          : [],

      // Job search status
      full_time_2_offline: jobSearchStatus.Full_time.offline,
      full_time_2_online: jobSearchStatus.Full_time.online,
      part_time_weekdays_2_offline: jobSearchStatus.part_time_weekdays.offline,
      part_time_weekdays_2_online: jobSearchStatus.part_time_weekdays.online
    };

    try {
      const { data } = await axios.post(
        'https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success("Job preferences saved successfully");
      console.log('Success:', data);
    } catch (error) {
      console.error('Error saving job preferences:', error);
      toast.error("Error saving job preferences");
    }
  };

  // Renders the lower half of the form (Job details, designations, etc.)
  const renderJobDetailsSection = () => (
    <div className="form-group col-lg-12">
      <div className="form-box">
        <h3 className="form-title">Expected Job Preferences</h3>
        <div className="row">
          {/* Job Type */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <Select
              placeholder="Job Type"
              options={Job_TypeOptions}
              value={Job_TypeOptions.find(option => option.value === jobDetails.Job_Type)}
              onChange={(selected) => {
                console.log('Selected job type:', selected?.value);
                setJobDetails(prev => ({
                  ...prev,
                  Job_Type: selected?.value || ''
                }));
              }}
              className="custom-select required"
            />
            <span className="custom-tooltip">Job Type</span>
            </div>
          </div>

          {/* Expected Salary */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
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
            <span className="custom-tooltip">Expected salary(INR)</span>
            </div>
          </div>

          {/* Notice Period */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
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
              className="custom-select required"
            />
            <span className="custom-tooltip">Notice Period</span>
            </div>
          </div>

          {/* Preferred Country */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <Select
              placeholder="Preferred Country"
              options={countries}
              value={jobDetails.preferred_country}
              onChange={(option) => {
                setJobDetails(prev => ({
                  ...prev,
                  preferred_country: option,
                  preferred_state: null,
                  preferred_city: null
                }));
              }}
              className="custom-select required"
            />
            <span className="custom-tooltip">Preferred Country</span>
            </div>
          </div>

          {/* Preferred State */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <Select
              placeholder="Preferred State/UT"
              options={states}
              value={jobDetails.preferred_state}
              onChange={(option) => {
                setJobDetails(prev => ({
                  ...prev,
                  preferred_state: option,
                  preferred_city: null
                }));
              }}
              className="custom-select required"
            />
            <span className="custom-tooltip">Preferred State/UT</span>
            </div>
          </div>

          {/* Preferred City */}
          <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
            <Select
              placeholder="Preferred City"
              options={cities}
              value={jobDetails.preferred_city}
              onChange={(option) =>
                setJobDetails(prev => ({
                  ...prev,
                  preferred_city: option
                }))
              }
              className="custom-select required"
            />
            <span className="custom-tooltip">Preferred City</span>
            </div>
          </div>

          {/* Teaching + Admin */}
          {jobDetails.Job_Type && (
            <>
              {jobDetails.Job_Type === 'teachingAndAdmin' && (
                <div className='row'>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      placeholder="Teaching & Administrative Designation(s)"
                      options={teachingAdminDesignations}
                      value={jobDetails.teachingAdminDesignations.map(value => {
                        const option = teachingAdminDesignations.find(opt => opt.value === value);
                        return option ? { value: option.value, label: option.label } : null;
                      }).filter(Boolean)}
                      onChange={(selected) =>
                        setJobDetails(prev => ({
                          ...prev,
                          teachingAdminDesignations: selected ? selected.map(item => item.value) : []
                        }))
                      }
                      className={`custom-select ${jobDetails.teachingAdminDesignations?.length ? 'required' : ''}`}
                    />
                    <span className="custom-tooltip">Teaching & Administrative Designation(s)</span>
                    </div>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      placeholder="Curriculum/Board/University"
                      options={curriculum}
                      value={jobDetails.teachingAdminCurriculum.map(value => {
                        const opt = curriculum.find(c => c.value === value);
                        return opt ? { value: opt.value, label: opt.label } : null;
                      }).filter(Boolean)}
                      onChange={(selected) =>
                        setJobDetails(prev => ({
                          ...prev,
                          teachingAdminCurriculum: selected ? selected.map(item => item.value) : []
                        }))
                      }
                    />
                    <span className="custom-tooltip">Curriculum/Board/University</span>
                    </div>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      placeholder="Subjects"
                      options={subjectsOptions}
                      value={jobDetails.teachingAdminSubjects.map(value => {
                        const opt = subjectsOptions.find(s => s.value === value);
                        return opt ? { value: opt.value, label: opt.label } : null;
                      }).filter(Boolean)}
                      onChange={(selected) =>
                        setJobDetails(prev => ({
                          ...prev,
                          teachingAdminSubjects: selected ? selected.map(item => item.value) : []
                        }))
                      }
                      className="custom-select required"
                    />
                    <span className="custom-tooltip">Subjects</span>
                    </div>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      placeholder="Grades"
                      options={grades}
                      value={jobDetails.teachingAdminGrades.map(value => {
                        const opt = grades.find(g => g.value === value);
                        return opt ? { value: opt.value, label: opt.label } : null;
                      }).filter(Boolean)}
                      onChange={(selected) =>
                        setJobDetails(prev => ({
                          ...prev,
                          teachingAdminGrades: selected ? selected.map(item => item.value) : []
                        }))
                      }
                      className="custom-select required"
                    />
                    <span className="custom-tooltip">Grades</span>
                    </div>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      placeholder="Core Expertise"
                      options={coreExpertise}
                      value={jobDetails.teachingAdminCoreExpertise.map(value => {
                        const opt = coreExpertise.find(c => c.value === value);
                        return opt ? { value: opt.value, label: opt.label } : null;
                      }).filter(Boolean)}
                      onChange={(selected) =>
                        setJobDetails(prev => ({
                          ...prev,
                          teachingAdminCoreExpertise: selected ? selected.map(item => item.value) : []
                        }))
                      }
                      className="custom-select required"
                    />
                    <span className="custom-tooltip">Core Expertise</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Teaching only */}
          {jobDetails.Job_Type === 'teaching' && (
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Teaching Designation(s)"
                  options={teachingDesignations}
                  value={teachingDesignations.filter(option =>
                    jobDetails.teachingDesignation.includes(option.value)
                  )}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      teachingDesignation: selected ? selected.map(item => item.value) : []
                    }))
                  }
                  className="custom-select required"
                />
                <span className="custom-tooltip">Teaching Designation(s)</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Curriculum/Board/University"
                  options={curriculum}
                  value={jobDetails.teachingCurriculum.map(value => {
                    const opt = curriculum.find(c => c.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      teachingCurriculum: selected ? selected.map(item => item.value) : []
                    }))
                  }
                />
                <span className="custom-tooltip">Curriculum/Board/University</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Subjects"
                  options={subjectsOptions}
                  value={jobDetails.teachingSubjects.map(value => {
                    const opt = subjectsOptions.find(s => s.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      teachingSubjects: selected ? selected.map(item => item.value) : []
                    }))
                  }
                  className="custom-select required"
                />
                <span className="custom-tooltip">Subjects</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Grades"
                  options={grades}
                  value={jobDetails.teachingGrades.map(value => {
                    const opt = grades.find(g => g.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      teachingGrades: selected ? selected.map(item => item.value) : []
                    }))
                  }
                  className="custom-select required"
                />
                <span className="custom-tooltip">Grades</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Core Expertise"
                  options={coreExpertise}
                  value={jobDetails.teachingCoreExpertise.map(value => {
                    const opt = coreExpertise.find(c => c.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      teachingCoreExpertise: selected ? selected.map(item => item.value) : []
                    }))
                  }
                  className="custom-select required"
                />
                <span className="custom-tooltip">Core Expertise</span>
                </div>
              </div>
            </div>
          )}

          {/* Administration only */}
          {jobDetails.Job_Type === 'administration' && (
            <>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Administrative Designation(s)"
                  options={adminDesignations}
                  value={jobDetails.adminDesignations.map(value => {
                    const opt = adminDesignations.find(a => a.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      adminDesignations: selected ? selected.map(item => item.value) : []
                    }))
                  }
                  className="custom-select required"
                />
                <span className="custom-tooltip">Administrative Designation(s)</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  placeholder="Curriculum/Board/University"
                  options={curriculum}
                  value={jobDetails.adminCurriculum.map(value => {
                    const opt = curriculum.find(c => c.value === value);
                    return opt ? { value: opt.value, label: opt.label } : null;
                  }).filter(Boolean)}
                  onChange={(selected) =>
                    setJobDetails(prev => ({
                      ...prev,
                      adminCurriculum: selected ? selected.map(item => item.value) : []
                    }))
                  }
                />
                <span className="custom-tooltip">Curriculum/Board/University</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* Job Shift & Job Category Section */}
        <div className="form-group col-md-12 col-lg-12">
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
                    <td data-label="Type">Full time</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.jobShift.Full_time.offline}
                        onChange={(e) =>
                          handlePreferenceChange('jobShift', 'Full_time', 'offline', e.target.value)
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.jobShift.Full_time.online}
                        onChange={(e) =>
                          handlePreferenceChange('jobShift', 'Full_time', 'online', e.target.value)
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">Part time (Weekdays)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_weekdays.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_weekdays',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_weekdays.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_weekdays',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">Part time (Weekends)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_weekends.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_weekends',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_weekends.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_weekends',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">Part time (vacations)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_vacations.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_vacations',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.jobShift.part_time_vacations.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'jobShift',
                            'part_time_vacations',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
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
                    <td data-label="Type">School / College / University</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.organizationType.school_college_university.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'school_college_university',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.organizationType.school_college_university.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'school_college_university',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">Coaching Centers / Institutes</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.organizationType.coaching_institute.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'coaching_institute',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.organizationType.coaching_institute.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'coaching_institute',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">EdTech Companies</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.organizationType.Ed_TechCompanies.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'Ed_TechCompanies',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.organizationType.Ed_TechCompanies.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'organizationType',
                            'Ed_TechCompanies',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
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
                    <td data-label="Type">Home Tutor (One-to-One at Students Home)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.parentGuardian.Home_Tutor.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'parentGuardian',
                            'Home_Tutor',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online" className="disabled">-</td>
                  </tr>
                  <tr>
                    <td data-label="Type">Private Tutor (One-to-One at Tutors Place)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.parentGuardian.Private_Tutor.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'parentGuardian',
                            'Private_Tutor',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online" className="disabled">-</td>
                  </tr>
                  <tr>
                    <td data-label="Type">Group Tuitions Offline (at teachers home)</td>
                    <td data-label="Offline">
                      <select
                        className="form-select"
                        value={preferences.parentGuardian.Group_Tutor_offline.offline}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'parentGuardian',
                            'Group_Tutor_offline',
                            'offline',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                    <td data-label="Online" className="disabled">-</td>
                  </tr>
                  <tr>
                    <td data-label="Type">Private Tuitions Online (One-One)</td>
                    <td data-label="Offline" className="disabled">-</td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.parentGuardian.Private_Tutions_online.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'parentGuardian',
                            'Private_Tutions_online',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Type">Group Tuitions Online (from teacher as tutor)</td>
                    <td data-label="Offline" className="disabled">-</td>
                    <td data-label="Online">
                      <select
                        className="form-select"
                        value={preferences.parentGuardian.Group_Tutor_online.online}
                        onChange={(e) =>
                          handlePreferenceChange(
                            'parentGuardian',
                            'Group_Tutor_online',
                            'online',
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="" disabled>Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Lower half (job details, designations, etc.) */}
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
              <tr>
                <td data-label="Mode">Full Time</td>
                <td data-label="Offline">
                  <select
                    className="form-select"
                    value={jobSearchStatus.Full_time.offline}
                    onChange={(e) =>
                      setJobSearchStatus(prev => ({
                        ...prev,
                        Full_time: {
                          ...prev.Full_time,
                          offline: e.target.value
                        }
                      }))
                    }
                    required
                  >
                    <option value="" disabled>Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
                <td data-label="Online">
                  <select
                    className="form-select"
                    value={jobSearchStatus.Full_time.online}
                    onChange={(e) =>
                      setJobSearchStatus(prev => ({
                        ...prev,
                        Full_time: {
                          ...prev.Full_time,
                          online: e.target.value
                        }
                      }))
                    }
                    required
                  >
                    <option value="" disabled>Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td data-label="Mode">Part Time (Weekdays)</td>
                <td data-label="Offline">
                  <select
                    className="form-select"
                    value={jobSearchStatus.part_time_weekdays.offline}
                    onChange={(e) =>
                      setJobSearchStatus(prev => ({
                        ...prev,
                        part_time_weekdays: {
                          ...prev.part_time_weekdays,
                          offline: e.target.value
                        }
                      }))
                    }
                    required
                  >
                    <option value="" disabled>Status</option>
                    <option value="activelySearching">Actively Searching Jobs</option>
                    <option value="casuallyExploring">Casually Exploring Jobs</option>
                    <option value="notLooking">Not looking for Jobs</option>
                  </select>
                </td>
                <td data-label="Online">
                  <select
                    className="form-select"
                    value={jobSearchStatus.part_time_weekdays.online}
                    onChange={(e) =>
                      setJobSearchStatus(prev => ({
                        ...prev,
                        part_time_weekdays: {
                          ...prev.part_time_weekdays,
                          online: e.target.value
                        }
                      }))
                    }
                    required
                  >
                    <option value="" disabled>Status</option>
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
        <button type="submit" className="theme-btn btn-style-three">
          Save Job Preferences
        </button>
      </div>
    </form>
  );
};

export default JobPreference;
