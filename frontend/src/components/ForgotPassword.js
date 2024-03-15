import React, {useState} from 'react';
import classes from './ForgotPassword.module.css';

const ForgotPassword = () => {

    const [showOTPField, setShowOTPField] = useState(false);

  return (
    <div className={classes.ForgotPassword}>
      {!showOTPField && <div className={classes.inputDiv}>
        <label htmlFor='email'>Email</label>
        <input id="email" type="text" placeholder='Enter email address' />
      </div>}

      {showOTPField && <div className={classes.inputDiv}>
        <label htmlFor='otp'>OTP</label>
        <input id="otp" type="text" placeholder='Enter OTP' />
      </div>}
      
      <button onClick={()=> setShowOTPField(true)}>Send OTP</button>
    </div>
  )
}

export default ForgotPassword;
