import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { organizationActions } from "./store/organizationSlice";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import Dashboard from "./pages/Dashboard";
import SetOrganization from "./pages/SetOrganization";
import Login from "./pages/Login";
import InventoryPage from "./pages/InventoryPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(authActions.login(user));
    }
  }, [dispatch]);

  useEffect(() => {
    const getOrganizationInfo = async () => {
      try {
        if (user) {
          const response = await fetch(
            `http://localhost:9999/org/getOrg`,{
              headers:{
                'Authorization': `Bearer ${user?.token}`
              }
            }
          );
          const orgDetails = await response.json();
          dispatch(organizationActions.setOrg(orgDetails));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getOrganizationInfo();
    
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard"/> : <Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/setOrg"
          element={
            user && user?.role === "admin" ? (
              <SetOrganization />
            ) : user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
         <Route
          path="/employees"
          element={user ? <EmployeeManagementPage /> : <Navigate to="/" />}
        />
        <Route
          path="/inventory"
          element={user ? <InventoryPage /> : <Navigate to="/" />}
        />
        <Route
          path="/employee"
          element={
            user && user?.role === "admin" ? (
              <EmployeeManagementPage />
            ) : user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
