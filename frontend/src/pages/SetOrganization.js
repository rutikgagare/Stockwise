import React, { useState } from "react";
import classes from "./Signup.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const SetOrganization = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [orgName, setOrgName] = useState();
  const [email, setEmail] = useState();
  const [address, setAdress] = useState();

  const createOrganization = async (event) => {
    event.preventDefault();

    try {
      await fetch("/organization/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName,
          email,
          address,
          adminId: user?.id,
        }),
      });
      
      navigate("/dashboard");
      
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.main}>
      <form className={classes.signup} onSubmit={createOrganization}>
        <div className={classes.heading}>
          <h2>Set up organization profile</h2>
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="orgName">Organization Name</label>
          <input
            id="orgName"
            placeholder=""
            type="text"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
            }}
          />
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="email">Organization Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="address">Organization Location</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => {
              setAdress(e.target.value);
            }}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SetOrganization;
