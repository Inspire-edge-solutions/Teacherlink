const SocialNetworkBox = () => {

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <h3>Social Networks</h3>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="facebook"
            placeholder="Facebook"
            
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
            <input type="text" name="twitter" placeholder="Twitter" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="linkedin" placeholder="Linkedin" />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="instagram" placeholder="Instagram" />
        </div>

        {/* <!-- Submit Button --> */}
        <div className="form-group col-lg-12">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default SocialNetworkBox;