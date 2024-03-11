import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";
import { MdInventory } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { MdSell } from "react-icons/md";

const Sidebar = ({ isOpen }) => {
  const user = useSelector((state) => state?.auth?.user);

  return (
    isOpen && (
      <div className="sidebar-container">
        <NavLink to="/dashboard" className="sidebar-item" activeClassName="active">
          <MdDashboard className="icon" />
          Dashboard
        </NavLink>
        {user && user?.role === "admin" && (
          <NavLink to="/employees" className="sidebar-item" activeClassName="active">
            <FaUser className="icon" />
            Employees
          </NavLink>
        )}
        <NavLink to="/category" className="sidebar-item" activeClassName="active">
          <BiSolidCategory className="icon" />
          Category
        </NavLink>
        <NavLink to="/inventory" className="sidebar-item" activeClassName="active">
          <MdInventory className="icon" />
          Inventory
        </NavLink>
        <NavLink to="/vendors" className="sidebar-item" activeClassName="active">
          <FaUser className="icon" />
          Vendors
        </NavLink>
        <NavLink to="/order" className="sidebar-item" activeClassName="active">
          <MdSell />
          Purchase Order
        </NavLink>
      </div>
    )
  );
};

export default Sidebar;
