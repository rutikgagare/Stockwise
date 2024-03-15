import React, { useState } from "react";
import classes from "./CreateTicket.module.css";
import { useSelector } from "react-redux";

const CreateTicket = (props) => {

  const user = useSelector(state => state.auth.user);

  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [priority, setPriority] = useState();
  const [error, setError] = useState();

  const raiseTicketHandler = async (e) => {
    e.preventDefault();
    try {

      if (!title || !priority || !description) {
        throw Error("All required field must be field");
      }

      const response = await fetch("http://localhost:9999/ticket/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          priority
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      if (response.ok) {
        const json = await response.json();
        props.onClose();
      }

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={classes.createTicketForm}>
      <div className={classes.error}>{error}</div>
      <form onSubmit={raiseTicketHandler}>
        <div className={classes.inputDiv}>
          <label htmlFor="title" className={classes.required}>
            Ticket title
          </label>
          <input id="title" type="text" placeholder="ex. Laptop issue" onChange={(e)=>setTitle(e.target.value)} />
        </div>

        <div className={classes.inputDiv}>
          <label htmlFor="description" className={classes.required}>Description</label>
          <textarea
            id="description"
            cols="30"
            rows="5"
            placeholder="explain your issue?"
            onChange={(e)=>setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className={classes.inputDiv}>
          <label className={classes.required}>Priority</label>
          <select htmlFor="priority" onChange={(e)=>setPriority(e.target.value)}>
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
