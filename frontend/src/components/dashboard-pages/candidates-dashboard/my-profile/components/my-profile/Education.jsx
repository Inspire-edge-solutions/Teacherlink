import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./profile-styles.css";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper: Convert a value to an array if needed.
const parseArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim() !== "") return val.split(",").map(s => s.trim());
  return [];
};

const Education = ({
  // Booleans to control which fields render in each section
  isEasyMode,
  grade12syllabus,
  grade12school,
  grade12percentage,
  grade12mode,
  degreeCollege,
  degreePlace,
  degreeUniversity,
  degreePercentage,
  degreeMode,
  masterCollege,
  masterPlace,
  masterUniversity,
  masterPercentage,
  masterMode,
  doctorateCollege,
  doctorateUniversity,
  doctorateMode,
  bEdCollege,
  bEdPlace,
  bEdAffiliated,
  bEdCourseDuration,
  bEdPercentage,
  bEdMode,
  certificatePlace,
  certificateCourseDuration,
  certificateSpecialization,
  certificateMode
}) => {
  // ---------- Grade 10 (Mandatory) ----------
  const [grade10Data, setGrade10Data] = useState({
    syllabus: "",
    schoolName: "",
    yearOfPassing: "",
    percentage: "",
    mode: ""
  });

  // For all other education entries (grade12, degree, etc.)
  const [additionalEducation, setAdditionalEducation] = useState([]);

  // State for dropdown options for core subjects
  const [coreSubjectsOptions, setCoreSubjectsOptions] = useState([]);

  // States for degree constants
  const [degrees, setDegrees] = useState([]);
  const [masterDegrees, setMasterDegrees] = useState([]);

  const { user } = useAuth();

  // Dropdown options
  const syllabusOptions = [
    { value: "State Board", label: "State Board" },
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "Others", label: "Others" }
  ];

  const educationModeOptions = [
    { value: "regular", label: "Regular" },
    { value: "correspondence", label: "Correspondence" },
    { value: "evening", label: "Evening" }
  ];

  const courseStatusOptions = [
    { value: "Pursuing", label: "Pursuing" },
    { value: "Completed", label: "Completed" }
  ];

  const courseDurationOptions = [
    { value: "1", label: "1 month" },
    { value: "2", label: "2 months" },
    { value: "3", label: "3 months" },
    { value: "4", label: "4 months" },
    { value: "5", label: "5 months" },
    { value: "6", label: "6 months" },
    { value: "7", label: "7 months" },
    { value: "8", label: "8 months" },
    { value: "9", label: "9 months" },
    { value: "10", label: "10 months" }
  ];

  const bEdCourseDurationOptions = [
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" },
    { value: "3", label: "3 years" },
    { value: "4", label: "4 years" }
  ];

  const dEdCourseDurationOptions = [
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" }
  ];

  const certificateCourseDurationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} months`
  }));

  // Education types for "Add More Education"
  const educationTypes = [
    { value: "grade12", label: "Grade 12", allowMultiple: false },
    { value: "degree", label: "Degree", allowMultiple: true },
    { value: "masterDegree", label: "Master Degree", allowMultiple: true },
    { value: "doctorate", label: "Doctorate", allowMultiple: false },
    { value: "nttMtt", label: "NTT/MTT", allowMultiple: false },
    { value: "dEd", label: "D.Ed/D.EID", allowMultiple: false },
    { value: "bEd", label: "B.Ed", allowMultiple: false },
    { value: "certificate", label: "Certificate/Other Course", allowMultiple: true }
  ];

  // ------------------- GET: Fetch education details -------------------
  useEffect(() => {
    if (!user?.uid) return;
    const fetchEducationDetails = async () => {
      try {
        console.log("Fetching education data with UID:", user.uid);
        const response = await axios.get(
          "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails",
          { params: { firebase_uid: user.uid } }
        );
        console.log("Raw GET response:", response.data);
        if (response.status === 200 && Array.isArray(response.data)) {
          const items = response.data;
          const newAdditionalEducation = [];
          items.forEach((item) => {
            const eduType = (item.education_type || "").trim();
            const coreSubjects = parseArray(item.coreSubjects);
            switch (eduType) {
              case "grade10":
                setGrade10Data({
                  syllabus: item.syllabus || "",
                  schoolName: item.schoolName || "",
                  yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                  percentage: item.percentage || "",
                  mode: item.mode || ""
                });
                break;
              case "grade12":
                newAdditionalEducation.push({
                  type: "grade12",
                  data: {
                    syllabus: item.syllabus || "",
                    schoolName: item.schoolName || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "degree":
                newAdditionalEducation.push({
                  type: "degree",
                  data: {
                    courseName: item.courseName || "",
                    collegeName: item.collegeName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    universityName: item.universityName || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "masterDegree":
                newAdditionalEducation.push({
                  type: "masterDegree",
                  data: {
                    courseName: item.courseName || "",
                    collegeName: item.collegeName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    universityName: item.universityName || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "doctorate":
                newAdditionalEducation.push({
                  type: "doctorate",
                  data: {
                    placeOfStudy: item.placeOfStudy || "",
                    universityName: item.universityName || "",
                    yearOfCompletion: item.yearOfCompletion ? item.yearOfCompletion.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "bEd":
                newAdditionalEducation.push({
                  type: "bEd",
                  data: {
                    instituteName: item.instituteName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    affiliatedTo: item.affiliatedTo || "",
                    courseDuration: item.courseDuration || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "dEd":
                newAdditionalEducation.push({
                  type: "dEd",
                  data: {
                    instituteName: item.instituteName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    affiliatedTo: item.affiliatedTo || "",
                    courseDuration: item.courseDuration || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    coreSubjects: coreSubjects,
                    otherSubjects: item.otherSubjects || "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "nttMtt":
                newAdditionalEducation.push({
                  type: "nttMtt",
                  data: {
                    instituteName: item.instituteName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    affiliatedTo: item.affiliatedTo || "",
                    courseDuration: item.courseDuration || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    percentage: item.percentage || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              case "certificate":
                newAdditionalEducation.push({
                  type: "certificate",
                  data: {
                    courseName: item.courseName || "",
                    placeOfStudy: item.placeOfStudy || "",
                    courseDuration: item.courseDuration || "",
                    yearOfPassing: item.yearOfPassing ? item.yearOfPassing.toString() : "",
                    specialization: item.specialization || "",
                    mode: item.mode || "",
                    courseStatus: item.courseStatus || ""
                  }
                });
                break;
              default:
                break;
            }
          });
          setAdditionalEducation(newAdditionalEducation);
          console.log("Final additionalEducation:", newAdditionalEducation);
        }
      } catch (error) {
        console.error("Error fetching education details:", error);
      }
    };
    fetchEducationDetails();
  }, [user?.uid]);

  // ------------------- Handler for Grade 10 changes -------------------
  const handleGrade10Change = (field, value) => {
    let validatedValue = value;
    if (field === "schoolName") {
      validatedValue = value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20);
    } else if (field === "yearOfPassing") {
      const minYear = new Date().getFullYear() - 14;
      const maxYear = new Date().getFullYear();
      if (Number(value) < minYear || Number(value) > maxYear) return;
    } else if (field === "percentage") {
      validatedValue = value.replace(/[^a-zA-Z0-9+%]/g, "").slice(0, 5);
    }
    setGrade10Data((prev) => ({ ...prev, [field]: validatedValue }));
  };

  // ------------------- Default data for each education type -------------------
  const getInitialDataForType = (type) => {
    switch (type) {
      case "grade12":
        return {
          syllabus: "",
          schoolName: "",
          yearOfPassing: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "degree":
        return {
          courseName: "",
          collegeName: "",
          placeOfStudy: "",
          universityName: "",
          yearOfPassing: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "masterDegree":
        return {
          courseName: "",
          collegeName: "",
          placeOfStudy: "",
          universityName: "",
          yearOfPassing: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "doctorate":
        return {
          placeOfStudy: "",
          universityName: "",
          yearOfCompletion: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "nttMtt":
        return {
          instituteName: "",
          placeOfStudy: "",
          affiliatedTo: "",
          courseDuration: "",
          yearOfPassing: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "dEd":
        return {
          instituteName: "",
          placeOfStudy: "",
          affiliatedTo: "",
          courseDuration: "",
          yearOfPassing: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "bEd":
        return {
          instituteName: "",
          placeOfStudy: "",
          affiliatedTo: "",
          courseDuration: "",
          yearOfPassing: "",
          coreSubjects: [],
          otherSubjects: "",
          percentage: "",
          mode: "",
          courseStatus: ""
        };
      case "certificate":
        return {
          courseName: "",
          placeOfStudy: "",
          courseDuration: "",
          yearOfPassing: "",
          specialization: "",
          mode: "",
          courseStatus: ""
        };
      default:
        return {};
    }
  };

  // ------------------- Handler to update data for a specific education section -------------------
  const handleEducationDataChange = (index, field, value) => {
    setAdditionalEducation((prev) => {
      const updated = [...prev];
      if (!updated[index].data) {
        updated[index].data = {};
      }
      updated[index].data[field] = value;
      return updated;
    });
  };

  // ------------------- Handler to remove an education section -------------------
  const handleRemoveEducation = (index) => {
    setAdditionalEducation((prev) => prev.filter((_, i) => i !== index));
  };

  // ------------------- Fetch subjects (for core subjects) -------------------
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_DEV1_API + "/education-data");
      const formattedSubjects = response.data.map((subject) => ({
        value: subject.value,
        label: subject.label
      }));
      setCoreSubjectsOptions(formattedSubjects);
    } catch (error) {
      console.error("Error fetching education subjects:", error);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  // ------------------- Fetch degree constants for degree and masterDegree sections -------------------
  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_DEV1_API + "/constants");
        const data = await response.json();
        const transformedData = data.map((item) => ({
          category: item.category,
          value: item.value,
          label: item.label
        }));
        setDegrees(transformedData.filter((item) => item.category === "Degrees") || []);
        setMasterDegrees(
          transformedData.filter((item) => item.category === "MasterDegree") || []
        );
      } catch (error) {
        console.error("Error fetching degree constants:", error);
      }
    };
    fetchDegrees();
  }, []);

  // For Grade 10, Degree, Master's, etc. where you need year selection
  const generateYearOptions = (startYear = 1960, endYear = new Date().getFullYear()) => {
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push(<option key={year} value={year}>{year}</option>);
    }
    return years;
  };

  // ------------------- Render education fields based on type -------------------
  const renderEducationFields = (type, data, index) => {
    switch (type) {
      case "grade12":
        return (
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <select
                className="custom-select"
                value={data.courseStatus || ""}
                onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                required
              >
                <option value="" disabled>Course Status</option>
                {courseStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            {grade12syllabus && (
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.syllabus || ""}
                  onChange={(e) => handleEducationDataChange(index, "syllabus", e.target.value)}
                  required
                >
                  <option value="" disabled>Syllabus</option>
                  {syllabusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
            {grade12school && (
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => handleEducationDataChange(index, "schoolName", e.target.value)}
                  placeholder="School Name"
                  pattern="[a-zA-Z0-9 ]*"
                  maxLength={20}
                />
              </div>
            )}
            <div className="form-group col-lg-6 col-md-12">
              <select
                value={data.yearOfPassing}
                onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                required
              >
                <option value="">Year of Passing</option>
                {generateYearOptions()}
              </select>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <Select
                isMulti
                value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                onChange={(selected) => {
                  const selectedValues = selected.map(option => option.value);
                  handleEducationDataChange(index, "coreSubjects", selectedValues);
                }}
                options={coreSubjectsOptions}
                className="custom-select required"
                placeholder="Core Subjects"
                required
              />
            </div>
            {data.coreSubjects.includes("Others") && (
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.otherSubjects}
                  onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                  placeholder="Specify other subjects"
                  required
                />
              </div>
            )}
            {grade12percentage && (
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.percentage}
                  onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                />
              </div>
            )}
            {grade12mode && (
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.mode || ""}
                  onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                  required
                >
                  <option value="" disabled>Mode of Study</option>
                  {educationModeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      case "degree":
        return (
          <div className="degree-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.courseStatus || ""}
                  onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                  required
                >
                  <option value="" disabled>Course Status</option>
                  {courseStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={degrees.find(d => d.value === data.courseName) || null}
                  onChange={(selectedOption) => handleEducationDataChange(index, "courseName", selectedOption.value)}
                  options={degrees}
                  placeholder="Degree Name"
                  className="custom-select required"
                  required
                />
              </div>
              {degreeCollege && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.collegeName}
                    onChange={(e) => handleEducationDataChange(index, "collegeName", e.target.value)}
                    placeholder="College Name"
                    pattern="[a-zA-Z0-9 ]*"
                    maxLength={20}
                  />
                </div>
              )}
              {degreePlace && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.placeOfStudy}
                    onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                    placeholder="Place of Study"
                    maxLength={20}
                    pattern="[a-zA-Z0-9 ]*"
                  />
                </div>
              )}
              {degreeUniversity && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.universityName}
                    onChange={(e) => handleEducationDataChange(index, "universityName", e.target.value)}
                    placeholder="University Name"
                    maxLength={20}
                  />
                </div>
              )}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {generateYearOptions()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className="custom-select required"
                  placeholder="Core Subjects"
                  required
                />
              </div>
              {data.coreSubjects.includes("Others") && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.otherSubjects}
                    onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                    placeholder="Specify other subjects"
                    required
                  />
                </div>
              )}
              {degreePercentage && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.percentage}
                    onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                    placeholder="Grade / Percentage"
                    pattern="[a-zA-Z0-9+%]*"
                    maxLength={5}
                  />
                </div>
              )}
              {degreeMode && (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    className="custom-select"
                    value={data.mode || ""}
                    onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                    required
                  >
                    <option value="" disabled>Mode of Study</option>
                    {educationModeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      case "masterDegree":
        return (
          <div className="master-degree-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.courseStatus || ""}
                  onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                  required
                >
                  <option value="" disabled>Course Status</option>
                  {courseStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={masterDegrees.find(d => d.value === data.courseName) || null}
                  onChange={(selectedOption) => handleEducationDataChange(index, "courseName", selectedOption.value)}
                  options={masterDegrees}
                  placeholder="Master Degree Name"
                  className="custom-select required"
                  required
                />
              </div>
              {masterCollege && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.collegeName}
                    onChange={(e) => handleEducationDataChange(index, "collegeName", e.target.value)}
                    placeholder="College Name"
                    maxLength={20}
                  />
                </div>
              )}
              {masterPlace && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.placeOfStudy}
                    onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                    placeholder="Place of Study"
                    maxLength={20}
                  />
                </div>
              )}
              {masterUniversity && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.universityName}
                    onChange={(e) => handleEducationDataChange(index, "universityName", e.target.value)}
                    placeholder="University Name"
                    maxLength={20}
                  />
                </div>
              )}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {generateYearOptions()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className="custom-select required"
                  placeholder="Core Subjects"
                  required
                />
              </div>
              {data.coreSubjects.includes("Others") && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.otherSubjects}
                    onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                    placeholder="Specify other subjects"
                    required
                  />
                </div>
              )}
              {masterPercentage && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.percentage}
                    onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                    placeholder="Grade / Percentage"
                    pattern="[a-zA-Z0-9+%]*"
                    maxLength={5}
                    required
                  />
                </div>
              )}
              {masterMode && (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    className="custom-select"
                    value={data.mode || ""}
                    onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                    required
                  >
                    <option value="" disabled>Mode of Study</option>
                    {educationModeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      case "doctorate":
        return (
          <div className="doctorate-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.courseStatus || ""}
                  onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                  required
                >
                  <option value="" disabled>Course Status</option>
                  {courseStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {doctorateCollege && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.placeOfStudy}
                    onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                    placeholder="Place of Study"
                    maxLength={20}
                  />
                </div>
              )}
              {doctorateUniversity && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.universityName}
                    onChange={(e) => handleEducationDataChange(index, "universityName", e.target.value)}
                    placeholder="University Name"
                    maxLength={20}
                  />
                </div>
              )}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfCompletion}
                  onChange={(e) => handleEducationDataChange(index, "yearOfCompletion", e.target.value)}
                  required
                >
                  <option value="">Year of Completion</option>
                  {generateYearOptions()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className="custom-select required"
                  placeholder="Core Subjects"
                  required
                />
              </div>
              {data.coreSubjects.includes("Others") && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.otherSubjects}
                    onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                    placeholder="Specify other subjects"
                    required
                  />
                </div>
              )}
              {doctorateMode && (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    className="custom-select"
                    value={data.mode || ""}
                    onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                    required
                  >
                    <option value="" disabled>Mode of Study</option>
                    {educationModeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      case "nttMtt":
        return (
          <div className="ntt-mtt-section">
            <div className="row">
              {isEasyMode ? (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    value={data.yearOfPassing}
                    onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                    required
                  >
                    <option value="">Year of Passing</option>
                    {generateYearOptions()}
                  </select>
                </div>
              ) : (
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      className="custom-select"
                      value={data.courseStatus || ""}
                      onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                      required
                    >
                      <option value="" disabled>Course Status</option>
                      {courseStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.instituteName}
                      onChange={(e) => handleEducationDataChange(index, "instituteName", e.target.value)}
                      placeholder="Institute Name"
                      maxLength={20}
                      pattern="[a-zA-Z0-9 ]*"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.placeOfStudy}
                      onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                      placeholder="Place of Study"
                      maxLength={20}
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.affiliatedTo}
                      onChange={(e) => handleEducationDataChange(index, "affiliatedTo", e.target.value)}
                      placeholder="Affiliated to / recognized by"
                      maxLength={20}
                      pattern="[a-zA-Z0-9 ]*"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      value={courseDurationOptions.find(option => option.value === data.courseDuration)}
                      onChange={(selected) => handleEducationDataChange(index, "courseDuration", selected.value)}
                      options={courseDurationOptions}
                      placeholder="Course Duration"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      value={data.yearOfPassing}
                      onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                      required
                    >
                      <option value="">Year of Passing</option>
                      {generateYearOptions()}
                    </select>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.percentage}
                      onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                      placeholder="Grade / Percentage"
                      pattern="[a-zA-Z0-9+%]*"
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      className="custom-select"
                      value={data.mode || ""}
                      onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                      required
                    >
                      <option value="" disabled>Mode of Study</option>
                      {educationModeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case "bEd":
        return (
          <div className="bed-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.courseStatus || ""}
                  onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                  required
                >
                  <option value="" disabled>Course Status</option>
                  {courseStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              {bEdCollege && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.instituteName}
                    onChange={(e) => handleEducationDataChange(index, "instituteName", e.target.value)}
                    placeholder="Institute / College name"
                    maxLength={20}
                    pattern="[a-zA-Z0-9 ]*"
                  />
                </div>
              )}
              {bEdPlace && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.placeOfStudy}
                    onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                    placeholder="Place of Study"
                    maxLength={20}
                  />
                </div>
              )}
              {bEdAffiliated && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.affiliatedTo}
                    onChange={(e) => handleEducationDataChange(index, "affiliatedTo", e.target.value)}
                    placeholder="Affiliated to / recognized by"
                    maxLength={20}
                    pattern="[a-zA-Z0-9 ]*"
                  />
                </div>
              )}
              {bEdCourseDuration && (
                <div className="form-group col-lg-6 col-md-12">
                  <Select
                    value={bEdCourseDurationOptions.find(option => option.value === data.courseDuration)}
                    onChange={(selected) => handleEducationDataChange(index, "courseDuration", selected.value)}
                    options={bEdCourseDurationOptions}
                    placeholder="Course Duration"
                  />
                </div>
              )}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {generateYearOptions()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map(option => option.value);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className="custom-select required"
                  placeholder="Core Subjects"
                  required
                />
              </div>
              {data.coreSubjects.includes("Others") && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.otherSubjects}
                    onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                    placeholder="Specify other subjects"
                    required
                  />
                </div>
              )}
              {bEdPercentage && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.percentage}
                    onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                    placeholder="Grade / Percentage"
                    pattern="[a-zA-Z0-9+%]*"
                    maxLength={5}
                  />
                </div>
              )}
              {bEdMode && (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    className="custom-select"
                    value={data.mode || ""}
                    onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                    required
                  >
                    <option value="" disabled>Mode of Study</option>
                    {educationModeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      case "certificate":
        return (
          <div className="certificate-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  className="custom-select"
                  value={data.courseStatus || ""}
                  onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                  required
                >
                  <option value="" disabled>Course Status</option>
                  {courseStatusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.courseName}
                  onChange={(e) => handleEducationDataChange(index, "courseName", e.target.value)}
                  placeholder="Course Name"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>
              {certificatePlace && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.placeOfStudy}
                    onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                    placeholder="Place of Study"
                    maxLength={20}
                  />
                </div>
              )}
              {certificateCourseDuration && (
                <div className="form-group col-lg-6 col-md-12">
                  <Select
                    value={certificateCourseDurationOptions.find(option => option.value === data.courseDuration)}
                    onChange={(selected) => handleEducationDataChange(index, "courseDuration", selected.value)}
                    options={certificateCourseDurationOptions}
                    placeholder="Course Duration"
                  />
                </div>
              )}
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {generateYearOptions()}
                </select>
              </div>
              {certificateSpecialization && (
                <div className="form-group col-lg-6 col-md-12">
                  <input
                    type="text"
                    value={data.specialization}
                    onChange={(e) => handleEducationDataChange(index, "specialization", e.target.value)}
                    placeholder="Specialization"
                    maxLength={20}
                    pattern="[a-zA-Z0-9 ]*"
                  />
                </div>
              )}
              {certificateMode && (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    className="custom-select"
                    value={data.mode || ""}
                    onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                    required
                  >
                    <option value="" disabled>Mode of Study</option>
                    {educationModeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        );
      case "dEd":
        return (
          <div className="ded-section">
            <div className="row">
              {isEasyMode ? (
                <div className="form-group col-lg-6 col-md-12">
                  <select
                    value={data.yearOfPassing}
                    onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                    required
                  >
                    <option value="">Year of Passing</option>
                    {generateYearOptions()}
                  </select>
                </div>
              ) : (
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      className="custom-select"
                      value={data.courseStatus || ""}
                      onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                      required
                    >
                      <option value="" disabled>Course Status</option>
                      {courseStatusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.instituteName}
                      onChange={(e) => handleEducationDataChange(index, "instituteName", e.target.value)}
                      placeholder="Institute / College name"
                      maxLength={20}
                      pattern="[a-zA-Z0-9 ]*"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.placeOfStudy}
                      onChange={(e) => handleEducationDataChange(index, "placeOfStudy", e.target.value)}
                      placeholder="Place of Study"
                      maxLength={20}
                      pattern="[a-zA-Z0-9 ]*"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.affiliatedTo}
                      onChange={(e) => handleEducationDataChange(index, "affiliatedTo", e.target.value)}
                      placeholder="Affiliated to / recognized by"
                      maxLength={20}
                      pattern="[a-zA-Z0-9 ]*"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      value={dEdCourseDurationOptions.find(option => option.value === data.courseDuration)}
                      onChange={(selected) => handleEducationDataChange(index, "courseDuration", selected.value)}
                      options={dEdCourseDurationOptions}
                      placeholder="Course Duration"
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      value={data.yearOfPassing}
                      onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                      required
                    >
                      <option value="">Year of Passing</option>
                      {generateYearOptions()}
                    </select>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      value={data.coreSubjects.map(subject => ({ value: subject, label: subject }))}
                      onChange={(selected) => {
                        const selectedValues = selected.map(option => option.value);
                        handleEducationDataChange(index, "coreSubjects", selectedValues);
                      }}
                      options={coreSubjectsOptions}
                      className="custom-select required"
                      placeholder="Core Subjects"
                      required
                    />
                  </div>
                  {data.coreSubjects.includes("Others") && (
                    <div className="form-group col-lg-6 col-md-12">
                      <input
                        type="text"
                        value={data.otherSubjects}
                        onChange={(e) => handleEducationDataChange(index, "otherSubjects", e.target.value)}
                        placeholder="Specify other subjects"
                        required
                      />
                    </div>
                  )}
                  <div className="form-group col-lg-6 col-md-12">
                    <input
                      type="text"
                      value={data.percentage}
                      onChange={(e) => handleEducationDataChange(index, "percentage", e.target.value)}
                      placeholder="Percentage"
                      maxLength={5}
                    />
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      className="custom-select"
                      value={data.mode || ""}
                      onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                      required
                    >
                      <option value="" disabled>Mode of Study</option>
                      {educationModeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ------------------- Submit handler -------------------
  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      firebase_uid: user.uid,
      grade10: {
        syllabus: grade10Data.syllabus,
        schoolName: grade10Data.schoolName,
        yearOfPassing: grade10Data.yearOfPassing,
        percentage: grade10Data.percentage,
        mode: grade10Data.mode
      },
      additionalEducation: additionalEducation.map((edu) => ({
        education_type: edu.type,
        syllabus: edu.data.syllabus || null,
        schoolName: edu.data.schoolName || null,
        yearOfPassing: edu.data.yearOfPassing || null,
        percentage: edu.data.percentage || null,
        mode: edu.data.mode || null,
        courseStatus: edu.data.courseStatus || null,
        courseName: edu.data.courseName || null,
        collegeName: edu.data.collegeName || null,
        placeOfStudy: edu.data.placeOfStudy || null,
        universityName: edu.data.universityName || null,
        yearOfCompletion: edu.data.yearOfCompletion || null,
        instituteName: edu.data.instituteName || null,
        affiliatedTo: edu.data.affiliatedTo || null,
        courseDuration: edu.data.courseDuration || null,
        specialization: edu.data.specialization || null,
        coreSubjects:
          edu.data.coreSubjects && edu.data.coreSubjects.length
            ? JSON.stringify(edu.data.coreSubjects)
            : null,
        otherSubjects: edu.data.otherSubjects || null
      }))
    };
    try {
      const { data } = await axios.post(
        "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Education details saved successfully");
      console.log("Success:", data);
    } catch (error) {
      console.error("Error saving education details:", error);
      toast.error("Error saving education details");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="education-form">
      <div className="form-group col-lg-12 col-md-12">
        {/* Grade 10 Section (Mandatory) */}
        <div className="education-section">
          <h6>Grade 10</h6>
          {isEasyMode ? (
            <div className="form-group col-lg-6 col-md-12">
              <select
                value={grade10Data.yearOfPassing}
                onChange={(e) => handleGrade10Change("yearOfPassing", e.target.value)}
                required
              >
                <option value="">Year of Passing</option>
                {generateYearOptions()}
              </select>
            </div>
          ) : (
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={grade10Data.syllabus || ""}
                  onChange={(e) => handleGrade10Change("syllabus", e.target.value)}
                >
                  <option value="" disabled>Syllabus</option>
                  {syllabusOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={grade10Data.schoolName}
                  onChange={(e) => handleGrade10Change("schoolName", e.target.value)}
                  placeholder="School Name"
                  pattern="[a-zA-Z0-9 ]*"
                  maxLength={20}
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={grade10Data.yearOfPassing}
                  onChange={(e) => handleGrade10Change("yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {generateYearOptions()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={grade10Data.percentage}
                  onChange={(e) => handleGrade10Change("percentage", e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={grade10Data.mode || ""}
                  onChange={(e) => handleGrade10Change("mode", e.target.value)}
                >
                  <option value="" disabled>Mode of Study</option>
                  {educationModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        {/* Additional Education Sections */}
        {additionalEducation.map((education, index) => (
          <div key={index} className="education-section" style={{ display: "block" }}>
            <div className="section-header">
              <h4>{educationTypes.find((type) => type.value === education.type)?.label}</h4>
              <div>
                <button type="button" onClick={() => handleRemoveEducation(index)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
            {renderEducationFields(education.type, education.data, index)}
          </div>
        ))}
        {/* Add More Education Section */}
        <div className="add-education-section">
          <h6>Add More Education</h6>
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <select
                value=""
                onChange={(e) => {
                  const selected = educationTypes.find((type) => type.value === e.target.value);
                  if (selected) {
                    const newEducation = {
                      type: selected.value,
                      data: getInitialDataForType(selected.value)
                    };
                    setAdditionalEducation((prev) => [...prev, newEducation]);
                  }
                }}
              >
                <option value="">Select Course</option>
                {educationTypes.map((type) => {
                  const alreadySelected = additionalEducation.some((edu) => edu.type === type.value);
                  if (type.allowMultiple || !alreadySelected) {
                    return (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
          </div>
        </div>
        <div>
          <button type="submit" className="theme-btn btn-style-three">
            Save Education Details
          </button>
        </div>
      </div>
    </form>
  );
};

export default Education;