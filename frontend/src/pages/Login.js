import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import classes from "./Signup.module.css";
import Layout from "../components/Layout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Layout>
      <div className={classes.main}>
        <form className={classes.signupForm} onSubmit={handleSubmit}>
          <div className={classes.heading}>
            <h2>Sign in</h2>
            <span>to access Inventory</span>
          </div>

          <input
            placeholder="Email Address"
            required="true"
            type="email"
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
            Sign in
          </button>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </Layout>
  );
};

export default Login;
