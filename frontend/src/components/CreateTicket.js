import React, { useEffect, useState } from "react";
import classes from "./CreateTicket.module.css";
import { useDispatch, useSelector } from "react-redux";
import { ticketActions } from "../store/ticketSlice";
import { BASE_URL } from "../constants";

const CreateTicket = (props) => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state.org.organization);

  const dispatch = useDispatch();

  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState();
  const [priority, setPriority] = useState();
  const [error, setError] = useState();
  const [userAssets, setUserAssets] = useState();
  const [selectedAssetId, setSelectedAssetId] = useState();

  const raiseTicketHandler = async (e) => {
    e.preventDefault();
    try {
      if (!issueType || !description) {
        throw Error("All required field must be field");
      }

      const response = await fetch(`${BASE_URL}/ticket/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          issueType,
          description,
          priority,
          assetId:selectedAssetId,
          orgId: org?._id
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        dispatch(ticketActions.addTicket(json));
        props.onClose();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    const getUserAssets = async () => {
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
      setUserAssets(json);
    };
    getUserAssets();
  }, [user]);

  return (
    <div className={classes.createTicketForm}>
      <div className={classes.error}>{error}</div>
      <form onSubmit={raiseTicketHandler}>
        <div className={classes.inputDiv}>
          <label htmlFor="issueType" className={classes.required}>
            Issue Type
          </label>
          <select id="issueType" onChange={(e) => setIssueType(e.target.value)}>
            <option value="">Select issue type</option>
            <option value="newAssetRequest">New Asset Request</option>
            <option value="assetModification">
              Asset Modification Request
            </option>
            <option value="assetDamage">Asset Damage</option>
            <option value="assetMalfunction">Asset Malfunction</option>
            <option value="assetLossTheft">Asset Loss or Theft</option>
            <option value="accessRestriction">Access Restriction</option>
            <option value="routineMaintenance">
              Routine Maintenance Request
            </option>
            <option value="urgentRepair">Urgent Repair Request</option>
            <option value="assetDisposal">Asset Disposal Request</option>
            <option value="assetTransfer">Asset Transfer Request</option>
          </select>
        </div>

        {issueType !== "" && issueType !== "newAssetRequest" && (
          <div className={classes.inputDiv}>
            <label htmlFor="asset">Asset</label>
            <select id="asset" onChange={(e)=> setSelectedAssetId(e.target.value)}>
              <option value="">Select Asset</option>
              {userAssets && userAssets.map((asset)=>{
                return (<option key={asset._id} value={asset._id}>{`${asset.name} - ${asset?.serialNumber ? asset?.serialNumber : ''}`}</option>)
              })}
            </select>
          </div>
        )}

        <div className={classes.inputDiv}>
          <label htmlFor="description" className={classes.required}>
            Description
          </label>
          <textarea
            id="description"
            cols="30"
            rows="5"
            placeholder="Tell us more...."
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className={classes.inputDiv}>
          <label>Priority</label>
          <select
            htmlFor="priority"
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit">Raise Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
