import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../../../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuth } from "../../../../contexts/AuthContext";
import LoginWithSocial from "./LoginWithSocial";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // If the blocked popup is showing, do not navigate.
    if (showBlockedPopup) return;

    if (user?.user_type && loginAttempted && location.pathname === "/login") {
      console.log("Navigating with user type:", user.user_type);
      if (user.user_type === "Employer") {
        navigate("/employers-dashboard/dashboard", { replace: true });
      } else if (user.user_type === "Candidate") {
        navigate("/candidates-dashboard/dashboard", { replace: true });
      }
      setLoginAttempted(false);
    }
  }, [user, loginAttempted, navigate, location.pathname, showBlockedPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign in via Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebase_uid = userCredential.user.uid;
      console.log("Firebase UID:", firebase_uid);

      // 2. Immediately call your API to check if the user is blocked
      const queryParams = new URLSearchParams({ firebase_uid });
      const apiUrl = `https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/personal?${queryParams.toString()}`;
      console.log("API URL:", apiUrl);

      const apiResponse = await fetch(apiUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!apiResponse.ok) {
        console.error("API response not ok", apiResponse.status);
        toast.error("Error fetching user status");
        setLoading(false);
        return;
      }

      const apiData = await apiResponse.json();
      console.log("API Data:", apiData);

      // 3. The API returns an array, so we check the first item
      if (Array.isArray(apiData) && apiData.length > 0) {
        const userData = apiData[0];
        console.log("userData.isBlocked:", userData.isBlocked);

        // If blocked, sign out and show the popup
        if (userData.isBlocked === 1 || userData.isBlocked === "1") {
          await signOut(auth);
          setShowBlockedPopup(true);
          return;
        }
      } else {
        console.error("Unexpected API response format");
        toast.error("Unexpected user status response");
        setLoading(false);
        return;
      }

      // 4. If not blocked, continue with normal login flow
      setLoginAttempted(true);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If the user is blocked, render a popup that covers the screen
  if (showBlockedPopup) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            position: "relative",
            zIndex: 10000,
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => {
              setShowBlockedPopup(false);
              navigate("/login"); // Return to the login page
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              border: "none",
              background: "transparent",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            X
          </button>
          <div style={{ fontSize: "32px", color: "red", marginBottom: "1rem" }}>🚫</div>
          <p style={{ fontSize: "1.2rem" }}>Your profile is blocked</p>
        </div>
      </div>
    );
  }

  // Otherwise, render the normal login form
  return (
    <div className="form-inner">
      <h3>Login to TeacherLink!</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
