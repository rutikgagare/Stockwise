import React from 'react';
import classes from './Home.module.css';
import logisticsImage from '../Images/logistics.png'

const Home = () => {

  return (
    <div className={classes.home}>

      <div className={classes.left}>
        <img src={logisticsImage} alt="" />
      </div>

      <div className={classes.right}>
        <h2>Streamline Your Inventory, Simplify Your Business</h2>
        <p>
          Welcome to Stockwise, your comprehensive inventory management solution. Stockwise is a Software as a Service (SaaS) application built on the MERN (MongoDB, Express.js, React.js, Node.js) stack. It empowers organizations to efficiently manage their inventory, streamline stock tracking, record sales transactions, and analyze sales and profit data with ease.
        </p>
      </div>
    </div>
  )
}

export default Home;
