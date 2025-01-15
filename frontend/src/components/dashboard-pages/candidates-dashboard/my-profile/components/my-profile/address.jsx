import React, { useState } from "react";
import Select from "react-select";
import csc from "countries-states-cities";

const Address = () => {

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    
  
    const countries = csc.getAllCountries().map((country) => ({
      value: country.id,
      label: country.name,
    }));
  
    const states = selectedCountry
      ? csc.getStatesOfCountry(selectedCountry.value).map((state) => ({
          value: state.id,
          label: state.name,
        }))
      : [];
  
    const cities = selectedState
      ? csc.getCitiesOfState(selectedState.value).map((city) => ({
          value: city.id,
          label: city.name,
        }))
      : [];
    

  return (
    <div className="row">
      <div className="form-group col-lg-6 col-md-12">
        <h3>Permanent address</h3>


      <div className="form-group">
      <Select
      placeholder="Select Country"
        options={countries}
        value={selectedCountry}
        onChange={(option) => {
          setSelectedCountry(option);
          setSelectedState(null); // Reset state when country changes
          setSelectedCity(null);  // Reset city when country changes
        }}
      />
    </div>
    <div className="form-group">
      <Select
      placeholder="Select State/UT"
        options={states}
        value={selectedState}
        onChange={(option) => {
          setSelectedState(option);
          setSelectedCity(null); // Reset city when state changes
        }}
      />
    </div>
    <div className="form-group">
      <Select
      placeholder="Select City"
        options={cities}
        value={selectedCity}
        onChange={(option) => setSelectedCity(option)}
      />
    </div>
    <div className="form-group">
        <input
          type="text"
          name="street"
          placeholder="House no. & street"
          required
        />
      </div>
      </div>

      <div className="form-group col-lg-6 col-md-12">
        <h3>Present address</h3>
       

      <div className="form-group">
      <Select
        options={countries}
        placeholder="Select Country"
        value={selectedCountry}
        onChange={(option) => {
          setSelectedCountry(option);
          setSelectedState(null); // Reset state when country changes
          setSelectedCity(null);  // Reset city when country changes
        }}
      />
    </div>
    <div className="form-group">
      <Select
      placeholder="Select State/UT"
        options={states}
        value={selectedState}
        onChange={(option) => {
          setSelectedState(option);
          setSelectedCity(null); // Reset city when state changes
        }}
      />
    </div>
    <div className="form-group">
      <Select
      placeholder="Select City"
        options={cities}
        value={selectedCity}
        onChange={(option) => setSelectedCity(option)}
      />
    </div>
    <div className="form-group">
        <input
          type="text"
          name="street"
          placeholder="House no. & street"
          required
        />
      </div>
      </div>
    </div>
  );
};

export default Address;
