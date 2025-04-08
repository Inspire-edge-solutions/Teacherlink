// // // import { Link } from "react-router-dom";
// // // import LoginWithSocial from "./LoginWithSocial";

// // // const FormContent = () => {
// // //   return (
// // //     <div className="form-inner">
// // //       <h3>Login to TeacherLink</h3>

// // //       {/* <!--Login Form--> */}
// // //       <form method="post">
// // //         <div className="form-group">
// // //           <label>Username</label>
// // //           <input type="text" name="username" placeholder="Username" required />
// // //         </div>
// // //         {/* name */}

// // //         <div className="form-group">
// // //           <label>Password</label>
// // //           <input
// // //             type="password"
// // //             name="password"
// // //             placeholder="Password"
// // //             required
// // //           />
// // //         </div>
// // //         {/* password */}

// // //         <div className="form-group">
// // //           <div className="field-outer">
// // //             <div className="input-group checkboxes square">
// // //               <input type="checkbox" name="remember-me" id="remember" />
// // //               <label htmlFor="remember" className="remember">
// // //                 <span className="custom-checkbox"></span> Remember me
// // //               </label>
// // //             </div>
// // //             <a href="#" className="pwd">
// // //               Forgot password?
// // //             </a>
// // //           </div>
// // //         </div>
// // //         {/* forgot password */}

// // //         <div className="form-group">
// // //           <button
// // //             className="theme-btn btn-style-one"
// // //             type="submit"
// // //             name="log-in"
// // //           >
// // //             Login
// // //           </button>
// // //         </div>
// // //         {/* login */}
// // //       </form>
// // //       {/* End form */}

// // //       <div className="bottom-box">
// // //         <div className="text">
// // //           Don&apos;t have an account?{" "}
// // //           <Link
// // //             to="#"
// // //             className="call-modal signup"
// // //             data-bs-toggle="modal"
// // //             data-bs-target="#registerModal"
// // //           >
// // //             Signup
// // //           </Link>
// // //         </div>

// // //         <div className="divider">
// // //           <span>or</span>
// // //         </div>

// // //         <LoginWithSocial />
// // //       </div>
// // //       {/* End bottom-box LoginWithSocial */}
// // //     </div>
// // //   );
// // // };

// // // export default FormContent;

// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { auth } from "../../../../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../../../contexts/AuthContext";
// import LoginWithSocial from "./LoginWithSocial";
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const FormContent = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [loginAttempted, setLoginAttempted] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user } = useAuth();

//   useEffect(() => {
//     // Only navigate if we have a user, login was attempted, and we're on the login page
//     if (user?.user_type && loginAttempted && location.pathname === '/login') {
//       console.log("Navigating with user type:", user.user_type);
      
//       if (user.user_type === 'Employer') {
//         navigate('/employers-dashboard/dashboard', { replace: true });
//       } else if (user.user_type === 'Candidate') {
//         navigate('/candidates-dashboard/dashboard', { replace: true });
//       }
//       // Reset login attempt after navigation
//       setLoginAttempted(false);
//     }
//   }, [user, loginAttempted, navigate, location.pathname]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       setLoginAttempted(true); // Set login attempt flag
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-inner">
//       <h3>Login to TeacherLink !</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </div>
//       </form>
//       <div className="text">
//         Forgot Password? <Link to="/forgetpassword">Reset Password</Link>
//       </div>
//       <div className="bottom-box">
//         <div className="text">
//           Don't have an account?{" "}
//           <Link to="/register">Signup</Link>
//         </div>

//         <div className="divider">
//           <span>or</span>
//         </div>

//         <LoginWithSocial />
//       </div>
//     </div>
//   );
// };

// export default FormContent;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebase"; // Adjust import as needed
import { toast } from "react-toastify";
import LoginWithSocial from "./LoginWithSocial";

const API_URL = "https://2u7ec1e22c.execute-api.ap-south-1.amazonaws.com/staging/users"; 
// The base URL for your backend

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 1) First, sign in with Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Firebase sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2: If sign in succeeds, call your custom backend to fetch user details
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: "GetUser", // crucial so the backend doesn't complain about 'Route not specified'
          email: email,     // the email we just used for Firebase sign-in
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to retrieve user details");
      }

      // data now contains your user info (user_type, name, phone_number, etc.)
      // You can store this in your global AuthContext or localStorage as needed.
      console.log("Custom backend user data:", data);

      // For example, we might do:
      localStorage.setItem("user", JSON.stringify(data));

      // If you have user_type logic for navigation:
      const userType = data.user_type;
      if (userType === "Employer") {
        navigate("/employers-dashboard/dashboard");
      } else if (userType === "Candidate") {
        navigate("/candidates-dashboard/dashboard");
      } else {
        // fallback or default route
        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login to TeacherLink</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </div>
      </form>

      <div className="text">
        Forgot Password? <Link to="/forgetpassword">Reset Password</Link>
      </div>
      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link to="/register">Signup</Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
    </div>
  );
};

export default FormContent;

