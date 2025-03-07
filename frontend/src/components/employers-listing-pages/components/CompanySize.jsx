import { BsBriefcase } from "react-icons/bs";

const CompanySize = () => {
  return (
    <>
      <select className="form-select">
        <option>Choose a category</option>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Industrial</option>
        <option>Apartments</option>
      </select>
      <span className="icon"><BsBriefcase /></span>
    </>
  );
};

export default CompanySize;
