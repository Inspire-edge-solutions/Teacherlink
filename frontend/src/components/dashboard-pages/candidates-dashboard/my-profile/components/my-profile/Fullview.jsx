import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from 'react-toastify'; // Import toast for notifications

const FULL_API = 'https://xx22er5s34.execute-api.ap-south-1.amazonaws.com/dev/fullapi';

// Format keys into a human-friendly label.
const formatLabel = (key) => {
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Format ISO date strings (if present).
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};

// RecordCard renders a section. It skips internal keys and any fields whose rendered value is empty.
const RecordCard = ({ title, record, renderValue }) => {
  const fieldElements = Object.entries(record)
    .map(([key, value]) => {
      // Skip internal keys.
      if (["id", "user_id", "firebase_uid"].includes(key.toLowerCase())) return null;
      // Render the value.
      const rendered = key === "dateOfBirth" ? formatDate(value) : renderValue(value);
      // If rendered value is empty, skip this field.
      if (rendered === "" || rendered === null || rendered === undefined) return null;
      return (
        <div className="d-flex mb-2" key={key}>
          <div className="font-weight-bold mr-2">{formatLabel(key)}:</div>
          <div>{rendered}</div>
        </div>
      );
    })
    .filter(element => element !== null);
  
  // If no valid fields are present, do not render the card.
  if (fieldElements.length === 0) return null;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-info text-white">{title}</div>
      <div className="card-body">
        {fieldElements.length > 0 ? fieldElements : <div className="text-muted">No details provided.</div>}
      </div>
    </div>
  );
};

// Helper: Merge an array of records so that for each key we pick the first non-empty value.
const mergeRecords = (records) => {
  const keys = new Set();
  records.forEach(record => {
    Object.keys(record).forEach(key => {
      if (!["id", "user_id", "firebase_uid"].includes(key.toLowerCase())) {
        keys.add(key);
      }
    });
  });
  const merged = {};
  keys.forEach(key => {
    for (let i = 0; i < records.length; i++) {
      const val = records[i][key];
      if (val !== null && val !== "" && val !== undefined) {
        merged[key] = val;
        break; // take first non-empty value
      }
    }
  });
  return merged;
};

function UserJobProfile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  // Recursively render values.
  const renderValue = useCallback((value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") return "";
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          return renderValue(parsed);
        }
      } catch (e) {
        return trimmed;
      }
      return trimmed;
    }
    if (Array.isArray(value)) {
      const items = value.map((item, index) => {
        const renderedItem = renderValue(item);
        return renderedItem !== "" ? <li key={index}>{renderedItem}</li> : null;
      }).filter(item => item !== null);
      return items.length > 0 ? <ul className="list-unstyled ml-3">{items}</ul> : "";
    }
    if (typeof value === "object") {
      const items = Object.entries(value)
        .filter(([k]) => !["id", "user_id", "firebase_uid"].includes(k.toLowerCase()))
        .map(([k, v]) => {
          const renderedItem = renderValue(v);
          return (
            <li key={k}>
              <strong>{formatLabel(k)}:</strong> {renderedItem !== "" ? renderedItem : "Not Provided"}
            </li>
          );
        });
      return items.length > 0 ? <ul className="list-unstyled ml-3">{items}</ul> : "";
    }
    return String(value);
  }, []);

  // Fetch profile data and merge all rows for the current user.
  const fetchProfileData = useCallback(async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    setError(null);

    console.log("Current user UID:", user.uid);
    console.log("Current user email:", user.email);

    try {
      const response = await axios.get(FULL_API, {
        params: { firebase_uid: user.uid, t: Date.now() }
      });
      console.log("Raw data from API:", response.data);
      if (response.status === 200) {
        let data = response.data;
        if (Array.isArray(data)) {
          // Filter rows that match current user using firebase_uid or email.
          const filtered = data.filter(r => {
            if (r.firebase_uid && r.firebase_uid.trim() !== "") {
              return r.firebase_uid === user.uid;
            }
            return r.email && r.email.toLowerCase() === user.email.toLowerCase();
          });
          console.log("Filtered rows for this UID/email:", filtered);
          if (filtered.length > 0) {
            const merged = mergeRecords(filtered);
            console.log("Merged profile data:", merged);
            setProfileData(merged);
          } else {
            setProfileData(null);
          }
        } else if (typeof data === "object" && data !== null) {
          if ((data.firebase_uid && data.firebase_uid === user.uid) ||
              (!data.firebase_uid && data.email && data.email.toLowerCase() === user.email.toLowerCase())) {
            console.log("Single record for user:", data);
            setProfileData(data);
          } else {
            setProfileData(null);
          }
        } else {
          setProfileData(null);
        }
      } else {
        setProfileData(null);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profile data:", err);
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
    return <div className="alert alert-danger">Error loading profile: {error}</div>;
  }
  if (!profileData) {
    return <div className="alert alert-warning">No profile data found for your account.</div>;
  }

  // Define sections. "Personal Information" now includes "userId" to display the ID.
  const sections = {
    personal: {
      title: "Personal Information",
      fields: [
        "userId", // Changed from "id" to "userId" to match backend output
        "fullName",
        "email",
        "gender",
        "dateOfBirth",
        "callingNumber",
        "whatsappNumber",
        "marital_status"
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
        "additional_info",
        "religion",
        "differently_abled",
        "health_issues"
      ]
    }
  };

  // Build a record for each section using profile data.
  const sectionRecords = {};
  Object.entries(sections).forEach(([key, { fields }]) => {
    const record = {};
    fields.forEach(field => {
      if (key === "additionalInfo") {
        record[field] = profileData[field] ? profileData[field] : "Not Provided";
      } else {
        record[field] = profileData[field] || "";
      }
    });
    sectionRecords[key] = record;
  });

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <button className="btn btn-primary d-flex justify-content-end" onClick={() => {
          window.location.href = "/candidates-dashboard/my-profile";
        }}>
          Edit Profile
        </button>
        <div className="text-center mb-4">
          <h1>User Job Profile</h1>
          <button
            className="btn btn-primary"
            onClick={async () => {
              await fetchProfileData();
              toast.success("Profile data refreshed!");
            }}
          >
            Refresh Profile Data
          </button>
        </div>
        {Object.entries(sectionRecords).map(([key, record]) => (
          <RecordCard
            key={key}
            title={sections[key].title}
            record={record}
            renderValue={renderValue}
          />
        ))}
      </div>
    </div>
  );
}

export default React.memo(UserJobProfile);