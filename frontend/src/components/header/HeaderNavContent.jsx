import { Link } from "react-router-dom";
import {
  blogItems,
  candidateItems,
  employerItems,
  findJobItems,
  homeItems,
  pageItems,
  shopItems,
} from "../../data/mainMenuData";
import {
  isActiveParent,
  isActiveLink,
  isActiveParentChaild,
} from "../../utils/linkActiveChecker";

import { useLocation } from "react-router-dom";
const HeaderNavContent = () => {
  const { pathname } = useLocation();
  return (
    <>
      <nav className="nav main-menu">
        <ul className="navigation" id="navbar">
          {/* current dropdown */}
           {/* Home link */}
           <li className={isActiveLink("/home-13", pathname) ? "current" : ""}>
            <Link to="/home/home-13">Home</Link>
          </li>
          {/* End homepage menu items */}

          <li className={isActiveLink("/why-teacherlink", pathname) ? "current" : ""}>
            <Link to="/why-teacherlink">Why Teacherlink</Link>
          </li>

          <li className={isActiveLink("/salient-features", pathname) ? "current" : ""}>
            <Link to="/salient-features">Salient features</Link>
          </li>

          <li className={isActiveLink("/subscription", pathname) ? "current" : ""}>
            <Link to="/subscription">Subscription plans</Link>
          </li>

          <li className={isActiveLink("/about", pathname) ? "current" : ""}>
            <Link to="/about">About us</Link>
          </li>

          <li className={isActiveLink("/contact", pathname) ? "current" : ""}>
            <Link to="/contact">Contact us</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
