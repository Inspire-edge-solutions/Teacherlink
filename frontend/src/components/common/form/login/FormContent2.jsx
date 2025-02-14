import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginWithSocial from "./LoginWithSocial";

  const API_URL = "https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/login"; // Replace with actual API URL

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          route: "LoginUser",
          email, 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store session data (e.g., token) in local storage or context
      localStorage.setItem("user", JSON.stringify(data.data));

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default FormContent;


// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import LoginWithSocial from "./LoginWithSocial";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { app } from "../../../../firebase";

// const API_URL = "https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/login";

// const FormContent = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const auth = getAuth(app);
//   const provider = new GoogleAuthProvider();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ route: "LoginUser", email, password }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("user", JSON.stringify(data.data));
//       alert("Login successful!");
//       navigate("/");
//     } catch (error) {
//       alert(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const idToken = await result.user.getIdToken();
      
//       const response = await fetch(GOOGLE_LOGIN_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ route: "LoginWithGoogle", idToken }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Google Login failed");

//       localStorage.setItem("user", JSON.stringify(data.data));
//       alert("Google Login successful!");
//       navigate("/");
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="form-inner">
//       <h3>Login to TeacherLink</h3>
//       <form onSubmit={handleLogin}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Enter Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </div>
//       </form>
      
//       <div className="bottom-box">
//         <div className="text">
//           Don&apos;t have an account? <Link to="/register">Signup</Link>
//         </div>

//         <div className="divider">
//           <span>or</span>
//         </div>

//         <LoginWithSocial onGoogleLogin={handleGoogleLogin} />
//       </div>
//     </div>
//   );
// };

// export default FormContent;