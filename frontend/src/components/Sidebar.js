import React from 'react';
import { Link } from "react-router-dom"
import {useSelector } from 'react-redux';
import './Sidebar.css';

const Sidebar = () => {

  const user = useSelector(state => state?.auth?.user);

  return (
    <div className="sidebar-container">
      {user && user?.role === "admin" && <Link to="/employees" className="sidebar-item">Employees</Link>}
      <Link to="/product" className="sidebar-item">Products</Link>
      <Link to="/inventory" className="sidebar-item">Inventory</Link>
      <Link to="/order" className="sidebar-item">Place Order</Link>
      <Link to="/vendors" className="sidebar-item">Vendors</Link>
    </div>
  );
};

export default Sidebar;
