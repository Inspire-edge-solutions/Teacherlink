import React, { useState } from 'react';
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
  const navigate = useNavigate();

  // Endpoints for OTP and user operations
  const otpBaseURL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/otp';
  const userBaseURL = 'https://0vg0fr4nqc.execute-api.ap-south-1.amazonaws.com/staging/users';

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
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      setLoading(true);
      
      // Create the payload object
      const payload = {
        email: email.trim(), // Ensure email has no whitespace
        otp: otp.trim(),
        newPassword: newPassword,
        route: "ForgotPassword"
      };

      console.log('Sending payload:', payload); // Debug log

      const response = await axios.post(
        `${userBaseURL}`,
        JSON.stringify(payload),  // Make sure payload is stringified
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(response.data.message || 'Password reset successful');
      setIsCompleted(true);
    } catch (err) {
      console.error('Reset password error:', err); // Debug log
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
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
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