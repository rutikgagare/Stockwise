import React from "react";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useLogout";


const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state)=> state.org.organization);

  const {logout} = useLogout();

  const logoutHandler = () => {
    logout();
  };

  return (
    <div className={classes.navbar}>
      <div className={classes.logo}>
        <i class="fas fa-laptop"></i>
        <h3>{org ? org.name : "StockWise"}</h3>
      </div>

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
          <span>{user.name}</span>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
