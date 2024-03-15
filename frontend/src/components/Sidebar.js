import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Sidebar.css";
import { MdInventory } from "react-icons/md";
import { FaUser, FaHistory } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { MdSell } from "react-icons/md";
import { SiHelpdesk } from "react-icons/si";

const Sidebar = ({ isOpen }) => {
  const user = useSelector((state) => state?.auth?.user);

  return (
    isOpen && (
      <div className="sidebar-container">
        <NavLink
          to="/dashboard"
          className="sidebar-item"
          activeClassName="active"
        >
          <MdDashboard className="icon" />
          Dashboard
        </NavLink>

        {user && user?.role === "admin" && (
          <NavLink
            to="/employees"
            className="sidebar-item"
            activeClassName="active"
          >
            <FaUser className="icon" />
            Employees
          </NavLink>
        )}

        {user && user?.role === "admin" && (
          <NavLink
            to="/category"
            className="sidebar-item"
            activeClassName="active"
          >
            <BiSolidCategory className="icon" />
            Category
          </NavLink>
        )}

        {user && user?.role === "admin" && (
          <NavLink
            to="/inventory"
            className="sidebar-item"
            activeClassName="active"
          >
            <MdInventory className="icon" />
            Inventory
          </NavLink>
        )}

        {user && user?.role === "admin" && (
          <NavLink
            to="/vendors"
            className="sidebar-item"
            activeClassName="active"
          >
            <FaUser className="icon" />
            Vendors
          </NavLink>
        )}

        {user && user?.role === "admin" && (
          <NavLink
            to="/order"
            className="sidebar-item"
            activeClassName="active"
          >
            <MdSell className="icon" />
            Purchase Order
          </NavLink>
        )}

        <NavLink
          to="/helpdesk"
          className="sidebar-item"
          activeClassName="active"
        >
          <SiHelpdesk className="icon"/>
          Help Desk
        </NavLink>
        <NavLink to="/history" className="sidebar-item" activeClassName="active">
          <FaHistory />
          Order History
        </NavLink>
      </div>
    )
  );
};

export default Sidebar;
