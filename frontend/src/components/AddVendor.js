import React, { useState } from "react";
import classes from "./AddProduct.module.css";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../store/productSlice";

const AddProduct = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(-1);
  
  const [error, setError] = useState(null);

  const createProductHandler = async (e) => {
    e.preventDefault();
    
    if (!org) {
      alert("Can't Add Vendor right now! Try again later");
      return;
    }

    try {
      if (!name || !address || !email || !phone) {
        throw Error("All field must be field");
      }

      const response = await fetch("http://localhost:9999/vendor/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          address,
          email,
          phone,
          orgId: org?._id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        props.updateVendors([...props.vendors, json])
        console.log("json", json)
        // dispatch(productActions.addProduct(json));
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.addProduct}>
        <div className={classes.header}>
          <h3>New Vendor</h3>
          <button onClick={() => props.onClose()}>Cancel</button>
        </div>

        <div className={classes.addProductForm} onSubmit={createProductHandler}>
          {error && <div className={classes.error}>{error}</div>}
          <form>
            <div className={classes.inputDiv}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                placeholder="Enter vendor name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="name">Address</label>
              <input
                id="address"
                type="test"
                value={address}
                placeholder="Enter vendor address"
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="name">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter vendor email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={classes.inputDiv}>
              <label htmlFor="name">Phone</label>
              <input
                id="phone"
                type="phone"
                value={phone}
                placeholder="Enter vendor phone"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit">Add Vendor</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
