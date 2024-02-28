import { useState } from "react";
import { authActions } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export const useSignup = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update state in store
      dispatch(authActions.login(json));

      // update loading state
      setIsLoading(false);
    }

    if(json.role === "admin"){
      navigate('/landing');
    }
  };

  return { signup, isLoading, error };
};
