import { useState } from "react";
import Sidebar from "../components/Sidebar";
import classes from "./PlaceOrderPage.module.css"
import "./PlaceOrderPage.module.css"

const PlaceOrderPage = () => {
    const [orders, setOrders] = useState([]);

    const handleClearAll = () => {
        // const res = confirm("Are You Sure Want to clear all items?");
        setOrders([])
    }

    return (
        <>
            <div className={classes.main}>
                <div className={classes.left}>
                    <Sidebar />
                </div>

                <div className={classes.right}>
                    <h1>Place Order</h1>

                    {orders.map((order, idx) => (
                        <div className={classes.order_form} key={idx}>
                            Product Name:
                            <input
                                type="text"
                                value={order?.name}
                                onChange={(e) => {
                                    const newOrders = [...orders];
                                    newOrders[idx] = { ...order, name: e.target.value };
                                    setOrders(newOrders);
                                }}
                            />
                            Product Vendor:
                            <input
                                type="text"
                                value={order?.vendor}
                                onChange={(e) => {
                                    const newOrders = [...orders];
                                    newOrders[idx] = { ...order, vendor: e.target.value };
                                    setOrders(newOrders);
                                }}
                            />
                            Vendor Email:
                            <input
                                type="email"
                                value={order?.email}
                                onChange={(e) => {
                                    const newOrders = [...orders];
                                    newOrders[idx] = { ...order, email: e.target.value };
                                    setOrders(newOrders);
                                }}
                            />
                            Quntity:
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

                    <div className={classes.action_buttons} >
                        <button className={classes.add_btn} onClick={() => { setOrders([...orders, {}]) }}>
                            Add
                        </button>

                        <button className={classes.clear_btn} onClick={ handleClearAll }>
                            Remove All
                        </button>

                        <button className={classes.order_btn} onClick={() => { console.log('orders', orders) }} >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaceOrderPage;