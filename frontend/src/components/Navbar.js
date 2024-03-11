import React, {useState} from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useLogout";
import Sidebar from "./Sidebar";

import { RiFunctionLine } from "react-icons/ri";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const { logout } = useLogout();

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className={classes.navbar}>
      <div className={classes.left}>

        {user &&  <div className={classes.sidebarIcon}>
          <RiFunctionLine onClick= {props.toggleSidebar} />
        </div> }

        <div className={classes.logo}>
          <i className="fas fa-laptop"></i>
          <Link to="/">
            <h3>{org ? org.name : "StockWise"}</h3>
          </Link>
        </div>
      </div>

      <div className={classes.middle}></div>

      {!user && (
        <div className={classes.nav}>
          <ul>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </ul>
        </div>
      )}

      {user && (
        <div className={classes.nav}>
          <h4>{user?.name}</h4>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
