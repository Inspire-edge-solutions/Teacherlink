import React from "react";

const Social = () => {
  return <div className="row mt-3">

<h3>Social Networks</h3><br/>
<div className="form-group col-lg-6 col-md-12">
  <input
    type="text"
    name="name"
    placeholder="Facebook - www.facebook.com/your-id"
    required
  />
</div>

{/* <!-- Input --> */}
<div className="form-group col-lg-6 col-md-12">
  <input type="text" name="name" placeholder="Linkedin - www.linkedin.com/your-id" required />
</div>

{/* <!-- Input --> */}
<div className="form-group col-lg-6 col-md-12">
  <input type="text" name="name" placeholder="Instagram - www.instagram.com/your-id" required />
</div>

{/* <!-- About Company --> */}
<div className="form-group col-lg-12 col-md-12">
  <textarea placeholder="Profile Summary - Write brief description about yourself (max 100 words)"></textarea>
</div>
</div>;
};

export default Social;