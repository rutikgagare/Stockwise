import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import EmployeeTable from '../components/EmployeeTable';
import CreateEmployee from '../components/CreateEmployee';
import axios from 'axios';

const EmployeeManagementPage = () => {

  const [employees, setEmployees] = useState([]);
  
  const org = useSelector((state)=> state.org.organization);

  const fetchEmployees = async () => {
    const e = await axios.get(`http://localhost:9999/org/employees/${org._id}`)
  }

  const appendNewEmp = (emp) => {
    setEmployees([
      ...employees, 
      { 
        name: emp.name, 
        email: emp.email, 
        phone: emp.phone, 
        password: "[REDACTED]"
      }
    ])
  }

  useEffect(() => { 
    if (org) {
      fetchEmployees();
    }
  })

  
  return (
    <div>
      <h2>Employees</h2>
      <CreateEmployee appendNewEmp={appendNewEmp}/>
      <EmployeeTable employees={employees}/>
    
    </div>
  )
}

export default EmployeeManagementPage;
