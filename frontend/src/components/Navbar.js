import React, {useState} from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { RiFunctionLine } from "react-icons/ri";

const Navbar = (props) => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

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
          <ul>
            <Link to = "/profile"> < CgProfile className={classes.profileIcon} /></Link>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
