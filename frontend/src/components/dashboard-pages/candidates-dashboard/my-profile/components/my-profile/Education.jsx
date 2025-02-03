import React, { useState } from "react";
import Select from "react-select";
import "./profile-styles.css";

const Education = ({ isEasyMode }) => {
  // Base education data for Grade 10 (mandatory)
  const [grade10Data, setGrade10Data] = useState({
    syllabus: '',
    schoolName: '',
    yearOfPassing: '',
    percentage: '',
    mode: ''
  });

  // Additional education sections
  const [additionalEducation, setAdditionalEducation] = useState([]);
  const [selectedEducationType, setSelectedEducationType] = useState(null);

  // All Options
  const educationTypes = [
    { value: 'grade12', label: 'Grade 12', allowMultiple: false },
    { value: 'degree', label: 'Degree', allowMultiple: true },
    { value: 'masterDegree', label: 'Master Degree', allowMultiple: true },
    { value: 'doctorate', label: 'Doctorate', allowMultiple: false },
    { value: 'nttMtt', label: 'NTT/MTT', allowMultiple: false },
    { value: 'dEd', label: 'D.Ed/D.EID', allowMultiple: false },
    { value: 'bEd', label: 'B.Ed', allowMultiple: false },
    { value: 'certificate', label: 'Certificate/Other Course', allowMultiple: true }
  ];

  const syllabusOptions = [
    { value: 'State Board', label: 'State Board' },
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'Others', label: 'Others' }
  ];

  const educationModeOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'evening', label: 'Evening' },
    // { value: 'online', label: 'Online' },
    // { value: 'hybrid', label: 'Hybrid' }
  ];

  const coreSubjectsOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'computerScience', label: 'Computer Science' },
    // Add more subjects as needed
  ];

  const specializationOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Information Science', label: 'Information Science' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Cyber Security', label: 'Cyber Security' }
  ];

  const degreeOptions = [
    { value: 'bsc', label: 'B.Sc' },
    { value: 'ba', label: 'BA' },
    { value: 'bcom', label: 'B.Com' },
    { value: 'btech', label: 'BTech/BE' },
    { value: 'mbbs', label: 'MBBS' },
    { value: 'bds', label: 'BDS' },
    { value: 'bscAgri', label: 'BSc Agri' },
    { value: 'other', label: 'Others' }
  ];

  const degreeSubjectsOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'accountancy', label: 'Accountancy' },
    { value: 'businessStudies', label: 'Business Studies' },
    // ... add more subjects
  ];

  const masterDegreeOptions = [
    { value: 'msc', label: 'M.Sc' },
    { value: 'ma', label: 'MA' },
    { value: 'mcom', label: 'M.com' },
    { value: 'mtech', label: 'MTech/ME' },
    { value: 'md', label: 'MD' },
    { value: 'mscAgri', label: 'M.sc Agri' },
    { value: 'other', label: 'Other' }
  ];

  const masterSubjectsOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'accountancy', label: 'Accountancy' },
    { value: 'businessStudies', label: 'Business Studies' },
    { value: 'other', label: 'Other' }
  ];

  const masterSpecializationOptions = [
    { value: 'ai', label: 'AI' },
    { value: 'cyberSecurity', label: 'Cyber Security' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'other', label: 'Other' }
  ];

  const degreeModeOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'evening', label: 'Evening' },
    { value: 'online', label: 'Online' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  // Add these options at the component level
  const threeYearDegreeOptions = [
    { value: 'bsc', label: 'B.Sc', duration: 3 },
    { value: 'ba', label: 'BA', duration: 3 },
    { value: 'bcom', label: 'B.Com', duration: 3 },
    { value: 'bca', label: 'BCA', duration: 3 },
    { value: 'other3Year', label: 'Other 3-Year Degree', duration: 3 }
  ];

  const fourYearDegreeOptions = [
    { value: 'btech', label: 'BTech/BE', duration: 4 },
    { value: 'mbbs', label: 'MBBS', duration: 4 },
    { value: 'bds', label: 'BDS', duration: 4 },
    { value: 'bscAgri', label: 'BSc Agri', duration: 4 },
    { value: 'other4Year', label: 'Other 4-Year Degree', duration: 4 }
  ];

  const threeYearSubjectsOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'biology', label: 'Biology' },
    { value: 'computerScience', label: 'Computer Science' },
    { value: 'accountancy', label: 'Accountancy' },
    { value: 'economics', label: 'Economics' },
    { value: 'businessStudies', label: 'Business Studies' },
    { value: 'statistics', label: 'Statistics' },
    { value: 'other', label: 'Other' }
  ];

  const fourYearSpecializationOptions = [
    { value: 'computerScience', label: 'Computer Science' },
    { value: 'informationScience', label: 'Information Science' },
    { value: 'mechanicalEngineering', label: 'Mechanical Engineering' },
    { value: 'electricalEngineering', label: 'Electrical Engineering' },
    { value: 'electronicsCommunication', label: 'Electronics & Communication' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'other', label: 'Other' }
  ];

  // Add these options at the component level
  const doctorateSpecializationOptions = [
    { value: 'gravitation', label: 'Gravitation' },
    { value: 'nuclearPhysics', label: 'Nuclear Physics' },
    { value: 'numericalAnalysis', label: 'Numerical Analysis' },
    { value: 'other', label: 'Other' }
  ];

  const doctorateModeOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'partTime', label: 'Part Time' }
  ];

  // Add these options at the component level
  const nttMttModeOptions = [
    { value: 'regular', label: 'Regular' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'evening', label: 'Evening' },
    { value: 'online', label: 'Online' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const courseDurationOptions = [
    { value: '1', label: '1 month' },
    { value: '2', label: '2 months' },
    { value: '3', label: '3 months' },
    { value: '4', label: '4 months' },
    { value: '5', label: '5 months' },
    { value: '6', label: '6 months' },
    { value: '7', label: '7 months' },
    { value: '8', label: '8 months' },
    { value: '9', label: '9 months' },
    { value: '10', label: '10 months' }
  ];

  // Add these options at the component level
  const dEdCourseDurationOptions = [
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' }
  ];

  const bEdCourseDurationOptions = [
    { value: '1', label: '1 year' },
    { value: '2', label: '2 years' },
    { value: '3', label: '3 years' },
    { value: '4', label: '4 years' }
  ];

  const specializedSubjectsOptions = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'others', label: 'Others' }
  ];

  // Add these options at the component level
  const certificateCourseDurationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} months`
  }));

  // Add this constant at the top with other options
  const courseStatusOptions = [
    { value: 'Pursuing', label: 'Pursuing' },
    { value: 'Completed', label: 'Completed' }
  ];

  // Handlers
  const handleGrade10Change = (field, value) => {
    let validatedValue = value;
    
    switch(field) {
      case 'schoolName':
        // Alpha numeric, max 20 characters
        validatedValue = value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 20);
        break;
      case 'yearOfPassing':
        // Between 14 years after date of birth to till date
        const minYear = new Date().getFullYear() - 14;
        const maxYear = new Date().getFullYear();
        if (value < minYear || value > maxYear) return;
        break;
      case 'percentage':
        // Alpha numeric, special letters, max 5 characters
        validatedValue = value.replace(/[^a-zA-Z0-9+%]/g, '').slice(0, 5);
        break;
      default:
        break;
    }

    setGrade10Data(prev => ({
      ...prev,
      [field]: validatedValue
    }));
  };

  const getInitialDataForType = (type) => {
    switch(type) {
      case 'grade12':
        return {
          syllabus: '',
          schoolName: '',
          yearOfPassing: '',
          coreSubjects: [],
          percentage: '',
          mode: '',
          courseStatus: 'Completed'
        };
      case 'degree':
        return {
          courseName: '',
          collegeName: '',
          placeOfStudy: '',
          universityName: '',
          yearOfPassing: '',
          coreSubjects: [],
          specialization: '',
          percentage: '',
          mode: '',
          courseStatus: 'Completed'
        };
      case 'masterDegree':
        return {
          courseName: '',
          collegeName: '',
          placeOfStudy: '',
          universityName: '',
          yearOfPassing: '',
          coreSubjects: [],
          specialization: '',
          percentage: '',
          mode: '',
          courseStatus: 'Completed'
        };
      case 'doctorate':
        return {
          placeOfStudy: '',
          universityName: '',
          yearOfCompletion: '',
          coreSubjectsSpecialization: '',
          mode: ''
        };
      case 'nttMtt':
        return {
          instituteName: '',
          placeOfStudy: '',
          affiliatedTo: '',
          courseDuration: '',
          yearOfPassing: '',
          percentage: '',
          mode: ''
        };
      case 'dEdDEld':
        return {
          instituteName: '',
          placeOfStudy: '',
          affiliatedTo: '',
          courseDuration: '',
          yearOfPassing: '',
          subjects: '',
          percentage: '',
          mode: ''
        };
      case 'bEd':
        return {
          instituteName: '',
          placeOfStudy: '',
          affiliatedTo: '',
          courseDuration: '',
          yearOfPassing: '',
          specializedSubjects: [],
          percentage: '',
          mode: ''
        };
      case 'certificate':
        return {
          courseName: '',
          placeOfStudy: '',
          courseDuration: '',
          yearOfPassing: '',
          specialization: '',
          mode: ''
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

    setAdditionalEducation(prev => [...prev, newEducation]);
    setSelectedEducationType(null);
  };

  const handleEducationDataChange = (index, field, value) => {
    setAdditionalEducation(prev => {
      const updated = [...prev];
      updated[index].data[field] = value;
      return updated;
    });
  };

  const handleRemoveEducation = (index) => {
    setAdditionalEducation(prev => prev.filter((_, i) => i !== index));
  };

  const renderEducationFields = (type, data, index) => {
    switch(type) {
      case 'grade12':
        return (
          <div className="row">
            <div className="form-group col-lg-6 col-md-12">
              <div className="radio-group">
                <label>Course Status:</label>
                {courseStatusOptions.map(option => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name={`courseStatus_${type}_${index}`}
                      value={option.value}
                      checked={data.courseStatus === option.value}
                      onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
                      required
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <div className="radio-group">
                {syllabusOptions.map(option => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name={`grade12Syllabus_${index}`}
                      value={option.value}
                      checked={data.syllabus === option.value}
                      onChange={(e) => handleEducationDataChange(index, 'syllabus', e.target.value)}
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
                value={data.schoolName}
                onChange={(e) => handleEducationDataChange(index, 'schoolName', e.target.value)}
                placeholder="School Name"
                pattern="[a-zA-Z0-9 ]*"
                maxLength={20}
                required
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <select
                value={data.yearOfPassing}
                onChange={(e) => handleEducationDataChange(index, 'yearOfPassing', e.target.value)}
                required
              >
                <option value="">Year of Passing</option>
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const years = [];
                  const minYear = currentYear - 14;
                  // If pursuing, show up to 2 future years, else show only past years
                  const maxYear = data.courseStatus === 'Pursuing' 
                    ? currentYear + 2 
                    : currentYear;
                  
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
                value={data.coreSubjects}
                onChange={(selected) => handleEducationDataChange(index, 'coreSubjects', selected)}
                options={coreSubjectsOptions}
                placeholder="Core Subjects"
                required
              />
            </div>

            <div className="form-group col-lg-6 col-md-12">
              <input
                type="text"
                value={data.percentage}
                onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                placeholder="Grade / Percentage"
                pattern="[a-zA-Z0-9+%]*"
                maxLength={5}
                required
              />
            </div>

            <div className="form-group col-12">
              <div className="radio-group single-line">
                <label>Mode of Study:</label>
                {educationModeOptions.map(option => (
                  <label key={option.value}>
                    <input
                      type="radio"
                      name={`grade12Mode_${index}`}
                      value={option.value}
                      checked={data.mode === option.value}
                      onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                      required
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'degree':
        return (
          <div className="degree-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Duration</label>
                  <label>
                    <input
                      type="radio"
                      name={`degreeDuration_${index}`}
                      value="3"
                      checked={data.duration === "3"}
                      onChange={(e) => {
                        handleEducationDataChange(index, 'duration', e.target.value);
                        handleEducationDataChange(index, 'courseName', '');
                      }}
                      required
                    />
                    3 Year Degree
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`degreeDuration_${index}`}
                      value="4"
                      checked={data.duration === "4"}
                      onChange={(e) => {
                        handleEducationDataChange(index, 'duration', e.target.value);
                        handleEducationDataChange(index, 'courseName', '');
                      }}
                      required
                    />
                    4 Year Degree
                  </label>
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={
                    data.duration === "3" 
                      ? threeYearDegreeOptions.find(option => option.value === data.courseName)
                      : fourYearDegreeOptions.find(option => option.value === data.courseName)
                  }
                  onChange={(selected) => handleEducationDataChange(index, 'courseName', selected.value)}
                  options={data.duration === "3" ? threeYearDegreeOptions : fourYearDegreeOptions}
                  placeholder="Degree"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.collegeName}
                  onChange={(e) => handleEducationDataChange(index, 'collegeName', e.target.value)}
                  placeholder="College Name"
                  pattern="[a-zA-Z0-9 ]*"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => handleEducationDataChange(index, 'universityName', e.target.value)}
                  placeholder="University Name"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, 'yearOfPassing', e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    const maxYear = data.courseStatus === 'Pursuing' ? currentYear + 3 : currentYear;
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push(<option key={year} value={year}>{year}</option>);
                    }
                    return years;
                  })()}
                </select>
              </div>

              {data.duration === "3" && (
                <div className="form-group col-lg-6 col-md-12">
                  <Select
                    isMulti
                    value={data.coreSubjects}
                    onChange={(selected) => handleEducationDataChange(index, 'coreSubjects', selected)}
                    options={threeYearSubjectsOptions}
                    placeholder="Core Subjects"
                    required
                  />
                </div>
              )}

              {data.duration === "4" && (
                <div className="form-group col-lg-6 col-md-12">
                
                  <Select
                    isMulti
                    value={data.specialization}
                    onChange={(selected) => handleEducationDataChange(index, 'specialization', selected)}
                    options={fourYearSpecializationOptions}
                    placeholder="Specialization"
                    required
                  />
                </div>
              )}

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.percentage}
                  onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`degreeMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'masterDegree':
        return (
          <div className="master-degree-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={masterDegreeOptions.find(option => option.value === data.courseName)}
                  onChange={(selected) => handleEducationDataChange(index, 'courseName', selected.value)}
                  options={masterDegreeOptions}
                  placeholder="Master degree"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.collegeName}
                  onChange={(e) => handleEducationDataChange(index, 'collegeName', e.target.value)}
                  placeholder="College Name"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => handleEducationDataChange(index, 'universityName', e.target.value)}
                  placeholder="University Name"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="number"
                  value={data.yearOfPassing}
                  placeholder="Year of Passing"
                  onChange={(e) => handleEducationDataChange(index, 'yearOfPassing', e.target.value)}
                  min={new Date().getFullYear() - 4}
                  max={data.courseStatus === 'Pursuing' ? new Date().getFullYear() + 2 : new Date().getFullYear()}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.coreSubjects}
                  onChange={(selected) => handleEducationDataChange(index, 'coreSubjects', selected)}
                  options={masterSubjectsOptions}
                  placeholder="Core Subjects"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={data.specialization}
                  onChange={(selected) => handleEducationDataChange(index, 'specialization', selected)}
                  options={masterSpecializationOptions}
                  placeholder="Specialization"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.percentage}
                  onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`masterDegreeMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'doctorate':
        return (
          <div className="doctorate-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
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
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.universityName}
                  onChange={(e) => handleEducationDataChange(index, 'universityName', e.target.value)}
                  placeholder="University Name"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfCompletion}
                  onChange={(e) => handleEducationDataChange(index, 'yearOfCompletion', e.target.value)}
                  required
                >
                  <option value="">Year of Completion</option>
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 20;
                    // If pursuing, show up to 5 future years, else show only past years
                    const maxYear = data.courseStatus === 'Pursuing' 
                      ? currentYear + 5 
                      : currentYear;
                    
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
                  value={data.specialization}
                  onChange={(selected) => handleEducationDataChange(index, 'specialization', selected)}
                  options={doctorateSpecializationOptions}
                  placeholder="Specialization"
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`doctorateMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'nttMtt':
        return (
          <div className="ntt-mtt-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
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
                  onChange={(e) => handleEducationDataChange(index, 'instituteName', e.target.value)}
                  placeholder="Institute Name"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.affiliatedTo}
                  onChange={(e) => handleEducationDataChange(index, 'affiliatedTo', e.target.value)}
                  placeholder="Affiliated to / recognized by"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={courseDurationOptions.find(option => option.value === data.courseDuration)}
                  onChange={(selected) => handleEducationDataChange(index, 'courseDuration', selected.value)}
                  options={courseDurationOptions}
                  placeholder="Course Duration"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={data.yearOfPassing}
                  onChange={(e) => handleEducationDataChange(index, 'yearOfPassing', e.target.value)}
                  required
                >
                  <option value="">Year of Passing</option>
                  {(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    // If pursuing, show up to 1 future year, else show only past years
                    const maxYear = data.courseStatus === 'Pursuing' 
                      ? currentYear + 1 
                      : currentYear;
                    
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
                  onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`nttMttMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );


      case 'bEd':
        return (
          <div className="bed-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
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
                  onChange={(e) => handleEducationDataChange(index, 'instituteName', e.target.value)}
                  placeholder="Institute / College name"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.affiliatedTo}
                  onChange={(e) => handleEducationDataChange(index, 'affiliatedTo', e.target.value)}
                  placeholder="Affiliated to / recognized by"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={bEdCourseDurationOptions.find(option => option.value === data.courseDuration)}
                  onChange={(selected) => handleEducationDataChange(index, 'courseDuration', selected.value)}
                  options={bEdCourseDurationOptions}
                  placeholder="Course Duration"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={data.yearOfPassing}
                  onChange={(selected) => handleEducationDataChange(index, 'yearOfPassing', selected.value)}
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    // If pursuing, show up to 3 future years, else show only past years
                    const maxYear = data.courseStatus === 'Pursuing' 
                      ? currentYear + 3 
                      : currentYear;
                    
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push({ value: year.toString(), label: year.toString() });
                    }
                    return years;
                  })()}
                  placeholder="Year of Passing"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  isMulti
                  value={specializedSubjectsOptions.filter(option => 
                    data.specializedSubjects?.includes(option.value)
                  )}
                  onChange={(selected) => handleEducationDataChange(index, 'specializedSubjects', 
                    selected.map(option => option.value)
                  )}
                  options={specializedSubjectsOptions}
                  placeholder="Specialized Subjects"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.percentage}
                  onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`bEdMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'certificate':
        return (
          <div className="certificate-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
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
                  onChange={(e) => handleEducationDataChange(index, 'courseName', e.target.value)}
                  placeholder="Course Name"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={certificateCourseDurationOptions.find(option => option.value === data.courseDuration)}
                  onChange={(selected) => handleEducationDataChange(index, 'courseDuration', selected.value)}
                  options={certificateCourseDurationOptions}
                  placeholder="Course Duration"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={data.yearOfPassing}
                  onChange={(selected) => handleEducationDataChange(index, 'yearOfPassing', selected.value)}
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    // If pursuing, show up to 2 future years, else show only past years
                    const maxYear = data.courseStatus === 'Pursuing' 
                      ? currentYear + 2 
                      : currentYear;
                    
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push({ value: year.toString(), label: year.toString() });
                    }
                    return years;
                  })()}
                  placeholder="Year of Passing"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.specialization}
                  onChange={(e) => handleEducationDataChange(index, 'specialization', e.target.value)}
                  placeholder="Specialization"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`certificateMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'dEd':
        return (
          <div className="ded-section">
            <div className="row">
              <div className="form-group col-lg-6 col-md-12">
                <div className="radio-group">
                  <label>Course Status:</label>
                  {courseStatusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`courseStatus_${type}_${index}`}
                        value={option.value}
                        checked={data.courseStatus === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'courseStatus', e.target.value)}
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
                  onChange={(e) => handleEducationDataChange(index, 'instituteName', e.target.value)}
                  placeholder="Institute / College name"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.placeOfStudy}
                  onChange={(e) => handleEducationDataChange(index, 'placeOfStudy', e.target.value)}
                  placeholder="Place of Study"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.affiliatedTo}
                  onChange={(e) => handleEducationDataChange(index, 'affiliatedTo', e.target.value)}
                  placeholder="Affiliated to / recognized by"
                  maxLength={20}
                  pattern="[a-zA-Z0-9 ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={dEdCourseDurationOptions.find(option => option.value === data.courseDuration)}
                  onChange={(selected) => handleEducationDataChange(index, 'courseDuration', selected.value)}
                  options={dEdCourseDurationOptions}
                  placeholder="Course Duration"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <Select
                  value={data.yearOfPassing}
                  onChange={(selected) => handleEducationDataChange(index, 'yearOfPassing', selected.value)}
                  options={(() => {
                    const currentYear = new Date().getFullYear();
                    const years = [];
                    const minYear = currentYear - 16;
                    // If pursuing, show up to 2 future years, else show only past years
                    const maxYear = data.courseStatus === 'Pursuing' 
                      ? currentYear + 2 
                      : currentYear;
                    
                    for (let year = maxYear; year >= minYear; year--) {
                      years.push({ value: year.toString(), label: year.toString() });
                    }
                    return years;
                  })()}
                  placeholder="Year of Passing"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.subjects}
                  onChange={(e) => handleEducationDataChange(index, 'subjects', e.target.value)}
                  placeholder="Core Subjects"
                  maxLength={40}
                  pattern="[a-zA-Z0-9, ]*"
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <input
                  type="text"
                  value={data.percentage}
                  onChange={(e) => handleEducationDataChange(index, 'percentage', e.target.value)}
                  placeholder="Percentage"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12 mode-section">
                <div className="radio-group">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name={`dEdMode_${index}`}
                        value={option.value}
                        checked={data.mode === option.value}
                        onChange={(e) => handleEducationDataChange(index, 'mode', e.target.value)}
                        required
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
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
                  onChange={(e) => handleGrade10Change('yearOfPassing', e.target.value)}
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
                  {syllabusOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="grade10Syllabus"
                        value={option.value}
                        checked={grade10Data.syllabus === option.value}
                        onChange={(e) => handleGrade10Change('syllabus', e.target.value)}
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
                  onChange={(e) => handleGrade10Change('schoolName', e.target.value)}
                  placeholder="School Name"
                  pattern="[a-zA-Z0-9 ]*"
                  maxLength={20}
                  required
                />
              </div>

              <div className="form-group col-lg-6 col-md-12">
                <select
                  value={grade10Data.yearOfPassing}
                  onChange={(e) => handleGrade10Change('yearOfPassing', e.target.value)}
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
                  onChange={(e) => handleGrade10Change('percentage', e.target.value)}
                  placeholder="Grade / Percentage"
                  pattern="[a-zA-Z0-9+%]*"
                  maxLength={5}
                  required
                />
              </div>

              <div className="form-group col-12">
                <div className="radio-group single-line">
                  <label>Mode of Study:</label>
                  {educationModeOptions.map(option => (
                    <label key={option.value}>
                      <input
                        type="radio"
                        name="grade10Mode"
                        value={option.value}
                        checked={grade10Data.mode === option.value}
                        onChange={(e) => handleGrade10Change('mode', e.target.value)}
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
           
            <h4>{educationTypes.find(type => type.value === education.type)?.label}</h4>
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
                const selected = educationTypes.find(type => type.value === e.target.value);
                if (selected) {
                  const newEducation = {
                    type: selected.value,
                    data: getInitialDataForType(selected.value)
                  };
                  setAdditionalEducation(prev => [...prev, newEducation]);
                }
              }}
            >
              <option value="">Select Course</option>
              {educationTypes.map(type => {
                // For non-multiple types, only show if not already selected
                // For multiple types (degree and masterDegree), always show
                const alreadySelected = additionalEducation.some(edu => edu.type === type.value);
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
    </div>
  );
};

export default Education;
