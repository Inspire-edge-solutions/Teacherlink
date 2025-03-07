import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaUsers } from 'react-icons/fa';

const AboutBlock = () => {
  const blockContent = [
    {
      id: 1,
      icon: FaSearch,
      title: "Search Millions of Jobs",
      bgColor: "-purple",
      text: `There is no one universal solution in online marketing, that's.`,
    },
    {
      id: 2,
      icon: FaMapMarkerAlt,
      title: "Location Base Search",
      bgColor: "-orange",
      text: `There is no one universal solution in online marketing, that's.`,
    },
    {
      id: 3,
      icon: FaBriefcase,
      title: "Top Careers",
      bgColor: "-red",
      text: `There is no one universal solution in online marketing, that's.`,
    },
    {
      id: 4,
      icon: FaUsers,
      title: "Recruiter directory",
      bgColor: "-green",
      text: `There is no one universal solution in online marketing, that's.`,
    },
  ];
  return (
    <>
      {blockContent.map((item) => (
        <div className="col-lg-6" key={item.id}>
          <div className="icon-side -type-1">
            <div className={`icon-wrap ${item.bgColor}`}>
              <item.icon size={32} />
            </div>

            <div className="content">
              <h4 className="title">{item.title}</h4>
              <p className="text">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AboutBlock;
