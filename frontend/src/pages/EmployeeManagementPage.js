import React from 'react';
import EmployeeTable from '../components/EmployeeTable';
import CreateEmployee from '../components/CreateEmployee';

const EmployeeManagementPage = () => {

  const employees = [
    {name: "sid", email: "sidfjls", phone: "djlsfj", password: "[REDACTED]"},
    {name: "sid", email: "sidfjls", phone: "djlsfj", password: "[REDACTED]"},
    {name: "sid", email: "sidfjls", phone: "djlsfj", password: "[REDACTED]"},
    {name: "sid", email: "sidfjls", phone: "djlsfj", password: "[REDACTED]"},
  ]

  return (
    <div>
      <h2>Employees</h2>
      <CreateEmployee />
      <EmployeeTable employees={employees}/>
    
    </div>
  )
}

export default EmployeeManagementPage;
