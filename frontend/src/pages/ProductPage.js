import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import AddProduct from "../components/AddProduct";
import classes from "./ProductPage.module.css";
import { productActions } from "../store/productSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.product.data);
  const org = useSelector((state) => state.org.organization);

  const [showAddItem, setShowAddItem] = useState(false);

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const createProductHandler = async (name, unit, costPrice, sellingPrice) => {
    try {
      const response = await fetch("http://localhost:9999/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          unit,
          costPrice,
          sellingPrice,
          orgId: org?._id,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log("INside product page", json);
        dispatch(productActions.addProduct(json));
      }
    } catch (err) {
      console.log(err);
    }
    toggleShowAddItem();
  };

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

      if(resposnse.ok){
        const json = await resposnse.json()
        dispatch(productActions.deleteProduct({id: json?._id}));
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

      {!showAddItem && (
        <div className={classes.right}>
          <div className={classes.header}>
            <h3>Active Product</h3>
            <button onClick={() => setShowAddItem(true)}>+ New</button>
          </div>

          <div className={classes.employee_table_container}>
            {products && (
              <table className={classes.employee_table}>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Unit</th>
                    <th>Selling Price</th>
                    <th>Cost Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((product) => (
                    <tr key={product?._id}>
                      <td>{product?.name}</td>
                      <td>{product?.unit}</td>
                      <td>{product?.sellingPrice} Rs</td>
                      <td>{product?.costPrice} Rs</td>

                      <td className={classes.actions}>
                        <button className={classes.update}>Update</button>
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

      {showAddItem && (
        <div className={classes.right}>
          <AddProduct
            onClose={toggleShowAddItem}
            onSubmit={createProductHandler}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
