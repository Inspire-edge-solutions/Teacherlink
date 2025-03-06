import { useState } from "react";
import axios from "axios";
import './profile-styles.css';
import { useAuth } from "../../../../../../contexts/AuthContext";

const Social = ({ isEasyMode }) => {

  const { user } = useAuth();

  const [socialLinks, setSocialLinks] = useState({
    firebase_id: user.uid,
    facebook: '',
    linkedin: '',
    instagram: '',
    profile_summary: ''  // Updated field name
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/socialProfile', socialLinks, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert('Data sent successfully');
      console.log('Data sent successfully:', response.data);
      
      // Handle success (e.g., show a success message)
    } catch (error) {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      
          <div className="row mt-3">
          {isEasyMode ? (
            <div className="form-group col-lg-12 col-md-12">
            <textarea
              name="profile_summary"  // Updated field name
              placeholder="Profile Summary - Write a brief description about yourself (max 100 words)"
              value={socialLinks.profile_summary}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        ):(
          <>
          <h3>Social Networks</h3><br/>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="facebook"
            placeholder="Facebook - www.facebook.com/your-id"
            value={socialLinks.facebook}
            onChange={handleChange}
      
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="linkedin"
            placeholder="LinkedIn - www.linkedin.com/your-id"
            value={socialLinks.linkedin}
            onChange={handleChange}
          
          />
        </div>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="instagram"
            placeholder="Instagram - www.instagram.com/your-id"
            value={socialLinks.instagram}
            onChange={handleChange}
      
          />
        </div>
        
        <div className="form-group col-lg-12 col-md-12">
          <textarea
            name="profile_summary"  // Updated field name
            placeholder="Profile Summary - Write a brief description about yourself (max 100 words)"
            value={socialLinks.profile_summary}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-three">
            Save Links
          </button>
        </div>
        </>
        )}
         </div>
    </form>
  );
};

export default Social;