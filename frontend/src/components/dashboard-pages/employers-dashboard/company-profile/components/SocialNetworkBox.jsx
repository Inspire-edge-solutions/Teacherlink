const SocialNetworkBox = () => {
  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <h3>Social Networks</h3>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="name"
            placeholder="Facebook"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Twitter" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Linkedin" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="name" placeholder="Instagram" required />
        </div>

      </div>
    </form>
  );
};

export default SocialNetworkBox;