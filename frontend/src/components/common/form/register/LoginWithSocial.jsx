import { auth, googleProvider } from "../../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginWithSocial = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login with Google successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="btn-box row">
      <div className="col-lg-6 col-md-12">
        <button
          className="theme-btn social-btn-two google-btn"
          onClick={handleGoogleSignIn}
        >
          <i className="fab fa-google"></i> Log In via Google
        </button>
      </div>
    </div>
  );
};

export default LoginWithSocial;
