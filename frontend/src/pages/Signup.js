import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router";
import classes from "./Signup.module.css";

const Signup = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");

  const { signup, isLoading, error } = useSignup();

  const handleSignUp = async (e) => {
    e.preventDefault();

    await signup(name, email, password, orgName);
    navigate('/setOrg');
  };

  return (
    <div className={classes.main}>
      <form className="signup" onSubmit={handleSignUp}>
        
        <div className={classes.heading}>
          <h2>Sign up</h2>
        </div>

        <input
          placeholder="Organization Name"
          type="text"
          required="true"
          value={orgName}
          onChange={(e) => {
            setOrgName(e.target.value);
          }}
        />

        <input
          placeholder="Enter Your Name"
          type="text"
          required="true"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <input
          placeholder="Email Address"
          type="email"
          required="true"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          placeholder="Password"
          type="password"
          required="true"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <button disabled={isLoading} type="submit">
          Sign up
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Signup;
