import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import classes from "./PlaceOrderPage.module.css"
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./PlaceOrderPage.module.css"

const PlaceOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [vendors, setVendors] = useState([]);

    const user = useSelector((state) => state.auth.user);
    const org = useSelector((state) => state.org.organization);

    const handleClearAll = () => {
        // const res = confirm("Are You Sure Want to clear all items?");
        setOrders([])
    }

    const handlePlaceOrder = async () => {
        console.log(orders);
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
                orgId: org?._id,
                adminId: user?.id,
                cart: orders
            })
            console.log("res: ", res);
        }
        catch (err) {
            alert("could not create order: ", err);
        }

    }

    useEffect(() => {
        const fetchVendors = async () => {
            const res = await fetch("http://localhost:9999/vendor/vendors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`,
                },
                body: JSON.stringify({
                    orgId: org?._id
                }),
            });

            const resJson = await res.json()
            console.log("resJson", resJson);
            if (!res.ok) { }

            if (res.ok) {

                setVendors(resJson);
            }

        }
        fetchVendors();
        console.log("vendors:", vendors);
    }, [])

    return (
        <>
            <div className={classes.main}>
                <div className={classes.left}>
                    <Sidebar />
                </div>

                <div className={classes.right}>
                    <h1>Place Order</h1>
                    <div className={classes.orders}>
                        {orders.map((order, idx) => (
                            <div className={classes.order_form} key={idx}>
                                <label for="vendor">Product Name</label>
                                
                                <input
                                    type="text"
                                    value={order?.name}
                                    onChange={(e) => {
                                        const newOrders = [...orders];
                                        newOrders[idx] = { ...order, name: e.target.value };
                                        setOrders(newOrders);
                                    }}
                                />
                                <label for="vendor">Product Vendor</label>

                                <select 
                                    name="vendor" 
                                    id="vendor"
                                    onChange={(e) => { 
                                        console.log(idx, e.target.value)
                                        const newOrders = [...orders];
                                        newOrders[idx] = { ...order, vendor: e.target.value };
                                        setOrders(newOrders);
                                     }}
                                >
                                    <option></option>
                                    {vendors?.map((v) => (
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
                        <button className={classes.add_btn} onClick={() => { setOrders([...orders, {}]) }}>
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
        </>
    )
}

export default PlaceOrderPage;
