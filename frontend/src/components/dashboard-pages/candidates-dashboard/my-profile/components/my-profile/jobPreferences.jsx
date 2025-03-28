import { useState, useEffect } from 'react';
import Select from 'react-select';
import csc from 'countries-states-cities';
import axios from 'axios';
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobPreference = ({ formData, updateFormData }) => {
  const { user } = useAuth();

  // Helper: Convert numeric from DB => "yes" or "no"
  const convertYesNo = (value) => (Number(value) === 1 ? "yes" : "no");

  // Helper: Convert "yes"/"no" => 1 or 0 (or null if empty)
  const convertToInt = (value) => {
    if (value === "yes") return 1;
    if (value === "no") return 0;
    return null; // for the empty "Select" case
  };

  const [preferences, setPreferences] = useState({
    jobShift: {
      Full_time: { value: "yes" },
      part_time_weekdays: { value: "yes" },
      part_time_weekends: { value: "yes" },
      part_time_vacations: { value: "yes" },
    },
    organizationType: {
      school_college_university: { value: "yes" },
      coaching_institute: { value: "yes" },
      Ed_TechCompanies: { value: "yes" },
    },
    parentGuardian: {
      Home_Tutor: { value: "yes" },
      Private_Tutor: { value: "yes" },
      Group_Tutor: { value: "yes" },
      Private_Tutions: { value: "yes" },
      Group_Tuitions: { value: "yes" },
    },
    teachingMode: {
      online: "yes",
      offline: "yes"
    },
  });

  const [jobSearchStatus, setJobSearchStatus] = useState({
    Full_time: { value: "activelySearching" },
    part_time_weekdays: { value: "activelySearching" },
    part_time_weekends: { value: "activelySearching" },
    part_time_vacations: { value: "activelySearching" },
    tuitions: { value: "activelySearching" },
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
    { value: "less_than_40k", label: "Less than 40k" },
    { value: "40k_60k", label: "40k-60k" },
    { value: "60k_80k", label: "60k-80k" },
    { value: "80k_100k", label: "80k-1 lakh" },
    { value: "100k_120k", label: "1 lakh-1.2 lakh" },
    { value: "120k_140k", label: "1.2 lakh-1.4 lakh" },
    { value: "140k_160k", label: "1.4 lakh-1.6 lakh" },
    { value: "160k_180k", label: "1.6 lakh-1.8 lakh" },
    { value: "180k_200k", label: "1.8 lakh-2 lakh" },
    { value: "more_than_200k", label: "More than 2 lakh" }
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

  // Add validation function
  const validateJobPreferences = () => {
    // Helper function to check if a value exists
    const hasValue = (val) => val !== null && val !== undefined && val !== "";

    // 1. Validate job shifts - check if selections exist
    const areJobShiftsValid = Object.values(preferences.jobShift).every(
      (shift) => hasValue(shift.value)
    );

    // 2. Validate organization types
    const areOrgTypesValid = Object.values(preferences.organizationType).every(
      (org) => hasValue(org.value)
    );

    // 3. Validate parent/guardian preferences - only validate fields that should have values
    const areParentPrefsValid = Object.entries(preferences.parentGuardian).every(([key, value]) => {
      if (key === 'Group_Tutor' || key === 'Home_Tutor' || key === 'Private_Tutor') {
        return hasValue(value.value);
      }
      if (key === 'Private_Tutions' || key === 'Group_Tuitions') {
        return hasValue(value.value);
      }
      // coaching_institute was removed from parentGuardian, so no validation for it
      return true;
    });

    // 4. Validate basic job details
    const areBasicDetailsValid =
      hasValue(jobDetails.Job_Type) &&
      hasValue(jobDetails.expected_salary) &&
      hasValue(jobDetails.notice_period);

    // 5. Validate location preferences (if any are filled, all must be filled)
    const hasAnyLocation =
      jobDetails.preferred_country ||
      jobDetails.preferred_state ||
      jobDetails.preferred_city;

    const areLocationsValid =
      !hasAnyLocation ||
      (jobDetails.preferred_country && jobDetails.preferred_state);
    // city is optional

    // 6. Validate job type specific fields
    let areJobTypeFieldsValid = true;
    if (jobDetails.Job_Type === 'teaching') {
      areJobTypeFieldsValid =
        jobDetails.teachingDesignation.length > 0 &&
        jobDetails.teachingSubjects.length > 0 &&
        jobDetails.teachingGrades.length > 0;
    } else if (jobDetails.Job_Type === 'administration') {
      areJobTypeFieldsValid = jobDetails.adminDesignations.length > 0;
    } else if (jobDetails.Job_Type === 'teachingAndAdmin') {
      areJobTypeFieldsValid =
        jobDetails.teachingAdminDesignations.length > 0 &&
        jobDetails.teachingAdminSubjects.length > 0 &&
        jobDetails.teachingAdminGrades.length > 0;
    }

    // 7. Validate job search status
    const isJobSearchValid = Object.values(jobSearchStatus).every(
      (status) => hasValue(status.value)
    );

    return (
      areJobShiftsValid &&
      areOrgTypesValid &&
      areParentPrefsValid &&
      areBasicDetailsValid &&
      areLocationsValid &&
      areJobTypeFieldsValid &&
      isJobSearchValid
    );
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
      const response = await axios.get(
        import.meta.env.VITE_DEV1_API + '/education-data'
      );
      const formattedSubjects = response.data.map((subject) => ({
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
        const transformedData = data.map((item) => ({
          category: item.category,
          value: item.value,
          label: item.label,
        }));
        setTeachingDesignations(
          transformedData.filter((item) => item.category === "Teaching") || []
        );
        setAdminDesignations(
          transformedData.filter((item) => item.category === "Administration") || []
        );
        setTeachingAdminDesignations(
          transformedData.filter(
            (item) => item.category === "Teaching" || item.category === "Administration"
          ) || []
        );
        setCoreExpertise(
          transformedData.filter((item) => item.category === "Core Expertise") || []
        );
        setGrades(
          transformedData.filter((item) => item.category === "Grades") || []
        );
        setCurriculum(
          transformedData.filter((item) => item.category === "Curriculum") || []
        );
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };
    fetchDesignations();
  }, []);

  // Fetch existing job preferences (if any)
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

          const pref = {
            jobShift: {
              Full_time: {
                value: convertYesNo(record.full_time_offline),
              },
              part_time_weekdays: {
                value: convertYesNo(record.part_time_weekdays_offline),
              },
              part_time_weekends: {
                value: convertYesNo(record.part_time_weekends_offline),
              },
              part_time_vacations: {
                value: convertYesNo(record.part_time_vacations_offline),
              },
            },
            organizationType: {
              school_college_university: {
                value: convertYesNo(record.school_college_university_offline),
              },
              coaching_institute: {
                value: convertYesNo(record.coaching_institute_offline),
              },
              Ed_TechCompanies: {
                value: convertYesNo(record.Ed_TechCompanies_offline),
              },
            },
            parentGuardian: {
              Home_Tutor: {
                value: convertYesNo(record.Home_Tutor_offline),
              },
              Private_Tutor: {
                value: convertYesNo(record.Private_Tutor_offline),
              },
              Group_Tutor: {
                value: convertYesNo(record.Group_Tutor_offline),
              },
              Private_Tutions: {
                value: convertYesNo(record.Private_Tutions_online_online),
              },
              Group_Tuitions: {
                value: convertYesNo(record.Group_Tutor_online),
              },
            },
            teachingMode: {
              online: convertYesNo(record.teachingMode_online),
              offline: convertYesNo(record.teachingMode_offline),
            },
          };

          const jobSearch = {
            Full_time: {
              value: record.full_time_2_offline || "",
            },
            part_time_weekdays: {
              value: record.part_time_weekdays_2_offline || "",
            },
            part_time_weekends: {
              value: record.part_time_weekends_2_offline || "",
            },
            part_time_vacations: {
              value: record.part_time_vacations_2_offline || "",
            },
            tuitions: {
              value: record.tuitions_2_offline || "",
            },
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
            notice_period: record.notice_period || "",
          };

          setPreferences(pref);
          setJobSearchStatus(jobSearch);
          setJobDetails(details);

          // Mark form as valid or invalid in parent
          updateFormData(
            {
              preferences: pref,
              jobDetails: details,
              jobSearchStatus: jobSearch
            },
            true
          );
        }
      } catch (error) {
        console.error("Error fetching job preference:", error);
      }
    };

    fetchJobPreference();
  }, [user?.uid]);

  // Update preference change handler
  const handlePreferenceChange = (category, field, mode, value) => {
    setPreferences((prev) => {
      const newPreferences = {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: {
            ...prev[category][field],
            [mode]: value,
          },
        },
      };

      const isValid = validateJobPreferences();
      updateFormData(
        {
          preferences: newPreferences,
          jobDetails,
          jobSearchStatus,
        },
        isValid
      );

      return newPreferences;
    });
  };

  // Update job details change handler
  const handleJobDetailsChange = (field, value) => {
    setJobDetails((prev) => {
      const newJobDetails = {
        ...prev,
        [field]: value,
      };

      const isValid = validateJobPreferences();
      updateFormData(
        {
          preferences,
          jobDetails: newJobDetails,
          jobSearchStatus,
        },
        isValid
      );

      return newJobDetails;
    });
  };

  // Update job search status change handler
  const handleJobSearchStatusChange = (type, mode, value) => {
    setJobSearchStatus((prev) => {
      const newStatus = {
        ...prev,
        [type]: {
          ...prev[type],
          [mode]: value,
        },
      };

      const isValid = validateJobPreferences();
      updateFormData(
        {
          preferences,
          jobDetails,
          jobSearchStatus: newStatus,
        },
        isValid
      );

      return newStatus;
    });
  };

  // Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateJobPreferences()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      firebase_uid: user.uid,
      // Convert "yes"/"no" => 1/0
      full_time_offline: convertToInt(preferences.jobShift.Full_time.value),
      full_time_online: convertToInt(preferences.jobShift.Full_time.value),
      part_time_weekdays_offline: convertToInt(preferences.jobShift.part_time_weekdays.value),
      part_time_weekdays_online: convertToInt(preferences.jobShift.part_time_weekdays.value),
      part_time_weekends_offline: convertToInt(preferences.jobShift.part_time_weekends.value),
      part_time_weekends_online: convertToInt(preferences.jobShift.part_time_weekends.value),
      part_time_vacations_offline: convertToInt(preferences.jobShift.part_time_vacations.value),
      part_time_vacations_online: convertToInt(preferences.jobShift.part_time_vacations.value),

      school_college_university_offline: convertToInt(preferences.organizationType.school_college_university.value),
      school_college_university_online: convertToInt(preferences.organizationType.school_college_university.value),
      coaching_institute_offline: convertToInt(preferences.organizationType.coaching_institute.value),
      coaching_institute_online: convertToInt(preferences.organizationType.coaching_institute.value),
      Ed_TechCompanies_offline: convertToInt(preferences.organizationType.Ed_TechCompanies.value),
      Ed_TechCompanies_online: convertToInt(preferences.organizationType.Ed_TechCompanies.value),

      // Parent/Guardian
      Home_Tutor_offline: convertToInt(preferences.parentGuardian.Home_Tutor.value),
      Home_Tutor_online: convertToInt(preferences.parentGuardian.Home_Tutor.value),
      Private_Tutor_offline: convertToInt(preferences.parentGuardian.Private_Tutor.value),
      Private_Tutor_online: convertToInt(preferences.parentGuardian.Private_Tutor.value),
      Group_Tutor_offline: convertToInt(preferences.parentGuardian.Group_Tutor.value),
      Group_Tutor_online: convertToInt(preferences.parentGuardian.Group_Tutor.value),
      Private_Tutions_online_online: convertToInt(preferences.parentGuardian.Private_Tutions.value),
      // Removed parent_coaching_institute_offline / parent_coaching_institute_online

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
      full_time_2_offline: jobSearchStatus.Full_time.value,
      full_time_2_online: jobSearchStatus.Full_time.value,
      part_time_weekdays_2_offline: jobSearchStatus.part_time_weekdays.value,
      part_time_weekdays_2_online: jobSearchStatus.part_time_weekdays.value,
      part_time_weekends_2_offline: jobSearchStatus.part_time_weekends.value,
      part_time_weekends_2_online: jobSearchStatus.part_time_weekends.value,
      part_time_vacations_2_offline: jobSearchStatus.part_time_vacations.value,
      part_time_vacations_2_online: jobSearchStatus.part_time_vacations.value,
      tuitions_2_offline: jobSearchStatus.tuitions.value,
      tuitions_2_online: jobSearchStatus.tuitions.value,
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
                value={Job_TypeOptions.find((option) => option.value === jobDetails.Job_Type)}
                onChange={(selected) => {
                  setJobDetails((prev) => ({
                    ...prev,
                    Job_Type: selected?.value || '',
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
                onChange={(e) =>
                  setJobDetails((prev) => ({
                    ...prev,
                    expected_salary: e.target.value,
                  }))
                }
              >
                <option value="">Expected salary(INR)</option>
                {salaryRanges.map((range) => (
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
                  { value: 'moreThan1Month', label: '> 1 Month' },
                ]}
                value={jobDetails.notice_period}
                onChange={(selected) =>
                  setJobDetails((prev) => ({
                    ...prev,
                    notice_period: selected,
                  }))
                }
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
                  setJobDetails((prev) => ({
                    ...prev,
                    preferred_country: option,
                    preferred_state: null,
                    preferred_city: null,
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
                  setJobDetails((prev) => ({
                    ...prev,
                    preferred_state: option,
                    preferred_city: null,
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
                  setJobDetails((prev) => ({
                    ...prev,
                    preferred_city: option,
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
                        value={jobDetails.teachingAdminDesignations.map((val) => {
                          const option = teachingAdminDesignations.find((opt) => opt.value === val);
                          return option ? { value: option.value, label: option.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected) =>
                          setJobDetails((prev) => ({
                            ...prev,
                            teachingAdminDesignations: selected ? selected.map((item) => item.value) : [],
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
                        value={jobDetails.teachingAdminCurriculum.map((val) => {
                          const opt = curriculum.find((c) => c.value === val);
                          return opt ? { value: opt.value, label: opt.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected) =>
                          setJobDetails((prev) => ({
                            ...prev,
                            teachingAdminCurriculum: selected ? selected.map((item) => item.value) : [],
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
                        value={jobDetails.teachingAdminSubjects.map((val) => {
                          const opt = subjectsOptions.find((s) => s.value === val);
                          return opt ? { value: opt.value, label: opt.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected) =>
                          setJobDetails((prev) => ({
                            ...prev,
                            teachingAdminSubjects: selected ? selected.map((item) => item.value) : [],
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
                        value={jobDetails.teachingAdminGrades.map((val) => {
                          const opt = grades.find((g) => g.value === val);
                          return opt ? { value: opt.value, label: opt.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected) =>
                          setJobDetails((prev) => ({
                            ...prev,
                            teachingAdminGrades: selected ? selected.map((item) => item.value) : [],
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
                        value={jobDetails.teachingAdminCoreExpertise.map((val) => {
                          const opt = coreExpertise.find((c) => c.value === val);
                          return opt ? { value: opt.value, label: opt.label } : null;
                        }).filter(Boolean)}
                        onChange={(selected) =>
                          setJobDetails((prev) => ({
                            ...prev,
                            teachingAdminCoreExpertise: selected ? selected.map((item) => item.value) : [],
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
                    value={teachingDesignations.filter((opt) =>
                      jobDetails.teachingDesignation.includes(opt.value)
                    )}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        teachingDesignation: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.teachingCurriculum.map((val) => {
                      const opt = curriculum.find((c) => c.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        teachingCurriculum: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.teachingSubjects.map((val) => {
                      const opt = subjectsOptions.find((s) => s.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        teachingSubjects: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.teachingGrades.map((val) => {
                      const opt = grades.find((g) => g.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        teachingGrades: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.teachingCoreExpertise.map((val) => {
                      const opt = coreExpertise.find((c) => c.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        teachingCoreExpertise: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.adminDesignations.map((val) => {
                      const opt = adminDesignations.find((a) => a.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        adminDesignations: selected ? selected.map((item) => item.value) : [],
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
                    value={jobDetails.adminCurriculum.map((val) => {
                      const opt = curriculum.find((c) => c.value === val);
                      return opt ? { value: opt.value, label: opt.label } : null;
                    }).filter(Boolean)}
                    onChange={(selected) =>
                      setJobDetails((prev) => ({
                        ...prev,
                        adminCurriculum: selected ? selected.map((item) => item.value) : [],
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
            <div className="form-group">
              <h3 className='form-title'>Select your preferred teaching mode</h3>
              <div className='row'>
                <div className='form-group col-lg-6 col-md-12'>
                  <label htmlFor="teachingMode_online">Online</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.teachingMode.online}
                    onChange={(e) => {
                      handlePreferenceChange('teachingMode', 'online', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className='form-group col-lg-6 col-md-12'>
                  <label htmlFor="teachingMode_offline">Offline</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.teachingMode.offline}
                    onChange={(e) => {
                      handlePreferenceChange('teachingMode', 'offline', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <h3 className="form-title">Job Shift Preferences</h3>
              <div className="row">
                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="Full_time">Full Time</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.jobShift.Full_time.value}
                    onChange={(e) => {
                      handlePreferenceChange('jobShift', 'Full_time', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="Part_time_weekdays">Part Time (Weekdays)</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.jobShift.part_time_weekdays.value}
                    onChange={(e) => {
                      handlePreferenceChange('jobShift', 'part_time_weekdays', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="Part_time_weekends">Part Time (Weekends)</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.jobShift.part_time_weekends.value}
                    onChange={(e) => {
                      handlePreferenceChange('jobShift', 'part_time_weekends', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="Part_time_vacations">Part Time (Vacations)</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.jobShift.part_time_vacations.value}
                    onChange={(e) => {
                      handlePreferenceChange('jobShift', 'part_time_vacations', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Organization Type Section */}
            <div className="form-group">
              <h3 className="form-title">Organization Type Preferences</h3>
              <div className="row">
                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="school_college_university">School / College / University</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.organizationType.school_college_university.value}
                    onChange={(e) => {
                      handlePreferenceChange('organizationType', 'school_college_university', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="coaching_institute">Coaching Centers / Institutes</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.organizationType.coaching_institute.value}
                    onChange={(e) => {
                      handlePreferenceChange('organizationType', 'coaching_institute', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <label htmlFor="Ed_TechCompanies">EdTech Companies</label>
                  <select
                    required
                    className="form-select"
                    defaultValue="yes"
                    value={preferences.organizationType.Ed_TechCompanies.value}
                    onChange={(e) => {
                      handlePreferenceChange('organizationType', 'Ed_TechCompanies', 'value', e.target.value);
                    }}
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        {/* Parent / Guardian Section */}
        <div className="form-group">
          <h3 className="form-title">Tuition Preferences</h3>
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <label htmlFor="Home_Tutor">Home Tutor (One-to-One at Students Home)</label>
              <select
                required
                className="form-select"
                defaultValue="yes"
                value={preferences.parentGuardian.Home_Tutor.value}
                onChange={(e) => {
                  handlePreferenceChange('parentGuardian', 'Home_Tutor', 'value', e.target.value);
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <label htmlFor="Private_Tutor">Private Tutor (One-to-One at Tutors Place)</label>
              <select
                required
                className="form-select"
                defaultValue="yes"
                value={preferences.parentGuardian.Private_Tutor.value}
                onChange={(e) => {
                  handlePreferenceChange('parentGuardian', 'Private_Tutor', 'value', e.target.value);
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <label htmlFor="Group_Tutor_offline">Group Tuitions (at teachers home)</label>
              <select
                required
                className="form-select"
                defaultValue="yes"
                value={preferences.parentGuardian.Group_Tutor.value}
                onChange={(e) => {
                  handlePreferenceChange('parentGuardian', 'Group_Tutor', 'value', e.target.value);
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <label htmlFor="Private_Tutions_online">Private Tuitions (One-One)</label>
              <select
                required
                className="form-select"
                defaultValue="yes"
                value={preferences.parentGuardian.Private_Tutions.value}
                onChange={(e) => {
                  handlePreferenceChange('parentGuardian', 'Private_Tutions', 'value', e.target.value);
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <label htmlFor="Group_Tutor_online">Group Tuitions (from teacher as tutor)</label>
              <select
                required
                className="form-select"
                defaultValue="yes"
                value={preferences.parentGuardian.Group_Tuitions.value}
                onChange={(e) => {
                  handlePreferenceChange('parentGuardian', 'Group_Tuitions', 'value', e.target.value);
                }}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        </div>

      {/* Lower half (job details, designations, etc.) */}
      {renderJobDetailsSection()}

      {/* Job Search Status Section */}
      <div className="form-group">
        <h3 className="form-title">Job Search Status</h3>
        <div className="row">
          <div className="form-group col-lg-6 col-md-12">
            <label htmlFor="Full_time_status">Full Time</label>
            <select
              required
              className="form-select"
              value={jobSearchStatus.Full_time.value}
              onChange={(e) => {
                handleJobSearchStatusChange('Full_time', 'value', e.target.value);
              }}
            >
              <option value="activelySearching">Actively Searching Jobs</option>
              <option value="casuallyExploring">Casually Exploring Jobs</option>
              <option value="notLooking">Not looking for Jobs</option>
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label htmlFor="part_time_weekdays_status">Part Time (Weekdays)</label>
            <select
              required
              className="form-select"
              value={jobSearchStatus.part_time_weekdays.value}
              onChange={(e) => {
                handleJobSearchStatusChange('part_time_weekdays', 'value', e.target.value);
              }}
            >
              <option value="activelySearching">Actively Searching Jobs</option>
              <option value="casuallyExploring">Casually Exploring Jobs</option>
              <option value="notLooking">Not looking for Jobs</option>
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label htmlFor="part_time_weekends_status">Part Time (Weekends)</label>
            <select
              required
              className="form-select"
              value={jobSearchStatus.part_time_weekends.value}
              onChange={(e) => {
                handleJobSearchStatusChange('part_time_weekends', 'value', e.target.value);
              }}
            >
              <option value="activelySearching">Actively Searching Jobs</option>
              <option value="casuallyExploring">Casually Exploring Jobs</option>
              <option value="notLooking">Not looking for Jobs</option>
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label htmlFor="part_time_vacations_status">Part Time (Vacations)</label>
            <select
              required
              className="form-select"
              value={jobSearchStatus.part_time_vacations.value}
              onChange={(e) => {
                handleJobSearchStatusChange('part_time_vacations', 'value', e.target.value);
              }}
            >
              <option value="activelySearching">Actively Searching Jobs</option>
              <option value="casuallyExploring">Casually Exploring Jobs</option>
              <option value="notLooking">Not looking for Jobs</option>
            </select>
          </div>

          <div className="form-group col-lg-6 col-md-12">
            <label htmlFor="tuitions_status">Tuitions</label>
            <select
              required
              className="form-select"
              value={jobSearchStatus.tuitions.value}
              onChange={(e) => {
                handleJobSearchStatusChange('tuitions', 'value', e.target.value);
              }}
            >
              <option value="activelySearching">Actively Searching Jobs</option>
              <option value="casuallyExploring">Casually Exploring Jobs</option>
              <option value="notLooking">Not looking for Jobs</option>
            </select>
          </div>
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