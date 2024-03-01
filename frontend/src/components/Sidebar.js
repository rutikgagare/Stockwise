import React from 'react';
import { Link } from "react-router-dom"
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Link to="/employees" className="sidebar-item">Employees</Link>
      <div className="sidebar-item">Products</div>
      <Link to="/inventory" className="sidebar-item">Inventory</Link>
    </div>
  );
};

export default Sidebar;
