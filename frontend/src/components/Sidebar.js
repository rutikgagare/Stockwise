import React from 'react';
import { Link } from "react-router-dom"
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <Link to="/employees" className="sidebar-item">Employees</Link>
      <div className="sidebar-item">Products</div>
      <div className="sidebar-item">Inventory</div>
    </div>
  );
};

export default Sidebar;
