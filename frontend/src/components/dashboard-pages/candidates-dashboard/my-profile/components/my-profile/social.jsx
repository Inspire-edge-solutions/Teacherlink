// import { useState } from "react";
// import axios from "axios";
// import './profile-styles.css';
// import { useAuth } from "../../../../../../contexts/AuthContext";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import ContactInfoBox from "../ContactInfoBox";
// const Social = ({ isEasyMode }) => {

//   const { user } = useAuth();

//   const [socialLinks, setSocialLinks] = useState({
//     firebase_id: user.uid,
//     facebook: '',
//     linkedin: '',
//     instagram: '',
//     profile_summary: ''  // Updated field name
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setSocialLinks(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/socialProfile', socialLinks, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
//       toast.success('Social links saved successfully');
//       console.log('Data sent successfully:', response.data);
      
//       // Handle success (e.g., show a success message)
//     } catch (error) {
//       console.error('Error sending data:', error.response ? error.response.data : error.message);
//       toast.error('Error sending data');
//       // Handle error (e.g., show an error message)
//     }
//   };

//   return (
//     <form className="default-form" onSubmit={handleSubmit}>
      
//           <div className="row mt-3">
//           {isEasyMode ? (
//             <div className="form-group col-lg-12 col-md-12">
//             <textarea
//               name="profile_summary"  // Updated field name
//               placeholder="Profile Summary - Write a brief description about yourself (max 100 words)"
//               value={socialLinks.profile_summary}
//               onChange={handleChange}
//               required
//             ></textarea>
//           </div>
//         ):(
//           <>
//           <h3>Social Networks</h3><br/>
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             name="facebook"
//             placeholder="Facebook - www.facebook.com/your-id"
//             value={socialLinks.facebook}
//             onChange={handleChange}
      
//           />
//         </div>
//         <div className="form-group col-lg-6 col-md-12">
//           <input
//             type="text"
//             name="linkedin"
//             placeholder="LinkedIn - www.linkedin.com/your-id"
//             value={socialLinks.linkedin}
//             onChange={handleChange}
          
//           />
//         </div>
        
//         <div className="form-group col-lg-12 col-md-12">
//           <button type="submit" className="theme-btn btn-style-three">
//             Save Links
//           </button>
//         </div>
//         </>
//         )}
//          </div>
//          <ContactInfoBox/>
//     </form>
//   );
// };

// export default Social;

import { useState, useEffect } from "react";
import axios from "axios";
import "./profile-styles.css";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactInfoBox from "../ContactInfoBox";

const Social = ({ isEasyMode }) => {
  const { user } = useAuth();

  // Initialize state for social links (only Facebook and LinkedIn)
  const [socialLinks, setSocialLinks] = useState({
    firebase_id: user?.uid || "",
    facebook: "",
    linkedin: ""
  });
  const [socialExists, setSocialExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch the existing social profile data (if any) for the current user
  useEffect(() => {
    const fetchSocialProfile = async () => {
      try {
        const response = await axios.get(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/socialProfile",
          { params: { firebase_uid: user.uid } }
        );
        if (response.status === 200 && response.data.length > 0) {
          const record = response.data[0]; // assuming one record per user
          setSocialLinks({
            firebase_id: record.firebase_uid || user.uid,
            facebook: record.facebook || "",
            linkedin: record.linkedin || ""
          });
          setSocialExists(true);
        }
      } catch (error) {
        console.error("Error fetching social profile:", error);
      }
    };

    if (user?.uid) {
      fetchSocialProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (socialExists) {
        // Update existing record via PUT
        const response = await axios.put(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/socialProfile",
          socialLinks,
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Social links updated successfully");
        //console.log("Data updated successfully:", response.data);
      } else {
        // Create new record via POST
        const response = await axios.post(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/socialProfile",
          socialLinks,
          { headers: { "Content-Type": "application/json" } }
        );
        toast.success("Social links saved successfully");
        //console.log("Data sent successfully:", response.data);
        setSocialExists(true);
      }
    } catch (error) {
      console.error(
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
      toast.error("Error sending data");
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row mt-3">
        {isEasyMode ? (
          <>
          // In easy mode, you might only show a simplified version.
          <div className="form-group col-lg-12 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="facebook"
              placeholder="Facebook - www.facebook.com/your-id"
              value={socialLinks.facebook}
              onChange={handleChange}
              required
            />
            <span className="custom-tooltip">Facebook</span>
            </div>
            </div>

            <div className="form-group col-lg-12 col-md-12">
            <div className="input-wrapper">
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn - www.linkedin.com/your-id"
              value={socialLinks.linkedin}
              onChange={handleChange}
              required
            />
            <span className="custom-tooltip">LinkedIn</span>
            </div>
            </div>
            <div className="form-group col-lg-12 col-md-12">
              <button type="submit" className="theme-btn btn-style-three">
                Save Links
              </button>
            </div>
            </>
        ) : (
          <>
            <br />
            <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
              <input
                type="text"
                name="facebook"
                placeholder="Facebook - www.facebook.com/your-id"
                value={socialLinks.facebook}
                onChange={handleChange}
              />
              <span className="custom-tooltip">Facebook</span>
            </div>
            </div>
            <div className="form-group col-lg-6 col-md-12">
            <div className="input-wrapper">
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn - www.linkedin.com/your-id"
                value={socialLinks.linkedin}
                onChange={handleChange}
              />
              <span className="custom-tooltip">LinkedIn</span>
            </div>
            </div>
            <div className="form-group col-lg-12 col-md-12">
              <button type="submit" className="theme-btn btn-style-three">
                Save Links
              </button>
            </div>
          </>
        )}
      </div>
      <ContactInfoBox />
    </form>
  );
};

export default Social;