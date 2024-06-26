import { useEffect, useState } from "react";
import classes from "./PlaceOrderPage.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import "./PlaceOrderPage.module.css";
import Layout from "../components/Layout";
import { BASE_URL } from "../constants";
import NoItem from "../components/NoItem";

const PlaceOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [respVendors, setRespVendors] = useState([[]]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const handleClearAll = () => {
    // const res = confirm("Are You Sure Want to clear all items?");
    setOrders([]);
  };

  const handlePlaceOrder = async () => {
    for (const order of orders) {
      if (!order.vendor || !order.quantity || !order.item) {
        alert("Product, vendor and quantity are required");
        return;
      }
    }

    if (!org) {
      alert("Organization data not found!");
      return;
    }
    if (!user) {
      alert("User not found!");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/order/create`, {
        org,
        admin: user,
        cart: orders,
      });

      if (res.status) {
        setOrders([]);
        alert(
          "Order Placed Successfully! You can track your orders in the Order History tab."
        );
      }
    } catch (err) {
      alert("could not create order: ", err);
    }
  };

  const handleSetVendors = (itemIdx, arrIdx) => {
    if (itemIdx === 0) setRespVendors([]);
    if (!(itemIdx > 0 && itemIdx < products.length + 1)) return;

    const productCategoryId = products[itemIdx - 1].categoryId;
    const respectiveCategory = categories.filter(
      (v, i, a) => v._id === productCategoryId
    )[0];
    const respectiveCategoryVendorIds = respectiveCategory?.vendors;
    const respectiveVendors = vendors?.filter((vendor) =>
      respectiveCategoryVendorIds?.includes(vendor._id)
    );

    const newRespVendors = [...respVendors];
    newRespVendors[arrIdx] = respectiveVendors;

    setRespVendors(newRespVendors);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (org) {
          const res = await fetch(`${BASE_URL}/vendor/vendors`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              orgId: org?._id,
            }),
          });

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }

          setVendors(json);
        }
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    const fetchInventory = async () => {
      try {
        if (org) {
          const res = await fetch(`${BASE_URL}/inventory/${org?._id}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const json = await res.json();

          if (!Array.isArray(json)) {
            throw new Error("Response is not an array");
          }
          setProducts(json);
        }
      } catch (error) {
        console.error("Error fetching Inventory:", error);
      }
    };

    const fetchCategories = async () => {
      const res = await fetch(`${BASE_URL}/category/${org?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const resJson = await res.json();
      console.log("resJson", resJson);
      if (!res.ok) {
      }

      if (res.ok) {
        setCategories(resJson);
      }
    };

    fetchVendors();
    fetchCategories();
    fetchInventory();
  }, [org]);

  const getProductFromId = (productId) => {
    const product = products.filter((prod) => prod._id === productId)[0];
    return product ?? null;
  };

  const getVendorFromId = (vendorId) => {
    const vendor = vendors?.filter((prod) => prod._id === vendorId)[0];
    return vendor ?? null;
  };

  return (
    <Layout>
      <div className={classes.place_order}>
        <div className={classes.header}>
          <h3>Place Order</h3>
        </div>

        <div className={classes.orders}>
          {orders.length ? 
          orders.map((order, idx) => (
            <div className={classes.order_form} key={idx}>
              <div className={classes.inputDiv}>
                <label htmlFor="product">Select Product</label>
                <select
                  id="product"
                  onChange={(e) => {
                    handleSetVendors(e.target.selectedIndex, idx);
                    const newOrders = [...orders];
                    newOrders[idx] = {
                      ...order,
                      item: getProductFromId(e.target.value),
                    };
                    setOrders(newOrders);
                  }}
                >
                  <option value="testval"></option>
                  {products?.map((prod, idx) => (
                    <option value={prod?._id}>{prod.name}</option>
                  ))}
                </select>
              </div>

              <div className={classes.inputDiv}>
                <label htmlFor="vendor">Product Vendor</label>
                <select
                  name="vendor"
                  id="vendor"
                  onChange={(e) => {
                    const newOrders = [...orders];
                    newOrders[idx] = {
                      ...order,
                      vendor: getVendorFromId(e.target.value),
                    };
                    setOrders(newOrders);
                  }}
                >
                  <option></option>
                  {respVendors[idx]?.map((v) => (
                    <option value={v?._id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className={classes.inputDiv}>
                <label htmlFor="quantity">Quantity</label>
                <input
                  id="quantity"
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
              >
                Remove
              </button>
            </div>
          )) :
          <NoItem/>
          }
        </div>

        <div className={classes.action_buttons}>
          <button
            className={classes.add_btn}
            onClick={() => {
              setOrders([...orders, {}]);
              setRespVendors([...respVendors, []]);
            }}
          >
            Add
          </button>

          <button className={classes.clear_btn} onClick={handleClearAll}>
            Remove All
          </button>

          <button className={classes.order_btn} onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrderPage;
