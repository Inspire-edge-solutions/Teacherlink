import React from 'react';
import Map from "../../../Map";

const LocationMap = () => {
  return (
    <>
    <div className="row">
    <div className="form-group col-lg-6 col-md-12">
<label>Find On Map</label>
<input
  type="text"
  name="name"
  placeholder="13/2, Standage road, Pulikeshi nagar, Bengaluru, Karnataka, India 560005"
/>
</div>

<div className="form-group col-lg-3 col-md-12">
<label>Latitude</label>
<input type="text" name="name" placeholder="Melbourne" />
</div>

{/* <!-- Input --> */}
<div className="form-group col-lg-3 col-md-12">
<label>Longitude</label>
<input type="text" name="name" placeholder="Melbourne" />
</div>

{/* <!-- Input --> */}
<div className="form-group col-lg-12 col-md-12">
<button className="theme-btn btn-style-three">Search Location</button>
</div>

<div className="form-group col-lg-12 col-md-12">
<div className="map-outer">
  <div style={{ height: "420px", width: "100%" }}>
    <Map />
  </div>
</div>
</div>
</div>
</>
  );
};

export default LocationMap;