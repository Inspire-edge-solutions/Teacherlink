import { BsBriefcase } from "react-icons/bs";

const Notification = () => {
  return (
    <ul className="notification-list">
      <li>
        <span className="icon"><BsBriefcase /></span>
        <strong>Henry Wilson</strong> applied for a job
        <span className="colored"> Product Designer</span>
      </li>
      {/* End li */}

      <li className="success">
        <span className="icon"><BsBriefcase /></span>
        <strong>Raul Costa</strong> applied for a job
        <span className="colored"> Product Manager, Risk</span>
      </li>
      {/* End li */}

      <li>
        <span className="icon"><BsBriefcase /></span>
        <strong>Jack Milk</strong> applied for a job
        <span className="colored"> Technical Architect</span>
      </li>
      {/* End li */}

      <li className="success">
        <span className="icon"><BsBriefcase /></span>
        <strong>Michel Arian</strong>
        applied for a job
        <span className="colored"> Software Engineer</span>
      </li>
      {/* End li */}

      <li>
        <span className="icon"><BsBriefcase /></span>
        <strong>Wade Warren</strong> applied for a job
        <span className="colored"> Web Developer</span>
      </li>
      {/* End li */}

      <li className="success">
        <span className="icon"><BsBriefcase /></span>
        <strong>Michel Arian</strong>
        applied for a job
        <span className="colored"> Software Engineer</span>
      </li>
      {/* End li */}
    </ul>
  );
};

export default Notification;
