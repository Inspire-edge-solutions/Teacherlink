

import {

  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import { Link } from "react-router-dom";
import mobileMenuData from "../../../data/mobileMenuData";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();


  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      
        <Sidebar>
          <Menu>
            {/* {mobileMenuData.map((item) => (
              <SubMenu
                className={
                  isActiveParentChaild(item.items, pathname)
                    ? "menu-active"
                    : ""
                }
                label={item.label}
                key={item.id}
              >
                {item.items.map((menuItem, i) => (
                  <MenuItem

                  onClick={()=>navigate(menuItem.routePath)}
                    className={
                      isActiveLink(menuItem.routePath, pathname)
                        ? "menu-active-link"
                        : ""
                    }
                    key={i}
                    // routerLink={<Link to={menuItem.routePath} />}
                  >
                    {menuItem.name}
                  </MenuItem>
                ))}
              </SubMenu>
            ))} */}

          <ul id="navbar">
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

          </Menu>
        </Sidebar>


      <SidebarFooter />
    </div>
  );
};

export default Index;