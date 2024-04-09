import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { useEffect, useState } from "react";

import  { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import Dashboard from "./pages/Dashboard";
import SetOrganization from "./pages/SetOrganization";
import Login from "./pages/Login";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import InventoryPage from "./pages/InventoryPage";
import CategoryPage from "./pages/CategoryPage";
import VendorsPage from "./pages/VendorsPage";
import ProfilePage from "./pages/ProfilePage";
import HelpDesk from "./pages/HelpDesk";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import HelpDeskAdmin from "./pages/HelpDeskAdmin";

import Loader from "./components/Loader.js";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(authActions.login(storedUser));
    } else {
      dispatch(authActions.logout());
    }

    setLoading(false);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <Loader />}
      {!loading && (
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
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
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />

          <Route
            path="/inventory"
            element={
              user && user?.role === "admin" ? (
                <InventoryPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/vendors"
            element={
              user && user?.role === "admin" ? (
                <VendorsPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/employees"
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
          <Route
            path="/order"
            element={
              user && user?.role === "admin" ? (
                <PlaceOrderPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/category"
            element={
              user && user?.role === "admin" ? (
                <CategoryPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/login" />}
          />

          <Route
            path="/helpdesk"
            element={user ? <HelpDesk /> : <Navigate to="/login" />}
          />

          <Route
            path="/helpdeskAdmin"
            element={
              user && user?.role === "admin" ? (
                <HelpDeskAdmin />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/history"
            element={
              user && user?.role === "admin" ? (
                <OrderHistoryPage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
