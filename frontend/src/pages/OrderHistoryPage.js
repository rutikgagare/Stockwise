import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import HorizontalDataComponent from "../components/HorizontalDataComponent";

const OrderHistoryPage = () => {
    const org = useSelector((state) => state.org.organization);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.post("http://localhost:9999/order/orders", { orgId: org?._id });
                console.log("res: ", res);
                if (res.statusText === "OK") {
                    setOrders(res.data);
                }
            } catch (error) { 
                console.warn("Could not fetch orders: ", error); 
            }
        }

        fetchOrders();
    }, []);

    return (
        <>
            <Layout>
                {orders.map((order) => (
                    <HorizontalDataComponent data={order} />
                ))}
            </Layout>
        </>
    )
}

export default OrderHistoryPage;