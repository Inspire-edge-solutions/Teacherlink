import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../../../contexts/AuthContext';

const Fullview = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const userEmail = user.email.toLowerCase().trim(); // Normalize email
        
        // Fetch all profiles
        const response = await axios.get('https://xx22er5s34.execute-api.ap-south-1.amazonaws.com/dev/fullapi');
        console.log(response.data);
        if (!response.data || response.data.length === 0) {
          setError('No profiles received from API');
          setLoading(false);
          return;
        }

        // Add debugging info
        setDebugInfo({
          userEmail: userEmail,
          profileEmails: response.data.map(p => p.email),
          profileCount: response.data.length
        });
        
        // Try case-insensitive match first
        let currentUserProfile = response.data.find(
          profile => profile.email && profile.email.toLowerCase().trim() === userEmail
        );
        
        // If still not found, try a more flexible matching (contains email)
        if (!currentUserProfile) {
          currentUserProfile = response.data.find(
            profile => profile.email && profile.email.toLowerCase().includes(userEmail.split('@')[0].toLowerCase())
          );
        }
        
        // If no match, just use the first profile for testing (comment this out in production)
        if (!currentUserProfile && response.data.length > 0) {
          currentUserProfile = response.data[0];
          console.log('Using first profile for testing');
        }
        
        if (currentUserProfile) {
          setUserProfile(currentUserProfile);
        } else {
          setError('User profile not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile: ' + err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]); // Add user as dependency to reload if user changes

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      {debugInfo && (
        <div className="debug-info" style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', fontSize: '12px' }}>
          <p><strong>Debug Info:</strong></p>
          <p>Your email: {debugInfo.userEmail}</p>
          <p>Available emails in system: {debugInfo.profileCount > 0 ? 
              debugInfo.profileEmails.map(email => <div key={email}>{email || 'NULL'}</div>) : 
              'No emails found'}
          </p>
        </div>
      )}
    </div>
  );
  
  if (!userProfile) return (
    <div className="not-found-container">
      <h3>Profile not found</h3>
      <p>We couldn't find your profile information. Please make sure your account is properly set up.</p>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        <div className="profile-section">
          <h3>Personal Information</h3>
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{userProfile.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Gender:</span>
              <span className="value">{userProfile.gender || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Date of Birth:</span>
              <span className="value">
                {userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Contact Information</h3>
          <div className="profile-details">
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{userProfile.callingNumber || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">WhatsApp:</span>
              <span className="value">{userProfile.whatsappNumber || 'N/A'}</span>
            </div>
            {userProfile.city_name && (
              <div className="detail-item">
                <span className="label">City:</span>
                <span className="value">{userProfile.city_name}</span>
              </div>
            )}
            {userProfile.state_name && (
              <div className="detail-item">
                <span className="label">State:</span>
                <span className="value">{userProfile.state_name}</span>
              </div>
            )}
            {userProfile.country_name && (
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{userProfile.country_name}</span>
              </div>
            )}
          </div>
        </div>

        {(userProfile.education_type || userProfile.syllabus || userProfile.schoolName) && (
          <div className="profile-section">
            <h3>Education</h3>
            <div className="profile-details">
              {userProfile.education_type && (
                <div className="detail-item">
                  <span className="label">Education Type:</span>
                  <span className="value">{userProfile.education_type}</span>
                </div>
              )}
              {userProfile.syllabus && (
                <div className="detail-item">
                  <span className="label">Syllabus:</span>
                  <span className="value">{userProfile.syllabus}</span>
                </div>
              )}
              {userProfile.schoolName && (
                <div className="detail-item">
                  <span className="label">School:</span>
                  <span className="value">{userProfile.schoolName}</span>
                </div>
              )}
              {userProfile.yearOfPassing && (
                <div className="detail-item">
                  <span className="label">Year of Passing:</span>
                  <span className="value">{userProfile.yearOfPassing}</span>
                </div>
              )}
              {userProfile.percentage && (
                <div className="detail-item">
                  <span className="label">Percentage:</span>
                  <span className="value">{userProfile.percentage}%</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(userProfile.Job_Type || userProfile.expected_salary || userProfile.notice_period) && (
          <div className="profile-section">
            <h3>Career Information</h3>
            <div className="profile-details">
              {userProfile.Job_Type && (
                <div className="detail-item">
                  <span className="label">Job Type:</span>
                  <span className="value">{userProfile.Job_Type}</span>
                </div>
              )}
              {userProfile.expected_salary && (
                <div className="detail-item">
                  <span className="label">Expected Salary:</span>
                  <span className="value">{userProfile.expected_salary}</span>
                </div>
              )}
              {userProfile.notice_period && (
                <div className="detail-item">
                  <span className="label">Notice Period:</span>
                  <span className="value">{userProfile.notice_period}</span>
                </div>
              )}
              {userProfile.total_experience_years && (
                <div className="detail-item">
                  <span className="label">Total Experience:</span>
                  <span className="value">
                    {userProfile.total_experience_years} years
                    {userProfile.total_experience_months && `, ${userProfile.total_experience_months} months`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fullview;
