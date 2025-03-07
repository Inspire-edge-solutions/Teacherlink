import Applicants from "./Applicants";
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const WidgetContentBox = () => {
  return (
    <div className="widget-content">
      <div className="row">
        <Applicants />
      </div>
      {/* <!-- Pagination --> */}
      <nav className="ls-pagination mb-5">
        <ul>
          <li className="prev">
            <a href="#">
              <i className="icon"><BsArrowLeft /></i>
            </a>
          </li>
          <li>
            <a href="#">1</a>
          </li>
          <li>
            <a href="#" className="current-page">
              2
            </a>
          </li>
          <li>
            <a href="#">3</a>
          </li>
          <li className="next">
            <a href="#">
              <i className="icon"><BsArrowRight /></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default WidgetContentBox;
