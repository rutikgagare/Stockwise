import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import classes from "./ProfilePage.module.css";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useLogout";
import { BASE_URL } from "../constants";

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const [assetList, setAssetList] = useState(null);
  const { logout } = useLogout();

  const logoutHandler = () => {
    logout();
  };

  const getAssetList = async () => {
    const response = await fetch(
      `${BASE_URL}/inventory/item/getUserAssets`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );

    const json = await response.json();
    setAssetList(json);
  };

  useEffect(() => {
    getAssetList();
  }, []);

  return (
    <Layout>
      <div className={classes.profilePage}>
        <div className={classes.header}>
          <h3>Profile</h3>
          <button onClick={logoutHandler}>Logout</button>
        </div>

        <div className={classes.profile}>
          <div className={classes.userInfo}>
            <div className={classes.profileImage}>
              <img
                src="https://bootdey.com/img/Content/avatar/avatar7.png"
                alt=""
              />
            </div>

            <div className={classes.info}>
              <h3>
                Name: <span>{user?.name}</span>
              </h3>
              <h3>
                Email: <span>{user?.email}</span>
              </h3>
              <h3>
                Role: <span>{user?.role}</span>
              </h3>
            </div>
          </div>

          <hr />

          {assetList && assetList.length > 0 && <div className={classes.assignedAssets}>
            <h3>Assigned Assets</h3>

            <div className={classes.assetList}>
              { (
                assetList?.map((asset) => (
                  <div className={classes.asset}>
                    <div className={classes.assetImage}>
                      <img src={`https://stockwisebucket.s3.ap-south-1.amazonaws.com/${asset?.itemImage}`} alt="" />
                    </div>

                    <div className={classes.assetInfo}>
                      <h4>
                        Asset Name: <span>{asset?.name}</span>{" "}
                      </h4>
                      {asset?.serialNumber && (
                        <h4>
                          SerialNumber: <span>{asset?.serialNumber}</span>{" "}
                        </h4>
                      )}
                      <h4>
                        Quantity: <span>{asset?.quantity}</span>{" "}
                      </h4>

                      {asset.customFields && <div className={classes.customFields}>
                        {Object.entries(asset?.customFieldsData).map(
                          ([key, value]) => (
                            key && value && <h4 key={key}>
                              {key}: <span>{value}</span>
                            </h4>
                          )
                        )}
                      </div>}
                    </div>
                  </div>
                ))
              )} 
            </div>
          </div>}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
