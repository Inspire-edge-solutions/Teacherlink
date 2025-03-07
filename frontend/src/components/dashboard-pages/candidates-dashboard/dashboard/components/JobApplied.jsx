import { Link } from "react-router-dom";
import recentJobApplied from "../../../../../data/job-featured";
import { BsBriefcase, BsClock, BsCurrencyDollar, BsGeoAltFill, BsBookmark } from "react-icons/bs";

const JobApplied = () => {
  return (
    <>
      {recentJobApplied.slice(0, 6).map((item) => (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img
                 
                  src={item.logo}
                  alt="item brand"
                />
              </span>
              <h4>
                <Link to={`/job-single-v1/${item.id}`}>{item.jobTitle}</Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon"><BsBriefcase /></span>
                  {item.company}
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon"><BsGeoAltFill /></span>
                  {item.location}
                </li>
                {/* location info */}
                <li>
                  <span className="icon"><BsClock /></span> {item.time}
                </li>
                {/* time info */}
                <li>
                  <span className="icon"><BsCurrencyDollar /></span> {item.salary}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {item.jobType.map((val, i) => (
                  <li key={i} className={`${val.styleClass}`}>
                    {val.type}
                  </li>
                ))}
              </ul>
              {/* End .job-other-info */}

              <button className="bookmark-btn">
                <span className="icon"><BsBookmark /></span>
              </button>
            </div>
          </div>
        </div>
        // End job-block
      ))}
    </>
  );
};

export default JobApplied;
