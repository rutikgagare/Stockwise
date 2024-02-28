import React, { useState } from 'react';
import classes1 from './Landing.module.css';
import classes from './Signup.module.css'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const LandingPage = () => {

  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const [isClicked, setIsClicked] = useState(false);
  const [orgName, setOrgName] = useState();
  const [email, setEmail] = useState();
  const [address, setAdress] = useState();

  const createOrganization = async (event) =>{
    event.preventDefault();

    try{
      const res = await fetch("/organization/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, email, address, adminId: user?.id}),
      });

      console.log(res.json());

      if(res){
        navigate('/');
      }

    }catch(err){
      console.log(err);
    }
  }

  return (

    <div className={classes1.main}>

      {/* when button is not clicked */}
      {!isClicked && <button className={classes1.createOrgBtn} onClick = {()=>{setIsClicked(true)}} >Create Organization</button>}

      {isClicked && 
         <form className={classes.signup} onSubmit={createOrganization}>
         <h2>Organization details</h2>

         <div className={classes.inputDiv}>
           <label htmlFor="orgName">Organization name</label>
           <input
             id="orgName"
             type="text"
             value={orgName}
             onChange={(e) => {
               setOrgName(e.target.value);
             }}
           />
         </div>
 
         <div className={classes.inputDiv}>
           <label htmlFor="email">Email</label>
           <input
             id="email"
             type="email"
             value={email}
             onChange={(e) => {
               setEmail(e.target.value);
             }}
           />
         </div>
 
         <div className={classes.inputDiv}>
           <label htmlFor="address">Address</label>
           <input
             id="address"
             type="text"
             value={address}
             onChange={(e) => {
               setAdress(e.target.value);
             }}
           />
         </div>
 
         <button type="submit">
             Submit
         </button>
        
       </form>
      }
    </div>
  )
}

export default LandingPage;
