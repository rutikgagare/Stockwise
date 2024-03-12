import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import classes from "./PlaceOrderPage.module.css"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./PlaceOrderPage.module.css"
import Layout from "../components/Layout";

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
        setOrders([])
    }

    const handlePlaceOrder = async () => {
        console.log(orders);

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
            alert("User not found!")
            return;
        }

        if (user) console.log('user: ', user)
        try {
            const res = await axios.post("http://localhost:9999/order/create", {
                org, 
                admin: user,
                cart: orders
            })
            console.log("res: ", res);

            if (res.status) {
                setOrders([]);
                alert("Order Placed Successfully! You can track your orders in the Order History tab.")
            }
        }
        catch (err) {
            alert("could not create order: ", err);
        }

    }

    const handleSetVendors = (itemIdx, arrIdx) => {
        if (!(itemIdx > 0 && itemIdx < products.length + 1)) return;

        const productCategoryId = products[itemIdx - 1].categoryId;
        const respectiveCategory = categories.filter((v, i, a) => v._id == productCategoryId)[0];
        const respectiveCategoryVendorIds = respectiveCategory.vendors;
        const respectiveVendors = vendors.filter(vendor => respectiveCategoryVendorIds.includes(vendor._id));

        const newRespVendors = [...respVendors];
        newRespVendors[arrIdx] = respectiveVendors

        setRespVendors(newRespVendors);
    }

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                if (org) {
                    const res = await fetch(
                        `http://localhost:9999/vendor/vendors`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${user?.token}`,
                        },
                        body: JSON.stringify({
                            orgId: org?._id
                        })
                    });

                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const json = await res.json();

                    if (!Array.isArray(json)) {
                        throw new Error("Response is not an array");
                    }

                    console.log("vendors fetched: ", json);
                    setVendors(json);
                }
            } catch (error) {
                console.error("Error fetching Inventory:", error);
            }
        };

        const fetchInventory = async () => {
            try {
                if (org) {
                    const res = await fetch(
                        `http://localhost:9999/inventory/${org?._id}`, {
                        headers: {
                            Authorization: `Bearer ${user?.token}`,
                        },
                    }
                    );

                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const json = await res.json();

                    if (!Array.isArray(json)) {
                        throw new Error("Response is not an array");
                    }

                    console.log("json: ", json);
                    setProducts(json);
                }
            } catch (error) {
                console.error("Error fetching Inventory:", error);
            }
        };

        const fetchCategories = async () => {
            const res = await fetch(`http://localhost:9999/category/${org?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`,
                }
            });

            const resJson = await res.json()
            console.log("resJson", resJson);
            if (!res.ok) { }

            if (res.ok) {

                setCategories(resJson);
            }

        }

        fetchVendors()
        fetchCategories();
        fetchInventory();
    }, [])

    const getProductFromId = (productId) => {
        const product = products.filter((prod) => prod._id == productId)[0];
        return product ?? null;
    }

    const getVendorFromId = (vendorId) => {
        const vendor = vendors.filter((prod) => prod._id == vendorId)[0];
        return vendor ?? null;
    }
    return (
        <Layout>
            <div className={classes.main}>
                <div className={classes.left}>
                    <Sidebar />
                </div>

                <div className={classes.right}>
                    <h1>Place Order</h1>
                    <div className={classes.orders}>
                        {orders.map((order, idx) => (
                            <div className={classes.order_form} key={idx}>
                                <label for="vendor">Select Product</label>
                                <select onChange={(e) => {
                                    handleSetVendors(e.target.selectedIndex, idx)
                                    const newOrders = [...orders];
                                    newOrders[idx] = { ...order, item: getProductFromId(e.target.value) };
                                    setOrders(newOrders);
                                }}>
                                    <option value="testval"></option>
                                    {products?.map((prod, idx) => (
                                        <option value={prod?._id}>{prod.name}</option>
                                    ))}
                                </select>

                                <label for="vendor">Product Vendor</label>
                                <select
                                    name="vendor"
                                    id="vendor"
                                    onChange={(e) => {
                                        console.log(idx, e.target.value)
                                        const newOrders = [...orders];
                                        newOrders[idx] = { ...order, vendor: getVendorFromId(e.target.value) };
                                        setOrders(newOrders);
                                    }}
                                >
                                    <option></option>
                                    {respVendors[idx]?.map((v) => (
                                        <option value={v?._id}>{v.name}</option>
                                    ))}
                                </select>

                                <label for="vendor">Quantity</label>
                                <input
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
                                <button
                                    onClick={() => {
                                        const newOrders = orders.filter((_, i) => i !== idx);
                                        setOrders(newOrders);
                                    }}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className={classes.action_buttons} >
                        <button className={classes.add_btn} onClick={() => {
                            setOrders([...orders, {}])
                            setRespVendors([...respVendors, []])
                        }}>
                            Add
                        </button>

                        <button className={classes.clear_btn} onClick={handleClearAll}>
                            Remove All
                        </button>

                        <button className={classes.order_btn} onClick={handlePlaceOrder} >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default PlaceOrderPage;
