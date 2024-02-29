import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { organizationActions } from "./store/organizationSlice";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import Dashboard from "./pages/Dashboard";
import SetOrganization from './pages/SetOrganization';
import Login from './pages/Login';


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
        <Route path="/" element={user ? <Dashboard /> : <Home/>} />
        <Route path="/login" element={!user ? <Login /> : <Dashboard></Dashboard>} />
        <Route path="/signup" element={!user ? <Signup /> : <Dashboard></Dashboard>} />
        <Route path="/setOrg" element={ user && user?.role === "admin" ? <SetOrganization/> :<Dashboard/>} />
        <Route path="/dashboard" element={user ? <Dashboard/> : <Home></Home>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
