import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      
      <div className={classes.logo}>
        <i class="fas fa-laptop"></i>
        <h3>StockWise</h3>
      </div>

      <ul>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
      </ul>
    </div>
  )
}

export default Navbar
