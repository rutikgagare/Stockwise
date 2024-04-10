import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import HorizontalDataComponent from "../components/HorizontalDataComponent";
import { BASE_URL } from "../constants";
import NoItem from "../components/NoItem";

const OrderHistoryPage = () => {
  const org = useSelector((state) => state.org.organization);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/order/orders`, {
          orgId: org?._id,
        });
        if (res.statusText === "OK") {
          setOrders(res.data);
        }
      } catch (error) {
        console.warn("Could not fetch orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <Layout>
        {orders.length ? 
          orders.map((order) => (
            <HorizontalDataComponent data={order} />
          ))
         :
          <NoItem />
        }
      </Layout>
    </>
  );
};

export default OrderHistoryPage;
