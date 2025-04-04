import { useState } from "react";

  const ContactForm = () => {
  const [contactForm, setContactForm] = useState({
    username: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  return (
    <form>
      <div className="row">
        <div className="form-group col-lg-12 col-md-12 col-sm-12">
          <div className="response"></div>
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-md-12 col-sm-12 form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="username"
            className="username"
            placeholder="Your Name*"
            required
          />
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-md-12 col-sm-12 form-group">
          <label>Your Email</label>
          <input
            type="email"
            name="email"
            className="email"
            placeholder="Your Email*"
            required
          />
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-md-12 col-sm-12 form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            className="mobile"
            placeholder="Mobile Number *"
            required
            maxLength="10"
            minLength="10"
            onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          />
        </div>
        {/* End .col */}

        <div className="col-lg-6 col-md-12 col-sm-12 form-group">
          <label>Upload cv/resume</label>
          <input
            type="file"
            name="resume"
            className="resume"
            placeholder="Upload cv/resume"
            
          />
        </div>
        

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label>Your Message</label>
          <textarea
            name="message"
            placeholder="Write your message..."
            required=""
          ></textarea>
        </div>
        {/* End .col */}

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            id="submit"
            name="submit-form"
          >
            Submit
          </button>
        </div>
        {/* End .col */}
      </div>
    </form>
  );
};

export default ContactForm;
