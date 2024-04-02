import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import classes from "./HelpDesk.module.css";
import Modal from "../components/Modal.js";
import { useDispatch, useSelector } from "react-redux";
import { IoIosCalendar } from "react-icons/io";
import NoItem from "../components/NoItem.js";
import UpdateTicketStatus from "../components/UpdateTicketStatus.js";
import { ticketAdminActions } from "../store/ticketAdminSlice.js";
import { BASE_URL } from "../constants/index.js";

const HelpDeskAdmin = () => {
  const user = useSelector((state) => state.auth.user);
  const org = useSelector((state) => state?.org?.organization);
  const tickets = useSelector((state) => state?.ticketAdmin?.data);

  const dispatch = useDispatch();

  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState();
  const [filterTag, setFilterTag] = useState("new");
  const [filteredTickets, setFilteredTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await fetch(`${BASE_URL}/${org?._id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });
    const json = await res.json();
    console.log("all", json);
    dispatch(ticketAdminActions.setTickets(json));
  };

  useEffect(() => {
    fetchTickets();
  }, [org]);

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

  useEffect(() => {
    const filteredTicketHandler = () => {
      let updatedTickets;

      if (filterTag === "all") {
        updatedTickets = tickets;
      } else if (filterTag === "new") {
        updatedTickets = tickets?.filter(
          (ticket) => ticket.status === "open");
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

  // Function to handle filter change
  const handleFilterChange = (newFilter) => {
    setFilterTag(newFilter);
  };

  return (
    <Layout>
      <div className={classes.helpDesk}>
        <div className={classes.header}>
          <h3>Ticket Administration</h3>
          <button onClick={fetchTickets}>Refresh</button>
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
                filterTag === "new" ? classes.active : ""
              }`}
              onClick={() => handleFilterChange("new")}
            >
              New
            </button>
            <button
              className={`${classes.filter_button} ${
                filterTag === "processing" ? classes.active : ""
              }`}
              onClick={() => handleFilterChange("processing")}
            >
              Processing
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
                        <span className={classes.ticket_id}>#A12Bc3</span>

                        <span className={`${classes.ticketStatus} ${classes[ticket.status]}`}>
                          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                      </div>

                      <span className={classes.ticketDate}>
                        <IoIosCalendar />
                        {formatTimestamp(ticket.createdAt)}
                      </span>
                    </div>

                    <div className={classes.additionalDetails}>
                      <h4>
                        Request User: <span>{ticket?.userName}</span>
                      </h4>
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

                    <div className={classes.actions}>
                      {ticket.status !== "resolved" && (
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowUpdateStatus(true);
                          }}
                          className={classes.update}
                        >
                          Update Status
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showUpdateStatus && (
            <Modal onClose={() => setShowUpdateStatus(false)}>
              <UpdateTicketStatus
                ticket={selectedTicket}
                onClose={() => setShowUpdateStatus(false)}
              ></UpdateTicketStatus>
            </Modal>
          )}

          {(!filteredTickets ||
            (filteredTickets && filteredTickets?.length === 0)) && (
            <NoItem></NoItem>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HelpDeskAdmin;
