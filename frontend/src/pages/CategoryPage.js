import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../components/Sidebar";
import AddCategory from "../components/AddCategory";
import UpdateCategory from "../components/UpdateCategory";
import classes from "./CategoryPage.module.css";
import { categoryActions } from "../store/categorySlice";
import noItem from "../Images/noItem.jpg";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.category.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [updateItem, setUpdateItem] = useState();

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const toggleShowUdateItem = () => {
    setShowUPdateItem((prevState) => !prevState);
  };

  const deleCategoryHandler = async (id) => {
    try {
      const resposnse = await fetch("http://localhost:9999/Category/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          categoryId: id,
        }),
      });

      if (resposnse.ok) {
        const json = await resposnse.json();
        dispatch(categoryActions.deleteCategory({ id: json?._id }));
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
            <h3>Active Categories</h3>
            <button onClick={() => setShowAddItem(true)}>+ New</button>
          </div>

          <div className={classes.category_table_container}>
            {categories && categories.length > 0  && (
              <table className={classes.category_table}>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Identification Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => (
                    <tr key={category?._id}>
                      <td>{category?.name}</td>
                      <td>{category?.identificationType}</td>

                      <td className={classes.actions}>
                        <button
                          onClick={() => {
                            setUpdateItem(category);
                            toggleShowUdateItem();
                          }}
                          className={classes.update}
                        >
                          Update
                        </button>

                        <button
                          onClick={() => {
                            deleCategoryHandler(category._id);
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

            {categories && categories.length === 0 && (
              <div className={classes.noItem}>
                <img src={noItem} alt="" />
              </div>
            )}
          </div>
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.right}>
          <AddCategory onClose={toggleShowAddItem} />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.right}>
          <UpdateCategory Category={updateItem} onClose={toggleShowUdateItem} />
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
