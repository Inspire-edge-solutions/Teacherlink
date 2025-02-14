// // const LoginWithSocial = () => {
// //   return (
// //     <div className="btn-box row">
// //       <div className="col-lg-6 col-md-12">
// //         <a href="#" className="theme-btn social-btn-two facebook-btn">
// //           <i className="fab fa-facebook-f"></i> Log In via Facebook
// //         </a>
// //       </div>
// //       <div className="col-lg-6 col-md-12">
// //         <a href="#" className="theme-btn social-btn-two google-btn">
// //           <i className="fab fa-google"></i> Log In via Google
// //         </a>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginWithSocial;

// // const LoginWithSocial = () => {
// //   return (
// //     <div className="btn-box row">
// //       <div className="col-lg-6 col-md-12">
// //         <a href="#" className="theme-btn social-btn-two facebook-btn">
// //           <i className="fab fa-facebook-f"></i> Log In via Facebook
// //         </a>
// //       </div>
// //       <div className="col-lg-6 col-md-12">
// //         <a href="#" className="theme-btn social-btn-two google-btn">
// //           <i className="fab fa-google"></i> Log In via Gmail
// //         </a>
// //       </div>
// //     </div>
// //   );
// // };

// // export default LoginWithSocial;

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
        <button style={{display:"flex",justifyContent:"center",alignItems:"center"}}
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


// import {signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../../../firebase";
// import { useNavigate } from "react-router-dom";



// const LoginWithSocial = () => {
//   const navigate = useNavigate();

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const idToken = await result.user.getIdToken();

//       const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/logingoogle", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ idToken }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Google login failed");
//       }

//       localStorage.setItem("user", JSON.stringify(data.data));
//       alert("Google Login Successful!");
//       navigate("/");
//     } catch (error) {
//       console.error("Google Login Error:", error);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="btn-box row">
//       <div className="col-lg-6 col-md-12">
//         <button onClick={handleGoogleLogin} className="theme-btn social-btn-two google-btn">
//           <i className="fab fa-google"></i> Log In via Google
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginWithSocial;