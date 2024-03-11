import React, {useState} from "react";
import Sidebar from "./Sidebar";
import classes from "./Layout.module.css";
import Navbar from "./Navbar";

const Layout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={classes.layout}>
      <Navbar toggleSidebar={toggleSidebar} ></Navbar>

      <div className={classes.mainContent}>
        <Sidebar className={classes.sidebar} isOpen={isSidebarOpen}></Sidebar>
        <div className={classes.main}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
