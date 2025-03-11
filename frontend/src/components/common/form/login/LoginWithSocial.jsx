// const LoginWithSocial = () => {
//   return (
//     <div className="btn-box row">
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two facebook-btn">
//           <i className="fab fa-facebook-f"></i> Log In via Facebook
//         </a>
//       </div>
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two google-btn">
//           <i className="fab fa-google"></i> Log In via Google
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LoginWithSocial;

// const LoginWithSocial = () => {
//   return (
//     <div className="btn-box row">
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two facebook-btn">
//           <i className="fab fa-facebook-f"></i> Log In via Facebook
//         </a>
//       </div>
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two google-btn">
//           <i className="fab fa-google"></i> Log In via Gmail
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LoginWithSocial;

import { auth, googleProvider } from "../../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';

const LoginWithSocial = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  const [number, setNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roleError, setRoleError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = result.user;
      
      // First, check if user already exists
      const checkResponse = await fetch('https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/logingoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credential.displayName,
          email: credential.email,
          firebase_uid: credential.uid,
          phone_number: "", // Empty string since we don't get phone from Google
        })
      });

      const data = await checkResponse.json();

      if (data.success && data.user?.user_type) {
        // Existing user with user_type, proceed with login
        try {
          await setUser(data.user);
          navigate(data.user.user_type === 'Employer' 
            ? '/employers-dashboard/dashboard' 
            : '/candidates-dashboard/dashboard');
        } catch (error) {
          console.error('Error setting user:', error);
          toast.error('Error during login. Please try again.');
        }
      } else {
        // New user, show role selection
        setGoogleCredential(credential);
        setShowRoleSelection(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!selectedRole) {
        setRoleError('Please select a role');
        return;
      }
      if (!number || number.length !== 10) {
        setPhoneError('Please enter a valid 10-digit mobile number');
        return;
      }

      // Send data matching backend expectations
      const userData = {
        name: googleCredential.displayName,
        email: googleCredential.email,
        phone_number: number,
        firebase_uid: googleCredential.uid,
        user_type: selectedRole
      };

      const response = await fetch('https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/logingoogle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with server');
      }

      const data = await response.json();
      
      if (data.success) {
        try {
          setUser(data.user);
          navigate(selectedRole === 'Employer' 
            ? '/employers-dashboard/dashboard' 
            : '/candidates-dashboard/dashboard');
        } catch (error) {
          console.error('Error setting user:', error);
          toast.error('Error during registration. Please try again.');
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="btn-box row">
        <div className="col-lg-6 col-md-12">
          <button
            className="theme-btn google-btn"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={20} style={{ marginRight: '8px' }} /> Log In via Google
          </button>
        </div>
      </div>

      {showRoleSelection && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="role-selection-container">
              <h4 className="role-selection-title">Select your role</h4>
              <div className="btn-box row role-selection-buttons">
                <div className="col-lg-6 col-md-12">
                  <button
                    className={`theme-btn ${selectedRole === 'Employer' ? 'btn-style-two selected' : 'btn-style-three'}`}
                    onClick={() => {
                      setSelectedRole('Employer');
                      setRoleError('');
                    }}
                    type="button"
                  >
                    I'm an Employer
                  </button>
                </div>
                <div className="col-lg-6 col-md-12">
                  <button
                    className={`theme-btn ${selectedRole === 'Candidate' ? 'btn-style-two selected' : 'btn-style-three'}`}
                    onClick={() => {
                      setSelectedRole('Candidate');
                      setRoleError('');
                    }}
                    type="button"
                  >
                    I'm a Candidate
                  </button>
                </div>
              </div>
              {roleError && (
                <div className="error-message">
                  {roleError}
                </div>
              )}
              <div className="form-group">
                <label>Mobile Number:</label>
                <input
                  type="tel"
                  value={number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    setNumber(value);
                    setPhoneError(value.length === 10 ? '' : 'Please enter a valid 10-digit mobile number');
                  }}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  required
                  className={`phone-input ${phoneError ? 'error' : ''}`}
                />
                {phoneError && (
                  <div className="error-message">
                    {phoneError}
                  </div>
                )}
              </div>
              <div className="submit-btn-container">
                <button
                  className="theme-btn btn-style-one"
                  onClick={handleSubmit}
                  type="button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginWithSocial;
