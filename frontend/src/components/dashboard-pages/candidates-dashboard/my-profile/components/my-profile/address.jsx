import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import csc from "countries-states-cities"; // Package to get countries, states, and cities

const Address = ({city,houseNo,street}) => {
  const [formData, setFormData] = useState({
    permanentAddress: {
      country: null,
      state: null,
      city: null,
      houseNo: "",
      street: ""
    },
    presentAddress: {
      country: null,
      state: null,
      city: null,
      houseNo: "",
      street: "",
      sameAsPermanent: false
    }
  });

  const countries = csc.getAllCountries().map(country => ({
    value: country.id,
    label: country.name
  }));

  const getStates = countryId => {
    return countryId
      ? csc.getStatesOfCountry(countryId).map(state => ({
          value: state.id,
          label: state.name
        }))
      : [];
  };

  const getCities = stateId => {
    return stateId
      ? csc.getCitiesOfState(stateId).map(city => ({
          value: city.id,
          label: city.name
        }))
      : [];
  };

  const handleAddressChange = (addressType, field, value) => {
    setFormData(prev => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        [field]: value
      }
    }));
  };

  const handleSameAsPermanent = e => {
    if (e.target.checked) {
      setFormData(prev => ({
        ...prev,
        presentAddress: {
          ...prev.permanentAddress,
          sameAsPermanent: true
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        presentAddress: {
          country: null,
          state: null,
          city: null,
          houseNo: "",
          street: "",
          sameAsPermanent: false
        }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload for permanent address (without user_id)
    const permanentAddressPayload = {
      country_name: formData.permanentAddress.country?.label,
      state_name: formData.permanentAddress.state?.label,
      city_name: formData.permanentAddress.city?.label,
      house_no: formData.permanentAddress.houseNo,
      street: formData.permanentAddress.street
    };

    // Prepare the payload for present address (only if it's different)
    const presentAddressPayload = formData.presentAddress.sameAsPermanent
      ? { ...permanentAddressPayload } // If same, use permanent address
      : {
          country_name: formData.presentAddress.country?.label,
          state_name: formData.presentAddress.state?.label,
          city_name: formData.presentAddress.city?.label,
          house_no: formData.presentAddress.houseNo,
          street: formData.presentAddress.street
      };

    try {
      // Send the data to the permanent address API (don't include user_id)
      const permanentResponse = await axios.post(
        "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/permanentAddress",
        permanentAddressPayload,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (permanentResponse.status === 200 || permanentResponse.status === 201) {
        // alert("Permanent address saved successfully!");
      } else {
        throw new Error("Failed to save permanent address");
      }

      // Send the data to the present address API (don't include user_id)
      const presentResponse = await axios.post(
        "https://wf6d1c6dcd.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
        presentAddressPayload,
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      if (presentResponse.status === 200 || presentResponse.status === 201) {
        alert("address added successfully!");
      } else {
        throw new Error("Failed to save present address");
      }

    } catch (error) {
      console.error("Error details:", error.response?.data || error.message || "Unknown error");
      alert(`Error: ${error.response?.data?.message || error.message || "Failed to save address"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="default-form">
      <div className="row">
        {/* Permanent Address */}
        <div className="form-group col-lg-6 col-md-12">
          <h3>Permanent Address</h3>
          <div className="form-group">
          <Select
            id="permanentCountry"
            name="permanentCountry"
            placeholder="Select Country"
            options={countries}
            value={formData.permanentAddress.country}
            onChange={option => {
              handleAddressChange("permanentAddress", "country", option);
              handleAddressChange("permanentAddress", "state", null);
              handleAddressChange("permanentAddress", "city", null);
            }}
          />
          </div>

          <div className="form-group">
          <Select
            id="permanentState"
            name="permanentState"
            placeholder="Select State/UT"
            options={getStates(formData.permanentAddress.country?.value)}
            value={formData.permanentAddress.state}
            onChange={option => {
              handleAddressChange("permanentAddress", "state", option);
              handleAddressChange("permanentAddress", "city", null);
            }}
          />
          </div>
           {city && (
          <div className="form-group">
          <Select
            id="permanentCity"
            name="permanentCity"
            placeholder="Select City"
            options={getCities(formData.permanentAddress.state?.value)}
            value={formData.permanentAddress.city}
            onChange={option => handleAddressChange("permanentAddress", "city", option)}
          />
          </div>
          )}
          {houseNo && (
          <div className="form-group">
          <input
            id="permanentHouseNo"
            name="permanentHouseNo"
            type="text"
            placeholder="House No."
            value={formData.permanentAddress.houseNo}
            onChange={e => handleAddressChange("permanentAddress", "houseNo", e.target.value)}
            required
          />
          </div>
          )}
          {street && (
          <div className="form-group">
          <input
            id="permanentStreet"
            name="permanentStreet"
            type="text"
            placeholder="Street"
            value={formData.permanentAddress.street}
            onChange={e => handleAddressChange("permanentAddress", "street", e.target.value)}
            required
          />
          </div>
          )}
        </div>

        {/* Present Address */}
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
                id="presentCountry"
                name="presentCountry"
                placeholder="Select Country"
                options={countries}
                value={formData.presentAddress.country}
                onChange={option => {
                  handleAddressChange("presentAddress", "country", option);
                  handleAddressChange("presentAddress", "state", null);
                  handleAddressChange("presentAddress", "city", null);
                }}
              />
              </div>
               <div className="form-group">
              <Select
                id="presentState"
                name="presentState"
                placeholder="Select State/UT"
                options={getStates(formData.presentAddress.country?.value)}
                value={formData.presentAddress.state}
                onChange={option => {
                  handleAddressChange("presentAddress", "state", option);
                  handleAddressChange("presentAddress", "city", null);
                }}
              />
              </div>
              {city && (
              <div className="form-group">
              <Select
                id="presentCity"
                name="presentCity"
                placeholder="Select City"
                options={getCities(formData.presentAddress.state?.value)}
                value={formData.presentAddress.city}
                onChange={option => handleAddressChange("presentAddress", "city", option)}
              />
              </div>
              )}
              {houseNo && (
              <div className="form-group">
              <input
                id="presentHouseNo"
                name="presentHouseNo"
                type="text"
                placeholder="House No."
                value={formData.presentAddress.houseNo}
                onChange={e => handleAddressChange("presentAddress", "houseNo", e.target.value)}
                required
              />
              </div>
              )}
              {street && (
              <div className="form-group">
              <input
                id="presentStreet"
                name="presentStreet"
                type="text"
                placeholder="Street"
                value={formData.presentAddress.street}
                onChange={e => handleAddressChange("presentAddress", "street", e.target.value)}
                required
              />
              </div>
              )}
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save Address
          </button>
        </div>
      </div>
    </form>
  );
};

export default Address;
