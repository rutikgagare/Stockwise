import React from 'react';
import classes from './Dashboard.module.css';
// import Sidebar from '../components/Sidebar';
import Layout from "../components/Layout";

const Dashboard = () => {
  return (
    <Layout>
      <div className={classes.right}>
        Dashboard
      </div>
    </Layout>
  )
}

export default Dashboard
