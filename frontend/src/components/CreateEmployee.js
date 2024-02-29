// CreateEmployee.js

import React, { useState } from 'react';
import './CreateEmployee.css';

const CreateEmployee = ({ onAddEmployee }) => {
  const [showInputs, setShowInputs] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddEmployee = () => {
    // Validate input if needed before adding
    if (email && password) {
      onAddEmployee({ email, password });
      // Clear input fields after adding
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
