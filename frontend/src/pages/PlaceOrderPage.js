import { useEffect, useState, useRef } from "react";
import classes from "./PlaceOrderPage.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import Layout from "../components/Layout";

const PlaceOrderPage = () => {
  const [orders, setOrders] = useState([{}]);
  const [vendors, setVendors] = useState([]);
  const lastOrderRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const handleClearAll = () => {
    setOrders([]);
  };

  const handlePlaceOrder = async () => {
    console.log(orders);
    if (!org) {
      alert("Organization data not found!");
      return;
    }
    if (!user) {
      alert("User not found!");
      return;
    }

    if (user) console.log("user: ", user);
    try {
      const res = await axios.post("http://localhost:9999/order/create", {
        orgId: org?._id,
        adminId: user?.id,
        cart: orders,
      });
      console.log("res: ", res);
    } catch (err) {
      alert("could not create order: ", err);
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch("http://localhost:9999/vendor/vendors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orgId: org?._id,
        }),
      });

      const resJson = await res.json();
      console.log("resJson", resJson);

      if (res.ok) {
        setVendors(resJson);
      }
    };
    fetchVendors();
    console.log("vendors:", vendors);
  }, []);

  useEffect(() => {
    // Scroll to the last order form when orders change
    if (lastOrderRef.current) {
      lastOrderRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [orders]);

  return (
    <Layout>
      <div className={classes.placeOrder}>
        <div className={classes.header}>
          <h3>Purchase Order</h3>
        </div>

        <div className={classes.orders_container}>
          {orders.map((order, idx) => (
            <div
              className={classes.order_form}
              key={idx}
              ref={idx === orders.length - 1 ? lastOrderRef : null}
            >
              <div className={classes.inputDiv}>
                <label htmlFor="productName"> Product Name</label>
                <input
                  id="productName"
                  type="text"
                  value={order?.name}
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[idx] = { ...order, name: e.target.value };
                    setOrders(newOrders);
                  }}
                />
              </div>
              <div className={classes.inputDiv}>
                <label htmlFor="vendorName">Product Vendor</label>
                <input
                  id="vendorName"
                  type="text"
                  value={order?.vendor}
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[idx] = { ...order, vendor: e.target.value };
                    setOrders(newOrders);
                  }}
                />
              </div>

              <div className={classes.inputDiv}>
                <label htmlFor="email">Vendor Email</label>
                <input
                  id="email"
                  type="email"
                  value={order?.email}
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[idx] = { ...order, email: e.target.value };
                    setOrders(newOrders);
                  }}
                />
              </div>

              <div className={classes.inputDiv}>
                <label htmlFor="qty">Quantity</label>
                <input
                  id="qty"
                  type="number"
                  min={1}
                  max={1000}
                  value={order?.quantity}
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[idx] = { ...order, quantity: e.target.value };
                    setOrders(newOrders);
                  }}
                />
              </div>

              <button
                onClick={() => {
                  const newOrders = orders.filter((_, i) => i !== idx);
                  setOrders(newOrders);
                }}
                className={classes.remove}
              >
                Remove
              </button>
            </div>
          ))}

          <div className={classes.action_buttons}>
            <button
              className={classes.add_btn}
              onClick={() => {
                setOrders([...orders, {}]);
              }}
            >
              Add Product
            </button>

            <button className={classes.clear_btn} onClick={handleClearAll}>
              Clear All Products
            </button>

            <button className={classes.order_btn} onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrderPage;
