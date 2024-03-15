import React, { useState } from "react";
import Layout from "../components/Layout";
import classes from "./HelpDesk.module.css";
import CreateTicket from "../components/CreateTicket.js";
import Modal from "../components/Modal.js";

const HelpDesk = () => {
  const [showCreateTicket, setShowCreateTicket] = useState(false);

  const toggleShowCreateTicket = () => {
    setShowCreateTicket((prev) => !prev);
  };

  return (
    <Layout>
      <div className={classes.helpDesk}>
        <div className={classes.header}>
          <h3>Tickets</h3>
          <button onClick={toggleShowCreateTicket}>+ Ticket</button>
        </div>

        <div className={classes.desk}>
          {showCreateTicket && (
            <Modal onClose={toggleShowCreateTicket}>
              <CreateTicket onClose = {toggleShowCreateTicket} />
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpDesk;
