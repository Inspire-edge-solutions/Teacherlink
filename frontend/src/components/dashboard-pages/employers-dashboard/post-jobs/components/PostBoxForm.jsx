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
import "./postJobs.css";

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
          <div className="input-wrapper">
          <input
            type="text"
            name="address"
            placeholder="Find On Map"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <span className="custom-tooltip">Find On Map</span>
          </div>
        </div>
        <div className="form-group col-lg-3 col-md-12 mb-3">
          <div className="input-wrapper">
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
          <span className="custom-tooltip">Latitude</span>
          </div>
        </div>
        <div className="form-group col-lg-3 col-md-12 mb-3">
          <div className="input-wrapper">
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
          <span className="custom-tooltip">Longitude</span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 mb-3">
          <div className="input-wrapper">
          <button className="theme-btn btn-style-three">
            Search Location
          </button>
          <span className="custom-tooltip">Search Location</span>
          </div>
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
      import.meta.env.VITE_DEV1_API + '/languages'
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
      import.meta.env.VITE_DEV1_API + '/education-data'
    );
    setSubjectsList(response.data);
  } catch (error) {
    console.error("Error fetching subjects:", error);
  }
};

  const fetchDesignations = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_DEV1_API + '/constants'
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
  const [selectedJobCategory, setSelectedJobCategory] = useState('');

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
  const [selectedJobSubCategory, setSelectedJobSubCategory] = useState([]);
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
  const jobCategoryOptions = [
    { value: 'fullTime', label: 'Full Time' },
    { value: 'fullPart', label: 'Full Time / Part Time' },
    { value: 'partTime', label: 'Part Time' },
    { value: 'tuitions', label: 'Tuitions' }
  ];
  const handleJobCategoryChange = (value) => {
    setSelectedJobCategory(value);
    setJobCategory(value);
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
    { value: 'Week days', label: 'Week days' },
    { value: 'All days', label: 'All days' },
    { value: 'week ends', label: 'Week ends' },
    { value: 'Vacations', label: 'Vacations' }
    ],
    job_process: [
    { value: 'Regular', label: 'Regular (Offline)' },
    { value: 'Online', label: 'Online' },
    { value: 'Hybrid', label: 'Hybrid' }
    ],
    job_sub_category: [
    { value: 'Online', label: 'Online' },
    { value: 'tuition Center', label: 'Tuition Center' },
    { value: 'Group tuition', label: 'Group tuition' },
    { value: 'Private tuitions', label: 'Private tuitions' },
    { value: 'Home Tuitions', label: 'Home Tuitions' }
    ],
    selection_process: [
      { value: 'Demo', label: 'Demo' },
      { value: 'Written test', label: 'Written test' },
      { value: 'Personal Interview', label: 'Personal Interview' },
      { value: 'Subject Interview', label: 'Subject Interview' },
      { value: 'HR interview', label: 'HR interview' },
      { value: 'Management Interview', label: 'Management Interview' },
      { value: 'Online', label: 'Online' },
      { value: 'Offline', label: 'Offline' },
      { value: 'Hybrid', label: 'Hybrid' }
    ],
    tution_types: [
      { value: "Home Tuitions Offline (One-One at students home)", label: "Home Tuitions Offline (One-One at students home)" },
      { value: "Private Tuitions Offline (One-One at teachers home)", label: "Private Tuitions Offline (One-One at teachers home)" },
      { value: "Group Tuitions Offline (at teachers home)", label: "Group Tuitions Offline (at teachers home)" },
      { value: "Private Tuitions Online (One-One)", label: "Private Tuitions Online (One-One)" },
      { value: "Group Tuitions Online (from teacher as tuitions)", label: "Group Tuitions Online (from teacher as tuitions)" }
    ],
   
    computer_skills: [
    { value: 'basic', label: 'Basic Knowledge' },
    { value: 'word', label: 'Word' },
    { value: 'excel', label: 'Excel' },
    { value: 'ppt', label: 'PPT' },
    { value: 'erp', label: 'ERP' },
    { value: 'tally', label: 'Tally' },
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
      job_sub_category: selectedJobSubCategory.map((opt) => opt.value),
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
    <div className="default-form">
    <div className="row">
      <div className="form-group col-lg-12">
      
        <div className="form-check form-check-inline d-flex justify-content-between flex-wrap">
        <h6>Job Category:</h6>
          {jobCategoryOptions.map((option) => (
            <div key={option.value} className="form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id={option.value}
                name="jobCategory"
                value={option.value}
                checked={selectedJobCategory === option.value}
                onChange={(e) => handleJobCategoryChange(e.target.value)}
                required
              />
              <label className="form-check-label" htmlFor={option.value}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
        </div>
       {/* ---------- Basic Job Info Section ---------- */}
          <div className="row" onSubmit={handleSubmit}>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                  required
                />
                <span className="custom-tooltip">Job Title</span>
              </div>
              </div>

              {jobCategory === "tuitions" && (
                  <div className="form-group col-lg-6 col-md-12">
                    <div className="input-wrapper">
                    <Select
                      isMulti
                      options={multiSelectOptions.tution_types}
                      value={selectedTutionTypes}
                      onChange={setSelectedTutionTypes}
                      menuPortalTarget={document.body}
                      styles={selectMenuPortalStyles}
                      placeholder="Tution Types"
                    />
                    <span className="custom-tooltip">Tution Types</span>
                  </div>
                  </div>
                )}

                 {/* Qualification Multi-Select */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  options={qualifications}
                  value={selectedQualifications}
                  onChange={setSelectedQualifications}
                  placeholder="Qualification(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                  className="custom-select required"
                />
                <span className="custom-tooltip">Qualification(s)</span>
              </div>
              </div>
              {/* Core Subjects Multi-Select */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  options={coreExpertise}
                  value={selectedCoreSubjects}
                  onChange={setSelectedCoreSubjects}
                  placeholder="Core Subject(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                    className="custom-select required"
                />
                <span className="custom-tooltip">Core Subject(s)</span>
              </div>
              </div>
              {/* Optional Subject Multi-Select */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <Select
                  isMulti
                  options={subjectsList}
                  value={selectedOptionalSubject}
                  onChange={setSelectedOptionalSubject}
                  placeholder="Optional Subject(s)"
                  menuPortalTarget={document.body}
                  styles={selectMenuPortalStyles}
                />
                <span className="custom-tooltip">Optional Subject(s)</span>
              </div>
              </div>

               {/* ---------- Experience Sections ---------- */}
               <div className="row g-3 align-items-end">
              <h6>Experience</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={totalExpMinYears}
                    onChange={setTotalExpMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={totalExpMinMonths}
                    onChange={setTotalExpMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={totalExpMaxYears}
                    onChange={setTotalExpMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={totalExpMaxMonths}
                    onChange={setTotalExpMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
            </div>

            {/* Teaching Experience */}
              <div className="row g-3 align-items-end">
              <h6>Teaching Experience</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={teachingExpMinYears}
                    onChange={setTeachingExpMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={teachingExpMinMonths}
                    onChange={setTeachingExpMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={teachingExpMaxYears}
                    onChange={setTeachingExpMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={teachingExpMaxMonths}
                    onChange={setTeachingExpMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>
            

            {/* Education - Teaching (Full Time) */}
              <div className="row g-3 align-items-end">
              <h6>Education - Teaching (Full Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduTeachFullMinYears}
                    onChange={setEduTeachFullMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduTeachFullMinMonths}
                    onChange={setEduTeachFullMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduTeachFullMaxYears}
                    onChange={setEduTeachFullMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduTeachFullMaxMonths}
                    onChange={setEduTeachFullMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

            {/* Education - Teaching (Part Time) */}
              <div className="row g-3 align-items-end">
              <h6>Education - Teaching (Part Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduTeachPartMinYears}
                    onChange={setEduTeachPartMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduTeachPartMinMonths}
                    onChange={setEduTeachPartMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduTeachPartMaxYears}
                    onChange={setEduTeachPartMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduTeachPartMaxMonths}
                    onChange={setEduTeachPartMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

            {/* Education - Administration (Full Time) */}
              <div className="row g-3 align-items-end">
              <h6>Education - Administration (Full Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduAdminFullMinYears}
                    onChange={setEduAdminFullMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduAdminFullMinMonths}
                    onChange={setEduAdminFullMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduAdminFullMaxYears}
                    onChange={setEduAdminFullMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduAdminFullMaxMonths}
                    onChange={setEduAdminFullMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

            {/* Education - Administration (Part Time) */}
              <div className="row g-3 align-items-end">
              <h6>Education - Administration (Part Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduAdminPartMinYears}
                    onChange={setEduAdminPartMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduAdminPartMinMonths}
                    onChange={setEduAdminPartMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={eduAdminPartMaxYears}
                    onChange={setEduAdminPartMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={eduAdminPartMaxMonths}
                    onChange={setEduAdminPartMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

            {/* Non-Education - Any Role (Full Time) */}
              <div className="row g-3 align-items-end">
              <h6>Non-Education - Any Role (Full Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={nonEduFullMinYears}
                    onChange={setNonEduFullMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={nonEduFullMinMonths}
                    onChange={setNonEduFullMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={nonEduFullMaxYears}
                    onChange={setNonEduFullMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={nonEduFullMaxMonths}
                    onChange={setNonEduFullMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

            {/* Non-Education - Any Role (Part Time) */}
              <div className="row g-3 align-items-end">
              <h6>Non-Education - Any Role (Part Time)</h6>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={nonEduPartMinYears}
                    onChange={setNonEduPartMinYears}
                    placeholder="Min Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={nonEduPartMinMonths}
                    onChange={setNonEduPartMinMonths}
                    placeholder="Min Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Min Months</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={yearOptions}
                    value={nonEduPartMaxYears}
                    onChange={setNonEduPartMaxYears}
                    placeholder="Max Years"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Years</span>
                </div>
                </div>
                <div className="form-group col-md-3">
                  <div className="input-wrapper">
                  <Select
                    options={monthOptions}
                    value={nonEduPartMaxMonths}
                    onChange={setNonEduPartMaxMonths}
                    placeholder="Max Months"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">Max Months</span>
                </div>
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="number"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    placeholder="Minimum Salary"
                    required
                  />
                  <span className="custom-tooltip">Minimum Salary</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="number"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    placeholder="Maximum Salary"
                  />
                  <span className="custom-tooltip">Maximum Salary</span>
                </div>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    options={allCountries}
                    value={domicileCountry}
                    onChange={handleDomicileCountryChange}
                    placeholder="Domicile Country"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Domicile Country</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    options={mapStatesOfCountry(domicileCountry?.value)}
                    value={domicileState}
                    onChange={handleDomicileStateChange}
                    placeholder="Domicile State/UT"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    className="required"
                  />
                  <span className="custom-tooltip">Domicile State/UT</span>
                </div>
                </div>
                  {/* Location (General) as user text */}
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="Location (General)"
                  value={locationGeneral}
                  onChange={(e) => setLocationGeneral(e.target.value)}
                  required  
                />
                <span className="custom-tooltip">Location (General)</span>
                </div>
              </div>
            
 {/* ---------- Multi-Select Fields ---------- */}
                  <div className="form-group col-lg-6 col-md-12"> 
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={designations}
                    value={selectedDesignations}
                    onChange={setSelectedDesignations}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Designations"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Designations</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={designatedGrades}
                    value={selectedDesignatedGrades}
                    onChange={setSelectedDesignatedGrades}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Designated Grades"
                    className="custom select required"
                  />
                  <span className="custom-tooltip">Designated Grades</span>
                </div>
                </div>
              
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={curriculum}
                    value={selectedCurriculum}
                    onChange={setSelectedCurriculum}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Curriculum"
                  />
                  <span className="custom-tooltip">Curriculum</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={subjectsList}
                    value={selectedSubjects}
                    onChange={setSelectedSubjects}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Subjects"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Subjects</span>
                </div>
                </div>
              
              
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={coreExpertise}
                    value={selectedCoreExpertise}
                    onChange={setSelectedCoreExpertise}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Core Expertise"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Core Expertise</span>
                </div>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={multiSelectOptions.job_shifts}
                    value={selectedJobShifts}
                    onChange={setSelectedJobShifts}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Job Shifts"
                  className="custom-select required"
                  />
                  <span className="custom-tooltip">Job Shifts</span>
                </div>
                </div>
             
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={multiSelectOptions.job_process}
                    value={selectedJobProcess}
                    onChange={setSelectedJobProcess}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Job Process"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Job Process</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={multiSelectOptions.job_sub_category}
                    value={selectedJobSubCategory}
                    onChange={setSelectedJobSubCategory}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Job Sub Category"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Job Sub Category</span>
                </div>
                </div>

              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="number"
                  value={noOfOpening}
                  onChange={(e) => setNoOfOpening(e.target.value)}
                  placeholder="Enter number of openings"
                  />
                <span className="custom-tooltip">Number of Openings</span>
                </div>
              </div>
              <div className="form-group col-lg-12 col-md-12">
                <div className="input-wrapper">
                <textarea
                  rows={1}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Enter job description"
                />
                <span className="custom-tooltip">Job Description</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                <input
                  type="text"
                  value={joiningDate}
                  placeholder="Joining Date"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      e.target.type = "text";
                    }
                  }}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
                <span className="custom-tooltip">Joining Date</span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <div className="input-wrapper">
                  <Select
                    isMulti
                    options={multiSelectOptions.selection_process}
                    value={selectedSelectionProcess}
                    onChange={setSelectedSelectionProcess}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Selection Process"
                    className="custom-select required"
                  />
                  <span className="custom-tooltip">Selection Process</span>
                </div>
                </div>
              
            {/* ---------- Additional Preferences Section ---------- */}
            <h6>Preferred candidate profile</h6>
            <div className="form-group col-lg-6 col-md-12">
              <div className="input-wrapper">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="custom-tooltip">Gender</span>
                </div>
              </div>
              
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="number"
                    value={minimumAge}
                    onChange={(e) => setMinimumAge(e.target.value)}
                    placeholder="Minimum Age"
                  />
                  <span className="custom-tooltip">Minimum Age</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <input
                    type="number"
                    value={maximumAge}
                    onChange={(e) => setMaximumAge(e.target.value)}
                    placeholder="Maximum Age"
                  />
                  <span className="custom-tooltip">Maximum Age</span>
                </div>
                </div>
{/* ---------- Main Location (ID-based) ---------- */}
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    options={allCountries}
                    value={mainCountry}
                    onChange={handleMainCountryChange}
                    placeholder="Country"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}                  
                  />
                  <span className="custom-tooltip">Country</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    options={mapStatesOfCountry(mainCountry?.value)}
                    value={mainState}
                    onChange={handleMainStateChange}
                    placeholder="State / UT"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                  />
                  <span className="custom-tooltip">State / UT</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    options={mapCitiesOfState(mainState?.value)}
                    value={mainCity}
                    onChange={(option) => setMainCity(option)}
                    placeholder="City"
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    />
                  <span className="custom-tooltip">City</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={languagesSpeak}
                    value={selectedLanguageSpeak}
                    onChange={setSelectedLanguageSpeak}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Languages-Speak"
                  />
                  <span className="custom-tooltip">Languages-Speak</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={languagesRead}
                    value={selectedLanguageRead}
                    onChange={setSelectedLanguageRead}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Languages-Read"
                  />
                  <span className="custom-tooltip">Languages-Read</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={languagesWrite}
                    value={selectedLanguageWrite}
                    onChange={setSelectedLanguageWrite}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles} 
                    placeholder="Languages-Write"
                  />
                  <span className="custom-tooltip">Languages-Write</span>
                </div>
                </div>
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <Select
                    isMulti
                    options={multiSelectOptions.computer_skills}
                    value={selectedComputerSkills}
                    onChange={setSelectedComputerSkills}
                    menuPortalTarget={document.body}
                    styles={selectMenuPortalStyles}
                    placeholder="Computer Skills"
                  />
                  <span className="custom-tooltip">Computer Skills</span>
                </div>
                </div>

          <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <h6>Knowledge of Accounting Process?</h6>
                    <input
                      type="radio"
                      className="radio-option"
                      name="accProcess"
                      id="accYes"
                      value="Yes"
                      checked={knowledgeOfAccProcess === "Yes"}
                      onChange={(e) => setKnowledgeOfAccProcess(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="accYes">
                      Yes
                    </label>
                  
                  <input
                    type="radio"
                    className="radio-option"
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
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                  >
                    <option value="">Notice Period</option>
                    <option value="<7">{'<'} 7 days</option>
                    <option value="<15">{'<'} 15 days</option>
                    <option value="<30">{'<'} 1 month</option>
                    <option value=">30">{'>'} 1 Month</option>
                  </select>
                  <span className="custom-tooltip">Notice Period</span>
                </div>
                </div>

          
                <div className="form-group col-lg-6 col-md-12">
                  <div className="input-wrapper">
                  <select
                    className="form-select"
                    value={jobSearchStatus}
                    onChange={(e) => setJobSearchStatus(e.target.value)}
                  >
                    <option value="" disabled>Job Search Status</option>
                    <option value="active">Actively Searching Jobs</option>
                    <option value="casual">Casually Exploring Jobs</option>
                    <option value="not_looking">Not looking for Jobs</option>
                  </select>
                  <span className="custom-tooltip">Job Search Status</span>
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
            <div className="form-group col-lg-12 col-md-12 text-center">
              <button type="submit" className="theme-btn btn-style-one">
                Post Job
              </button>
            </div>
          </div>
        </div>
  );
};

export default PostBoxForm;
