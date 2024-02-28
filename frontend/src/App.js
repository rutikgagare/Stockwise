import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/authSlice";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
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

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={user ? <Home /> : <Login/>} />
        <Route path="/login" element={!user ? <Login /> : <Home></Home>} />
        <Route path="/signup" element={!user ? <Signup /> : <Home></Home>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
