// CreateEmployee.js

import React, { useState } from 'react';
import { useSelector } from "react-redux";
import axios from "axios";
import './CreateEmployee.css';

const CreateEmployee = ({appendNewEmp}) => {
  const user = useSelector(state => state.auth.user);
  const org = useSelector((state)=> state.org.organization);

  const [showInputs, setShowInputs] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');

  const [isCreatingUser, setIsCreatingUser] = useState(false)

  const addEmpToOrg = async (emp) => {

    const res = await axios.post("http://localhost:9999/org/add", { employeeId: emp.data._id, orgId: org._id },{
      headers: {
        "Authorization": `Bearer ${user?.token}`
      }
    })

    if (res.status === 200 || res.status === 201) {
      alert("Employee Created!")
      appendNewEmp(emp.data)
    }
  }

  const handleAddEmployee = async () => {
    // Validate input if needed before adding
    if (email) {
      // Clear input fields after adding
      setIsCreatingUser(true);
      // let newEmp;
      try {
        const newEmp = await axios.post("http://localhost:9999/user/createUser/", { name, email, role },{
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        });
        addEmpToOrg(newEmp)
        setIsCreatingUser(false);
      } 
      catch (err) {
        console.log(err.response.data.error);
        alert(err?.response?.data?.error || "Something went wrong! Try again later")
        setIsCreatingUser(false);
        return;
      }

      setName('');
      setEmail('');
    }
  };

  const toggleInputs = () => {
    setShowInputs(!showInputs);
  };

  return (
    <div className="create-employee-container">
      <button className="round-add-button" onClick={toggleInputs}>
        {showInputs ? "-" : "+"}
      </button>
      {showInputs && (
        <>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select onChange={(e) => { setRole(e.target.value )}}>
            <option value="">Select Role</option>
            <option value ="employee">employee</option>
            <option value="admin">admin</option>
          </select>
          <button className="create-employee-button" onClick={handleAddEmployee}>
            Create Employee
          </button>
        </>
      )}
    </div>
  );
};

export default CreateEmployee;
