import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./profile-styles.css";
import axios from "axios";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Education = ({
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
  certificateMode,
  // If you have a user id, you can pass it as a prop.
  userId
}) => {
  // Base education data for Grade 10 (mandatory)
  const [grade10Data, setGrade10Data] = useState({
    syllabus: "",
    schoolName: "",
    yearOfPassing: "",
    percentage: "",
    mode: ""
  });

  const { user } = useAuth();
  const [coreSubjectsOptions, setCoreSubjectsOptions] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [masterDegrees, setMasterDegrees] = useState([]);
  const [additionalEducation, setAdditionalEducation] = useState([]);
  const [selectedEducationType, setSelectedEducationType] = useState(null);

  // All Options
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
    // { value: 'online', label: 'Online' },
    // { value: 'hybrid', label: 'Hybrid' }
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

  // Add these options at the component level
  const dEdCourseDurationOptions = [
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" }
  ];

  const bEdCourseDurationOptions = [
    { value: "1", label: "1 year" },
    { value: "2", label: "2 years" },
    { value: "3", label: "3 years" },
    { value: "4", label: "4 years" }
  ];

  // Add these options at the component level
  const certificateCourseDurationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} months`
  }));

  // Add this constant at the top with other options
  const courseStatusOptions = [
    { value: "Pursuing", label: "Pursuing" },
    { value: "Completed", label: "Completed" }
  ];

  // Handlers
  const handleGrade10Change = (field, value) => {
    let validatedValue = value;
    switch (field) {
      case "schoolName":
        // Alpha numeric, max 20 characters
        validatedValue = value.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20);
        break;
      case "yearOfPassing":
        // Between 14 years after date of birth to till date
        const minYear = new Date().getFullYear() - 14;
        const maxYear = new Date().getFullYear();
        if (value < minYear || value > maxYear) return;
        break;
      case "percentage":
        // Alpha numeric, special letters, max 5 characters
        validatedValue = value.replace(/[^a-zA-Z0-9+%]/g, "").slice(0, 5);
        break;
      default:
        break;
    }
    setGrade10Data((prev) => ({
      ...prev,
      [field]: validatedValue
    }));
  };

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
          courseStatus: "Completed"
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
          courseStatus: "Completed"
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
          courseStatus: "Completed"
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
          courseStatus: "Completed"
        };
      case "nttMtt":
        return {
          instituteName: "",
          placeOfStudy: "",
          affiliatedTo: "",
          courseDuration: "",
          yearOfPassing: "",
          percentage: "",
          mode: ""
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
          mode: ""
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
          mode: ""
        };
      case "certificate":
        return {
          courseName: "",
          placeOfStudy: "",
          courseDuration: "",
          yearOfPassing: "",
          specialization: "",
          mode: ""
        };
      default:
        return {};
    }
  };

  const handleAddEducation = () => {
    if (!selectedEducationType) return;
    const newEducation = {
      type: selectedEducationType.value,
      data: getInitialDataForType(selectedEducationType.value)
    };
    setAdditionalEducation((prev) => [...prev, newEducation]);
    setSelectedEducationType(null);
  };

  const handleEducationDataChange = (index, field, value) => {
    setAdditionalEducation((prev) => {
      const updated = [...prev];
      updated[index].data[field] = value;
      return updated;
    });
  };

  const handleRemoveEducation = (index) => {
    setAdditionalEducation((prev) => prev.filter((_, i) => i !== index));
  };

  const subjectList = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_DEV1_API + '/education-data'
      );
      const formattedSubjects = response.data.map((subject) => ({
        value: subject.value,
        label: subject.label
      }));
      setCoreSubjectsOptions(formattedSubjects);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    subjectList();
  }, []);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_DEV1_API + '/constants'
        );
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
        console.error("Error fetching designations:", error);
      }
    };
    fetchDegrees();
  }, []);

  const renderEducationFields = (type, data, index) => {
    switch (type) {
      case "grade12":
        return (
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                <label>Course Status:</label>
                {courseStatusOptions.map((option) => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name={`courseStatus_${type}_${index}`}
                      value={option.value}
                      checked={data.courseStatus === option.value}
                      onChange={(e) =>
                        handleEducationDataChange(index, "courseStatus", e.target.value)
                      }
                      required
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            {grade12syllabus && (
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  {syllabusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`grade12Syllabus_${index}`}
                        value={option.value}
                        checked={data.syllabus === option.value}
                        onChange={(e) =>
                          handleEducationDataChange(index, "syllabus", e.target.value)
                        }
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
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
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const years = [];
                  const minYear = currentYear - 14;
                  const maxYear = data.courseStatus === "Pursuing" ? currentYear + 2 : currentYear;
                  for (let year = maxYear; year >= minYear; year--) {
                    years.push(
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  }
                  return years;
                })()}
              </select>
            </div>
            <div className="form-group col-lg-6 col-md-12">
              <Select
                isMulti
                value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                onChange={(selected) => {
                  const selectedValues = selected.map((option) => option.value);
                  console.log("Selected Values:", selectedValues);
                  handleEducationDataChange(index, "coreSubjects", selectedValues);
                }}
                options={coreSubjectsOptions}
                className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
              <div className="form-group col-12">
                <div className="radio-group single-line">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`grade12Mode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "degree":
        return (
          <div className="degree-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                  <label>Course Status:</label>
                  {courseStatusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) =>
                          handleEducationDataChange(index, "courseStatus", e.target.value)
                        }
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
              <Select
                  value={degrees.find((d) => d.value === data.courseName) || null}
                  onChange={(selectedOption) =>
                    handleEducationDataChange(index, "courseName", selectedOption.value)
                  }
                  options={degrees}
                  className={`custom-select ${data.courseName === "" ? "required" : ""}`}
                  placeholder="Degree Name"
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
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    const maxYear =
                      data.courseStatus === "Pursuing" ? currentYear + 3 : currentYear;
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push(
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map((option) => option.value);
                    console.log("Selected Values:", selectedValues);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
                <div className="form-group col-12 mode-section">
                  <div className="radio-group">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`degreeMode_${index}`}
                          value={option.value}
                          checked={data.mode === option.value}
                          onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                  <label>Course Status:</label>
                  {courseStatusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  type="text"
                  value={data.courseName}
                  onChange={(e) => handleEducationDataChange(index, "courseName", e.target.value)}
                  options={masterDegrees}
                  placeholder="Master Degree Name"
                  className={`custom-select ${data.courseName.length === 0 ? "required" : ""}`}
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
                <input
                  type="number"
                  value={data.yearOfPassing}
                  placeholder="Year of Passing"
                  onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                  min={new Date().getFullYear() - 4}
                  max={data.courseStatus === "Pursuing" ? new Date().getFullYear() + 2 : new Date().getFullYear()}
                  required
                />
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map((option) => option.value);
                    console.log("Selected Values:", selectedValues);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
                <div className="form-group col-12 mode-section">
                  <div className="radio-group">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`masterDegreeMode_${index}`}
                          value={option.value}
                          checked={data.mode === option.value}
                          onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                  <label>Course Status:</label>
                  {courseStatusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
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
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 20;
                    const maxYear = data.courseStatus === "Pursuing" ? currentYear + 5 : currentYear;
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push(
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map((option) => option.value);
                    console.log("Selected Values:", selectedValues);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
                <div className="form-group col-12 mode-section">
                  <div className="radio-group">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`doctorateMode_${index}`}
                          value={option.value}
                          checked={data.mode === option.value}
                          onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      value={data.yearOfPassing}
                      onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                      required
                    >
                      <option value="">Year of Passing</option>
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const years = [];
                        const minYear = currentYear - 16;
                        const maxYear = data.courseStatus === "Pursuing" ? currentYear + 1 : currentYear;
                        for (let year = maxYear; year >= minYear; year--) {
                          years.push(
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        }
                        return years;
                      })()}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                      <label>Course Status:</label>
                      {courseStatusOptions.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name={`courseStatus_${type}_${index}`}
                            value={option.value}
                            checked={data.courseStatus === option.value}
                            onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                            required
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
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
                      value={courseDurationOptions.find((option) => option.value === data.courseDuration)}
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
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const years = [];
                        const minYear = currentYear - 16;
                        const maxYear = data.courseStatus === "Pursuing" ? currentYear + 1 : currentYear;
                        for (let year = maxYear; year >= minYear; year--) {
                          years.push(
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        }
                        return years;
                      })()}
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
                  <div className="form-group col-12 mode-section">
                    <div className="radio-group">
                      <label>Mode of Study:</label>
                      {educationModeOptions.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name={`nttMttMode_${index}`}
                            value={option.value}
                            checked={data.mode === option.value}
                            onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
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
                <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                  <label>Course Status:</label>
                  {courseStatusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
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
                    value={bEdCourseDurationOptions.find((option) => option.value === data.courseDuration)}
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
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    const maxYear = data.courseStatus === "Pursuing" ? currentYear + 1 : currentYear;
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push(
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
                </select>
              </div>
              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                  onChange={(selected) => {
                    const selectedValues = selected.map((option) => option.value);
                    console.log("Selected Values:", selectedValues);
                    handleEducationDataChange(index, "coreSubjects", selectedValues);
                  }}
                  options={coreSubjectsOptions}
                  className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
                <div className="form-group col-12 mode-section">
                  <div className="radio-group">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`bEdMode_${index}`}
                          value={option.value}
                          checked={data.mode === option.value}
                          onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                  <label>Course Status:</label>
                  {courseStatusOptions.map((option) => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
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
                    value={certificateCourseDurationOptions.find(
                      (option) => option.value === data.courseDuration
                    )}
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
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 14;
                    const maxYear = data.courseStatus === "Pursuing" ? currentYear + 2 : currentYear;
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push(
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                    return years;
                  })()}
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
                <div className="form-group col-12 mode-section">
                  <div className="radio-group">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name={`certificateMode_${index}`}
                          value={option.value}
                          checked={data.mode === option.value}
                          onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <select
                      value={data.yearOfPassing}
                      onChange={(e) => handleEducationDataChange(index, "yearOfPassing", e.target.value)}
                      required
                    >
                      <option value="">Year of Passing</option>
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const years = [];
                        const minYear = currentYear - 16;
                        const maxYear = data.courseStatus === "Pursuing" ? currentYear + 1 : currentYear;
                        for (let year = maxYear; year >= minYear; year--) {
                          years.push(
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        }
                        return years;
                      })()}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group col-lg-6 col-md-12">
                    <div className={`radio-group ${!courseStatusOptions.value ? "required" : ""}`}>
                      <label>Course Status:</label>
                      {courseStatusOptions.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name={`courseStatus_${type}_${index}`}
                            value={option.value}
                            checked={data.courseStatus === option.value}
                            onChange={(e) => handleEducationDataChange(index, "courseStatus", e.target.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
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
                      value={dEdCourseDurationOptions.find((option) => option.value === data.courseDuration)}
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
                      {(() => {
                        const currentYear = new Date().getFullYear();
                        const years = [];
                        const minYear = currentYear - 14;
                        const maxYear = data.courseStatus === "Pursuing" ? currentYear + 2 : currentYear;
                        for (let year = maxYear; year >= minYear; year--) {
                          years.push(
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        }
                        return years;
                      })()}
                    </select>
                  </div>
                  <div className="form-group col-lg-6 col-md-12">
                    <Select
                      isMulti
                      value={data.coreSubjects.map((subject) => ({ value: subject, label: subject }))}
                      onChange={(selected) => {
                        const selectedValues = selected.map((option) => option.value);
                        console.log("Selected Values:", selectedValues);
                        handleEducationDataChange(index, "coreSubjects", selectedValues);
                      }}
                      options={coreSubjectsOptions}
                      className={`custom-select ${data.coreSubjects.length === 0 ? "required" : ""}`}
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
                  <div className="form-group col-12 mode-section">
                    <div className="radio-group">
                      <label>Mode of Study:</label>
                      {educationModeOptions.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name={`dEdMode_${index}`}
                            value={option.value}
                            checked={data.mode === option.value}
                            onChange={(e) => handleEducationDataChange(index, "mode", e.target.value)}
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
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

  // Submit handler: construct payload and post via Axios
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Construct the payload based on our education_details table fields.
    const payload = {
      firebase_uid: user.uid,
      // Data for Grade 10 (mandatory)
      grade10: {
        syllabus: grade10Data.syllabus,
        schoolName: grade10Data.schoolName,
        yearOfPassing: grade10Data.yearOfPassing,
        percentage: grade10Data.percentage,
        mode: grade10Data.mode,
      },
      // Data for additional education entries (Grade 12, Degree, etc.)
      additionalEducation: additionalEducation.map((edu) => ({
        education_type: edu.type, // e.g., "grade12", "degree", etc.
        // Common fields
        syllabus: edu.data.syllabus || null,
        schoolName: edu.data.schoolName || null,
        yearOfPassing: edu.data.yearOfPassing || null,
        percentage: edu.data.percentage || null,
        mode: edu.data.mode || null,
        courseStatus: edu.data.courseStatus || null,
        // Higher education specific fields
        courseName: edu.data.courseName || null,
        collegeName: edu.data.collegeName || null,
        placeOfStudy: edu.data.placeOfStudy || null,
        universityName: edu.data.universityName || null,
        yearOfCompletion: edu.data.yearOfCompletion || null,
        // Fields for courses like NTT/MTT, D.Ed, B.Ed
        instituteName: edu.data.instituteName || null,
        affiliatedTo: edu.data.affiliatedTo || null,
        courseDuration: edu.data.courseDuration || null,
        // Certificate-specific field
        specialization: edu.data.specialization || null,
        // Convert coreSubjects to JSON format (array format)
        coreSubjects: edu.data.coreSubjects && edu.data.coreSubjects.length
          ? JSON.stringify(edu.data.coreSubjects) // This ensures it is stored as a JSON array
          : null,
        otherSubjects: edu.data.otherSubjects || null,
      })),
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
        <h3>Education Details</h3>

        {/* Grade 10 Section (Mandatory) */}
        <div className="education-section">
          <h4>Grade 10</h4>
          {isEasyMode ? (
            <>
              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={grade10Data.yearOfPassing}
                  onChange={(e) => handleGrade10Change("yearOfPassing", e.target.value)}
                  required
                >
                  <option value="">Select Year of Passing</option>
                  {Array.from({ length: 15 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <div className="form-group col-lg-6 col-md-12">
                  <div className="radio-group">
                    {syllabusOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name="grade10Syllabus"
                          value={option.value}
                          checked={grade10Data.syllabus === option.value}
                          onChange={(e) => handleGrade10Change("syllabus", e.target.value)}
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
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
                    <option value="">Select Year of Passing</option>
                    {Array.from({ length: 15 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
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

                <div className="form-group col-12">
                  <div className="radio-group single-line">
                    <label>Mode of Study:</label>
                    {educationModeOptions.map((option) => (
                      <label key={option.value}>
                        <input
                          type="radio"
                          name="grade10Mode"
                          value={option.value}
                          checked={grade10Data.mode === option.value}
                          onChange={(e) => handleGrade10Change("mode", e.target.value)}
                          required
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Display Added Education Sections */}
        {additionalEducation.map((education, index) => (
          <div key={index} className="education-section">
            <div className="section-header">
              <h4>
                {educationTypes.find((type) => type.value === education.type)?.label}
              </h4>
              <div>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
            {renderEducationFields(education.type, education.data, index)}
          </div>
        ))}

        {/* Add More Education Section */}
        <div className="add-education-section">
          <h4>Add More Education</h4>
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
          <button type="submit" className="theme-btn btn-style-three">Save Education Details</button>
        </div>
      </div>
    </form>
  );
};

export default Education;
