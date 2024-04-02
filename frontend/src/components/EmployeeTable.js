import React, { useState } from 'react';
import classes from "./EmployeeTable.module.css"
import './EmployeeTable.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../constants';

const EmployeeTable = ({ employees }) => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [updateItem, setUpdateItem] = useState(-1);
  const [emps, setEmps] = useState(employees);

  const updateEmployee = async (employeeIdx) => {
    console.log("employeeIdx", employeeIdx);
    console.log("emps", emps);
    console.log("updating vendor: ", emps[employeeIdx]);

    if (!emps[employeeIdx]) {
      alert(employeeIdx, "vendor not found?!");
      return;
    }

    const res = await fetch(`${BASE_URL}/user/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        ...emps[employeeIdx],
      }),
    });

    const resJson = await res.json();

    console.log("updateVendor resJson: ", resJson);
    if (res.statusText !== "OK") {
      alert("Could not update the vendor");
    }

    if (res.statusText === "OK") {
      alert("User udpated successfully!");
    }
  }

  const deleteEmployee = async (employeeIdx) => {
    const c = window.confirm("Are you sure want to delete the user?\nThis change is irreversible!");
    if (!c) return;

    try {
      const res = await axios.delete(`${BASE_URL}/user/deleteUser`, {
        data: {
          _id: emps[employeeIdx]._id
        }
      });

      console.log("res: ", res);
      if (res.statusText === "OK") {
        const newEmps = emps.filter((v, i) => i !== employeeIdx);
        setEmps(newEmps);
        alert("User deleted successfully!")
      }

    }

    catch (error) {
      alert("Could not delete the user: " + error);
      console.log(error);
    }
  }

  return (
    <div className="employee-table-container">
      {employees.length > 0 && <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>
                <input
                  style={{ outline: "none", border: "none" }}
                  disabled={index === updateItem ? false : true}
                  value={employee.name}
                  onChange={(e) => {
                    const empsCopy = [...emps];
                    empsCopy[index].name = e.target.value;
                    setEmps(empsCopy);
                  }}
                />
              </td>
              <td>
                <input
                  style={{ outline: "none", border: "none" }}
                  disabled={index === updateItem ? false : true}
                  value={employee.email}
                  onChange={(e) => {
                    const empsCopy = [...emps];
                    empsCopy[index].email = e.target.value;
                    setEmps(empsCopy);
                  }}
                />
              </td>
              <td>
                <select
                  style={{ outline: "none", border: "none" }}
                  disabled={index === updateItem ? false : true}
                  value={employee.role}
                  onChange={(e) => {
                    const empsCopy = [...emps];
                    empsCopy[index].role = e.target.value;
                    setEmps(empsCopy);
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="user">User</option>
                </select>
              </td>
              <td>
                <td>
                  <div className={classes.actions}>
                    {index === updateItem ? (
                      <button
                        onClick={() => setUpdateItem(-1)}
                        className={classes.cancel}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (updateItem !== -1) {
                            alert("Hit the done button to continue");
                            return;
                          }
                          setUpdateItem(index);
                        }}
                        className={classes.update}
                      >
                        Update
                      </button>
                    )}

                    {updateItem === index ? (

                      <button
                        className={classes.done}
                        onClick={() => {
                          updateEmployee(updateItem);
                          setUpdateItem(-1);
                        }}
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          deleteEmployee(index);
                        }}
                        className={classes.delete}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      }
    </div>
  );
};

export default EmployeeTable;
