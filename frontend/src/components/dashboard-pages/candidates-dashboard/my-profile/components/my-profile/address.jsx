import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import csc from "countries-states-cities"; // For countries, states, cities
import { useAuth } from "../../../../../../contexts/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Address = ({ className, permanentCity, presentCity }) => {
  const { user } = useAuth(); // Current user from AuthContext

  // ========== Form State ==========
  const [formData, setFormData] = useState({
    permanentAddress: {
      country: null,       // { value: countryId, label: countryName }
      state: null,         // { value: stateId,   label: stateName   }
      city: null,          // { value: cityId,    label: cityName    }
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

  // ========== CSC Data ==========
  // Convert csc data into react-select friendly objects
  const countries = csc.getAllCountries().map(country => ({
    value: country.id,
    label: country.name
  }));

  const getStates = (countryId) => {
    return countryId
      ? csc.getStatesOfCountry(countryId).map(state => ({
          value: state.id,
          label: state.name
        }))
      : [];
  };

  const getCities = (stateId) => {
    return stateId
      ? csc.getCitiesOfState(stateId).map(city => ({
          value: city.id,
          label: city.name
        }))
      : [];
  };

  // ========== Helper: find csc object by name ==========
  // Because your DB stores e.g. "country_name" as a string, we must find
  // a matching csc object so react-select can display the correct option.

  const findCountryByName = (name) => {
    if (!name) return null;
    const match = csc.getAllCountries().find(c => c.name.toLowerCase() === name.toLowerCase());
    return match
      ? { value: match.id, label: match.name }
      : null;
  };

  const findStateByName = (name, countryId) => {
    if (!name || !countryId) return null;
    const match = csc.getStatesOfCountry(countryId).find(s => s.name.toLowerCase() === name.toLowerCase());
    return match
      ? { value: match.id, label: match.name }
      : null;
  };

  const findCityByName = (name, stateId) => {
    if (!name || !stateId) return null;
    const match = csc.getCitiesOfState(stateId).find(ci => ci.name.toLowerCase() === name.toLowerCase());
    return match
      ? { value: match.id, label: match.name }
      : null;
  };

  // ========== Sync Form State Changes ==========
  const handleAddressChange = (addressType, field, value) => {
    const newFormData = {
      ...formData,
      [addressType]: {
        ...formData[addressType],
        [field]: value
      }
    };
    setFormData(newFormData);

    // Check if required fields are filled
    const isValid = validateAddressFields(newFormData);
    updateFormData(newFormData, isValid);
  };

  const handleSameAsPermanent = (e) => {
    const newFormData = {
      ...formData,
      presentAddress: e.target.checked 
        ? {
            ...formData.permanentAddress,
            sameAsPermanent: true
          }
        : {
            country: null,
            state: null,
            city: null,
            house_no_and_street: "",
            pincode: "",
            sameAsPermanent: false
          }
    };
    setFormData(newFormData);

    // If checked, validation only needs to check permanent address
    // If unchecked, needs to validate both addresses
    const isValid = validateAddressFields(newFormData);
    updateFormData(newFormData, isValid);
  };

  // Add validation function
  const validateAddressFields = (data) => {
    // Check permanent address required fields
    const isPermanentValid = data.permanentAddress.country && 
                           data.permanentAddress.state;

    // Check present address only if not same as permanent
    const isPresentValid = data.presentAddress.sameAsPermanent || 
                         (data.presentAddress.country && 
                          data.presentAddress.state);

    return isPermanentValid && isPresentValid;
  };

  // ========== Fetch Existing Addresses on Mount ==========
  useEffect(() => {
    if (!user?.uid) return; // must be logged in

    // 1) fetch permanent address
    const fetchPermanentAddress = async () => {
      try {
        const resp = await axios.get(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/permanentAddress",
          { params: { firebase_uid: user.uid, t: Date.now() } }
        );
        if (resp.status === 200 && resp.data.length > 0) {
          // We only expect one row per firebase_uid
          const addr = resp.data[0];
          // Convert DB strings -> csc objects
          const foundCountry = findCountryByName(addr.country_name);
          const foundState = foundCountry
            ? findStateByName(addr.state_name, foundCountry.value)
            : null;
          const foundCity = foundState
            ? findCityByName(addr.city_name, foundState.value)
            : null;

          setFormData(prev => ({
            ...prev,
            permanentAddress: {
              country: foundCountry,
              state: foundState,
              city: foundCity,
              house_no_and_street: addr.house_no_and_street || "",
              pincode: addr.pincode || ""
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching permanent address:", error);
      }
    };
    

    // 2) fetch present address
    const fetchPresentAddress = async () => {
      try {
        const resp = await axios.get(
          "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
          { params: { firebase_uid: user.uid, t: Date.now() } }
        );
        if (resp.status === 200 && resp.data.length > 0) {
          const addr = resp.data[0];
          const foundCountry = findCountryByName(addr.country_name);
          const foundState = foundCountry
            ? findStateByName(addr.state_name, foundCountry.value)
            : null;
          const foundCity = foundState
            ? findCityByName(addr.city_name, foundState.value)
            : null;

          setFormData(prev => ({
            ...prev,
            presentAddress: {
              country: foundCountry,
              state: foundState,
              city: foundCity,
              house_no_and_street: addr.house_no_and_street || "",
              pincode: addr.pincode || "",
              sameAsPermanent: false // we only set this if user explicitly checks
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching present address:", error);
      }
    };

    fetchPermanentAddress();
    fetchPresentAddress();
  }, [user?.uid]); // run once user is known

  // ========== Submit handler (Upsert both addresses) ==========
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      toast.error("Please log in to save your address.");
      return;
    }

    // Prepare payload for permanent address
    const permanentAddressPayload = {
      country_name: formData.permanentAddress.country?.label || "",
      state_name: formData.permanentAddress.state?.label || "",
      city_name: formData.permanentAddress.city?.label || "",
      house_no_and_street: formData.permanentAddress.house_no_and_street,
      pincode: formData.permanentAddress.pincode,
      firebase_uid: user.uid
    };

    // Prepare payload for present address; if "same as permanent," copy permanent
    const presentAddressPayload = formData.presentAddress.sameAsPermanent
      ? { ...permanentAddressPayload }
      : {
          country_name: formData.presentAddress.country?.label || "",
          state_name: formData.presentAddress.state?.label || "",
          city_name: formData.presentAddress.city?.label || "",
          house_no_and_street: formData.presentAddress.house_no_and_street,
          pincode: formData.presentAddress.pincode,
          firebase_uid: user.uid
        };

    try {
      // 1) Upsert permanent address
      const permResp = await axios.post(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/permanentAddress",
        permanentAddressPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (!(permResp.status === 200 || permResp.status === 201)) {
        throw new Error("Failed to save permanent address");
      }

      // 2) Upsert present address
      const presResp = await axios.post(
        "https://l4y3zup2k2.execute-api.ap-south-1.amazonaws.com/dev/presentAddress",
        presentAddressPayload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (presResp.status === 200 || presResp.status === 201) {
        toast.success("Address added/updated successfully!");
      } else {
        throw new Error("Failed to save present address");
      }
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message || "Unknown error");
      toast.error(`Error: ${
        error.response?.data?.message ||
        error.message ||
        "Failed to save address"
      }`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`address ${className}`}>
      <div className="row">
        {/* PERMANENT ADDRESS */}
          <h6>Permanent Address</h6>
          <div className="form-group col-lg-4 col-md-12">
          <div className="input-wrapper">
            <Select
              required
              id="permanentCountry"
              name="permanentCountry"
              placeholder="Permanent Country"
              className="custom-select required"
              options={countries}
              value={formData.permanentAddress.country}
              onChange={(option) => {
                handleAddressChange("permanentAddress", "country", option);
                // clear state, city
                handleAddressChange("permanentAddress", "state", null);
                handleAddressChange("permanentAddress", "city", null);
              }}
            />
            <span className="custom-tooltip">Permanent Country</span>
          </div>
          </div>

          <div className="form-group col-lg-4 col-md-12">
          <div className="input-wrapper">
            <Select
              required
              id="permanentState"
              name="permanentState"
              placeholder="Permanent State/UT"
              className="custom-select required"
              options={getStates(formData.permanentAddress.country?.value)}
              value={formData.permanentAddress.state}
              onChange={(option) => {
                handleAddressChange("permanentAddress", "state", option);
                handleAddressChange("permanentAddress", "city", null);
              }}
            />
            <span className="custom-tooltip">Permanent State/UT</span>
          </div>
          </div>

          {permanentCity && (
            <div className="form-group col-lg-4 col-md-12">
            <div className="input-wrapper">
              <Select
                id="permanentCity"
                name="permanentCity"
                placeholder="Permanent City"
                options={getCities(formData.permanentAddress.state?.value)}
                value={formData.permanentAddress.city}
                onChange={(option) =>
                  handleAddressChange("permanentAddress", "city", option)
                }
              />
              <span className="custom-tooltip">Permanent City</span>
            </div>
            </div>
          )}
        {/* PRESENT ADDRESS SAME AS PERMANENT ADDRESS */}
          <label style={{ display: "block", marginBottom: "0.5rem" ,fontWeight:"500"}}>
            <input
              id="sameAsPermanent"
              name="sameAsPermanent"
              type="checkbox"
              onChange={handleSameAsPermanent}
              checked={formData.presentAddress.sameAsPermanent}
              style={{ marginRight: "10px" }}
            />
           Present Address (Same as Permanent Address)
          </label>

          {!formData.presentAddress.sameAsPermanent && (
            <>
              <div className="form-group col-lg-4 col-md-12">
              <div className="input-wrapper">
                <Select
                  required
                  id="presentCountry"
                  name="presentCountry"
                  placeholder="Present Country"
                  className="custom-select required"
                  options={countries}
                  value={formData.presentAddress.country}
                  onChange={(option) => {
                    handleAddressChange("presentAddress", "country", option);
                    handleAddressChange("presentAddress", "state", null);
                    handleAddressChange("presentAddress", "city", null);
                  }}
                />
                <span className="custom-tooltip">Present Country</span>
              </div>
              </div>

              <div className="form-group col-lg-4 col-md-12">
              <div className="input-wrapper">
                <Select
                  required
                  id="presentState"
                  name="presentState"
                  placeholder="Present State/UT"
                  className="custom-select required"
                  options={getStates(formData.presentAddress.country?.value)}
                  value={formData.presentAddress.state}
                  onChange={(option) => {
                    handleAddressChange("presentAddress", "state", option);
                    handleAddressChange("presentAddress", "city", null);
                  }}
                />
                <span className="custom-tooltip">Present State/UT</span>
              </div>
              </div>

              {presentCity && (
                <div className="form-group col-lg-4 col-md-12">
                <div className="input-wrapper">
                  <Select
                    id="presentCity"
                    name="presentCity"
                    placeholder="Present City"
                    options={getCities(formData.presentAddress.state?.value)}
                    value={formData.presentAddress.city}
                    onChange={(option) =>
                      handleAddressChange("presentAddress", "city", option)
                    }
                  />
                  <span className="custom-tooltip">Present City</span>
                </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* SAVE BUTTON */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-three">
            Save Address
          </button>
        </div>
    </form>
  );
};

export default Address;