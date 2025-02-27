import { FaUserPlus } from "react-icons/fa";
import { BsPeople } from "react-icons/bs";
import { MdOutlineAutoGraph } from "react-icons/md";

const Block6 = () => {
  const blockContent = [
    {
      id: 1,
      icon: FaUserPlus,
      title: "Register an account to start",
      text: `Register in teacherlink to start exploring the job opportunities.`,
      bgClass: "-blue",
    },
    {
      id: 2,
      icon: BsPeople,
      title: `Find qualified teaching talent`,
      text: `Access a curated pool of certified teachers, subject experts, and educational professionals for your institution.`,
      bgClass: "-red",
    },
    {
      id: 3,
      icon: MdOutlineAutoGraph,
      title: "Smart Matching System",
      text: `Teachers find their ideal teaching environment while institutions discover educators who perfectly align with their vision and requirements.`,
      bgClass: "-yellow",
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={item.id}>
          <div className="work-block -type-2 mb-0">
            <div className="inner-box">
              <div className={`icon-wrap ${item.bgClass}`}>
                <item.icon />
              </div>
              <h5>{item.title}</h5>
              <p>{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Block6;
