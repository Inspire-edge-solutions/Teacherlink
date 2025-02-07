const SocialNetworkBox = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      facebook: formData.get('facebook'),
      twitter: formData.get('twitter'),
      linkedin: formData.get('linkedin'),
      instagram: formData.get('instagram'),
    };

    try {
      const response = await fetch('https://7eerqdly08.execute-api.ap-south-1.amazonaws.com/staging/socialmedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="default-form" onSubmit={handleSubmit}>
      <div className="row">
        {/* <!-- Input --> */}
        <h3>Social Networks</h3>
        <div className="form-group col-lg-6 col-md-12">
          <input
            type="text"
            name="facebook"
            placeholder="Facebook"
            required
          />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="twitter" placeholder="Twitter" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="linkedin" placeholder="Linkedin" required />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <input type="text" name="instagram" placeholder="Instagram" required />
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