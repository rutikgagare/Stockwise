import React from "react";
import classes from "./ErrorPage.module.css";
import { useNavigate,  } from "react-router-dom";
import { useSelector } from "react-redux";


const ErrorPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <div>
      <div className={classes.error}>
        <h1>404</h1>
        <h2>Oops! Page Not Found</h2>
        <p>
          The page you're looking for might be renamed, removed or might never
          exists on this planet.
        </p>
        {!user && <button onClick={()=>{navigate('/')}}>Go Back to Home Page</button>}
        {user && <button onClick={()=>{navigate('/dashboard')}}>Go Back to Home Page</button>}
      </div>
    </div>
  );
};

export default ErrorPage;
