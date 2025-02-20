import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './forget.css';

const ForgetPassword = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/otp/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send the email in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP. Please try again.');
            }

            setStep(2);
            setError(''); // Clear any previous error messages
        } catch (err) {
            setError(err.message); // Set error message
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/otp/verify", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }), // Send email and OTP in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to verify OTP. Please try again.');
            }

            setStep(3);
            setError(''); // Clear any previous error messages
        } catch (err) {
            setError(err.message); // Set error message
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/users", {
                method: 'POST',
                route : 'ChangePassword',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email,newPassword,confirmPassword }), // Send email and new password in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to change password. Please try again.');
            }

            setSuccess('Password changed successfully!');
            setError(''); // Clear any previous error messages

            // Redirect to login page
            navigate('/login'); // Change '/login' to your actual login route
        } catch (err) {
            setError(err.message); // Set error message
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        {error && <div className="alert alert-danger">{error}</div>} {/* Display error message */}
                        {success && <div className="alert alert-success">{success}</div>} {/* Display success message */}
                        {step === 1 && (
                            <form onSubmit={handleEmailSubmit}>
                                <h2 className="card-title">Enter your registered email</h2>
                                <div className="mb-3">
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className='btn btn-primary'>Send OTP</button>
                            </form>
                        )}
                        {step === 2 && (
                            <form onSubmit={handleOtpSubmit}>
                                <h2 className="card-title">Enter OTP</h2>
                                <div className="mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={otp} 
                                        onChange={(e) => setOtp(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className='btn btn-primary'>Verify OTP</button>
                            </form>
                        )}
                        {step === 3 && (
                            <form onSubmit={handlePasswordSubmit}>
                                <h2 className="card-title">Set New Password</h2>
                                <div className="mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className='btn btn-primary'>Reset Password</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword;
