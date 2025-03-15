import { useState } from "react";
import { auth } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormContent = ({ user_type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (number.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("Firebase User Created:", user);

      const userData = {
        name,
        email: user.email,
        phone_number: number,
        firebase_uid: user.uid,
        user_type,
      };

      console.log("Sending User Data:", userData);

      const response = await axios.post(
        import.meta.env.VITE_USERS_API,
        {
          route: "CreateUser",
          ...userData,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Registration successful! Please login.");
        window.location.href = "/login";
      } else {
        console.error("Backend Error:", response.statusText);
        toast.error("Failed to register. Please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address:</label>
        <input
          type="email"
          placeholder="Enter email address, e.g., abcd@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
          required
        />
        <div className="password-requirements" style={{ fontSize: '0.8rem', marginTop: '5px' }}>
          <p style={{ color: passwordValidation.minLength ? 'green' : 'red' }}>
            ✓ At least 8 characters
          </p>
          <p style={{ color: passwordValidation.hasUpperCase ? 'green' : 'red' }}>
            ✓ At least one uppercase letter
          </p>
          <p style={{ color: passwordValidation.hasLowerCase ? 'green' : 'red' }}>
            ✓ At least one lowercase letter
          </p>
          <p style={{ color: passwordValidation.hasNumber ? 'green' : 'red' }}>
            ✓ At least one number
          </p>
          <p style={{ color: passwordValidation.hasSpecialChar ? 'green' : 'red' }}>
            ✓ At least one special character (!@#$%^&*)
          </p>
        </div>
      </div>

      <div className="form-group">
        <label>Mobile Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
          placeholder="Mobile Number"
          maxLength="10"
          required
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
};

export default FormContent;
