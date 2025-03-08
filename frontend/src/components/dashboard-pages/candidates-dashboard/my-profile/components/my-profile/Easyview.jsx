import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../../../../contexts/AuthContext";
import { FaGlobe, FaBuilding, FaMapMarkerAlt, FaHome, FaHashtag } from 'react-icons/fa';

const Easyview = () =>  {
  // ========== AUTHENTICATION ==========
  const { user } = useAuth();

  // If there is no logged-in user, display a message.
  if (!user || !user.uid) {
    return <div>Please log in to view your profile.</div>;
  }

  // ========== STATE VARIABLES ==========
  const [personal, setPersonal] = useState(null);
  const [address, setAddress] = useState(null);
  const [education, setEducation] = useState(null);
  const [workExperience, setWorkExperience] = useState(null);
  const [jobPreference, setJobPreference] = useState(null);

  // ========== API ENDPOINTS ==========
  const personalAPI = "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal";
  const addressAPI = "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress";
  const educationAPI = "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails";
  const workExperienceAPI = "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience";
  const jobPreferenceAPI = "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference";

  // ========== HELPER FUNCTIONS ==========
  function getLastRecord(data) {
    if (!data) return null;
    if (Array.isArray(data) && data.length > 0) {
      return data[data.length - 1];
    }
    return Array.isArray(data) ? null : data;
  }

  function formatLabel(key) {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  }

  /**
   * Renders values as either text or JSX elements.
   * For strings, if valid JSON, it parses and renders as a bullet list.
   */
  function renderValue(value, skipEmpty = true) {
    if (value === null || value === undefined) return skipEmpty ? "" : "null";
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (skipEmpty && trimmed === "") return "";
      // Attempt to parse JSON if possible
      try {
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === "object" && parsed !== null) {
          return renderValue(parsed, skipEmpty);
        }
      } catch (e) {
        // Not a JSON string, continue with the trimmed string
      }
      return trimmed;
    }
    if (Array.isArray(value)) {
      let listItems = value.map((item, index) => {
        const rendered = renderValue(item, skipEmpty);
        return rendered !== "" || !skipEmpty ? <li key={index}>{rendered}</li> : null;
      }).filter(item => item !== null);
      return listItems.length > 0 ? <ul className="bullet-list">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
    }
    if (typeof value === "object") {
      let listItems = [];
      Object.keys(value).forEach((k) => {
        if (k === "id" || k === "user_id") return;
        // Skip firebase uid fields
        if (k.toLowerCase().includes("firebase")) return;
        const subVal = renderValue(value[k], skipEmpty);
        if (!skipEmpty || subVal !== "") {
          listItems.push(<li key={k}>{formatLabel(k)}: {subVal}</li>);
        }
      });
      return listItems.length > 0 ? <ul className="bullet-list">{listItems}</ul> : (skipEmpty ? "" : <ul></ul>);
    }
    return String(value);
  }

  function displayField(key, rawValue, skipEmpty = true) {
    if (key === "id" || key === "user_id") return null;
    const label = formatLabel(key);
    let value = rawValue;
    if (/date/i.test(key)) {
      value = formatDate(rawValue);
    }
    const rendered = renderValue(value, skipEmpty);
    if (skipEmpty && rendered === "") return null;
    return (
      <div className="info-row d-flex mb-2" key={key}>
        <div className="info-label font-weight-bold mr-2">{label}:</div>
        <div className="info-value">{rendered}</div>
      </div>
    );
  }

  /**
   * Filter out keys containing "created" or "updated" (case-insensitive)
   * from the education record.
   */
  function filterEducationRecord(record) {
    if (!record || typeof record !== "object") return record;
    const filtered = {};
    Object.keys(record).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes("created") || lowerKey.includes("updated")) return;
      filtered[key] = record[key];
    });
    return filtered;
  }

  // ========== COMPONENTS TO RENDER RECORDS ==========
  // Renders a record as a card (for Personal, Education, Work Experience)
  function RecordCard({ record, skipEmpty = true }) {
    if (!record) return null;
    const fields = Object.keys(record)
      .map(key => displayField(key, record[key], skipEmpty))
      .filter(x => x !== null);
    if (fields.length === 0) return null;
    return <div className="card p-3 mb-3 shadow-sm">{fields}</div>;
  }

  // Renders a record as a table (for Address and Job Preference)
  function RecordTable({ record, iconMap = {}, skipEmpty = true }) {
    if (!record) return null;
    const rows = Object.keys(record).map(key => {
      if (key === "id" || key === "user_id") return null;
      if (key.toLowerCase().includes("firebase")) return null;
      let rawValue = record[key];
      let rendered = renderValue(rawValue, skipEmpty);
      if (/date/i.test(key)) {
        rendered = formatDate(rawValue);
      }
      const label = formatLabel(key);
      const icon = iconMap[label] ? <span className="mr-2">{iconMap[label]}</span> : null;
      if (!skipEmpty || rendered !== "") {
        return (
          <tr key={key}>
            <th className="bg-light">{icon}{label}</th>
            <td>{rendered}</td>
          </tr>
        );
      }
      return null;
    }).filter(x => x !== null);
    if (rows.length === 0) return null;
    return (
      <table className="table table-bordered">
        <tbody>{rows}</tbody>
      </table>
    );
  }

  // ========== FETCH DATA ON COMPONENT MOUNT ==========
  useEffect(() => {
    // Each fetch call now includes the user's firebase_uid as a query parameter.
    async function fetchPersonal() {
      try {
        const response = await fetch(`${personalAPI}?firebase_uid=${user.uid}`);
        const data = await response.json();
        const latest = getLastRecord(data);
        setPersonal(latest);
      } catch (err) {
        console.error("Error fetching personal details:", err);
      }
    }
    async function fetchAddress() {
      try {
        const response = await fetch(`${addressAPI}?firebase_uid=${user.uid}`);
        const data = await response.json();
        const latest = getLastRecord(data);
        setAddress(latest);
      } catch (err) {
        console.error("Error fetching address details:", err);
      }
    }
    async function fetchEducation() {
      try {
        const response = await fetch(`${educationAPI}?firebase_uid=${user.uid}`);
        const data = await response.json();
        const latest = getLastRecord(data);
        const filteredLatest = filterEducationRecord(latest);
        setEducation(filteredLatest);
      } catch (err) {
        console.error("Error fetching education details:", err);
      }
    }
    async function fetchWorkExperience() {
      try {
        const response = await fetch(`${workExperienceAPI}?firebase_uid=${user.uid}`);
        const data = await response.json();
        const combined = [
          ...(data.mysqlData || []),
          ...(data.dynamoData?.experienceEntries || [])
        ];
        const latest = getLastRecord(combined);
        setWorkExperience(latest);
      } catch (err) {
        console.error("Error fetching work experience details:", err);
      }
    }
    async function fetchJobPreference() {
      try {
        const response = await fetch(`${jobPreferenceAPI}?firebase_uid=${user.uid}`);
        const data = await response.json();
        const latest = getLastRecord(data);
        setJobPreference(latest);
      } catch (err) {
        console.error("Error fetching job preference details:", err);
      }
    }
    fetchPersonal();
    fetchAddress();
    fetchEducation();
    fetchWorkExperience();
    fetchJobPreference();
  }, [user]);

  // Icon mapping for Present Address table using React Icons
  const addressIcons = {
    "Country Name": <FaGlobe />,
    "State Name": <FaBuilding />,
    "City Name": <FaMapMarkerAlt />,
    "House No And Street": <FaHome />,
    "Pincode": <FaHashtag />
  };

  // ========== RENDER ==========
  return (
    <div>
      {/* Inline CSS (retained along with Bootstrap) */}
      <style>{`
        /* ===== GLOBAL RESETS & FONTS ===== */
        * {
          box-sizing: border-box;
          margin: 0; 
          padding: 0;
          font-family: "Helvetica Neue", Arial, sans-serif;
        }
        body {
          background-color: #f2f2f5;
          color: #333;
          line-height: 1.6;
        }
        /* ===== BULLET LISTS ===== */
        .bullet-list {
          list-style-type: disc;
          list-style-position: outside;
          margin: 6px 0 6px 24px;
          padding: 0;
        }
        .bullet-list li {
          margin-bottom: 4px;
        }
        /* ===== RESPONSIVE DESIGN OVERRIDES ===== */
        @media (max-width: 600px) {
          .info-label {
            margin-bottom: 2px;
          }
        }
      `}</style>

      <div className="small-text-top-left position-fixed bg-white p-2 rounded shadow-sm" style={{ top: '10px', left: '10px', fontSize: '0.85rem', opacity: 0.9 }}>
        Easy View
      </div>
      <div className="container mt-4">
        {/* PERSONAL INFO */}
        <div className="row mb-4" id="personalSection">
          <div className="col-12">
            <h2 className="bg-primary text-white p-2 rounded">Personal Information</h2>
            <RecordCard record={personal} skipEmpty={true} />
          </div>
        </div>
        {/* PRESENT ADDRESS */}
        <div className="row mb-4" id="addressSection">
          <div className="col-12">
            <h2 className="bg-primary text-white p-2 rounded">Present Address</h2>
            <RecordTable record={address} iconMap={addressIcons} skipEmpty={true} />
          </div>
        </div>
        {/* EDUCATION DETAILS */}
        <div className="row mb-4" id="educationSection">
          <div className="col-12">
            <h2 className="bg-primary text-white p-2 rounded">Education Details</h2>
            <RecordCard record={education} skipEmpty={true} />
          </div>
        </div>
        {/* WORK EXPERIENCE */}
        <div className="row mb-4" id="workExperienceSection">
          <div className="col-12">
            <h2 className="bg-primary text-white p-2 rounded">Work Experience</h2>
            <RecordCard record={workExperience} skipEmpty={true} />
          </div>
        </div>
        {/* JOB PREFERENCE */}
        <div className="row mb-4" id="jobPreferenceSection">
          <div className="col-12">
            <h2 className="bg-primary text-white p-2 rounded">Job Preference</h2>
            <RecordTable record={jobPreference} skipEmpty={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Easyview;