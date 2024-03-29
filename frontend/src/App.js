import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { organizationActions } from "./store/organizationSlice";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
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

import { categoryActions } from "./store/categorySlice";
import { inventoryActions } from "./store/inventorySlice";

import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  const org = useSelector((state) => state?.org?.organization);
  const [loading, setIsloading] = useState(true);

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
          const response = await fetch(`http://localhost:9999/org/getOrg`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          const orgDetails = await response.json();
          dispatch(organizationActions.setOrg(orgDetails));
        }
      } catch (err) {
        console.log(err);
      }
    };
    getOrganizationInfo();
  }, [dispatch, user]);

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        if (org) {
          const res = await fetch(
            `http://localhost:9999/Category/${org?._id}`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }

          dispatch(categoryActions.setCategory(json));
        }
      } catch (error) {
        console.error("Error fetching Categorys:", error);
      }
    };

    fetchCategorys();
    setIsloading(false);
  }, [org]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        if (org) {
          const res = await fetch(
            `http://localhost:9999/inventory/${org?._id}`,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }

          dispatch(inventoryActions.setInventory(json));
        }
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    fetchInventory();
    setIsloading(false);
  }, [org]);

  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      {!loading && (
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Home />}
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
            path="/history"
            element={user ? <OrderHistoryPage /> : <Navigate to="/login" />}
          />

        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
