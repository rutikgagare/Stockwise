import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import AddProduct from "../components/AddProduct";
import UpdateProduct from "../components/UpdateProduct";
import classes from "./ProductPage.module.css";
import { productActions } from "../store/productSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [updateItem, setUpdateItem] = useState();

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const toggleShowUdateItem = () =>{
    setShowUPdateItem((prevState) => !prevState);
  }

  const deleProductHandler = async (id) => {
    try {
      const resposnse = await fetch("http://localhost:9999/product/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      if (resposnse.ok) {
        const json = await resposnse.json();
        dispatch(productActions.deleteProduct({ id: json?._id }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.main}>
      <div className={classes.left}>
        <Sidebar />
      </div>

      {!showAddItem && !showUdateItem && (
        <div className={classes.right}>
          <div className={classes.header}>
            <h3>Active Products</h3>
            <button onClick={() => setShowAddItem(true)}>+ New</button>
          </div>

          <div className={classes.employee_table_container}>
            {products && (
              <table className={classes.employee_table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr key={product?._id}>
                      <td>{product?.name}</td>
                      <td>{product?.category}</td>
                      <td>{product?.unit}</td>
                      <td>{Number(product?.costPrice).toLocaleString()} Rs</td>
                      <td>{Number(product?.sellingPrice).toLocaleString()} Rs</td>

                      <td className={classes.actions}>
                        <button
                          onClick={() => {
                            setUpdateItem(product);
                            toggleShowUdateItem();
                          }}
                          className={classes.update}
                        >
                          Update
                        </button>

                        <button
                          onClick={() => {
                            deleProductHandler(product._id);
                          }}
                          className={classes.delete}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.right}>
          <AddProduct onClose={toggleShowAddItem} />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.right}>
          <UpdateProduct product = {updateItem} onClose={toggleShowUdateItem} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
