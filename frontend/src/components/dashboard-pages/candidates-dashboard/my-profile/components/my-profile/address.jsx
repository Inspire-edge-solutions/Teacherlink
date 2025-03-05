// import { useState } from "react";
// import axios from "axios";
// import Select from "react-select";
// import csc from "countries-states-cities"; // Package to get countries, states, and cities

// const Address = ({city,houseNo,pincode,className}) => {
//   const [formData, setFormData] = useState({
//     permanentAddress: {
//       country: null,
//       state: null,
//       city: null,
//       houseNo: "",
//       street: "",
//       pincode: ""
//     },
//     presentAddress: {
//       country: null,
//       state: null,
//       city: null,
//       houseNo: "",
//       street: "",
//       sameAsPermanent: false,
//       pincode: ""
//     }
//   });

//   const countries = csc.getAllCountries().map(country => ({
//     value: country.id,
//     label: country.name
//   }));

//   const getStates = countryId => {
//     return countryId
//       ? csc.getStatesOfCountry(countryId).map(state => ({
//           value: state.id,
//           label: state.name
//         }))
//       : [];
//   };

//   const getCities = stateId => {
//     return stateId
//       ? csc.getCitiesOfState(stateId).map(city => ({
//           value: city.id,
//           label: city.name
//         }))
//       : [];
//   };

//   const handleAddressChange = (addressType, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [addressType]: {
//         ...prev[addressType],
//         [field]: value
//       }
//     }));
//   };

//   const handleSameAsPermanent = e => {
//     if (e.target.checked) {
//       setFormData(prev => ({
//         ...prev,
//         presentAddress: {
//           ...prev.permanentAddress,
//           sameAsPermanent: true
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         presentAddress: {
//           country: null,
//           state: null,
//           city: null,
//           houseNo: "",
//           street: "",
//           pincode: "",
//           sameAsPermanent: false
//         }
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Prepare the payload for permanent address (without user_id)
//     const permanentAddressPayload = {
//       country_name: formData.permanentAddress.country?.label,
//       state_name: formData.permanentAddress.state?.label,
//       city_name: formData.permanentAddress.city?.label,
//       house_no: formData.permanentAddress.houseNo,
//       street: formData.permanentAddress.street
//     };

//     // Prepare the payload for present address (only if it's different)
//     const presentAddressPayload = formData.presentAddress.sameAsPermanent
//       ? { ...permanentAddressPayload } // If same, use permanent address
//       : {
//           country_name: formData.presentAddress.country?.label,
//           state_name: formData.presentAddress.state?.label,
//           city_name: formData.presentAddress.city?.label,
//           house_no: formData.presentAddress.houseNo,
//           street: formData.presentAddress.street
//       };

//     try {
//       // Send the data to the permanent address API (don't include user_id)
//       const permanentResponse = await axios.post(
//         "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/permanentAddress",
//         permanentAddressPayload,
//         {
//           headers: { "Content-Type": "application/json" }
//         }
//       );

//       if (permanentResponse.status === 200 || permanentResponse.status === 201) {
//         // alert("Permanent address saved successfully!");
//       } else {
//         throw new Error("Failed to save permanent address");
//       }

//       // Send the data to the present address API (don't include user_id)
//       const presentResponse = await axios.post(
//         "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
//         presentAddressPayload,
//         {
//           headers: { "Content-Type": "application/json" }
//         }
//       );

//       if (presentResponse.status === 200 || presentResponse.status === 201) {
//         alert("address added successfully!");
//       } else {
//         throw new Error("Failed to save present address");
//       }

//     } catch (error) {
//       console.error("Error details:", error.response?.data || error.message || "Unknown error");
//       alert(`Error: ${error.response?.data?.message || error.message || "Failed to save address"}`);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className={`address ${className}`}>
//       <div className="row">
//         {/* Permanent Address */}
//         <div className="form-group col-lg-6 col-md-12">
//           <h3>Permanent Address</h3>
//           <div className="form-group">
//             <Select
//             required
//             id="permanentCountry"
//             name="permanentCountry"
//             placeholder="Country"
//             className={`custom-select ${!formData.permanentAddress.country ? 'required' : ''}`}
//             options={countries}
//             value={formData.permanentAddress.country}
//             onChange={option => {
//               handleAddressChange("permanentAddress", "country", option);
//               handleAddressChange("permanentAddress", "state", null);
//               handleAddressChange("permanentAddress", "city", null);
//             }}
//           />
//           </div>

//           <div className="form-group">
//           <Select
//             required
//             id="permanentState"
//             name="permanentState"
//             placeholder="State/UT"
//             className={`custom-select ${!formData.permanentAddress.state ? 'required' : ''}`}
//             options={getStates(formData.permanentAddress.country?.value)}
//             value={formData.permanentAddress.state}
//             onChange={option => {
//               handleAddressChange("permanentAddress", "state", option);
//               handleAddressChange("permanentAddress", "city", null);
//             }}
//           />
//           </div>
//            {city && (
//           <div className="form-group">
//           <Select
//             required
//             id="permanentCity"
//             name="permanentCity"
//             placeholder="City"
//             options={getCities(formData.permanentAddress.state?.value)}
//             value={formData.permanentAddress.city}
//             onChange={option => handleAddressChange("permanentAddress", "city", option)}
//           />
//           </div>
//           )}
//           {houseNo && (
//           <div className="form-group">
//           <input
//             id="permanentHouseNo"
//             name="permanentHouseNo"
//             type="text"
//             placeholder="House No. & Street"
//             value={formData.permanentAddress.houseNo}
//             onChange={e => handleAddressChange("permanentAddress", "houseNo", e.target.value)}
//             maxLength="50"
//           />
//           </div>
//           )}
         
//           {pincode && (
//           <div className="form-group">
//           <input
//             id="permanentPincode"
//             name="permanentPincode"
//             type="text"
//             placeholder="Pincode"
//             value={formData.permanentAddress.pincode}
//             onChange={e => handleAddressChange("permanentAddress", "pincode", e.target.value)}
//             onInput={(e) => {
//               e.target.value = e.target.value.replace(/[^0-9]/g, '');
//             }}
//             maxLength="6"
//           />          
//         </div>
//         )}
//         </div>

//         {/* Present Address */}
//         <div className="form-group col-lg-6 col-md-12">
//           <h3>Present Address</h3>
//           <div className="form-group">
//           <label>
//             <input
//               id="sameAsPermanent"
//               name="sameAsPermanent"
//               type="checkbox"
//               onChange={handleSameAsPermanent}
//               checked={formData.presentAddress.sameAsPermanent}
//             />
//             Same as permanent address
//           </label>
//           </div>

//           {!formData.presentAddress.sameAsPermanent && (
//             <>
//              <div className="form-group">
//                 <Select
//                 required
//                 id="presentCountry"
//                 name="presentCountry"
//                 placeholder="Country"
//                 className={`custom-select ${!formData.presentAddress.country ? 'required' : ''}`}
//                 options={countries}
//                 value={formData.presentAddress.country}
//                 onChange={option => {
//                   handleAddressChange("presentAddress", "country", option);
//                   handleAddressChange("presentAddress", "state", null);
//                   handleAddressChange("presentAddress", "city", null);
//                 }}
//               />
//               </div>
//                <div className="form-group">
//               <Select
//                 required
//                 id="presentState"
//                 name="presentState"
//                 placeholder="State/UT"
//                 className={`custom-select ${!formData.presentAddress.state ? 'required' : ''}`}
//                 options={getStates(formData.presentAddress.country?.value)}
//                 value={formData.presentAddress.state}
//                 onChange={option => {
//                   handleAddressChange("presentAddress", "state", option);
//                   handleAddressChange("presentAddress", "city", null);
//                 }}
//               />
//               </div>
//               {city && (
//               <div className="form-group">
//               <Select
//                 required
//                 id="presentCity"
//                 name="presentCity"
//                 placeholder="City"
//                 options={getCities(formData.presentAddress.state?.value)}
//                 value={formData.presentAddress.city}
//                 onChange={option => handleAddressChange("presentAddress", "city", option)}
//               />
//               </div>
//               )}
//               {houseNo && (
//               <div className="form-group">
//               <input
//                 id="presentHouseNo"
//                 name="presentHouseNo"
//                 type="text"
//                 placeholder="House No. & Street"
//                 value={formData.presentAddress.houseNo}
//                 onChange={e => handleAddressChange("presentAddress", "houseNo", e.target.value)}
//                 maxLength="50"
                
//               />
//               </div>
//               )}
//               {pincode && (
//               <div className="form-group">
//               <input
//                 id="presentPincode"
//                 name="presentPincode"
//                 type="text"
//                 placeholder="Pincode"
//                 value={formData.presentAddress.pincode}
//                 onChange={e => handleAddressChange("presentAddress", "pincode", e.target.value)}
//                 onInput={(e) => {
//                   e.target.value = e.target.value.replace(/[^0-9]/g, '');
//                 }}
//                 maxLength="6"
              
//               />
//               </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="form-group col-lg-12 col-md-12">
//           <button type="submit" className="theme-btn btn-style-three">
//             Save Address
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default Address;


import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import csc from "countries-states-cities"; // Package to get countries, states, and cities

const Address = ({ className }) => {
  // Updated state: use house_no_and_street instead of separate houseNo and street.
  const [formData, setFormData] = useState({
    permanentAddress: {
      country: null,
      state: null,
      city: null,
      house_no_and_street: "",
      pincode: ""
    },
    presentAddress: {
      country: null,
      state: null,
      city: null,
      house_no_and_street: "",
      pincode: "",
      sameAsPermanent: false
    }
  });

  const countries = csc.getAllCountries().map((country) => ({
    value: country.id,
    label: country.name
  }));

  const getStates = (countryId) => {
    return countryId
      ? csc.getStatesOfCountry(countryId).map((state) => ({
          value: state.id,
          label: state.name
        }))
      : [];
  };

  const getCities = (stateId) => {
    return stateId
      ? csc.getCitiesOfState(stateId).map((city) => ({
          value: city.id,
          label: city.name
        }))
      : [];
  };

  const handleAddressChange = (addressType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleSameAsPermanent = (e) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        presentAddress: {
          ...prev.permanentAddress,
          sameAsPermanent: true
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        presentAddress: {
          country: null,
          state: null,
          city: null,
          house_no_and_street: "",
          pincode: "",
          sameAsPermanent: false
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload for permanent address
    const permanentAddressPayload = {
      country_name: formData.permanentAddress.country?.label || "",
      state_name: formData.permanentAddress.state?.label || "",
      city_name: formData.permanentAddress.city?.label || "",
      house_no_and_street: formData.permanentAddress.house_no_and_street,
      pincode: formData.permanentAddress.pincode
    };

    // Prepare the payload for present address
    const presentAddressPayload = formData.presentAddress.sameAsPermanent
      ? { ...permanentAddressPayload }
      : {
          country_name: formData.presentAddress.country?.label || "",
          state_name: formData.presentAddress.state?.label || "",
          city_name: formData.presentAddress.city?.label || "",
          house_no_and_street: formData.presentAddress.house_no_and_street,
          pincode: formData.presentAddress.pincode
        };

    try {
      // Send the data to the permanent address API (without user_id)
      const permanentResponse = await axios.post(
        "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/permanentAddress",
        permanentAddressPayload,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!(permanentResponse.status === 200 || permanentResponse.status === 201)) {
        throw new Error("Failed to save permanent address");
      }

      // Send the data to the present address API (without user_id)
      const presentResponse = await axios.post(
        "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
        presentAddressPayload,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (presentResponse.status === 200 || presentResponse.status === 201) {
        alert("Address added successfully!");
      } else {
        throw new Error("Failed to save present address");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message || "Unknown error");
      alert(`Error: ${error.response?.data?.message || error.message || "Failed to save address"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`address ${className}`}>
      <div className="row">
        {/* Permanent Address Section */}
        <div className="form-group col-lg-6 col-md-12">
          <h3>Permanent Address</h3>
          <div className="form-group">
            <Select
              required
              id="permanentCountry"
              name="permanentCountry"
              placeholder="Country"
              className={`custom-select ${!formData.permanentAddress.country ? "required" : ""}`}
              options={countries}
              value={formData.permanentAddress.country}
              onChange={(option) => {
                handleAddressChange("permanentAddress", "country", option);
                handleAddressChange("permanentAddress", "state", null);
                handleAddressChange("permanentAddress", "city", null);
              }}
            />
          </div>

          <div className="form-group">
            <Select
              required
              id="permanentState"
              name="permanentState"
              placeholder="State/UT"
              className={`custom-select ${!formData.permanentAddress.state ? "required" : ""}`}
              options={getStates(formData.permanentAddress.country?.value)}
              value={formData.permanentAddress.state}
              onChange={(option) => {
                handleAddressChange("permanentAddress", "state", option);
                handleAddressChange("permanentAddress", "city", null);
              }}
            />
          </div>

          <div className="form-group">
            <Select
              required
              id="permanentCity"
              name="permanentCity"
              placeholder="City"
              options={getCities(formData.permanentAddress.state?.value)}
              value={formData.permanentAddress.city}
              onChange={(option) => handleAddressChange("permanentAddress", "city", option)}
            />
          </div>

          <div className="form-group">
            <input
              id="permanentHouseNo"
              name="permanentHouseNo"
              type="text"
              placeholder="House No. & Street"
              value={formData.permanentAddress.house_no_and_street}
              onChange={(e) =>
                handleAddressChange("permanentAddress", "house_no_and_street", e.target.value)
              }
              maxLength="50"
            />
          </div>

          <div className="form-group">
            <input
              id="permanentPincode"
              name="permanentPincode"
              type="text"
              placeholder="Pincode"
              value={formData.permanentAddress.pincode}
              onChange={(e) =>
                handleAddressChange("permanentAddress", "pincode", e.target.value)
              }
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              maxLength="6"
            />
          </div>
        </div>

        {/* Present Address Section */}
        <div className="form-group col-lg-6 col-md-12">
          <h3>Present Address</h3>
          <div className="form-group">
            <label>
              <input
                id="sameAsPermanent"
                name="sameAsPermanent"
                type="checkbox"
                onChange={handleSameAsPermanent}
                checked={formData.presentAddress.sameAsPermanent}
              />
              Same as permanent address
            </label>
          </div>

          {!formData.presentAddress.sameAsPermanent && (
            <>
              <div className="form-group">
                <Select
                  required
                  id="presentCountry"
                  name="presentCountry"
                  placeholder="Country"
                  className={`custom-select ${!formData.presentAddress.country ? "required" : ""}`}
                  options={countries}
                  value={formData.presentAddress.country}
                  onChange={(option) => {
                    handleAddressChange("presentAddress", "country", option);
                    handleAddressChange("presentAddress", "state", null);
                    handleAddressChange("presentAddress", "city", null);
                  }}
                />
              </div>

              <div className="form-group">
                <Select
                  required
                  id="presentState"
                  name="presentState"
                  placeholder="State/UT"
                  className={`custom-select ${!formData.presentAddress.state ? "required" : ""}`}
                  options={getStates(formData.presentAddress.country?.value)}
                  value={formData.presentAddress.state}
                  onChange={(option) => {
                    handleAddressChange("presentAddress", "state", option);
                    handleAddressChange("presentAddress", "city", null);
                  }}
                />
              </div>

              <div className="form-group">
                <Select
                  required
                  id="presentCity"
                  name="presentCity"
                  placeholder="City"
                  options={getCities(formData.presentAddress.state?.value)}
                  value={formData.presentAddress.city}
                  onChange={(option) => handleAddressChange("presentAddress", "city", option)}
                />
              </div>

              <div className="form-group">
                <input
                  id="presentHouseNo"
                  name="presentHouseNo"
                  type="text"
                  placeholder="House No. & Street"
                  value={formData.presentAddress.house_no_and_street}
                  onChange={(e) =>
                    handleAddressChange("presentAddress", "house_no_and_street", e.target.value)
                  }
                  maxLength="50"
                />
              </div>

              <div className="form-group">
                <input
                  id="presentPincode"
                  name="presentPincode"
                  type="text"
                  placeholder="Pincode"
                  value={formData.presentAddress.pincode}
                  onChange={(e) =>
                    handleAddressChange("presentAddress", "pincode", e.target.value)
                  }
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  maxLength="6"
                />
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-three">
            Save Address
          </button>
        </div>
      </div>
    </form>
  );
};

export default Address;