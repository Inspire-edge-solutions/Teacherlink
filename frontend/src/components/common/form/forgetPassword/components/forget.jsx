import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './forget.css';

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    match: false
  });
  const navigate = useNavigate();

  // Endpoints for OTP and user operations
  const otpBaseURL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/otp';
  const userBaseURL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/users';

  // Password validation function
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    return validations;
  };

  // Update password validation state when password or confirm password changes
  useEffect(() => {
    const validations = validatePassword(newPassword);
    setPasswordValidation(prev => ({
      ...validations,
      match: newPassword === confirmPassword
    }));
  }, [newPassword, confirmPassword]);

  // Password change handler
  const handlePasswordChange = (e) => {
    const newPwd = e.target.value;
    setNewPassword(newPwd);
  };

  // Confirm password change handler
  const handleConfirmPasswordChange = (e) => {
    const confirmPwd = e.target.value;
    setConfirmPassword(confirmPwd);
  };

  // Step 1: Send OTP via CreateOTP endpoint
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${otpBaseURL}/create`, { email });
      setSuccess(response.data.message || 'OTP has been sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP via GetOTP endpoint
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const response = await axios.post(`${otpBaseURL}/verify`, { email, otp });
      setSuccess(response.data.message || 'OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password via ForgotPassword endpoint
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate password strength
    const validations = validatePassword(newPassword);
    if (!Object.values(validations).every(Boolean)) {
      setError('Password does not meet the required criteria');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const payload = {
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword,
        route: "ForgotPassword"
      };

      console.log('Sending payload:', payload);

      const response = await axios.post(
        `${userBaseURL}`,
        JSON.stringify(payload),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(response.data.message || 'Password reset successful');
      setIsCompleted(true);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 py-5">
      <div className="forget-password-container">
        <h3 className="forget-password-title">Reset Password</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        {!isCompleted ? (
          <>
            {step === 1 && (
              <Form onSubmit={handleSendOTP} className="forget-password-form">
                <Form.Group className="mb-3">
                  <Form.Label>Enter your registered email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                  />
                </Form.Group>
                <div className="button-group">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              </Form>
            )}

            {step === 2 && (
              <Form onSubmit={handleVerifyOTP} className="forget-password-form">
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP:</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP sent to your email"
                    required
                  />
                </Form.Group>
                <div className="button-group">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </Form>
            )}

            {step === 3 && (
              <Form onSubmit={handleResetPassword} className="forget-password-form">
                <Form.Group className="mb-3">
                  <Form.Label>New Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    required
                    isInvalid={newPassword && !passwordValidation.length}
                  />
                  <Form.Text className="text-muted">
                    Password must contain:
                    <ul className="password-requirements">
                      <li style={{ color: passwordValidation.length ? 'green' : 'red' }}>
                        At least 8 characters
                      </li>
                      <li style={{ color: passwordValidation.uppercase ? 'green' : 'red' }}>
                        One uppercase letter
                      </li>
                      <li style={{ color: passwordValidation.lowercase ? 'green' : 'red' }}>
                        One lowercase letter
                      </li>
                      <li style={{ color: passwordValidation.number ? 'green' : 'red' }}>
                        One number
                      </li>
                      <li style={{ color: passwordValidation.special ? 'green' : 'red' }}>
                        One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm new password"
                    required
                    isInvalid={confirmPassword && !passwordValidation.match}
                  />
                  {confirmPassword && (
                    <Form.Text className={passwordValidation.match ? 'text-success' : 'text-danger'}>
                      {passwordValidation.match ? 'Passwords matched' : 'Passwords do not match'}
                    </Form.Text>
                  )}
                </Form.Group>
                <div className="button-group">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </div>
              </Form>
            )}
          </>
        ) : (
          <div className="text-center">
            <p>Your password has been reset successfully!</p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ForgetPassword;