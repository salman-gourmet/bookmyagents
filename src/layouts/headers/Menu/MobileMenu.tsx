/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link } from "react-router-dom";
import { useState } from "react";
import menu_data from "../../../data/MenuData";
import { useAuth } from "../../../contexts/AuthContext";

const MobileMenu = () => {
   const { isAuthenticated, user, logout } = useAuth();
   const [navTitle, setNavTitle] = useState("");
   const [, setSubNavTitle] = useState("");

   // Open or close the parent menu
   const openMobileMenu = (menu: any) => {
      setNavTitle((prev: any) => (prev === menu ? "" : menu));
      setSubNavTitle("");
   };

   // Open or close the submenu
   const handleLogout = async () => {
      try {
         await logout();
      } catch (error) {
         console.error('Logout error:', error);
      }
   };

   return (
      <ul className="navigation">
         {menu_data.map((menu) => (
            <li key={menu.id} className={menu.has_dropdown ? "menu-item-has-children" : ""}>
               <Link to={menu.link}>
                  {menu.title}
               </Link>

               {menu.has_dropdown && (
                  <>
                     {menu.sub_menus && (
                        <>
                           <ul className="sub-menu" style={{ display: navTitle === menu.title ? "block" : "none" }}>
                              {menu.sub_menus.map((sub_m, i) => (
                                 <li key={i}>
                                    <Link to={sub_m.link}>
                                       {sub_m.title}
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                           <div className={`dropdown-btn ${navTitle === menu.title ? "open" : ""}`}
                              onClick={() => openMobileMenu(menu.title)}>
                              <span className="plus-line"></span>
                           </div>
                        </>
                     )}
                  </>
               )}
            </li>
         ))}
         
         {/* Dashboard link for authenticated users */}
         {isAuthenticated && (
            <li>
               <Link to="/dashboard">
                  Dashboard
               </Link>
            </li>
         )}
         
         {/* Authentication links */}
         {isAuthenticated ? (
            <li className="menu-item-has-children">
               <Link to="#">
                  {user?.name || 'User'}
               </Link>
               <ul className="sub-menu">
                  <li>
                     <Link to="/dashboard">
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
                  <Link to="/login">
                     Login
                  </Link>
               </li>
               <li>
                  <Link to="/register">
                     Register
                  </Link>
               </li>
            </>
         )}
      </ul>
   );
};

export default MobileMenu;
