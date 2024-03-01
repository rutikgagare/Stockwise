import React, { useState } from "react";
import classes from "./Signup.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const SetOrganization = () => {
  const navigate = useNavigate();
  const org = useSelector((state) => state?.org?.organization);
  const user = useSelector((state) => state?.auth?.user);

  const [orgName, setOrgName] = useState(org?.name);
  const [email, setEmail] = useState();
  const [address, setAdress] = useState();

  const createOrganization = async (event) => {
    event.preventDefault();

    try {
      await fetch("/org/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: orgName,
          orgId: org?._id,
          email,
          address,
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
