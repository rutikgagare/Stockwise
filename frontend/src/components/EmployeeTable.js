import React from 'react';
import './EmployeeTable.css';

const EmployeeTable = ({ employees }) => {

  return (
    <div className="employee-table-container">
      { employees.length > 0 && <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.password}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  );
};

export default EmployeeTable;
