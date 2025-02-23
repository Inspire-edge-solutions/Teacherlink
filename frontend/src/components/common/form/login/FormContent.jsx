// import { Link } from "react-router-dom";
// import LoginWithSocial from "./LoginWithSocial";

// const FormContent = () => {
//   return (
//     <div className="form-inner">
//       <h3>Login to TeacherLink</h3>

//       {/* <!--Login Form--> */}
//       <form method="post">
//         <div className="form-group">
//           <label>Username</label>
//           <input type="text" name="username" placeholder="Username" required />
//         </div>
//         {/* name */}

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//           />
//         </div>
//         {/* password */}

//         <div className="form-group">
//           <div className="field-outer">
//             <div className="input-group checkboxes square">
//               <input type="checkbox" name="remember-me" id="remember" />
//               <label htmlFor="remember" className="remember">
//                 <span className="custom-checkbox"></span> Remember me
//               </label>
//             </div>
//             <a href="#" className="pwd">
//               Forgot password?
//             </a>
//           </div>
//         </div>
//         {/* forgot password */}

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             name="log-in"
//           >
//             Login
//           </button>
//         </div>
//         {/* login */}
//       </form>
//       {/* End form */}

//       <div className="bottom-box">
//         <div className="text">
//           Don&apos;t have an account?{" "}
//           <Link
//             to="#"
//             className="call-modal signup"
//             data-bs-toggle="modal"
//             data-bs-target="#registerModal"
//           >
//             Signup
//           </Link>
//         </div>

//         <div className="divider">
//           <span>or</span>
//         </div>

//         <LoginWithSocial />
//       </div>
//       {/* End bottom-box LoginWithSocial */}
//     </div>
//   );
// };

// export default FormContent;

import { useState } from "react";
import { auth } from "../../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import LoginWithSocial from "./LoginWithSocial";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const fetchUserData = async (firebase_uid) => {
    try {
      const response = await axios.get(
        `https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/users/${firebase_uid}?route=GetUser`,
        
      );
      
      const { user_type } = response.data; // Ensure correct property access
      console.log("User Type:", user_type);

      // Navigate based on user type
      if (user_type === "Candidate") {
        navigate("/candidates-dashboard/dashboard");
      } else if (user_type === "Employer") {
        navigate("/employers-dashboard/dashboard");
      } else {
        console.error("Unknown user type:", user_type);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to fetch user data. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebase_uid = userCredential.user.uid; // Get the Firebase user ID
      
      console.log("Firebase UID:", firebase_uid);
      await fetchUserData(firebase_uid);
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to TeacherLink</h3>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account? <Link to="/register">Signup</Link>
        </div>
        
        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>

      <div className="text">
        Forgot Password? <Link to="/forgetpassword">Reset Password</Link>
      </div>
    </div>
  );
};

export default FormContent;
