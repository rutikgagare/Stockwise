import React, { useState } from "react";
import classes from "./Signup.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";
import { BASE_URL } from "../constants";

const SetOrganization = () => {
  const navigate = useNavigate();
  const org = useSelector((state) => state?.org?.organization);
  const user = useSelector((state) => state?.auth?.user);

  const [orgName, setOrgName] = useState(org?.name);
  const [email, setEmail] = useState();
  const [address, setAdress] = useState();
  const [error, setError] = useState();

  const createOrganization = async (event) => {
    event.preventDefault();

    try {
      if (!orgName || !email || !address) {
        throw Error("All required filed must be filled");
      }

      await fetch(`${BASE_URL}/org/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name: orgName,
          orgId: org?._id,
          email,
          address,
        }),
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <div className={classes.main}>
        <form className={classes.signupForm} onSubmit={createOrganization}>
          <div className={classes.error}>{error}</div>

          <div className={classes.heading}>
            <h2>Set up organization profile</h2>
          </div>

          <div className={classes.inputDiv}>
            <label htmlFor="orgName" className={classes.required}>
              Organization Name
            </label>
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
            <label htmlFor="email" className={classes.required}>
              Organization Email
            </label>
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
            <label htmlFor="address" className={classes.required}>
              Organization Location
            </label>
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
    </Layout>
  );
};

export default SetOrganization;
