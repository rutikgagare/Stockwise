import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import classes from "./Signup.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className={classes.main}>
      <form className="login" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className={classes.inputDiv}>
          <label htmlFor="">Email</label>

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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button disabled={isLoading} type="submit">
          Login
        </button>

        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
