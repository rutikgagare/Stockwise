import React from "react";
import classes from "./Home.module.css";
import homeImage from "../Images/home.jpg";
import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div className={classes.home}>
        <div className={classes.left}>
          <img src={homeImage} alt="" />
        </div>

        <div className={classes.right}>
          <div className={classes.tagline}>
            <h2>Streamline Your Inventory</h2>
            <h2> Simplify Your Business</h2>
          </div>

          <p>
            Welcome to StockWise, the leading SaaS solution designed to empower
            organizations in effectively managing their assets. Whether you're
            overseeing office equipment, IT assets, or any other inventory,
            StockWise simplifies asset tracking, optimizing your operations for
            enhanced productivity.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
