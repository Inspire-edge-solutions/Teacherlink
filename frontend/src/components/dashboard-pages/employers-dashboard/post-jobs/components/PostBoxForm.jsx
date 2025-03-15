// import Category from "./Category";


// const PostBoxForm = () => {
 

//   return (
//     <form className="default-form">
//       <div className="row">
        
//         <Category/>

//       </div>
//       <div className="form-group col-lg-12 col-md-12 text-right">
//         <button className="theme-btn btn-style-one">Post Job</button>
//       </div>
//     </form>
//   );
// };

// export default PostBoxForm;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import csc from "countries-states-cities";
import axios from "axios";
import Map from "../../../Map"; // Adjust path as needed

//------------------------------------------------
// 1) Helper functions: map countries/states/cities by ID
//------------------------------------------------
const mapAllCountries = () =>
  csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name
  }));

const mapStatesOfCountry = (countryId) =>
  countryId
    ? csc.getStatesOfCountry(countryId).map((state) => ({
        value: state.id,
        label: state.name
      }))
    : [];

const mapCitiesOfState = (stateId) =>
  stateId
    ? csc.getCitiesOfState(stateId).map((city) => ({
        value: city.id,
        label: city.name
      }))
    : [];

//------------------------------------------------
// 2) Custom styles for React-Select to fix overlap
//    by giving the menu a high z-index and portaling to <body>.
//------------------------------------------------
const selectMenuPortalStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999 // ensure the dropdown is above map controls
  })
};

//------------------------------------------------
// 3) LocationMap component with PropTypes
//------------------------------------------------
const LocationMap = ({
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude
}) => {
  return (
    <div className="mb-4">
      <div className="row">
        <div className="form-group col-lg-6 col-md-12 mb-3">
          <label>Find On Map</label>
          <input
            type="text"
            name="address"
            className="form-control"
            placeholder="13/2, Standage road, Pulikeshi nagar, Bengaluru..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group col-lg-3 col-md-12 mb-3">
          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            className="form-control"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className="form-group col-lg-3 col-md-12 mb-3">
          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            className="form-control"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div className="form-group col-lg-12 col-md-12 mb-3">
          <button className="theme-btn btn-style-three btn btn-primary">
            Search Location
          </button>
        </div>
        <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LocationMap.propTypes = {
  address: PropTypes.string.isRequired,
  setAddress: PropTypes.func.isRequired,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setLatitude: PropTypes.func.isRequired,
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setLongitude: PropTypes.func.isRequired
};

//------------------------------------------------
// 4) Main PostBoxForm component
//------------------------------------------------
const PostBoxForm = () => {
  //-------------- API Data States --------------
  const [languagesSpeak, setLanguagesSpeak] = useState([]);
  const [languagesRead, setLanguagesRead] = useState([]);
  const [languagesWrite, setLanguagesWrite] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [designatedGrades, setDesignatedGrades] = useState([]);
  const [coreExpertise, setCoreExpertise] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  //-------------- Fetch API Data --------------
const languageList = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_LANGUAGE_API
    );
    const transformedData = response.data.filter((item) => item.category === "languages in India") || [];
    setLanguagesSpeak(transformedData);
    setLanguagesRead(transformedData);
    setLanguagesWrite(transformedData);
  } catch (error) {
    console.error("Error fetching languages:", error);
  }
};

const subjectList = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_EDUCATION_API
    );
    setSubjectsList(response.data);
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_CONSTANTS_API
      );
      
      const transformedData = response.data.map((item) => ({
        category: item.category,
        value: item.value,
        label: item.label
      }));
      
      setDesignations(
        transformedData.filter((item) => item.category === "Administration") || []
      );
      setCoreExpertise(
        transformedData.filter((item) => item.category === "Core Expertise") || []
      );
      setDesignatedGrades(
        transformedData.filter((item) => item.category === "Grades") || []
      );
      setCurriculum(
        transformedData.filter((item) => item.category === "Curriculum") || []
      );
      setQualifications(
        transformedData.filter((item) => item.category === "Degrees" || item.category === "MasterDegree") || []
      );
        
    } catch (error) {
      console.error("Error fetching drop down data list:", error);
    }
  };

  useEffect(() => {
    fetchDesignations();
    languageList();
    subjectList();
  }, []);
  
  //-------------- Radio Buttons (job_type) --------------
  const [jobCategory, setJobCategory] = useState("full_time");

  //-------------- Basic Job Info --------------
  const [jobTitle, setJobTitle] = useState("");
  const [noOfOpening, setNoOfOpening] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // Qualification (multi-select)
  const [selectedQualifications, setSelectedQualifications] = useState([]);

  //-------------- New Multi-Select Fields for Subjects --------------
  const [selectedCoreSubjects, setSelectedCoreSubjects] = useState([]);
  const [selectedOptionalSubject, setSelectedOptionalSubject] = useState([]);

  //-------------- Additional Preferences --------------
  const [optionalSubject, setOptionalSubject] = useState("");
  const [knowledgeOfAccProcess, setKnowledgeOfAccProcess] = useState("No");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [jobSearchStatus, setJobSearchStatus] = useState("");
  const [gender, setGender] = useState("");
  const [minimumAge, setMinimumAge] = useState("");
  const [maximumAge, setMaximumAge] = useState("");

  //-------------- Domicile (ID-based) --------------
  const [domicileCountry, setDomicileCountry] = useState(null);
  const [domicileState, setDomicileState] = useState(null);

  //-------------- Location (General) as user text --------------
  const [locationGeneral, setLocationGeneral] = useState("");

  //-------------- Map fields --------------
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  //-------------- Main Location: Country/State/City (ID-based) --------------
  const [mainCountry, setMainCountry] = useState(null);
  const [mainState, setMainState] = useState(null);
  const [mainCity, setMainCity] = useState(null);

  //-------------- Experience Fields --------------
  const [totalExpMinYears, setTotalExpMinYears] = useState(null);
  const [totalExpMinMonths, setTotalExpMinMonths] = useState(null);
  const [totalExpMaxYears, setTotalExpMaxYears] = useState(null);
  const [totalExpMaxMonths, setTotalExpMaxMonths] = useState(null);

  const [teachingExpMinYears, setTeachingExpMinYears] = useState(null);
  const [teachingExpMinMonths, setTeachingExpMinMonths] = useState(null);
  const [teachingExpMaxYears, setTeachingExpMaxYears] = useState(null);
  const [teachingExpMaxMonths, setTeachingExpMaxMonths] = useState(null);

  const [eduTeachFullMinYears, setEduTeachFullMinYears] = useState(null);
  const [eduTeachFullMinMonths, setEduTeachFullMinMonths] = useState(null);
  const [eduTeachFullMaxYears, setEduTeachFullMaxYears] = useState(null);
  const [eduTeachFullMaxMonths, setEduTeachFullMaxMonths] = useState(null);

  const [eduTeachPartMinYears, setEduTeachPartMinYears] = useState(null);
  const [eduTeachPartMinMonths, setEduTeachPartMinMonths] = useState(null);
  const [eduTeachPartMaxYears, setEduTeachPartMaxYears] = useState(null);
  const [eduTeachPartMaxMonths, setEduTeachPartMaxMonths] = useState(null);

  const [eduAdminFullMinYears, setEduAdminFullMinYears] = useState(null);
  const [eduAdminFullMinMonths, setEduAdminFullMinMonths] = useState(null);
  const [eduAdminFullMaxYears, setEduAdminFullMaxYears] = useState(null);
  const [eduAdminFullMaxMonths, setEduAdminFullMaxMonths] = useState(null);

  const [eduAdminPartMinYears, setEduAdminPartMinYears] = useState(null);
  const [eduAdminPartMinMonths, setEduAdminPartMinMonths] = useState(null);
  const [eduAdminPartMaxYears, setEduAdminPartMaxYears] = useState(null);
  const [eduAdminPartMaxMonths, setEduAdminPartMaxMonths] = useState(null);

  const [nonEduFullMinYears, setNonEduFullMinYears] = useState(null);
  const [nonEduFullMinMonths, setNonEduFullMinMonths] = useState(null);
  const [nonEduFullMaxYears, setNonEduFullMaxYears] = useState(null);
  const [nonEduFullMaxMonths, setNonEduFullMaxMonths] = useState(null);

  const [nonEduPartMinYears, setNonEduPartMinYears] = useState(null);
  const [nonEduPartMinMonths, setNonEduPartMinMonths] = useState(null);
  const [nonEduPartMaxYears, setNonEduPartMaxYears] = useState(null);
  const [nonEduPartMaxMonths, setNonEduPartMaxMonths] = useState(null);

  //-------------- Multi-Select Fields --------------
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectedDesignatedGrades, setSelectedDesignatedGrades] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCoreExpertise, setSelectedCoreExpertise] = useState([]);
  const [selectedJobShifts, setSelectedJobShifts] = useState([]);
  const [selectedJobProcess, setSelectedJobProcess] = useState([]);
  const [selectedJobSubProcess, setSelectedJobSubProcess] = useState([]);
  const [selectedSelectionProcess, setSelectedSelectionProcess] = useState([]);
  const [selectedTutionTypes, setSelectedTutionTypes] = useState([]);
  const [selectedLanguageSpeak, setSelectedLanguageSpeak] = useState([]);
  const [selectedLanguageRead, setSelectedLanguageRead] = useState([]);
  const [selectedLanguageWrite, setSelectedLanguageWrite] = useState([]);
  const [selectedComputerSkills, setSelectedComputerSkills] = useState([]);

  //-------------- All Countries for ID-based approach --------------
  const allCountries = mapAllCountries(); // for both main & domicile

  //-------------- MAIN Country => reset State/City --------------
  const handleMainCountryChange = (option) => {
    setMainCountry(option);
    setMainState(null);
    setMainCity(null);
  };

  //-------------- MAIN State => reset City --------------
  const handleMainStateChange = (option) => {
    setMainState(option);
    setMainCity(null);
  };

  //-------------- DOMICILE Country => reset State --------------
  const handleDomicileCountryChange = (option) => {
    setDomicileCountry(option);
    setDomicileState(null);
  };

  //-------------- DOMICILE State --------------
  const handleDomicileStateChange = (option) => {
    setDomicileState(option);
  };

  //-------------- Radio jobCategory --------------
  const handleJobCategoryChange = (e) => {
    setJobCategory(e.target.value);
  };

  //-------------- Year/Month Options --------------
  const yearOptions = Array.from({ length: 12 }, (_, i) => {
    const text = `${i + 1} year${i + 1 > 1 ? "s" : ""}`;
    return { value: text, label: text };
  });
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const text = `${i} month${i !== 1 ? "s" : ""}`;
    return { value: text, label: text };
  });

  //-------------- Multi-Select Options --------------
  const multiSelectOptions = {
    job_shifts: [
      { value: "morning", label: "Morning" },
      { value: "evening", label: "Evening" }
    ],
    job_process: [
      { value: "online", label: "Online" },
      { value: "offline", label: "Offline" }
    ],
    job_sub_process: [
      { value: "interview", label: "Interview" },
      { value: "written", label: "Written Test" }
    ],
    selection_process: [
      { value: "aptitude", label: "Aptitude Test" },
      { value: "group", label: "Group Discussion" }
    ],
    tution_types: [
      { value: "full_time", label: "Full Time" },
      { value: "part_time", label: "Part Time" }
    ],
   
    
    computer_skills: [
      { value: "excel", label: "Excel" },
      { value: "word", label: "Word" },
      { value: "powerpoint", label: "PowerPoint" }
    ]
  };

  //-------------- Handle Form Submission (with Axios POST) --------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) Construct the form data object
    const formData = {
      // Job Info
      job_type: jobCategory,
      job_title: jobTitle,
      no_of_opening: noOfOpening,
      job_description: jobDescription,
      joining_date: joiningDate,
      min_salary: minSalary,
      max_salary: maxSalary,

      // Qualifications & Subjects (store as JSON)
      qualification: selectedQualifications.map((opt) => opt.value),
      core_subjects: selectedCoreSubjects.map((opt) => opt.value),
      optional_subject: selectedOptionalSubject.map((opt) => opt.value),

      // Additional Preferences
      knowledge_of_acc_process: knowledgeOfAccProcess,
      notice_period: noticePeriod,
      job_search_status: jobSearchStatus,
      gender,
      minimum_age: minimumAge,
      maximum_age: maximumAge,

      // Domicile Location
      domicile_country: domicileCountry?.label || "",
      domicile_state_ut: domicileState?.label || "",

      // Location (General)
      location: locationGeneral,

      // Map fields
      address,
      latitude,
      longitude,

      // Experience Fields
      total_experience_min_years: totalExpMinYears?.value || "",
      total_experience_min_months: totalExpMinMonths?.value || "",
      total_experience_max_years: totalExpMaxYears?.value || "",
      total_experience_max_months: totalExpMaxMonths?.value || "",

      teaching_experience_min_years: teachingExpMinYears?.value || "",
      teaching_experience_min_months: teachingExpMinMonths?.value || "",
      teaching_experience_max_years: teachingExpMaxYears?.value || "",
      teaching_experience_max_months: teachingExpMaxMonths?.value || "",

      education_teaching_full_min_years: eduTeachFullMinYears?.value || "",
      education_teaching_full_min_months: eduTeachFullMinMonths?.value || "",
      education_teaching_full_max_years: eduTeachFullMaxYears?.value || "",
      education_teaching_full_max_months: eduTeachFullMaxMonths?.value || "",

      education_teaching_part_min_years: eduTeachPartMinYears?.value || "",
      education_teaching_part_min_months: eduTeachPartMinMonths?.value || "",
      education_teaching_part_max_years: eduTeachPartMaxYears?.value || "",
      education_teaching_part_max_months: eduTeachPartMaxMonths?.value || "",

      education_admin_full_min_years: eduAdminFullMinYears?.value || "",
      education_admin_full_min_months: eduAdminFullMinMonths?.value || "",
      education_admin_full_max_years: eduAdminFullMaxYears?.value || "",
      education_admin_full_max_months: eduAdminFullMaxMonths?.value || "",

      education_admin_part_min_years: eduAdminPartMinYears?.value || "",
      education_admin_part_min_months: eduAdminPartMinMonths?.value || "",
      education_admin_part_max_years: eduAdminPartMaxYears?.value || "",
      education_admin_part_max_months: eduAdminPartMaxMonths?.value || "",

      non_education_full_min_years: nonEduFullMinYears?.value || "",
      non_education_full_min_months: nonEduFullMinMonths?.value || "",
      non_education_full_max_years: nonEduFullMaxYears?.value || "",
      non_education_full_max_months: nonEduFullMaxMonths?.value || "",

      non_education_part_min_years: nonEduPartMinYears?.value || "",
      non_education_part_min_months: nonEduPartMinMonths?.value || "",
      non_education_part_max_years: nonEduPartMaxYears?.value || "",
      non_education_part_max_months: nonEduPartMaxMonths?.value || "",

      // Multi-select fields
      designations: selectedDesignations.map((opt) => opt.value),
      designated_grades: selectedDesignatedGrades.map((opt) => opt.value),
      curriculum: selectedCurriculum.map((opt) => opt.value),
      subjects: selectedSubjects.map((opt) => opt.value),
      core_expertise: selectedCoreExpertise.map((opt) => opt.value),
      job_shifts: selectedJobShifts.map((opt) => opt.value),
      job_process: selectedJobProcess.map((opt) => opt.value),
      job_sub_process: selectedJobSubProcess.map((opt) => opt.value),
      selection_process: selectedSelectionProcess.map((opt) => opt.value),
      tution_types:
        jobCategory === "tuitions"
          ? selectedTutionTypes.map((opt) => opt.value)
          : [],
      language_speak: selectedLanguageSpeak.map((opt) => opt.value),
      language_read: selectedLanguageRead.map((opt) => opt.value),
      language_write: selectedLanguageWrite.map((opt) => opt.value),
      computer_skills: selectedComputerSkills.map((opt) => opt.value),

      // MAIN Location (ID-based, stored as labels)
      country: mainCountry?.label || "",
      state_ut: mainState?.label || "",
      city: mainCity?.label || ""
    };

    console.log("Form Data:", formData);

    // 2) Send data to your backend using Axios POST.
    // The backend expects an array of job posts.
    try {
      const payload = [formData];
      const response = await axios.post(
        "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPostIntstitutes",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("POST response:", response.data);
      alert("Job posted successfully!");
    } catch (error) {
      console.error("Error posting job:", error);
      alert("Failed to post job. Check console for details.");
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div
        className="widget-content card"
        style={{ width: "1600px", padding: "0px 5px 3px", border:"none", bottom:"60px",boxShadow: "none" }}
      >
        <div className="card-body">
          {/* ---------- Job Category Radio Buttons ---------- */}
          <div className="mb-4">
            <h6 className="mb-3">Job Category</h6>
            <div className="form-check form-check-inline me-4">
              <input
                className="form-check-input"
                type="radio"
                name="jobCategory"
                id="fullTimeRadio"
                value="full_time"
                checked={jobCategory === "full_time"}
                onChange={handleJobCategoryChange}
              />
              <label className="form-check-label" htmlFor="fullTimeRadio">
                Full Time
              </label>
            </div>
            <div className="form-check form-check-inline me-4">
              <input
                className="form-check-input"
                type="radio"
                name="jobCategory"
                id="partTimeRadio"
                value="part_time"
                checked={jobCategory === "part_time"}
                onChange={handleJobCategoryChange}
              />
              <label className="form-check-label" htmlFor="partTimeRadio">
                Part Time
              </label>
            </div>
            <div className="form-check form-check-inline me-4">
              <input
                className="form-check-input"
                type="radio"
                name="jobCategory"
                id="fulltimeParttimeRadio"
                value="fulltime_parttime"
                checked={jobCategory === "fulltime_parttime"}
                onChange={handleJobCategoryChange}
              />
              <label className="form-check-label" htmlFor="fulltimeParttimeRadio">
                Fulltime/Part time
              </label>
            </div>
            <div className="form-check form-check-inline me-4">
              <input
                className="form-check-input"
                type="radio"
                name="jobCategory"
                id="tuitionsRadio"
                value="tuitions"
                checked={jobCategory === "tuitions"}
                onChange={handleJobCategoryChange}
              />
              <label className="form-check-label" htmlFor="tuitionsRadio">
                Tuitions
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ---------- Basic Job Info Section ---------- */}
            <div className="row">
              <h6 className="mb-3">General Information</h6>
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  className="form-control"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <label className="form-label">No. of Opening</label>
                <input
                  type="number"
                  className="form-control"
                  value={noOfOpening}
                  onChange={(e) => setNoOfOpening(e.target.value)}
                  placeholder="e.g., 5"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter job description"
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Min Salary</label>
                  <input
                    type="number"
                    className="form-control"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder="e.g., 15000"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Max Salary</label>
                  <input
                    type="number"
                    className="form-control"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    placeholder="e.g., 30000"
                  />
                </div>
              </div>
              {/* Qualification Multi-Select */}
              <div className="mb-3">
                <label className="form-label">Qualification</label>
                <Select
                  isMulti
                  options={qualifications}
                  value={selectedQualifications}
                  onChange={setSelectedQualifications}
                  placeholder="Select Qualification(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                />
              </div>
              {/* Core Subjects Multi-Select */}
              <div className="mb-3">
                <label className="form-label">Core Subjects</label>
                <Select
                  isMulti
                  options={coreExpertise}
                  value={selectedCoreSubjects}
                  onChange={setSelectedCoreSubjects}
                  placeholder="Select Core Subject(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                />
              </div>
              {/* Optional Subject Multi-Select */}
              <div className="mb-3">
                <label className="form-label">Optional Subject</label>
                <Select
                  isMulti
                  options={subjectsList}
                  value={selectedOptionalSubject}
                  onChange={setSelectedOptionalSubject}
                  placeholder="Select Optional Subject(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                />
              </div>
            </div>

            {/* ---------- Additional Preferences Section ---------- */}
            <div className="mb-4">
              <h6 className="mb-3">Additional Preferences</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label d-block">Knowledge of ACC Process?</label>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="accProcess"
                      id="accYes"
                      value="Yes"
                      checked={knowledgeOfAccProcess === "Yes"}
                      onChange={(e) => setKnowledgeOfAccProcess(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="accYes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="accProcess"
                      id="accNo"
                      value="No"
                      checked={knowledgeOfAccProcess === "No"}
                      onChange={(e) => setKnowledgeOfAccProcess(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="accNo">
                      No
                    </label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Notice Period</label>
                  <select
                    className="form-select"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                  >
                    <option value="">Notice Period</option>
                    <option value="<7">{'<'} 7 days</option>
                    <option value="<15">{'<'} 15 days</option>
                    <option value="<30">{'<'} 1 month</option>
                    <option value=">30">{'>'} 1 Month</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Search Status</label>
                  <select
                    className="form-select"
                    value={jobSearchStatus}
                    onChange={(e) => setJobSearchStatus(e.target.value)}
                  >
                    <option value="">Job Search Status</option>
                    <option value="active">Actively Searching Jobs</option>
                    <option value="casual">Casually Exploring Jobs</option>
                    <option value="not_looking">Not looking for Jobs</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">-- Select Gender --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Minimum Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={minimumAge}
                    onChange={(e) => setMinimumAge(e.target.value)}
                    placeholder="e.g., 18"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Maximum Age</label>
                  <input
                    type="number"
                    className="form-control"
                    value={maximumAge}
                    onChange={(e) => setMaximumAge(e.target.value)}
                    placeholder="e.g., 60"
                  />
                </div>
              </div>

              {/* Domicile Location */}
              <h6 className="mb-3">Domicile Location</h6>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Domicile Country</label>
                  <Select
                    options={allCountries}
                    value={domicileCountry}
                    onChange={handleDomicileCountryChange}
                    placeholder="Select Domicile Country"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Domicile State/UT</label>
                  <Select
                    options={mapStatesOfCountry(domicileCountry?.value)}
                    value={domicileState}
                    onChange={handleDomicileStateChange}
                    placeholder="Select Domicile State/UT"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>

              {/* Location (General) as user text */}
              <div className="mb-3">
                <label className="form-label">Location (General)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Any location details"
                  value={locationGeneral}
                  onChange={(e) => setLocationGeneral(e.target.value)}
                />
              </div>
            </div>

            {/* ---------- Experience Sections ---------- */}
            <div className="mb-4">
              <h6 className="mb-3">Experience</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={totalExpMinYears}
                    onChange={setTotalExpMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={totalExpMinMonths}
                    onChange={setTotalExpMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={totalExpMaxYears}
                    onChange={setTotalExpMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={totalExpMaxMonths}
                    onChange={setTotalExpMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Teaching Experience */}
            <div className="mb-4">
              <h6 className="mb-3">Teaching Experience</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={teachingExpMinYears}
                    onChange={setTeachingExpMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={teachingExpMinMonths}
                    onChange={setTeachingExpMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={teachingExpMaxYears}
                    onChange={setTeachingExpMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={teachingExpMaxMonths}
                    onChange={setTeachingExpMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Education - Teaching (Full Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Education - Teaching (Full Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={eduTeachFullMinYears}
                    onChange={setEduTeachFullMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={eduTeachFullMinMonths}
                    onChange={setEduTeachFullMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={eduTeachFullMaxYears}
                    onChange={setEduTeachFullMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={eduTeachFullMaxMonths}
                    onChange={setEduTeachFullMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Education - Teaching (Part Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Education - Teaching (Part Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={eduTeachPartMinYears}
                    onChange={setEduTeachPartMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={eduTeachPartMinMonths}
                    onChange={setEduTeachPartMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={eduTeachPartMaxYears}
                    onChange={setEduTeachPartMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={eduTeachPartMaxMonths}
                    onChange={setEduTeachPartMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Education - Administration (Full Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Education - Administration (Full Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={eduAdminFullMinYears}
                    onChange={setEduAdminFullMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={eduAdminFullMinMonths}
                    onChange={setEduAdminFullMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={eduAdminFullMaxYears}
                    onChange={setEduAdminFullMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={eduAdminFullMaxMonths}
                    onChange={setEduAdminFullMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Education - Administration (Part Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Education - Administration (Part Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={eduAdminPartMinYears}
                    onChange={setEduAdminPartMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={eduAdminPartMinMonths}
                    onChange={setEduAdminPartMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={eduAdminPartMaxYears}
                    onChange={setEduAdminPartMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={eduAdminPartMaxMonths}
                    onChange={setEduAdminPartMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Non-Education - Any Role (Full Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Non-Education - Any Role (Full Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={nonEduFullMinYears}
                    onChange={setNonEduFullMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={nonEduFullMinMonths}
                    onChange={setNonEduFullMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={nonEduFullMaxYears}
                    onChange={setNonEduFullMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={nonEduFullMaxMonths}
                    onChange={setNonEduFullMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* Non-Education - Any Role (Part Time) */}
            <div className="mb-4">
              <h6 className="mb-3">Non-Education - Any Role (Part Time)</h6>
              <div className="row g-3 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Min Years</label>
                  <Select
                    options={yearOptions}
                    value={nonEduPartMinYears}
                    onChange={setNonEduPartMinYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Min Months</label>
                  <Select
                    options={monthOptions}
                    value={nonEduPartMinMonths}
                    onChange={setNonEduPartMinMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Years</label>
                  <Select
                    options={yearOptions}
                    value={nonEduPartMaxYears}
                    onChange={setNonEduPartMaxYears}
                    placeholder="Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Max Months</label>
                  <Select
                    options={monthOptions}
                    value={nonEduPartMaxMonths}
                    onChange={setNonEduPartMaxMonths}
                    placeholder="Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Multi-Select Fields ---------- */}
            <div className="mb-4">
              <h6 className="mb-3">Multi-Select Fields</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Designations</label>
                  <Select
                    isMulti
                    options={designations}
                    value={selectedDesignations}
                    onChange={setSelectedDesignations}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Designated Grades</label>
                  <Select
                    isMulti
                    options={designatedGrades}
                    value={selectedDesignatedGrades}
                    onChange={setSelectedDesignatedGrades}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Curriculum</label>
                  <Select
                    isMulti
                    options={curriculum}
                    value={selectedCurriculum}
                    onChange={setSelectedCurriculum}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Subjects</label>
                  <Select
                    isMulti
                    options={subjectsList}
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Core Expertise</label>
                  <Select
                    isMulti
                    options={coreExpertise}
                    value={selectedCoreExpertise}
                    onChange={setSelectedCoreExpertise}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Shifts</label>
                  <Select
                    isMulti
                    options={multiSelectOptions.job_shifts}
                    value={selectedJobShifts}
                    onChange={setSelectedJobShifts}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Process</label>
                  <Select
                    isMulti
                    options={multiSelectOptions.job_process}
                    value={selectedJobProcess}
                    onChange={setSelectedJobProcess}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Sub Process</label>
                  <Select
                    isMulti
                    options={multiSelectOptions.job_sub_process}
                    value={selectedJobSubProcess}
                    onChange={setSelectedJobSubProcess}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Selection Process</label>
                  <Select
                    isMulti
                    options={multiSelectOptions.selection_process}
                    value={selectedSelectionProcess}
                    onChange={setSelectedSelectionProcess}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                {jobCategory === "tuitions" && (
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Tution Types</label>
                    <Select
                      isMulti
                      options={multiSelectOptions.tution_types}
                      value={selectedTutionTypes}
                      onChange={setSelectedTutionTypes}
                      menuPortalTarget={document.body}
                      styles={selectMenuPortalStyles}
                    />
                  </div>
                )}
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Language Speak</label>
                  <Select
                    isMulti
                    options={languagesSpeak}
                    value={selectedLanguageSpeak}
                    onChange={setSelectedLanguageSpeak}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Language Read</label>
                  <Select
                    isMulti
                    options={languagesRead}
                    value={selectedLanguageRead}
                    onChange={setSelectedLanguageRead}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Language Write</label>
                  <Select
                    isMulti
                    options={languagesWrite}
                    value={selectedLanguageWrite}
                    onChange={setSelectedLanguageWrite}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Computer Skills</label>
                  <Select
                    isMulti
                    options={multiSelectOptions.computer_skills}
                    value={selectedComputerSkills}
                    onChange={setSelectedComputerSkills}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Main Location (ID-based) ---------- */}
            <div className="mb-4">
              <h6 className="mb-3">Main Location</h6>
              <div className="row mb-4">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Country</label>
                  <Select
                    options={allCountries}
                    value={mainCountry}
                    onChange={handleMainCountryChange}
                    placeholder="Select Country"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">State / UT</label>
                  <Select
                    options={mapStatesOfCountry(mainCountry?.value)}
                    value={mainState}
                    onChange={handleMainStateChange}
                    placeholder="Select State/UT"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">City</label>
                  <Select
                    options={mapCitiesOfState(mainState?.value)}
                    value={mainCity}
                    onChange={(option) => setMainCity(option)}
                    placeholder="Select City"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Map Section ---------- */}
            <LocationMap
              address={address}
              setAddress={setAddress}
              latitude={latitude}
              setLatitude={setLatitude}
              longitude={longitude}
              setLongitude={setLongitude}
            />

            {/* ---------- Submit Button ---------- */}
            <div className="d-grid">
              <button type="submit" className="btn btn-success btn-lg">
                Post a Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostBoxForm;
