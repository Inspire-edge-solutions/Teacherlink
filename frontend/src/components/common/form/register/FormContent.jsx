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

// import { useState } from "react";
// import { auth } from "../../../../firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const FormContent = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [number, setNumber] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
  
//     try {
//       // Create the user in Firebase
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user; // Get the user object from Firebase
  
//       // Prepare the payload for your backend API
//       const userData = {
//         firebaseUid: user.uid, // Firebase User ID
//         email: user.email,
//         number: number, // Custom field you are capturing
//       };
  
//       // Send the data to your backend API
//       const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(userData),
//       });
  
//       if (response.ok) {
//         // Handle success
//         alert("Registration successful! Please login.");
//         navigate("/login");
//       } else {
//         // Handle backend errors
//         const errorData = await response.json();
//         alert(`Backend Error: ${errorData.message}`);
//       }
//     } catch (error) {
//       // Handle errors from Firebase or the fetch call
//       alert(`Error: ${error.message}`);
//     }
//   };
  

//   return (
//     <form onSubmit={handleRegister}>
//       <div className="form-group">
//         <label>Email Address :</label>
//         <input
//           type="email"
//           placeholder="Enter email address, Example : abcd@gmail.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Password :</label>
//         <input
//           type="password"
//           placeholder="Enter Password containing letters,numbers,characters, Example : abcd@1234"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <label>Mobile number :</label>
//         <input
//           type="number"
//           placeholder="Enter your mobile number, Ex: 9987665432"
//           value={number}
//           onChange={(e) => setNumber(e.target.value)}
//           required
//         />
//       </div>

//       <div className="form-group">
//         <button className="theme-btn btn-style-one" type="submit">
//           Register
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

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     // Create the user in Firebase with email and password only
  //     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user; // Get the user object from Firebase
  //     console.log(user);
  
  //     // Prepare the payload for your backend API
  //     const userData = {
  //       firebaseUid: user.uid, // Firebase User ID
  //       name: name,
  //       email: user.email,
  //       password:user.password,// Custom field captured from your form
  //       number: number, // Custom field captured from your form
  //     };
  
  //     // Send the data to your backend API
  //     const response = await fetch("https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         route: "registerUser",
  //         ...userData,
  //       }),
  //     });
  
  //     if (response.ok) {
  //       // Handle success
  //       alert("Registration successful! Please login.");
  //       navigate("/login");
  //     } else {
  //       // Handle backend errors
  //       const errorData = await response.json();
  //       alert(`Backend Error: ${errorData.message}`);
  //     }
  //   } catch (error) {
  //     // Handle errors from Firebase or the fetch call
  //     alert(`Error: ${error.message}`);
  //   }
  // };
  
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
      })
      .then((response) => {
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
    <form onSubmit={handleRegister}>

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