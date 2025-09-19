import { Link } from "react-router-dom";
import menu_data from "../../../data/MenuData";
import { useEffect, useState } from "react";

const NavMenu = () => {
    const [navClick, setNavClick] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [navClick]);
    return (
        <ul className="navigation">
            {menu_data.map((menu) => (
                <li key={menu.id} className={menu.has_dropdown ? "menu-item-has-children" : ""}>
                    <Link to={menu.link} onClick={() => setNavClick(!navClick)}>
                        {menu.title}
                    </Link>

                    {menu.has_dropdown && (
                        <>
                            {menu.sub_menus && (
                                <ul className="sub-menu">
                                    {menu.sub_menus.map((sub_m, i) => (
                                        <li key={i}>
                                            <Link to={sub_m.link} onClick={() => setNavClick(!navClick)}>
                                                {sub_m.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </li>
            ))}
            
            {/* Dashboard link for authenticated users */}
            {/* {isAuthenticated && (
                <li>
                    <Link to="/dashboard" onClick={() => setNavClick(!navClick)}>
                        Dashboard
                    </Link>
                </li>
            )} */}
            
            {/* Authentication links */}
            {/* {isAuthenticated ? (
                <li className="menu-item-has-children">
                    <Link to="#" onClick={(e) => e.preventDefault()}>
                        {user?.name || 'User'}
                    </Link>
                    <ul className="sub-menu">
                        <li>
                            <Link to="/dashboard" onClick={() => setNavClick(!navClick)}>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <button 
                                onClick={handleLogout}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: 'inherit', 
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 20px'
                                }}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </li>
            ) : (
                <>
                    <li>
                        <Link to="/login" onClick={() => setNavClick(!navClick)}>
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link to="/register" onClick={() => setNavClick(!navClick)}>
                            Register
                        </Link>
                    </li>
                </>
            )} */}
        </ul>
    );
};

export default NavMenu;
