import { useState } from "react";
import axios from "axios";
import Select from "react-select";
import csc from "countries-states-cities"; // Package to get countries, states, and cities

const Location = () => {
  const [country, setCountry] = useState(null); // Define country state
  const [state, setState] = useState(null); // Define state
  const [city, setCity] = useState(null); // Define city

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

  return (
    <form className="default-form">
      <div className="row">
        <div className="form-group col-lg-6 col-md-12">
            <Select
              id="permanentCountry"
              name="permanentCountry"
              placeholder="Select Country"
              options={countries}
              value={country} // Use country state here
              onChange={option => {
                setCountry(option); // Set selected country
                setState(null); // Reset state and city when country changes
                setCity(null);
              }}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <Select
              id="permanentState"
              name="permanentState"
              placeholder="Select State/UT"
              options={getStates(country?.value)} // Use country state here
              value={state}
              onChange={option => {
                setState(option); // Set selected state
                setCity(null); // Reset city when state changes
              }}
            />
          </div>
          <div className="form-group col-lg-6 col-md-12">
            <Select
              id="permanentCity"
              name="permanentCity"
              placeholder="Select City"
              options={getCities(state?.value)} // Use state here
              value={city}
              onChange={option => setCity(option)} // Set selected city
            />
          </div>
        </div>
    </form>
  );
};

export default Location;
