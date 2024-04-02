import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import Sidebar from "../components/Sidebar";
import AddCategory from "../components/AddCategory";
import UpdateCategory from "../components/UpdateCategory";
import classes from "./CategoryPage.module.css";
import { categoryActions } from "../store/categorySlice";
import Layout from "../components/Layout";
import NoItem from "../components/NoItem";
import Confirm from "../components/Confirm";
import { BASE_URL } from "../constants";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.category.data);

  const [showAddItem, setShowAddItem] = useState(false);
  const [showUdateItem, setShowUPdateItem] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleShowAddItem = () => {
    setShowAddItem((prevState) => !prevState);
  };

  const toggleShowUdateItem = () => {
    setShowUPdateItem((prevState) => !prevState);
  };

  const deleCategoryHandler = async () => {
    setShowConfirm(false);

    try {
      const resposnse = await fetch(`${BASE_URL}/Category/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          categoryId: selectedCategory?._id,
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

  console.log(categories);

  return (
    <Layout>
      {!showAddItem && !showUdateItem && (
        <div className={classes.category}>
          <div className={classes.header}>
            <h3>Active Categories</h3>
            <button onClick={() => setShowAddItem(true)}>+ New</button>
          </div>

          <div className={classes.category_table_container}>
            {categories && categories.length > 0 && (
              <table className={classes.category_table}>
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Identification Type</th>
                    <th>Asset Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((category) => (
                    <tr key={category?._id}>
                      <td>{category?.name}</td>
                      <td>{category?.identificationType}</td>
                      <td>{category?.numberOfAssets ? category?.numberOfAssets : 0}</td>

                      <td className={classes.actions}>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            toggleShowUdateItem();
                          }}
                          // disabled={category.numberOfAssets > 0}
                          className={classes.update}
                        >
                          Update
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowConfirm(true);
                          }}
                          className={classes.delete}
                          // disabled = {category.numberOfAssets > 0}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {categories && categories.length === 0 && <NoItem></NoItem>}
          </div>
        </div>
      )}

      {showAddItem && !showUdateItem && (
        <div className={classes.category}>
          <AddCategory onClose={toggleShowAddItem} />
        </div>
      )}

      {!showAddItem && showUdateItem && (
        <div className={classes.category}>
          <UpdateCategory Category={selectedCategory} onClose={toggleShowUdateItem} />
        </div>
      )}

      {showConfirm && (
        <Confirm
          onCancel={() => setShowConfirm(false)}
          onDelete={deleCategoryHandler}
          message="All the items under category will get deleted"
        ></Confirm>
      )}
    </Layout>
  );
};

export default CategoryPage;
