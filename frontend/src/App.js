import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { organizationActions } from "./store/organizationSlice";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";


function App() {

  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(authActions.login(user));
    }
  }, [dispatch]);

  useEffect(()=>{

    const getOrganizationInfo = async ()=>{
      if(user){
        const response = await fetch(`http://localhost:9999/org/getOrg/${user.id}`);
        const json = await response.json();

        dispatch(organizationActions.setOrg(json));
      }
    }
    getOrganizationInfo();

  },[dispatch, user])

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={user ? <Home /> : <Signup/>} />
        <Route path="/login" element={!user ? <Login /> : <Home></Home>} />
        <Route path="/signup" element={!user ? <Signup /> : <Home></Home>} />
        <Route path="/landing" element={user && user.role === "admin" ? <LandingPage/> : <Home></Home>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
