import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmployeeTable from "../components/EmployeeTable";
import CreateEmployee from "../components/CreateEmployee";
import classes from "./EmployeeManagementPage.module.css";
import axios from "axios";
import noItem from "../Images/noItem.jpg";
import Layout from "../components/Layout";
import { BASE_URL } from "../constants";
import Loader from '../components/Loader';

const EmployeeManagementPage = () => {
  const user = useSelector((state) => state?.auth?.user);
  const org = useSelector((state) => state?.org?.organization);

  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      if (org) {
        const res = await axios.get(
          `${BASE_URL}/org/employees/${org?._id}`,
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

    setLoading(false);

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

  return (
    <Layout>
      <div className={classes.employees}>
      {loading && <Loader></Loader>}
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
