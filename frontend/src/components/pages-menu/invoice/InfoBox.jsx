const InfoBox = () => {
  return (
    <div className="info-box">
      <div className="left-column">
        <div className="info">
          <h6>Invoice date:</h6>
          <span>03/10/2021</span>
        </div>

        <div className="info">
          <h4>Supplier</h4>
          <h5>TeacherLink LLC</h5>
          <p>2301 Ravenswood Rd Madison, WI 53711</p>
        </div>
      </div>

      <div className="right-column">
        <div className="info">
          <h6>Due date:</h6>
          <span>03/10/2021</span>
        </div>

        <div className="info">
          <h4>Customer</h4>
          <h5>John Doe</h5>
          <p>13/2, Standage road, Pulikeshi nagar, Bengaluru, Karnataka, India 560005</p>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
