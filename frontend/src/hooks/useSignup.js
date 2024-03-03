import { useState } from "react";
import { authActions } from "../store/authSlice";
import { organizationActions } from "../store/organizationSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export const useSignup = () => {

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const signup = async (name, email, password, orgName) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:9999/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "admin"}),
    });

    console.log("response in useSignup", response)
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
      return;
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update state in store
      dispatch(authActions.login(json));

      // update loading state
      setIsLoading(false);
    }

    console.log("json", json)
    const res = await axios.post("http://localhost:9999/org/create", { 
      name: orgName, 
      email,
      adminId: json?.id
    })
  
    console.log("res org/create", res);
    if(!res.ok){
      setIsLoading(false);
      setError(res.error)
    }

    if(res.ok){
      setIsLoading(false);
      dispatch(organizationActions.setOrg(res.json))
    }

    console.log("signup successfull")
  };

  return { signup, isLoading, error };
};
