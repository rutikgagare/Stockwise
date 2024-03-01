import React from 'react';
import classes from './Dashboard.module.css';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div className={classes.main}>
      <div className='left'>
        <Sidebar />
      </div>
      <div className='right'>
        Dashboard
      </div>
    </div>
  )
}

export default Dashboard
