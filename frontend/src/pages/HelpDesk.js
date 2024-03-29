import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import classes from "./HelpDesk.module.css";
import CreateTicket from "../components/CreateTicket.js";
import Modal from "../components/Modal.js";
import { ticketActions } from "../store/ticketSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCalendar } from "react-icons/io";
import NoItem from "../components/NoItem.js";

const HelpDesk = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state?.org?.organization);
  const tickets = useSelector((state) => state?.ticket?.data);

  const dispatch = useDispatch();

  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [filterTag, setFilterTag] = useState("active");
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch("http://localhost:9999/ticket/userTickets", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const json = await res.json();
      console.log("userTickets", json);
      dispatch(ticketActions.setTickets(json));
    };
    fetchTickets();
  }, [user, org, dispatch]);

  // Function to handle filter change
  const handleFilterChange = (newFilter) => {
    setFilterTag(newFilter);
  };

  console.log("data type", typeof tickets);

  useEffect(() => {
    const filteredTicketHandler = () => {
      let updatedTickets;

      if (filterTag === "all") {
        updatedTickets = tickets;
      } else if (filterTag === "active") {
        updatedTickets = tickets?.filter(
          (ticket) => ticket.status === "open" || ticket.status === "processing"
        );
      } else {
        updatedTickets = tickets?.filter(
          (ticket) => ticket.status === filterTag
        );
      }
      setFilteredTickets(updatedTickets);
    };

    if (Array.isArray(tickets) && tickets.length > 0 && filterTag) {
      filteredTicketHandler();
    }
  }, [tickets, filterTag]);

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-US", options);
  }

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
          <div className={classes.filter_buttons}>
            <button
              className={`${classes.filter_button} ${
                filterTag === "all" ? classes.active : ""
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`${classes.filter_button} ${
                filterTag === "active" ? classes.active : ""
              }`}
              onClick={() => handleFilterChange("active")}
            >
              Active
            </button>
            <button
              className={`${classes.filter_button} ${
                filterTag === "resolved" ? classes.active : ""
              }`}
              onClick={() => handleFilterChange("resolved")}
            >
              Resolved
            </button>
          </div>

          {filteredTickets && filteredTickets.length > 0 && (
            <div className={classes.tickets}>
              {filteredTickets.map((ticket) => {
                return (
                  <div className={classes.ticket}>
                    <div className={classes.ticketHeader}>
                      <div className={classes.ticketInfo}>
                        <span className={classes.ticket_id}>#A12Bc3 </span>

                        <span
                          className={`${classes.ticketStatus} ${
                            classes[ticket.status]
                          }`}
                        >
                          {ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1)}
                        </span>
                      </div>

                      <span className={classes.ticketDate}>
                        <IoIosCalendar />
                        {formatTimestamp(ticket.createdAt)}
                      </span>
                    </div>

                    <div className={classes.ticketDetails}>
                      <h3>{ticket?.issueType}</h3>
                      <p>{ticket.description}</p>
                    </div>

                    <div className={classes.additionalDetails}>
                      {ticket?.remark && (
                        <h4>
                          Remark: <span>{ticket?.remark}</span>
                        </h4>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!filteredTickets ||
            (filteredTickets?.length === 0 && <NoItem></NoItem>)}

          {showCreateTicket && (
            <Modal onClose={toggleShowCreateTicket}>
              <CreateTicket onClose={toggleShowCreateTicket} />
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpDesk;
