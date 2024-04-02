import { useState } from "react";
import { authActions } from "../store/authSlice";
import { organizationActions } from "../store/organizationSlice";
import { useDispatch} from "react-redux";
import { BASE_URL } from "../constants";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const signup = async (name, email, password, orgName) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "admin" }),
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


    const res = await fetch(`${BASE_URL}/org/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${json?.token}`,
      },
      body: JSON.stringify({ name: orgName, email }),
    });

    const orgDetails = await res.json()

    if (!res.ok) {
      setIsLoading(false);
      setError(res.error);
      return;
    }

    if(res.ok) {
      setIsLoading(false);
      dispatch(organizationActions.setOrg(orgDetails));
    }

    console.log("signup successfull");
  };

  return { signup, isLoading, error };
};
