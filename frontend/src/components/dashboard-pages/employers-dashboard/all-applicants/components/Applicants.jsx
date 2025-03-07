import { Link } from "react-router-dom";
import candidatesData from "../../../../../data/candidates";
import { BsGeoAltFill, BsCurrencyDollar, BsEye, BsCheck, BsXCircle, BsTrash } from "react-icons/bs";

const Applicants = () => {
  return (
    <>
      {candidatesData.slice(17, 23).map((candidate) => (
        <div
          className="candidate-block-three col-lg-6 col-md-12 col-sm-12"
          key={candidate.id}
        >
          <div className="inner-box">
            <div className="content">
              <figure className="image">
                <img
                 
                  src={candidate.avatar}
                  alt="candidates"
                />
              </figure>
              <h4 className="name">
                <Link to={`/candidates-single-v1/${candidate.id}`}>
                  {candidate.name}
                </Link>
              </h4>

              <ul className="candidate-info">
                <li className="designation">{candidate.designation}</li>
                <li>
                  <span className="icon"><BsGeoAltFill /></span>{" "}
                  {candidate.location}
                </li>
                <li>
                  <span className="icon"><BsCurrencyDollar /></span> $
                  {candidate.hourlyRate} / hour
                </li>
              </ul>
              {/* End candidate-info */}

              <ul className="post-tags">
                {candidate.tags.map((val, i) => (
                  <li key={i}>
                    <a href="#">{val}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* End content */}

            <div className="option-box">
              <ul className="option-list">
                <li>
                  <button data-text="View Aplication">
                    <span className="icon"><BsEye /></span>
                  </button>
                </li>
                <li>
                  <button data-text="Approve Aplication">
                    <span className="icon"><BsCheck /></span>
                  </button>
                </li>
                <li>
                  <button data-text="Reject Aplication">
                    <span className="icon"><BsXCircle /></span>
                  </button>
                </li>
                <li>
                  <button data-text="Delete Aplication">
                    <span className="icon"><BsTrash /></span>
                  </button>
                </li>
              </ul>
            </div>
            {/* End admin options box */}
          </div>
        </div>
      ))}
    </>
  );
};

export default Applicants;
