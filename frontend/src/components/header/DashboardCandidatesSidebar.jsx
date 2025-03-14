import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import candidatesuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { getIcon } from "../../utils/iconMapping";
import "./dashboardStyles.css";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";

import { useLocation } from "react-router-dom";

const DashboardCandidatesSidebar = () => {
  const { pathname } = useLocation();
  const { menu } = useSelector((state) => state.toggle);
  const percentage = 30;

  const dispatch = useDispatch();
  // State to track which menus are expanded
  const [expandedMenus, setExpandedMenus] = useState({});

  // menu togggle handler
  const menuToggleHandler = () => {
    dispatch(menuToggle());
  };

  // Toggle sub-menu visibility
  const toggleSubMenu = (itemId, event) => {
    event.preventDefault();
    setExpandedMenus(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
      {/* Start sidebar close icon */}
      <div className="pro-header text-end pb-0 mb-0 show-1023">
        <div className="fix-icon" onClick={menuToggleHandler}>
          {getIcon('icon-close')}
        </div>
      </div>
      {/* End sidebar close icon */}

      <div className="sidebar-inner">
        <ul className="navigation">
          {candidatesuData.map((item) => {
            const isActive = isActiveLink(item.routePath, pathname);
            const hasSubMenu = item.subMenu && item.subMenu.length > 0;
            const isExpanded = expandedMenus[item.id] || isActive;

            return (
              <li
                className={`${isActive ? "active" : ""} mb-1 ${hasSubMenu ? "has-submenu" : ""} ${isExpanded && hasSubMenu ? "expanded" : ""}`}
                key={item.id}
              >
                <div className="menu-item-wrapper">
                  <Link 
                    to={hasSubMenu ? "#" : item.routePath}
                    onClick={hasSubMenu ? null : menuToggleHandler}
                    className="menu-item-link"
                  >
                    {getIcon(item.icon)} 
                    <span className="menu-item-text">{item.name}</span>
                  </Link>
                  
                  {hasSubMenu && (
                    <button 
                      className="dropdown-toggle-btn"
                      onClick={(e) => toggleSubMenu(item.id, e)}
                      aria-expanded={isExpanded}
                    >
                      <span className="sr-only">Toggle submenu</span>
                      <svg 
                        className={`dropdown-arrow ${isExpanded ? 'expanded' : ''}`} 
                        width="15" 
                        height="15" 
                        viewBox="0 0 12 12"
                      >
                        <path d="M6 9L1 4h10L6 9z" fill="currentColor" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {hasSubMenu && (
                  <ul className={`sub-menu ${isExpanded ? "show" : ""}`}>
                    {item.subMenu.map((subItem) => (
                      <li
                        className={`${isActiveLink(subItem.routePath, pathname) ? "sub-active" : ""}`}
                        key={subItem.id}
                        onClick={menuToggleHandler}
                      >
                        <Link to={subItem.routePath}>
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        {/* End navigation */}

        <div className="skills-percentage">
          <h4>Skills Percentage</h4>
          <p>
            `Put value for <strong>Cover Image</strong> field to increase your
            skill up to <strong>85%</strong>`
          </p>
          <div style={{ width: 200, height: 200, margin: "auto" }}>
            <CircularProgressbar
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: "#7367F0",
                textColor: "#fff",
                pathColor: "#fff",
                trailColor: "transparent",
              })}
              value={percentage}
              text={`${percentage}%`}
            />
          </div>{" "}
          {/* <!-- Pie Graph --> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardCandidatesSidebar;
