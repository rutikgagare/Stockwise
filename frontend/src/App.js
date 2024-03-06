import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { organizationActions } from "./store/organizationSlice";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import Dashboard from "./pages/Dashboard";
import SetOrganization from "./pages/SetOrganization";
import Login from "./pages/Login";
import InventoryPage from "./pages/InventoryPage";
import ProductPage from "./pages/ProductPage";
import { productActions } from "./store/productSlice";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import VendorsPage from "./pages/VendorsPage";

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
    const fetchProducts = async () => {
      try {
        if (org) {
          const res = await fetch(`http://localhost:9999/product/${org?._id}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }

          dispatch(productActions.setProduct(json));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
    setIsloading(false);
  }, [org]);

  return (
    <BrowserRouter>
      <Navbar />

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
            element={user ? <InventoryPage /> : <Navigate to="/" />}
          />
           <Route
            path="/vendors"
            element={user ? <VendorsPage /> : <Navigate to="/" />}
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
            element={user ? <PlaceOrderPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/product"
            element={user ? <ProductPage /> : <Navigate to="/login" />}
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
