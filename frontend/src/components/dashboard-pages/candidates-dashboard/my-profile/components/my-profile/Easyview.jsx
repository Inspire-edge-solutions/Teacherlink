// import React, { useState, useEffect } from 'react';
// import { useAuth } from "../../../../../../contexts/AuthContext";
// import { 
//   FaUser, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, 
//   FaHeart, FaPhone, FaEnvelope, FaCalendarAlt, FaIdCard,
//   FaGlobe, FaBuilding, FaHome, FaHashtag, FaGenderless
// } from 'react-icons/fa';

// const Easyview = ({ formData, onBackClick }) => {
//   // Authentication
//   const { user } = useAuth();

//   // State variables
//   const [profileData, setProfileData] = useState({
//     personal: null,
//     address: null,
//     education: null,
//     workExperience: null,
//     jobPreference: null
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // API endpoints
//   const API_ENDPOINTS = {
//     personal: "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/personal",
//     address: "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
//     education: "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/educationDetails",
//     workExperience: "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/workExperience",
//     jobPreference: "https://2pn2aaw6f8.execute-api.ap-south-1.amazonaws.com/dev/jobPreference"
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     if (!user || !user.uid) return;
    
//     const fetchAllData = async () => {
//       setLoading(true);
//       try {
//         // Fetch all data in parallel
//         const results = await Promise.all([
//           fetchData('personal'),
//           fetchData('address'),
//           fetchData('education'),
//           fetchData('workExperience'),
//           fetchData('jobPreference')
//         ]);
        
//         setProfileData({
//           personal: results[0],
//           address: results[1],
//           education: results[2],
//           workExperience: results[3],
//           jobPreference: results[4]
//         });
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching profile data:", err);
//         setError("Failed to load profile data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [user]);

//   // Helper function to fetch data from an API
//   const fetchData = async (dataType) => {
//     try {
//       const response = await fetch(`${API_ENDPOINTS[dataType]}?firebase_uid=${user.uid}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
      
//       // Handle work experience special case
//       if (dataType === 'workExperience' && data) {
//         const combined = [
//           ...(data.mysqlData || []),
//           ...(data.dynamoData?.experienceEntries || [])
//         ];
//         return getLastRecord(combined);
//       }
      
//       // For other data types
//       return getLastRecord(data);
//     } catch (err) {
//       console.error(`Error fetching ${dataType}:`, err);
//       return null;
//     }
//   };

//   // Get the most recent record
//   const getLastRecord = (data) => {
//     if (!data) return null;
//     if (Array.isArray(data) && data.length > 0) {
//       return data[data.length - 1];
//     }
//     return Array.isArray(data) ? null : data;
//   };

//   // Format date strings
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     try {
//       const date = new Date(dateStr);
//       if (isNaN(date.getTime())) return dateStr;
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     } catch (e) {
//       return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
//     }
//   };

//   // Format field labels
//   const formatLabel = (key) => {
//     return key
//       .replace(/_/g, " ")
//       .replace(/([A-Z])/g, ' $1')
//       .replace(/\b\w/g, (l) => l.toUpperCase());
//   };

//   // Filter out system fields
//   const shouldDisplayField = (key) => {
//     const skipFields = ['id', 'user_id', 'firebase_uid', 'created_at', 'updated_at'];
//     return !skipFields.includes(key) && !key.toLowerCase().includes('firebase');
//   };

//   // Render a field value
//   const renderValue = (value) => {
//     if (value === null || value === undefined || value === '') return '-';
    
//     if (typeof value === 'string') {
//       // Try to parse JSON strings
//       try {
//         const parsed = JSON.parse(value);
//         if (Array.isArray(parsed) || (typeof parsed === 'object' && parsed !== null)) {
//           return renderValue(parsed);
//         }
//       } catch (e) {
//         // Not JSON, return as is
//       }
//       return value;
//     }
    
//     if (Array.isArray(value)) {
//       if (value.length === 0) return '-';
//       return (
//         <ul className="bullet-list">
//           {value.map((item, idx) => (
//             <li key={idx}>{renderValue(item)}</li>
//           ))}
//         </ul>
//       );
//     }
    
//     if (typeof value === 'object') {
//       const entries = Object.entries(value).filter(([k]) => shouldDisplayField(k));
//       if (entries.length === 0) return '-';
//       return (
//         <div className="nested-fields">
//           {entries.map(([k, v]) => (
//             <div key={k} className="nested-field">
//               <span className="nested-label">{formatLabel(k)}:</span> {renderValue(v)}
//             </div>
//           ))}
//         </div>
//       );
//     }
    
//     return String(value);
//   };

//   // Render Personal Details Section
//   const renderPersonalDetails = () => {
//     const data = profileData.personal;
//     if (!data) return null;

//     return (
//       <div className="profile-section">
//         <div className="section-header">
//           <FaUser className="section-icon" />
//           <h3>Personal Details</h3>
//         </div>
//         <div className="section-content">
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaUser className="field-icon" /> Full Name</label>
//               <div className="field-value">{data.fullName || data.name || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label><FaEnvelope className="field-icon" /> Email</label>
//               <div className="field-value">{data.email || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaGenderless className="field-icon" /> Gender</label>
//               <div className="field-value">{data.gender || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label><FaCalendarAlt className="field-icon" /> Date of Birth</label>
//               <div className="field-value">{formatDate(data.dateOfBirth) || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaPhone className="field-icon" /> Calling Number</label>
//               <div className="field-value">{data.callingNumber || data.phone || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label><FaPhone className="field-icon" /> WhatsApp Number</label>
//               <div className="field-value">{data.whatsappNumber || '-'}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render Address Section
//   const renderAddress = () => {
//     const data = profileData.address;
//     if (!data) return null;

//     return (
//       <div className="profile-section">
//         <div className="section-header">
//           <FaMapMarkerAlt className="section-icon" />
//           <h3>Address Details</h3>
//         </div>
//         <div className="section-content">
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaHome className="field-icon" /> House No. & Street</label>
//               <div className="field-value">{data.house_no_and_street || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label><FaBuilding className="field-icon" /> City</label>
//               <div className="field-value">{data.city_name || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaBuilding className="field-icon" /> State</label>
//               <div className="field-value">{data.state_name || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label><FaGlobe className="field-icon" /> Country</label>
//               <div className="field-value">{data.country_name || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label><FaHashtag className="field-icon" /> Pincode</label>
//               <div className="field-value">{data.pincode || '-'}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render Education Section
//   const renderEducation = () => {
//     const data = profileData.education;
//     if (!data) return null;

//     return (
//       <div className="profile-section">
//         <div className="section-header">
//           <FaGraduationCap className="section-icon" />
//           <h3>Education Details</h3>
//         </div>
//         <div className="section-content">
//           {/* Grade 10 */}
//           {data.grade10 && (
//             <div className="education-item">
//               <h4>Grade 10</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Syllabus</label>
//                   <div className="field-value">{data.grade10.syllabus || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>School Name</label>
//                   <div className="field-value">{data.grade10.schoolName || '-'}</div>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Year of Passing</label>
//                   <div className="field-value">{data.grade10.yearOfPassing || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>Percentage</label>
//                   <div className="field-value">{data.grade10.percentage || '-'}</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Grade 12 */}
//           {data.grade12 && (
//             <div className="education-item">
//               <h4>Grade 12</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Syllabus</label>
//                   <div className="field-value">{data.grade12.syllabus || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>School Name</label>
//                   <div className="field-value">{data.grade12.schoolName || '-'}</div>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Percentage</label>
//                   <div className="field-value">{data.grade12.percentage || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>Mode</label>
//                   <div className="field-value">{data.grade12.mode || '-'}</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Degree */}
//           {data.degree && (
//             <div className="education-item">
//               <h4>Degree</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>College</label>
//                   <div className="field-value">{data.degree.college || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>University</label>
//                   <div className="field-value">{data.degree.university || '-'}</div>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Percentage</label>
//                   <div className="field-value">{data.degree.percentage || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>Mode</label>
//                   <div className="field-value">{data.degree.mode || '-'}</div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Master's Degree */}
//           {data.masterDegree && (
//             <div className="education-item">
//               <h4>Master's Degree</h4>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>College</label>
//                   <div className="field-value">{data.masterDegree.college || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>University</label>
//                   <div className="field-value">{data.masterDegree.university || '-'}</div>
//                 </div>
//               </div>
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Percentage</label>
//                   <div className="field-value">{data.masterDegree.percentage || '-'}</div>
//                 </div>
//                 <div className="form-group">
//                   <label>Mode</label>
//                   <div className="field-value">{data.masterDegree.mode || '-'}</div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Render Work Experience Section
//   const renderWorkExperience = () => {
//     const data = profileData.workExperience;
//     if (!data) return null;

//     return (
//       <div className="profile-section">
//         <div className="section-header">
//           <FaBriefcase className="section-icon" />
//           <h3>Work Experience</h3>
//         </div>
//         <div className="section-content">
//           <div className="form-row">
//             <div className="form-group">
//               <label>Organization</label>
//               <div className="field-value">{data.organization || data.companyName || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label>Designation</label>
//               <div className="field-value">{data.designation || data.jobTitle || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label>Start Date</label>
//               <div className="field-value">{formatDate(data.startDate) || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label>End Date</label>
//               <div className="field-value">
//                 {data.currentlyWorking ? 'Present' : formatDate(data.endDate) || '-'}
//               </div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group full-width">
//               <label>Job Description</label>
//               <div className="field-value">{data.jobDescription || '-'}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render Job Preference Section
//   const renderJobPreference = () => {
//     const data = profileData.jobPreference;
//     if (!data) return null;

//     return (
//       <div className="profile-section">
//         <div className="section-header">
//           <FaHeart className="section-icon" />
//           <h3>Job Preferences</h3>
//         </div>
//         <div className="section-content">
//           <div className="form-row">
//             <div className="form-group">
//               <label>Preferred Location</label>
//               <div className="field-value">{data.preferredLocation || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label>Expected Salary</label>
//               <div className="field-value">{data.expectedSalary || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group">
//               <label>Job Type</label>
//               <div className="field-value">{data.jobType || '-'}</div>
//             </div>
//             <div className="form-group">
//               <label>Notice Period</label>
//               <div className="field-value">{data.noticePeriod || '-'}</div>
//             </div>
//           </div>
          
//           <div className="form-row">
//             <div className="form-group full-width">
//               <label>Skills</label>
//               <div className="field-value">
//                 {data.skills ? (
//                   <div className="skills-container">
//                     {Array.isArray(data.skills) ? 
//                       data.skills.map((skill, index) => (
//                         <span key={index} className="skill-tag">{skill}</span>
//                       )) : data.skills}
//                   </div>
//                 ) : '-'}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // If there is no logged-in user, display a message
//   if (!user || !user.uid) {
//     return (
//       <div className="login-message">
//         <FaUser className="login-icon" />
//         <h2>Please log in to view your profile</h2>
//         <p>You need to be logged in to access your profile information.</p>
//       </div>
//     );
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading your profile data...</p>
//       </div>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <div className="error-container">
//         <h3>Something went wrong</h3>
//         <p>{error}</p>
//         <button className="retry-button" onClick={() => window.location.reload()}>
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Check if any data is available
//   const hasData = Object.values(profileData).some(value => value !== null);
  
//   if (!hasData) {
//     return (
//       <div className="no-data-container">
//         <h3>No Profile Data Available</h3>
//         <p>Your profile information has not been set up yet.</p>
//         <p>Please complete your profile details to see them displayed here.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-container">
//       <style jsx>{`
//         /* Main container */
//         .profile-container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 20px;
//           font-family: 'Jost', sans-serif;
//         }
        
//         .profile-title {
//           margin-bottom: 25px;
//           color: #202124;
//           font-weight: 600;
//           text-align: center;
//         }
        
//         /* Profile sections */
//         .profile-section {
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           margin-bottom: 25px;
//           overflow: hidden;
//           transition: transform 0.2s, box-shadow 0.2s;
//         }
        
//         .profile-section:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//         }
        
//         .section-header {
//           display: flex;
//           align-items: center;
//           padding: 15px 20px;
//           background: #1967d2;
//           color: white;
//         }
        
//         .section-icon {
//           margin-right: 10px;
//           font-size: 1.2rem;
//         }
        
//         .section-header h3 {
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 500;
//         }
        
//         .section-content {
//           padding: 20px;
//         }
        
//         /* Form layout */
//         .form-row {
//           display: flex;
//           flex-wrap: wrap;
//           margin: 0 -10px 15px;
//         }
        
//         .form-row:last-child {
//           margin-bottom: 0;
//         }
        
//         .form-group {
//           flex: 1 0 calc(50% - 20px);
//           margin: 0 10px 15px;
//           min-width: 250px;
//         }
        
//         .form-group.full-width {
//           flex: 1 0 calc(100% - 20px);
//         }
        
//         .form-group label {
//           display: flex;
//           align-items: center;
//           font-weight: 500;
//           color: #5f6368;
//           margin-bottom: 5px;
//           font-size: 0.9rem;
//         }
        
//         .field-icon {
//           margin-right: 8px;
//           color: #1967d2;
//           font-size: 0.9rem;
//         }
        
//         .field-value {
//           padding: 10px;
//           background-color: #f8f9fa;
//           border-radius: 4px;
//           border: 1px solid #e8eaed;
//           min-height: 42px;
//           display: flex;
//           align-items: center;
//         }
        
//         /* Education items */
//         .education-item {
//           margin-bottom: 25px;
//           padding-bottom: 20px;
//           border-bottom: 1px solid #e8eaed;
//         }
        
//         .education-item:last-child {
//           margin-bottom: 0;
//           padding-bottom: 0;
//           border-bottom: none;
//         }
        
//         .education-item h4 {
//           margin: 0 0 15px;
//           color: #1967d2;
//           font-size: 1.1rem;
//           font-weight: 500;
//         }
        
//         /* Skills tags */
//         .skills-container {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//         }
        
//         .skill-tag {
//           background-color: #e8f0fe;
//           color: #1967d2;
//           padding: 5px 10px;
//           border-radius: 4px;
//           font-size: 0.9rem;
//         }
        
//         /* Nested fields */
//         .nested-fields {
//           display: flex;
//           flex-direction: column;
//           gap: 5px;
//         }
        
//         .nested-field {
//           display: flex;
//           align-items: baseline;
//         }
        
//         .nested-label {
//           font-weight: 500;
//           color: #5f6368;
//           margin-right: 5px;
//           min-width: 120px;
//         }
        
//         /* Lists */
//         .bullet-list {
//           list-style-type: disc;
//           padding-left: 20px;
//           margin: 5px 0;
//         }
        
//         .bullet-list li {
//           margin-bottom: 5px;
//         }
        
//         /* Loading spinner */
//         .loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 300px;
//         }
        
//         .spinner {
//           border: 4px solid rgba(0, 0, 0, 0.1);
//           border-radius: 50%;
//           border-top: 4px solid #1967d2;
//           width: 40px;
//           height: 40px;
//           animation: spin 1s linear infinite;
//           margin-bottom: 20px;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         /* Error and no data states */
//         .error-container,
//         .no-data-container,
//         .login-message {
//           text-align: center;
//           padding: 40px 20px;
//           background: white;
//           border-radius: 8px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
//           max-width: 600px;
//           margin: 40px auto;
//         }
        
//         .login-icon {
//           font-size: 3rem;
//           color: #1967d2;
//           margin-bottom: 20px;
//         }
        
//         .retry-button {
//           background: #1967d2;
//           color: white;
//           border: none;
//           padding: 10px 20px;
//           border-radius: 4px;
//           font-weight: 500;
//           cursor: pointer;
//           margin-top: 15px;
//           transition: background 0.2s;
//         }
        
//         .retry-button:hover {
//           background: #1657b3;
//         }
        
//         /* Responsive adjustments */
//         @media (max-width: 768px) {
//           .form-group {
//             flex: 1 0 calc(100% - 20px);
//           }
//         }
//       `}</style>

//       <h2 className="profile-title">My Profile</h2>
      
//       {/* Personal Details */}
//       {renderPersonalDetails()}
      
//       {/* Address Details */}
//       {renderAddress()}
      
//       {/* Education Details */}
//       {renderEducation()}
      
//       {/* Work Experience */}
//       {renderWorkExperience()}
      
//       {/* Job Preference */}
//       {renderJobPreference()}

//       <button 
//         className="theme-btn btn-style-one" 
//         onClick={onBackClick}
//       >
//         Back to Edit
//       </button>
//     </div>
//   );
// };

// export default Easyview;


import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from "../../../../../../contexts/AuthContext";
import {
  FaUser, FaMapMarkerAlt, FaGraduationCap, FaBriefcase,
  FaHeart, FaPhone, FaEnvelope, FaCalendarAlt, FaGenderless,
  FaGlobe, FaBuilding, FaHome, FaHashtag
} from 'react-icons/fa';
import axios from 'axios';

// Single API endpoint for fetching full profile data
const FULL_API = 'https://xx22er5s34.execute-api.ap-south-1.amazonaws.com/dev/fullapi';

/**
 * formatLabel: Converts snake_case or camelCase to a human-friendly label.
 * Example: "fullName" becomes "Full Name".
 */
const formatLabel = (key) => {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, ' $1')
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

/**
 * formatDate: Formats an ISO date string by removing the time part.
 */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  }
};

/**
 * RecordCard: Renders a section card given a title and record object.
 * It uses renderValue() to recursively render field values.
 */
const RecordCard = ({ title, record, renderValue }) => {
  const fieldElements = Object.entries(record)
    .map(([key, value]) => {
      if (key === "id" || key === "user_id" || key.toLowerCase().includes("firebase")) {
        return null;
      }
      // For dateOfBirth, use formatDate
      const rendered = key === "dateOfBirth" ? formatDate(value) : renderValue(value);
      if (rendered === "" || rendered === null || rendered === undefined) return null;
      return (
        <div className="d-flex mb-2" key={key}>
          <div className="font-weight-bold mr-2">{formatLabel(key)}:</div>
          <div>{rendered}</div>
        </div>
      );
    })
    .filter(element => element !== null);

  return (
    <div className="profile-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
      </div>
      <div className="section-content p-3">
        {fieldElements.length > 0 ? fieldElements : <div className="text-muted">No details provided.</div>}
      </div>
    </div>
  );
};

function Easyview() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState(null); // Merged data from all rows (for personal, address, etc.)
  const [educationData, setEducationData] = useState(null); // Last added education row
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // renderValue recursively renders field values.
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
      } catch {
        // Not JSON; return as is.
      }
      return trimmed;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      const items = value.map((item, idx) => {
        const renderedItem = renderValue(item);
        return renderedItem !== "" ? <li key={idx}>{renderedItem}</li> : null;
      }).filter(Boolean);
      return items.length > 0 ? <ul className="list-unstyled ml-3">{items}</ul> : "";
    }
    if (typeof value === "object") {
      const entries = Object.entries(value).filter(
        ([k]) => !k.toLowerCase().includes("firebase") && k !== "id" && k !== "user_id"
      );
      if (entries.length === 0) return "";
      const items = entries.map(([k, v]) => {
        const renderedItem = renderValue(v);
        return renderedItem !== "" ? (
          <li key={k}>
            <strong>{formatLabel(k)}:</strong> {renderedItem}
          </li>
        ) : null;
      }).filter(Boolean);
      return items.length > 0 ? <ul className="list-unstyled ml-3">{items}</ul> : "";
    }
    return String(value);
  }, []);

  // Fetch all rows for the current user, merge non-education fields,
  // and pick the last education row from those with education details.
  const fetchProfileData = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(FULL_API, {
        params: { firebase_uid: user.uid, t: Date.now() }
      });
      if (Array.isArray(data) && data.length > 0) {
        // Filter rows for the current user
        const userRows = data.filter(row => row.firebase_uid === user.uid);
        if (userRows.length === 0) {
          setProfileData(null);
          setEducationData(null);
        } else {
          // Merge all rows into one object for sections like personal, address, etc.
          const mergedData = userRows.reduce((acc, row) => {
            Object.entries(row).forEach(([key, val]) => {
              if (val && val !== "") {
                acc[key] = val;
              }
            });
            return acc;
          }, {});
          setProfileData(mergedData);

          // Filter for education rows (assumed to have a non-empty education_type)
          const educationRows = userRows.filter(r => r.education_type && r.education_type.toString().trim() !== "");
          const lastEducationRow = educationRows.length > 0 ? educationRows[educationRows.length - 1] : {};
          setEducationData(lastEducationRow);
        }
      } else {
        setProfileData(null);
        setEducationData(null);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (!user?.uid) {
    return (
      <div className="login-message">
        <FaUser className="login-icon" />
        <h2>Please log in to view your profile</h2>
        <p>You need to be logged in to access your profile information.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="no-data-container">
        <h3>No Profile Data Available</h3>
        <p>Your profile information has not been set up yet.</p>
        <p>Please complete your profile details to see them displayed here.</p>
      </div>
    );
  }

  // Define sections.
  // For the Education section, use educationData (the last added row from education).
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
        // Assuming that grade10 and grade12 are part of the education row (if available)
        "grade10",
        "grade12",
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
    }
  };

  return (
    <div className="profile-container">
      <style jsx>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Jost', sans-serif;
        }

        .profile-title {
          margin-bottom: 25px;
          color: #202124;
          font-weight: 600;
          text-align: center;
        }

        .profile-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 25px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .profile-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          background: #1967d2;
          color: white;
        }

        .section-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .section-icon {
          margin-right: 10px;
          font-size: 1.2rem;
        }

        .section-content {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 15px;
          min-width: 250px;
        }

        .form-group label {
          display: flex;
          align-items: center;
          font-weight: 500;
          color: #5f6368;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .field-icon {
          margin-right: 8px;
          color: #1967d2;
          font-size: 0.9rem;
        }

        .field-value {
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 4px;
          border: 1px solid #e8eaed;
          min-height: 42px;
          display: flex;
          align-items: center;
        }

        .education-item {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e8eaed;
        }

        .education-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .education-item h4 {
          margin: 0 0 15px;
          color: #1967d2;
          font-size: 1.1rem;
          font-weight: 500;
        }

        .skill-tag {
          background-color: #e8f0fe;
          color: #1967d2;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.9rem;
          margin-right: 5px;
          margin-bottom: 5px;
          display: inline-block;
        }

        .nested-fields {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nested-field {
          display: flex;
          align-items: baseline;
        }

        .nested-label {
          font-weight: 500;
          color: #5f6368;
          margin-right: 5px;
          min-width: 120px;
        }

        .bullet-list {
          list-style-type: disc;
          padding-left: 20px;
          margin: 5px 0;
        }

        .bullet-list li {
          margin-bottom: 5px;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #1967d2;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-container,
        .no-data-container,
        .login-message {
          text-align: center;
          padding: 40px 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin: 40px auto;
        }

        .login-icon {
          font-size: 3rem;
          color: #1967d2;
          margin-bottom: 20px;
        }

        .retry-button {
          background: #1967d2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          margin-top: 15px;
          transition: background 0.2s;
        }

        .retry-button:hover {
          background: #1657b3;
        }

        @media (max-width: 768px) {
          .form-group {
            flex: 1 0 100%;
          }
        }
      `}</style>

      <h2 className="profile-title">My Profile</h2>

      <div className="text-right mb-4">
        <button
          className="btn btn-primary"
          onClick={async () => {
            await fetchProfileData();
          }}
        >
          Refresh Profile Data
        </button>
      </div>

      {Object.entries(sections).map(([sectionKey, { title, fields }]) => {
        // For the Education section, use educationData; for others, use profileData.
        const sectionRecord = sectionKey === "education"
          ? Object.fromEntries(fields.map(field => [field, educationData ? educationData[field] : ""]))
          : Object.fromEntries(fields.map(field => [field, profileData[field]]));
        return (
          <RecordCard
            key={sectionKey}
            title={title}
            record={sectionRecord}
            renderValue={renderValue}
          />
        );
      })}
    </div>
  );
}

export default Easyview;