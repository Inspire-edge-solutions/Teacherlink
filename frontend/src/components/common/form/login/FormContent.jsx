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

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert(error.message);
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button  className="theme-btn btn-style-one" type="submit">
            Login
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