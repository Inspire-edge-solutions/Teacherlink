// const FormContent = () => {
//   return (
//     <form method="post" action="add-parcel.html">
//       <div className="form-group">
//         <label>Email Address</label>
//         <input type="email" name="username" placeholder="Username" required />
//       </div>
//       {/* name */}

//       <div className="form-group">
//         <label>Password</label>
//         <input
//           id="password-field"
//           type="password"
//           name="password"
//           placeholder="Password"
//         />
//       </div>
//       {/* password */}

//       <div className="form-group">
//         <button className="theme-btn btn-style-one" type="submit">
//           Register
//         </button>
//       </div>
//       {/* login */}
//     </form>
//   );
// };

// export default FormContent;

import { useState } from "react";
import { auth } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const FormContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password, number);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div className="form-group">
        <label>Email Address :</label>
        <input
          type="email"
          placeholder="Enter email address, Example : abcd@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Password :</label>
        <input
          type="password"
          placeholder="Enter Password containing letters,numbers,characters, Example : abcd@1234"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mobile number :</label>
        <input
          type="number"
          placeholder="Enter your mobile number, Ex: 9987665432"
          value={password}
          onChange={(e) => setNumber(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <button className="theme-btn btn-style-one" type="submit">
          Register
        </button>
      </div>
    </form>
  );
};

export default FormContent;

