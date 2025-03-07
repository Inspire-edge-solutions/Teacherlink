import { BsBriefcase, BsFileText, BsChatLeftText, BsBookmark } from "react-icons/bs";

const TopCardBlock = () => {
  const cardContent = [
    {
      id: 1,
      icon: <BsBriefcase />,
      countNumber: "22",
      metaName: "Applied Jobs",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: <BsFileText />,
      countNumber: "9382",
      metaName: "Job Alerts",
      uiClass: "ui-red",
    },
    {
      id: 3,
      icon: <BsChatLeftText />,
      countNumber: "74",
      metaName: "Messages",
      uiClass: "ui-yellow",
    },
    {
      id: 4,
      icon: <BsBookmark />,
      countNumber: "32",
      metaName: "Shortlist",
      uiClass: "ui-green",
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              {item.icon}
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock;
