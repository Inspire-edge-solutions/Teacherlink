import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import csc from "countries-states-cities";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Experience = ({
  excludeAdditionalDetails,
  excludeTeachingCurriculum,
  excludeAdminCurriculum,
  excludeTeachingAdminCurriculum
}) => {
  const { user } = useAuth();

  // Base experience template (no user_id in MySQL; used only for DynamoDB)
  const baseExperience = {
    firebase_uid: user?.uid || "", // Use optional chaining to safely access uid
    adminCurriculum: "",
    jobCategory: "", // "fullTime" / "partTime"
    jobProcess: "",  // "regular", "online", "hybrid"
    jobType: "",     // "teaching", "administration", "teachingAndAdministration", "nonEducation"
    otherAdminDesignation: "",
    otherTeachingAdminCoreExpertise: "",
    paySlip: null, // Will hold Base64 if a file is chosen
    teachingAdminSubjects: [],
    teachingDesignation: "",
    teachingSubjects: [],
    workProfile: "",
    adminDesignation: "",
    city: null,    // Will store entire option object
    country: null, // Will store entire option object
    currentlyWorking: false,
    designation: "",
    industryType: "",
    organizationName: "",
    otherAdminCurriculum: "",
    otherTeachingAdminCurriculum: "",
    otherTeachingAdminDesignation: "",
    otherTeachingAdminSubjects: "",
    otherTeachingCoreExpertise: "",
    otherTeachingCurriculum: "",
    otherTeachingDesignation: "",
    otherTeachingSubjects: "",
    salary: "",
    state: null, // Will store entire option object
    teachingAdminCoreExpertise: [],
    teachingAdminCurriculum: "",
    teachingAdminDesignations: [],
    teachingAdminGrades: [],
    teachingCoreExpertise: [],
    teachingCurriculum: "",
    teachingGrades: [],
    work_from_month: "",
    work_from_year: "",
    work_till_month: "",
    work_till_year: ""
  };

  // MySQL-like aggregated experience details
  const [workExperience, setWorkExperience] = useState({
    total: { years: "0", months: "0" },
    teaching: { years: "0", months: "0" },
    details: {
      teaching: {
        fullTime: { years: "0", months: "0" },
        partTime: { years: "0", months: "0" }
      },
      administration: {
        fullTime: { years: "0", months: "0" },
        partTime: { years: "0", months: "0" }
      },
      nonEducation: {
        fullTime: { years: "0", months: "0" },
        partTime: { years: "0", months: "0" }
      }
    }
  });
  // Array of individual experiences
  const [experienceEntries, setExperienceEntries] = useState([]);

  // Additional toggles for other teaching experiences (Ed Tech, etc.)
  const [otherTeachingExp, setOtherTeachingExp] = useState({
    edTechCompany: null,
    online: null,
    coachingTuition: null,
    groupTuitions: null,
    privateTuitions: null,
    homeTuitions: null
  });

  // For dynamic location: We store full country objects here
  const allCountries = csc.getAllCountries().map((c) => ({
    value: c.id,
    label: c.name
  }));

  // For designations, subjects, etc.
  const [subjectsOptions, setSubjectsOptions] = useState([]);
  const [teachingDesignations, setTeachingDesignations] = useState([]);
  const [adminDesignations, setAdminDesignations] = useState([]);
  const [teachingAdminDesignations, setTeachingAdminDesignations] = useState([]);
  const [coreExpertise, setCoreExpertise] = useState([]);
  const [grades, setGrades] = useState([]);
  const [curriculum, setCurriculum] = useState([]);

  // Year <option> elements
  const yearOptions = Array.from({ length: 31 }, (_, i) => (
    <option key={i} value={i}>
      {i} Years
    </option>
  ));

  // Fetch designations and subjects from your endpoints
  const subjectList = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_EDUCATION_API
      );
      const formattedSubjects = response.data.map((subject) => ({
        value: subject.value,
        label: subject.label
      }));
      setSubjectsOptions(formattedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_CONSTANTS_API
      );
      const data = await response.json();
      const transformedData = data.map((item) => ({
        category: item.category,
        value: item.value,
        label: item.label
      }));
      setTeachingDesignations(
        transformedData.filter((item) => item.category === "Teaching") || []
      );
      setAdminDesignations(
        transformedData.filter((item) => item.category === "Administration") || []
      );
      setTeachingAdminDesignations(
        transformedData.filter(
          (item) =>
            item.category === "Teaching" || item.category === "Administration"
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
      console.error("Error fetching drop down data list:", error);
    }
  };

  useEffect(() => {
    subjectList();
    fetchDesignations();
  }, []);

  // Add a new experience entry
  const addNewExperience = () => {
    setExperienceEntries((prev) => [...prev, { ...baseExperience }]);
  };

  // Remove an experience entry
  const removeExperience = (indexToRemove) => {
    setExperienceEntries((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  // Before submission, transform each entry's country/state/city from object to their label
  const transformExperienceEntries = (entries) => {
    return entries.map((entry) => ({
      ...entry,
      country: entry.country ? entry.country.label : "",
      state: entry.state ? entry.state.label : "",
      city: entry.city ? entry.city.label : ""
    }));
  };
  
  // Submit the entire experience data
  const submitExperienceData = async () => {
    if (experienceEntries.length === 0) {
      toast.error("Please add at least one work experience.");
      return;
    }

    // Build final payload for POST
    const experienceData = {
      // Aggregated data for MySQL; note that user_id is not sent here
      mysqlDB: {
        total_experience_years: workExperience.total.years,
        total_experience_months: workExperience.total.months,
        teaching_experience_years: workExperience.teaching.years,
        teaching_experience_months: workExperience.teaching.months,
        teaching_exp_fulltime_years: workExperience.details.teaching.fullTime.years,
        teaching_exp_fulltime_months: workExperience.details.teaching.fullTime.months,
        teaching_exp_partime_years: workExperience.details.teaching.partTime.years,
        teaching_exp_partime_months: workExperience.details.teaching.partTime.months,

        administration_fulltime_years:workExperience.details.administration.fullTime.years,
        administration_fulltime_months:workExperience.details.administration.fullTime.months,
        administration_partime_years:workExperience.details.administration.partTime.years,
        administration_parttime_months:workExperience.details.administration.partTime.months,

        anyrole_fulltime_years:workExperience.details.nonEducation.fullTime.years,
        anyrole_fulltime_months:workExperience.details.nonEducation.fullTime.months,
        anyrole_partime_years:workExperience.details.nonEducation.partTime.years,
        anyrole_parttime_months:workExperience.details.nonEducation.partTime.months,

        // Booleans for Other Teaching Experiences; converting to "1"/"0" strings
        Ed_Tech_Company: otherTeachingExp.edTechCompany,
        on_line: otherTeachingExp.online,
        coaching_tuitions_center: otherTeachingExp.coachingTuition,
        group_tuitions: otherTeachingExp.groupTuitions,
        private_tuitions: otherTeachingExp.privateTuitions,
        home_tuitions: otherTeachingExp.homeTuitions
      },
      // For DynamoDB, send the transformed experiences array
      dynamoDB: transformExperienceEntries(experienceEntries)
    };

    // POST to your backend
    try {
      const response = await axios.post(
        "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience",
        experienceData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log("Data submitted successfully:", response.data);
      toast.success("Experience data submitted successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Error submitting data");
    }
  };

  return (
    <div className="work-experience-section">
      <h3>Work Experience</h3>

      {/* Total and Teaching Experience */}
      <div className="experience-row">
        <div className="experience-col">
          <h4>Total Experience (Full Time + Part Time)</h4>
          <div className="duration-selector">
            <select
              value={workExperience.total.years}
              onChange={(e) =>
                setWorkExperience((prev) => ({
                  ...prev,
                  total: { ...prev.total, years: e.target.value }
                }))
              }
              required
            >
              <option value="">Years</option>
              {yearOptions}
            </select>
            <select
              value={workExperience.total.months}
              onChange={(e) =>
                setWorkExperience((prev) => ({
                  ...prev,
                  total: { ...prev.total, months: e.target.value }
                }))
              }
              required
            >
              <option value="">Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i} Months
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="experience-col">
          <h4>Teaching Experience (Full Time + Part Time)</h4>
          <div className="duration-selector">
            <select
              value={workExperience.teaching.years}
              onChange={(e) =>
                setWorkExperience((prev) => ({
                  ...prev,
                  teaching: { ...prev.teaching, years: e.target.value }
                }))
              }
              required
            >
              <option value="">Years</option>
              {yearOptions}
            </select>
            <select
              value={workExperience.teaching.months}
              onChange={(e) =>
                setWorkExperience((prev) => ({
                  ...prev,
                  teaching: { ...prev.teaching, months: e.target.value }
                }))
              }
              required
            >
              <option value="">Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {i} Months
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Additional Details */}
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
                teaching: "Education - Teaching",
                administration: "Education - Administration",
                nonEducation: "Non-Education (Any Role)"
              }).map(([key, label]) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <div className="duration-selector">
                      <select
                        value={workExperience.details[key].fullTime.years}
                        onChange={(e) =>
                          setWorkExperience((prev) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              [key]: {
                                ...prev.details[key],
                                fullTime: {
                                  ...prev.details[key].fullTime,
                                  years: e.target.value
                                }
                              }
                            }
                          }))
                        }
                      >
                        {yearOptions}
                      </select>
                      <select
                        value={workExperience.details[key].fullTime.months}
                        onChange={(e) =>
                          setWorkExperience((prev) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              [key]: {
                                ...prev.details[key],
                                fullTime: {
                                  ...prev.details[key].fullTime,
                                  months: e.target.value
                                }
                              }
                            }
                          }))
                        }
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Months
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="duration-selector">
                      <select
                        value={workExperience.details[key].partTime.years}
                        onChange={(e) =>
                          setWorkExperience((prev) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              [key]: {
                                ...prev.details[key],
                                partTime: {
                                  ...prev.details[key].partTime,
                                  years: e.target.value
                                }
                              }
                            }
                          }))
                        }
                      >
                        {yearOptions}
                      </select>
                      <select
                        value={workExperience.details[key].partTime.months}
                        onChange={(e) =>
                          setWorkExperience((prev) => ({
                            ...prev,
                            details: {
                              ...prev.details,
                              [key]: {
                                ...prev.details[key],
                                partTime: {
                                  ...prev.details[key].partTime,
                                  months: e.target.value
                                }
                              }
                            }
                          }))
                        }
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={i}>
                            {i} Months
                          </option>
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

      {/* Map each experience entry */}
      {experienceEntries.map((experience, index) => {
        // Compute states and cities for each entry if available
        const statesInCountry = experience.country
          ? csc.getStatesOfCountry(experience.country.value).map((st) => ({
              value: st.id,
              label: st.name
            }))
          : [];
        const citiesInState = experience.state
          ? csc.getCitiesOfState(experience.state.value).map((ct) => ({
              value: ct.id,
              label: ct.name
            }))
          : [];

        return (
          <div key={index} className="experience-entry">
            <div className="d-flex justify-content-between align-items-center">
              <h4>Experience Details {index + 1}</h4>
              {experienceEntries.length > 1 && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeExperience(index)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="row">
              {/* Organization Name */}
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  maxLength="20"
                  value={experience.organizationName}
                  onChange={(e) => {
                    const newArr = [...experienceEntries];
                    newArr[index].organizationName = e.target.value;
                    setExperienceEntries(newArr);
                  }}
                  placeholder="Name of the organization"
                  required
                />
              </div>

              {/* Job Category */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group single-line">
                  <label>Job Category:</label>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id={`jobCategory-fullTime-${index}`}
                      name={`jobCategory-${index}`}
                      value="fullTime"
                      checked={experience.jobCategory === "fullTime"}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].jobCategory = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                    />
                    <label htmlFor={`jobCategory-fullTime-${index}`}>Full Time</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id={`jobCategory-partTime-${index}`}
                      name={`jobCategory-${index}`}
                      value="partTime"
                      checked={experience.jobCategory === "partTime"}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].jobCategory = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                    />
                    <label htmlFor={`jobCategory-partTime-${index}`}>Part Time</label>
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="form-select"
                  value={experience.jobType}
                  onChange={(e) => {
                    const newArr = [...experienceEntries];
                    newArr[index].jobType = e.target.value;
                    setExperienceEntries(newArr);
                  }}
                  required
                >
                  <option value="">Job Type</option>
                  <option value="teaching">Education - Teaching</option>
                  <option value="administration">Education - Administration</option>
                  <option value="teachingAndAdministration">
                    Education - Teaching + Administration
                  </option>
                  <option value="nonEducation">Non-Education (Any Role)</option>
                </select>
              </div>

              {/* Currently Working */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group single-line">
                  <label>Are you currently working here?</label>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id={`currentlyWorking-yes-${index}`}
                      name={`currentlyWorking-${index}`}
                      value="yes"
                      checked={experience.currentlyWorking === true}
                      onChange={() => {
                        const newArr = [...experienceEntries];
                        newArr[index].currentlyWorking = true;
                        setExperienceEntries(newArr);
                      }}
                    />
                    <label htmlFor={`currentlyWorking-yes-${index}`}>Yes</label>
                  </div>
                  <div className="radio-option">
                    <input
                      type="radio"
                      id={`currentlyWorking-no-${index}`}
                      name={`currentlyWorking-${index}`}
                      value="no"
                      checked={experience.currentlyWorking === false}
                      onChange={() => {
                        const newArr = [...experienceEntries];
                        newArr[index].currentlyWorking = false;
                        setExperienceEntries(newArr);
                      }}
                    />
                    <label htmlFor={`currentlyWorking-no-${index}`}>No</label>
                  </div>
                </div>
              </div>

              {/* Work Period: From */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Worked from</label>
                <div className="date-selector" style={{ display: "flex", gap: 5 }}>
                  <select
                    value={experience.work_from_month}
                    onChange={(e) => {
                      const newArr = [...experienceEntries];
                      newArr[index].work_from_month = e.target.value;
                      setExperienceEntries(newArr);
                    }}
                    required
                  >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString("default", {
                          month: "long"
                        })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={experience.work_from_year}
                    onChange={(e) => {
                      const newArr = [...experienceEntries];
                      newArr[index].work_from_year = e.target.value;
                      setExperienceEntries(newArr);
                    }}
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Work Period: Till */}
              {!experience.currentlyWorking && (
                <div className="form-group col-lg-6 col-md-12">
                  <label>Worked till</label>
                  <div className="date-selector" style={{ display: "flex", gap: 5 }}>
                    <select
                      value={experience.work_till_month}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].work_till_month = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          {new Date(2000, i, 1).toLocaleString("default", {
                            month: "long"
                          })}
                        </option>
                      ))}
                    </select>
                    <select
                      value={experience.work_till_year}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].work_till_year = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 50 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
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
                      const newArr = [...experienceEntries];
                      newArr[index].salary = e.target.value;
                      setExperienceEntries(newArr);
                    }}
                    placeholder="Salary"
                    style={{ maxWidth: "200px", marginLeft: 8, marginRight: 8 }}
                  />
                  {experience.jobCategory === "fullTime" ? "in LPA" : "per hour"}
                </div>
              </div>

              {/* Pay Slip Upload */}
              <div className="form-group col-lg-6 col-md-12">
                <label>Upload Pay Slip</label>
                <input
                type="file"
                className="form-control"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const base64String = ev.target.result.split(",")[1];
                      console.log("Base64 length:", base64String.length); // Log to confirm non-zero length
                      const newArr = [...experienceEntries];
                      newArr[index].paySlip = base64String;
                      setExperienceEntries(newArr);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    const newArr = [...experienceEntries];
                    newArr[index].paySlip = null;
                    setExperienceEntries(newArr);
                  }
                }}
              />
              </div>

              {/* TEACHING FIELDS */}
              {experience.jobType === "teaching" && (
                <div className="row">
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      options={teachingDesignations}
                      value={teachingDesignations.find(
                        (opt) => opt.value === experience.teachingDesignation
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingDesignation =
                          selected?.value || "";
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Teaching designation"
                      isClearable
                    />
                  </div>
                  {experience.teachingDesignation === "Others" && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingDesignation}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingDesignation =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other designation"
                        required
                      />
                    </div>
                  )}

                  {excludeTeachingCurriculum && (
                    <div className="form-group col-lg-6 col-md-12">
                      <Select
                        options={curriculum}
                        value={curriculum.find(
                          (opt) => opt.value === experience.teachingCurriculum
                        )}
                        onChange={(selected) => {
                          const newArr = [...experienceEntries];
                          newArr[index].teachingCurriculum =
                            selected?.value || "";
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Curriculum"
                        isClearable
                      />
                    </div>
                  )}
                  {experience.teachingCurriculum === "Others" && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingCurriculum}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingCurriculum =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other curriculum"
                      />
                    </div>
                  )}

                  {/* Teaching Subjects */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={subjectsOptions}
                      value={subjectsOptions.filter((opt) =>
                        experience.teachingSubjects.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingSubjects = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Subjects you handled"
                      isClearable
                    />
                  </div>
                  {experience.teachingSubjects.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingSubjects}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingSubjects = e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other subjects"
                      />
                    </div>
                  )}

                  {/* Teaching Grades */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={grades}
                      value={grades.filter((opt) =>
                        experience.teachingGrades.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingGrades = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Grades you handled"
                      isClearable
                    />
                  </div>

                  {/* Teaching Core Expertise */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={coreExpertise}
                      value={coreExpertise.filter((opt) =>
                        experience.teachingCoreExpertise.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingCoreExpertise = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Core Expertise"
                      isClearable
                    />
                  </div>
                  {experience.teachingCoreExpertise.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingCoreExpertise}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingCoreExpertise =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other core expertise"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ADMINISTRATION FIELDS */}
              {experience.jobType === "administration" && (
                <div className="row">
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                    
                      options={adminDesignations}
                      value={adminDesignations.find(
                        (opt) => opt.value === experience.adminDesignation
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].adminDesignation = selected?.value || "";
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Designation"
                      isClearable
                    />
                  </div>
                  {experience.adminDesignation === "Others" && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherAdminDesignation}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherAdminDesignation = e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other designation"
                        required
                      />
                    </div>
                  )}

                  {excludeAdminCurriculum && (
                    <div className="form-group col-lg-6 col-md-12">
                      <Select
                        options={curriculum}
                        value={curriculum.find(
                          (opt) => opt.value === experience.adminCurriculum
                        )}
                        onChange={(selected) => {
                          const newArr = [...experienceEntries];
                          newArr[index].adminCurriculum =
                            selected?.value || "";
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Curriculum/Board/University"
                        isClearable
                      />
                    </div>
                  )}
                  {experience.adminCurriculum === "Others" && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherAdminCurriculum}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherAdminCurriculum = e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other curriculum"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TEACHING + ADMIN */}
              {experience.jobType === "teachingAndAdministration" && (
                <div className="row">
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={teachingAdminDesignations}
                      value={teachingAdminDesignations.filter((opt) =>
                        experience.teachingAdminDesignations.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingAdminDesignations = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Designation"
                      isClearable
                    />
                  </div>
                  {experience.teachingAdminDesignations.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingAdminDesignation}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingAdminDesignation =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other designation"
                        required
                      />
                    </div>
                  )}

                  {excludeTeachingAdminCurriculum && (
                    <div className="form-group col-lg-6 col-md-12">
                      <Select
                        options={curriculum}
                        value={curriculum.find(
                          (opt) =>
                            opt.value === experience.teachingAdminCurriculum
                        )}
                        onChange={(selected) => {
                          const newArr = [...experienceEntries];
                          newArr[index].teachingAdminCurriculum =
                            selected?.value || "";
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Curriculum"
                        isClearable
                      />
                    </div>
                  )}
                  {experience.teachingAdminCurriculum === "Others" && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingAdminCurriculum}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingAdminCurriculum =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other curriculum"
                      />
                    </div>
                  )}

                  {/* Teaching + Admin Subjects */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={subjectsOptions}
                      value={subjectsOptions.filter((opt) =>
                        experience.teachingAdminSubjects.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingAdminSubjects = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Subjects you handled"
                      isClearable
                    />
                  </div>
                  {experience.teachingAdminSubjects.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingAdminSubjects}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingAdminSubjects = e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other subjects"
                      />
                    </div>
                  )}

                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={grades}
                      value={grades.filter((opt) =>
                        experience.teachingAdminGrades.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingAdminGrades = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Grades you handled"
                      isClearable
                    />
                  </div>

                  {/* Teaching + Admin Core Expertise */}
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      options={coreExpertise}
                      value={coreExpertise.filter((opt) =>
                        experience.teachingAdminCoreExpertise.includes(opt.value)
                      )}
                      onChange={(selected) => {
                        const newArr = [...experienceEntries];
                        newArr[index].teachingAdminCoreExpertise = selected
                          ? selected.map((item) => item.value)
                          : [];
                        setExperienceEntries(newArr);
                      }}
                      placeholder="Core Expertise"
                      isClearable
                    />
                  </div>
                  {experience.teachingAdminCoreExpertise.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={experience.otherTeachingAdminCoreExpertise}
                        onChange={(e) => {
                          const newArr = [...experienceEntries];
                          newArr[index].otherTeachingAdminCoreExpertise =
                            e.target.value;
                          setExperienceEntries(newArr);
                        }}
                        placeholder="Specify other core expertise"
                        required
                      />
                    </div>
                  )}
                </div>
              )}

              {/* NON-EDUCATION FIELDS */}
              {experience.jobType === "nonEducation" && (
                <div className="row">
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      placeholder="Designation"
                      className="form-control"
                      maxLength="20"
                      value={experience.designation}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].designation = e.target.value;
                        setExperienceEntries(newArr);
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
                      value={experience.industryType}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].industryType = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                      required
                    />
                  </div>
                  <div className="form-group col-lg-12 col-md-12">
                    <input
                      type="text"
                      placeholder="Work Profile"
                      className="form-control"
                      maxLength="40"
                      value={experience.workProfile}
                      onChange={(e) => {
                        const newArr = [...experienceEntries];
                        newArr[index].workProfile = e.target.value;
                        setExperienceEntries(newArr);
                      }}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Country / State / City */}
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  placeholder="Country"
                  options={allCountries}
                  value={experience.country}
                  onChange={(option) => {
                    const newArr = [...experienceEntries];
                    newArr[index].country = option;
                    // Reset state & city
                    newArr[index].state = null;
                    newArr[index].city = null;
                    setExperienceEntries(newArr);
                  }}
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  placeholder="State / UT"
                  options={
                    experience.country
                      ? csc.getStatesOfCountry(experience.country.value).map((st) => ({
                          value: st.id,
                          label: st.name
                        }))
                      : []
                  }
                  value={experience.state}
                  onChange={(option) => {
                    const newArr = [...experienceEntries];
                    newArr[index].state = option;
                    newArr[index].city = null;
                    setExperienceEntries(newArr);
                  }}
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  placeholder="City"
                  options={
                    experience.state
                      ? csc.getCitiesOfState(experience.state.value).map((ct) => ({
                          value: ct.id,
                          label: ct.name
                        }))
                      : []
                  }
                  value={experience.city}
                  onChange={(option) => {
                    const newArr = [...experienceEntries];
                    newArr[index].city = option;
                    setExperienceEntries(newArr);
                  }}
                />
              </div>

              {/* Job Process */}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="form-select"
                  value={experience.jobProcess}
                  onChange={(e) => {
                    const newArr = [...experienceEntries];
                    newArr[index].jobProcess = e.target.value;
                    setExperienceEntries(newArr);
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
        );
      })}

      {/* Button to Add More Experiences */}
      <div className="add-experience-btn-wrapper">
        <button
          type="button"
          className="theme-btn btn-style-three"
          onClick={addNewExperience}
        >
          Add Experience Details +
        </button>
      </div>

      {/* Other Teaching Experiences Table */}
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
                { key: "edTechCompany", label: "Ed. Tech company" },
                { key: "online", label: "Online" },
                { key: "coachingTuition", label: "Coaching / Tuition Centers" },
                { key: "groupTuitions", label: "Group Tuitions" },
                { key: "privateTuitions", label: "Private Tuitions" },
                { key: "homeTuitions", label: "Home Tuitions" }
              ].map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>
                    <div className="radio-group" style={{ display: "flex", gap: 10 }}>
                      <div>
                        <input
                          type="radio"
                          name={key}
                          value="yes"
                          checked={otherTeachingExp[key] === true}
                          onChange={() =>
                            setOtherTeachingExp((prev) => ({
                              ...prev,
                              [key]: true
                            }))
                          }
                        />
                        <span style={{ marginLeft: 5 }}>Yes</span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name={key}
                          value="no"
                          checked={otherTeachingExp[key] === false}
                          onChange={() =>
                            setOtherTeachingExp((prev) => ({
                              ...prev,
                              [key]: false
                            }))
                          }
                        />
                        <span style={{ marginLeft: 5 }}>No</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="theme-btn btn-style-three"
        onClick={submitExperienceData}
      >
        Save Experience Details
      </button>
    </div>
  );
};

export default Experience;