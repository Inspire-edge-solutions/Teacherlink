// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const FormContent = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Prepare the payload for your backend API
//       const userData = {
//         name: name,
//         email: email,
//         password: password, // Password will be handled securely by the backend
//         phone_number: phoneNumber, // Ensure this is correctly passed
//       };

//       // Send the data to your backend API using axios
//       const response = await axios.post("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/register", {
//         route: "RegisterUser",
//         ...userData,
//       }, {
//         headers: {
//           "Content-Type": "application/json",
//         }
//       });

//       if (response.status === 201) {
//         alert("Registration successful! Please login.");
//         navigate("/login");
//       } else {
//         // Handle backend errors
//         alert(`Backend Error: ${response.data.message}`);
//       }
//     } catch (error) {
//       // Handle errors from Axios or the fetch call
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <form onSubmit={handleRegister}>
//       <div className="form-group">
//         <label>Name :</label>
//         <input
//           type="text"
//           placeholder="Enter Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Email Address :</label>
//         <input
//           type="email"
//           placeholder="Enter email address, Example: abcd@gmail.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Password :</label>
//         <input
//           type="password"
//           placeholder="Enter password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Mobile number :</label>
//         <input
//           type="number"
//           placeholder="Enter mobile number"
//           value={phoneNumber} // Ensure this is linked to the correct state
//           onChange={(e) => setPhoneNumber(e.target.value)} // Ensure this updates the state
//           required
//         />
//       </div>

//       <div className="form-group">
//         <button className="theme-btn btn-style-one" type="submit" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>
//       </div>
//     </form>
//   );
// };

// export default FormContent;


import { useState } from "react";
import { auth } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormContent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Create the user in Firebase with email and password only
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user; // Get the user object from Firebase
        console.log(user);

        // Prepare the payload for your backend API
        const userData = {
          firebaseUid: user.uid, // Firebase User ID
          name: name,
          email: user.email,
          password: password, // This might be a security risk if password is logged or reused
          number: number, // Custom field captured from your form
        };

        // Send the data to your backend API using axios
        return axios.post("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/login", {
          route: "RegisterUser",
          ...userData,
        }, {
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        // Handle success
        if (response.status === 200) {
          alert("Registration successful! Please login.");
          navigate("/login");
        } else {
          // Handle backend errors
          alert(`Backend Error: ${response.statusText}`);
        }
      })
      .catch((error) => {
        // Handle errors from Firebase, Axios or the fetch call
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <form onSubmit={handleRegister}>sddfsdfsdf
      <div className="form-group">
        <label>Name :</label>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Mobile number :</label>
        <input
          type="number"
          placeholder="Enter mobile number"
          value={number}
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