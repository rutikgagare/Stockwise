import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { useEffect, useState } from "react";

import { Toaster } from "react-hot-toast";

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
import ErrorPage from "./pages/ErrorPage.js";
import Home from "./pages/Home.js";

import { inventoryActions } from "./store/inventorySlice.js";
import { organizationActions } from "./store/organizationSlice.js";
import { categoryActions } from "./store/categorySlice.js";

import { BASE_URL } from "./constants/index.js";
import { generateToken, messaging } from "./notification/firebase.js";
import { onMessage } from "firebase/messaging";

import toast from "react-hot-toast";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        setLoading(true);

        const orgResponse = await fetch(`${BASE_URL}/org/getOrg`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!orgResponse.ok) {
          throw new Error("Failed to fetch organization data");
        }

        const orgDetails = await orgResponse.json();
        dispatch(organizationActions.setOrg(orgDetails));

        const categoryResponse = await fetch(
          `${BASE_URL}/Category/${orgDetails._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch category data");
        }

        const categoryData = await categoryResponse.json();
        dispatch(categoryActions.setCategory(categoryData));

        const inventoryResponse = await fetch(
          `${BASE_URL}/inventory/${orgDetails._id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!inventoryResponse.ok) {
          throw new Error("Failed to fetch inventory data");
        }

        const inventoryData = await inventoryResponse.json();
        dispatch(inventoryActions.setInventory(inventoryData));

        generateToken();
        onMessage(messaging, (payload) => {
          toast(payload.notification.body, { duration: 3000 });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user]);

  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      {loading && <Loader />}
      {!loading &&
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
        <Route path="*" element={<ErrorPage />} />
      </Routes>}
    </BrowserRouter>
  );
}

export default App;
