// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from "../../../../../../contexts/AuthContext";

// // Single API endpoint
// const FULL_API = 'https://xx22er5s34.execute-api.ap-south-1.amazonaws.com/dev/fullapi';

// // Helper functions
// const formatLabel = (key) => {
//     return key
//       .replace(/_/g, " ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());
// };

// const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
// };

// const RecordCard = ({ title, record, skipEmpty = true, renderValue }) => {
//   if (!record) return null;
  
//   const displayField = (key, rawValue, skipEmpty = true) => {
//     if (key === "id" || key === "user_id") return null;
//     const label = formatLabel(key);
//     let value = rawValue;
//     if (/date/i.test(key)) {
//       value = formatDate(rawValue);
//     }
//     const rendered = renderValue(value, skipEmpty);
//     if (skipEmpty && rendered === "") return null;
//     return (
//       <div className="d-flex mb-2" key={key}>
//         <div className="font-weight-bold mr-2">{label}:</div>
//         <div>{rendered}</div>
//       </div>
//     );
//   };

//   const fields = Object.keys(record)
//     .map(key => displayField(key, record[key], skipEmpty))
//     .filter(x => x !== null);

//   if (fields.length === 0) return null;

//   return (
//     <div className="card mb-4 shadow-sm">
//       <div className="card-header bg-info text-white">
//         {title}
//       </div>
//       <div className="card-body">
//         {fields}
//       </div>
//     </div>
//   );
// };

// function UserJobProfile({ formData, onBackClick }) {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [profileData, setProfileData] = useState(null);

//   const renderValue = useCallback((value, skipEmpty = true) => {
//     if (value === null || value === undefined) return skipEmpty ? "" : "null";
//     if (typeof value === "string") {
//       const trimmed = value.trim();
//       if (skipEmpty && trimmed === "") return "";
//       try {
//         const parsed = JSON.parse(trimmed);
//         if (typeof parsed === "object" && parsed !== null) {
//           return renderValue(parsed, skipEmpty);
//         }
//       } catch (e) {
//       return trimmed;
//       }
//     }
//     if (Array.isArray(value)) {
//       let listItems = value.map((item, index) => {
//         const rendered = renderValue(item, skipEmpty);
//         return rendered !== "" || !skipEmpty ? <li key={index}>{rendered}</li> : null;
//       }).filter(item => item !== null);
//       return listItems.length > 0 ? <ul className="list-unstyled ml-3">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
//     }
//     if (typeof value === "object") {
//       let listItems = [];
//       Object.keys(value).forEach((k) => {
//         if (k === "id" || k === "user_id") return;
//         if (k.toLowerCase().includes("firebase")) return;
//         const subVal = renderValue(value[k], skipEmpty);
//         if (!skipEmpty || subVal !== "") {
//           listItems.push(<li key={k}><strong>{formatLabel(k)}:</strong> {subVal}</li>);
//         }
//       });
//       return listItems.length > 0 ? <ul className="list-unstyled ml-3">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
//     }
//     return String(value);
//   }, []);

//   const fetchProfileData = useCallback(async () => {
//     if (!user?.uid) return;
    
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${FULL_API}?firebase_uid=${user.uid}`);
//       if (!response.ok) throw new Error('Failed to fetch profile data');
//       const data = await response.json();
      
//       // Get the latest record
//       const latestRecord = Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null;
//       setProfileData(latestRecord);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching profile data:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     fetchProfileData();
//   }, [fetchProfileData]);

//   if (!user?.uid) {
//     return <div>Please log in to view your profile.</div>;
//   }

//   if (isLoading) {
//     return <div>Loading profile data...</div>;
//   }

//   if (error) {
//     return <div>Error loading profile: {error}</div>;
//   }

//   if (!profileData) {
//     return <div>No profile data found.</div>;
//   }

//   // Group related fields for display
//   const sections = {
//     personal: {
//       title: "Personal Information",
//       fields: [
//         "fullName", 
//         "email", 
//         "gender", 
//         "dateOfBirth", 
//         "callingNumber", 
//         "whatsappNumber",
//         "marital_status",
//         "religion",
//         "differently_abled",
//         "health_issues"
//       ]
//     },
//     address: {
//       title: "Present Address",
//       fields: [
//         "country_name", 
//         "state_name", 
//         "city_name", 
//         "house_no_and_street", 
//         "pincode"
//       ]
//     },
//     education: {
//       title: "Education Details",
//       fields: [
//         "education_type",
//         "syllabus",
//         "schoolName",
//         "yearOfPassing",
//         "percentage",
//         "mode",
//         "courseStatus",
//         "courseName",
//         "collegeName",
//         "placeOfStudy",
//         "universityName",
//         "yearOfCompletion",
//         "instituteName",
//         "affiliatedTo",
//         "courseDuration",
//         "specialization",
//         "coreSubjects",
//         "otherSubjects"
//       ]
//     },
//     experience: {
//       title: "Experience",
//       fields: [
//         "total_experience_years",
//         "total_experience_months",
//         "teaching_experience_years",
//         "teaching_experience_months",
//         "teaching_exp_fulltime_years",
//         "teaching_exp_fulltime_months",
//         "teaching_exp_partime_years",
//         "teaching_exp_partime_months",
//         "administration_fulltime_years",
//         "administration_fulltime_months",
//         "administration_partime_years",
//         "administration_parttime_months",
//         "anyrole_fulltime_years",
//         "anyrole_fulltime_months",
//         "anyrole_partime_years",
//         "anyrole_parttime_months"
//       ]
//     },
//     jobPreference: {
//       title: "Job Preference",
//       fields: [
//         "Job_Type",
//         "expected_salary",
//         "notice_period",
//         "preferred_country",
//         "preferred_state",
//         "preferred_city",
//         "teaching_designations",
//         "teaching_curriculum",
//         "teaching_subjects",
//         "teaching_grades",
//         "teaching_coreExpertise",
//         "administrative_designations",
//         "administrative_curriculum",
//         "teaching_administrative_designations",
//         "teaching_administrative_curriculum",
//         "teaching_administrative_subjects",
//         "teaching_administrative_grades",
//         "teaching_administrative_coreExpertise"
//       ]
//     },
//     workMode: {
//       title: "Work Mode Preferences",
//       fields: [
//         "full_time_offline",
//         "full_time_online",
//         "part_time_weekdays_offline",
//         "part_time_weekdays_online",
//         "part_time_weekends_offline",
//         "part_time_weekends_online",
//         "part_time_vacations_offline",
//         "part_time_vacations_online",
//         "school_college_university_offline",
//         "school_college_university_online",
//         "coaching_institute_offline",
//         "coaching_institute_online",
//         "Ed_TechCompanies_offline",
//         "Ed_TechCompanies_online",
//         "Home_Tutor_offline",
//         "Home_Tutor_online",
//         "Private_Tutor_offline",
//         "Private_Tutor_online",
//         "Group_Tutor_offline",
//         "Group_Tutor_online"
//       ]
//     },
//     languages: {
//       title: "Languages",
//       fields: ["languages"]
//     },
//     social: {
//       title: "Social Profile",
//       fields: [
//         "facebook",
//         "linkedin",
//         "instagram",
//         "profile_summary"
//       ]
//     },
    
//     additionalInfo: {
//       title: "Additional Information",
//       fields: [
//         "computer_skills",
//         "accounting_knowledge",
//         "projects",
//         "accomplishments",
//         "certifications",
//         "research_publications",
//         "patents",
//         "accommodation_required",
//         "preferable_timings",
//         "spouse_need_job",
//         "spouse_name",
//         "spouse_qualification",
//         "spouse_work_experience",
//         "spouse_expertise",
//         "additional_info",
//         "aadhaar_number",
//         "citizenship",
//         "passport_available",
//         "passport_expiry_date",
//         "work_permit_details",
//         "criminal_charges"
//       ]
//     }
//   };

//   return (
//     <div className="bg-light min-vh-100 py-4">
//       <div className="container">
//         <div className="text-center mb-4">
//           <h1>User Job Profile</h1>
//         </div>
//         {Object.entries(sections).map(([key, { title, fields }]) => (
//           <RecordCard
//             key={key}
//             title={title}
//             record={Object.fromEntries(
//               fields.map(field => [field, profileData[field]])
//             )}
//             skipEmpty={true}
//             renderValue={renderValue}
//           />
//         ))}
//         <button 
//           className="theme-btn btn-style-one" 
//           onClick={onBackClick}
//         >
//           Back to Edit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default React.memo(UserJobProfile);

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Ensure axios is imported
import { useAuth } from "../../../../../../contexts/AuthContext";

// Single API endpoint for fetching full profile data
const FULL_API = 'https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal';

// Helper functions for formatting labels and dates
const formatLabel = (key) => {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};

const RecordCard = ({ title, record, skipEmpty = true, renderValue }) => {
  if (!record) return null;
  
  const displayField = (key, rawValue, skipEmpty = true) => {
    if (key === "id" || key === "user_id") return null;
    const label = formatLabel(key);
    let value = rawValue;
    if (/date/i.test(key)) {
      value = formatDate(rawValue);
    }
    const rendered = renderValue(value, skipEmpty);
    if (skipEmpty && rendered === "") return null;
    return (
      <div className="d-flex mb-2" key={key}>
        <div className="font-weight-bold mr-2">{label}:</div>
        <div>{rendered}</div>
      </div>
    );
  };

  const fields = Object.keys(record)
    .map(key => displayField(key, record[key], skipEmpty))
    .filter(x => x !== null);

  if (fields.length === 0) return null;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-info text-white">{title}</div>
      <div className="card-body">{fields}</div>
    </div>
  );
};

function UserJobProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const renderValue = useCallback((value, skipEmpty = true) => {
    if (value === null || value === undefined) return skipEmpty ? "" : "null";
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (skipEmpty && trimmed === "") return "";
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          return renderValue(parsed, skipEmpty);
        }
      } catch (e) {
        return trimmed;
      }
    }
    if (Array.isArray(value)) {
      let listItems = value.map((item, index) => {
        const rendered = renderValue(item, skipEmpty);
        return rendered !== "" || !skipEmpty ? <li key={index}>{rendered}</li> : null;
      }).filter(item => item !== null);
      return listItems.length > 0 ? <ul className="list-unstyled ml-3">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
    }
    if (typeof value === "object") {
      let listItems = [];
      Object.keys(value).forEach((k) => {
        if (k === "id" || k === "user_id") return;
        if (k.toLowerCase().includes("firebase")) return;
        const subVal = renderValue(value[k], skipEmpty);
        if (!skipEmpty || subVal !== "") {
          listItems.push(<li key={k}><strong>{formatLabel(k)}:</strong> {subVal}</li>);
        }
      });
      return listItems.length > 0 ? <ul className="list-unstyled ml-3">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
    }
    return String(value);
  }, []);

  // Fetch profile data using current user's UID from AuthContext
  const fetchProfileData = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError(null);
    try {
      // Send GET request with firebase_uid and a timestamp to avoid caching
      const response = await axios.get(FULL_API, {
        params: { firebase_uid: user.uid, t: Date.now() }
      });
      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        // Use the first record (assuming one record per uid)
        setProfileData(response.data[0]);
      } else {
        setProfileData(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (!user?.uid) {
    return <div>Please log in to view your profile.</div>;
  }

  if (isLoading) {
    return <div>Loading profile data...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  // Group related fields for display
  const sections = {
    personal: {
      title: "Personal Information",
      fields: [
        "fullName", 
        "email", 
        "gender", 
        "dateOfBirth", 
        "callingNumber", 
        "whatsappNumber",
        "marital_status",
        "religion",
        "differently_abled",
        "health_issues"
      ]
    },
    address: {
      title: "Present Address",
      fields: [
        "country_name", 
        "state_name", 
        "city_name", 
        "house_no_and_street", 
        "pincode"
      ]
    },
    education: {
      title: "Education Details",
      fields: [
        "education_type",
        "syllabus",
        "schoolName",
        "yearOfPassing",
        "percentage",
        "mode",
        "courseStatus",
        "courseName",
        "collegeName",
        "placeOfStudy",
        "universityName",
        "yearOfCompletion",
        "instituteName",
        "affiliatedTo",
        "courseDuration",
        "specialization",
        "coreSubjects",
        "otherSubjects"
      ]
    },
    experience: {
      title: "Experience",
      fields: [
        "total_experience_years",
        "total_experience_months",
        "teaching_experience_years",
        "teaching_experience_months",
        "teaching_exp_fulltime_years",
        "teaching_exp_fulltime_months",
        "teaching_exp_partime_years",
        "teaching_exp_partime_months"
      ]
    },
    jobPreference: {
      title: "Job Preference",
      fields: [
        "Job_Type",
        "expected_salary",
        "notice_period",
        "preferred_country",
        "preferred_state",
        "preferred_city",
        "teaching_designations",
        "teaching_curriculum",
        "teaching_subjects",
        "teaching_grades",
        "teaching_coreExpertise"
      ]
    },
    workMode: {
      title: "Work Mode Preferences",
      fields: [
        "full_time_offline",
        "full_time_online",
        "part_time_weekdays_offline",
        "part_time_weekdays_online",
        "part_time_weekends_offline",
        "part_time_weekends_online"
      ]
    },
    languages: {
      title: "Languages",
      fields: ["languages"]
    },
    social: {
      title: "Social Profile",
      fields: [
        "facebook",
        "linkedin",
        "instagram",
        "profile_summary"
      ]
    },
    additionalInfo: {
      title: "Additional Information",
      fields: [
        "computer_skills",
        "accounting_knowledge",
        "projects",
        "accomplishments",
        "certifications",
        "research_publications",
        "patents",
        "accommodation_required",
        "preferable_timings",
        "spouse_need_job",
        "spouse_name",
        "spouse_qualification",
        "spouse_work_experience",
        "spouse_expertise",
        "additional_info"
      ]
    }
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="text-center mb-4">
          <h1>User Job Profile</h1>
          <button className="btn btn-primary" onClick={fetchProfileData}>
            Refresh Profile Data
          </button>
        </div>
        {Object.entries(sections).map(([key, { title, fields }]) => (
          <RecordCard
            key={key}
            title={title}
            record={Object.fromEntries(
              fields.map(field => [field, profileData[field]])
            )}
            skipEmpty={true}
            renderValue={renderValue}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(UserJobProfile);