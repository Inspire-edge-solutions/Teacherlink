

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
            <Link to="/home-13">Home</Link>
          </li>
          {/* End homepage menu items */}

          <li
            className={`${
              isActiveParent(findJobItems, pathname) ? "current" : ""
            } dropdown has-mega-menu`}
            id="has-mega-menu"
          >
            <span>Find Jobs</span>
            <div className="mega-menu">
              <div className="mega-menu-bar row">
                {findJobItems.map((item) => (
                  <div
                    className="column col-lg-3 col-md-3 col-sm-12"
                    key={item.id}
                  >
                    <h3>{item.title}</h3>
                    <ul>
                      {item.items.map((menu, i) => (
                        <li
                          className={
                            isActiveLink(menu.routePath, pathname)
                              ? "current"
                              : ""
                          }
                          key={i}
                        >
                          <Link to={menu.routePath}>{menu.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </li>
          {/* End findjobs menu items */}

          <ul><li>Why Teacherlink</li></ul>
          <ul><li>Salient features</li></ul>
          <ul><li>Subscription plans</li></ul> 
          <ul><li>About us</li></ul> 
          <ul><li>Contact us</li></ul> 

          
        </ul>
      </nav>
    </>
  );
};

export default HeaderNavContent;
