import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import classes from "./Signup.module.css";
import Layout from "../components/Layout";
import ForgotPassword from "../components/ForgotPassword";
import Modal from "../components/Modal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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
            {/* <span>to access Inventory</span> */}
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

          <span className={classes.forgot} onClick={()=>setShowForgotPassword(prev => !prev)}>Forgot password?</span>

          {error && <div className={classes.error}>{error}</div>}
        </form>

        {showForgotPassword && <Modal onClose={() => setShowForgotPassword(false)} width = "30%"><ForgotPassword onClose={()=>setShowForgotPassword(false)}></ForgotPassword></Modal>}
      </div>
    </Layout>
  );
};

export default Login;
