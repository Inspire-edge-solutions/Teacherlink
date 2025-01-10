import Map from "../../../Map";

const ContactInfoBox = () => {
  return (
    <form className="default-form">
      <div className="row">

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="name"
            placeholder="Find your location on map"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
          
          <input type="text" name="name" placeholder="Latitude" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-3 col-md-12">
         
          <input type="text" name="name" placeholder="Longitude" required />
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
        {/* End MapBox */}

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-three">
            Save Location
          </button>
        </div>
      </div>
    </form>
  );
};

export default ContactInfoBox;
