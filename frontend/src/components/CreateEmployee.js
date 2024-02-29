// CreateEmployee.js

import React, { useState } from 'react';
import axios from "axios";
import './CreateEmployee.css';

const CreateEmployee = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddEmployee = async () => {
    // Validate input if needed before adding
    if (email && password) {
      // Clear input fields after adding
      const newEmp = await axios.post("http://localhost:9999/auth/signup/", { name, email, password, role: "employee"});
      console.log("newEmp", newEmp)
      setEmail('');
      setPassword('');
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="create-employee-button" onClick={handleAddEmployee}>
            Create Employee
          </button>
        </>
      )}
    </div>
  );
};

export default CreateEmployee;
