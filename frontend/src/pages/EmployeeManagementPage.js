import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeTable from "../components/EmployeeTable";
import CreateEmployee from "../components/CreateEmployee";
import Sidebar from "../components/Sidebar";
import classes from "./EmployeeManagementPage.module.css";
import axios from "axios";
import noItem from "../Images/noItem.jpg";
import Layout from "../components/Layout";

const EmployeeManagementPage = () => {
  const user = useSelector((state) => state?.auth?.user);
  const org = useSelector((state) => state?.org?.organization);

  const [employees, setEmployees] = useState(null);

  const fetchEmployees = async () => {
    try {
      if (org) {
        const res = await axios.get(
          `http://localhost:9999/org/employees/${org?._id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        const employees = await res.data;
        setEmployees(employees);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const appendNewEmp = (emp) => {
    setEmployees([
      ...employees,
      {
        name: emp.name,
        email: emp.email,
        role: emp.role,
        phone: emp.phone,
        password: "[REDACTED]",
      },
    ]);
  };

  useEffect(() => {
    fetchEmployees();
  }, [org]);

  // console.log("Employees ", employees);

  return (
    <Layout>
      <div className={classes.employees}>
        <div className={classes.header}>
          <h3>Employees</h3>
          <CreateEmployee appendNewEmp={appendNewEmp} />
        </div>

        {employees && employees.length > 0 && (
          <EmployeeTable employees={employees} />
        )}
        {employees && employees.length === 0 && (
          <div className={classes.noItem}>
            <img src={noItem} alt="" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeManagementPage;
