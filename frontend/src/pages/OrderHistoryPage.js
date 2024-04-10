import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import HorizontalDataComponent from "../components/HorizontalDataComponent";
import { BASE_URL } from "../constants";
import NoItem from "../components/NoItem";
import Loader from "../components/Loader";

const OrderHistoryPage = () => {
  const org = useSelector((state) => state.org.organization);

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/order/orders`, {
          orgId: org?._id,
        });

        if (res.status === 200) {
          setOrders(res.data);
          setIsLoading(false);
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
        { isLoading ? <Loader />
        :
        orders.length ? 
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
