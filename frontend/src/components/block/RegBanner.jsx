
import { Link } from "react-router-dom";

const RegBanner = () => {
  const regBannerContent = [
    {
      id: 1,
      bgImage: `url("/images/index-13/banner/bg-1.png")`,
      name: "Employers",
      text: ` Welcome to Teacherlink - Job portal for teachers. Register yourself to find the right opportunity.`,
      avatar: "/images/resource/employ.png",
      bannerClass: "banner-style-one",
      width: "221",
      height: "281",
    },
    {
      id: 2,
      bgImage: `url("/images/index-13/banner/bg-2.png")`,
      name: "Candidate",
      text: ` Welcome to Teacherlink - Job portal for teachers. Register yourself to find the right opportunity.`,
      avatar: "/images/resource/candidate.png",
      bannerClass: "banner-style-two dark",
      width: "207",
      height: "283",
    },
  ];
  return (
    <>
      {regBannerContent.map((item) => (
        <div
          className={`${item.bannerClass} -type-2 col-lg-6 col-md-12 col-sm-12`}
          key={item.id}
        >
          <div
            className="inner-box"
            style={{
              backgroundImage: item.bgImage,
            }}
          >
            <div className="content">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <Link to="/register" className="theme-btn btn-style-five">
                Register Account
              </Link>
            </div>
            <figure className="image">
              <img
                width={item.width}
                height={item.height}
                src={item.avatar}
                alt="resource"
              />
            </figure>
          </div>
        </div>
      ))}
    </>
  );
};

export default RegBanner;
