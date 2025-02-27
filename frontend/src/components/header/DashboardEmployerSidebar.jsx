import { Link } from "react-router-dom";
import employerMenuData from "../../data/employerMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { getIcon } from "../../utils/iconMapping";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { useLocation } from "react-router-dom";

const DashboardEmployerSidebar = () => {
    const { pathname } = useLocation();
    const { menu } = useSelector((state) => state.toggle);
    const dispatch = useDispatch();

    const menuToggleHandler = () => {
        dispatch(menuToggle());
    };

    return (
        <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
            <div className="pro-header show-1023">
                <div className="fix-icon" onClick={menuToggleHandler}>
                    {getIcon('icon-close')}
                </div>
            </div>

            <div className="sidebar-inner">
                <ul className="navigation">
                    {employerMenuData.map((item) => (
                        <li
                            className={`${
                                isActiveLink(item.routePath, pathname)
                                    ? "active"
                                    : ""
                            } mb-1`}
                            key={item.id}
                            onClick={menuToggleHandler}
                        >
                            <Link to={item.routePath}>
                                {getIcon(item.icon)} {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DashboardEmployerSidebar;
