import React from 'react';
import EmployeeTable from '../components/EmployeeTable';
import CreateEmployee from '../components/CreateEmployee';
import {useSelector } from 'react-redux';

const EmployeeManagementPage = () => {

  const admins = useSelector((state)=> state?.org?.organization?.admins);
  const employees = useSelector((state)=> state?.org?.organization?.employees);

  console.log("admins", admins)
  console.log("employees", employees)

  const employees1 = [
  
  ]

  return (
    <div>
      <h2>Employees</h2>
      <CreateEmployee />
      <EmployeeTable employees={employees1}/>
    </div>
  )
}

export default EmployeeManagementPage;
