// const LoginWithSocial = () => {
//   return (
//     <div className="btn-box row">
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two facebook-btn">
//           <i className="fab fa-facebook-f"></i> Log In via Facebook
//         </a>
//       </div>
//       <div className="col-lg-6 col-md-12">
//         <a href="#" className="theme-btn social-btn-two google-btn">
//           <i className="fab fa-google"></i> Log In via Gmail
//         </a>
//       </div>
//     </div>
//   );
// };

// export default LoginWithSocial;

import { auth, googleProvider } from "../../../../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LoginWithSocial = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Login with Google successful!");
      navigate("/dashboard");
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
