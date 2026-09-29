import { useEffect, useState } from "react";

import {
  Users,
  RefreshCw,
  MessageCircle,
  Send,
  X,
  Circle,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getFieldAgents,
  getManagerMessages,
  sendManagerMessage,
} from "../../api/api";


function ManagerAgents() {
  const [agents, setAgents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedAgent, setSelectedAgent] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [messagesLoading, setMessagesLoading] =
    useState(false);

  const [messageText, setMessageText] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD AGENTS
  ===================================================== */

  async function loadAgents() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getFieldAgents();

      const result =
        Array.isArray(data)
          ? data
          : data?.agents || [];

      setAgents(result);
    } catch (err) {
      console.error(
        "FAILED TO LOAD AGENTS:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load field agents."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadAgents();
  }, []);


  /* =====================================================
     OPEN AGENT CHAT
  ===================================================== */

  async function openAgentChat(agent) {
    try {
      setSelectedAgent(agent);
      setMessages([]);
      setMessageText("");
      setMessagesLoading(true);

      const data =
        await getManagerMessages(
          agent.id
        );

      setMessages(
        Array.isArray(data)
          ? data
          : data?.messages || []
      );
    } catch (err) {
      console.error(
        "FAILED TO LOAD CONVERSATION:",
        err
      );

      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }


  /* =====================================================
     CLOSE CHAT
  ===================================================== */

  function closeAgentChat() {
    setSelectedAgent(null);
    setMessages([]);
    setMessageText("");
  }


  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  async function handleSendMessage() {
    const text =
      messageText.trim();

    if (
      !text ||
      !selectedAgent ||
      sending
    ) {
      return;
    }

    try {
      setSending(true);

      const data =
        await sendManagerMessage(
          selectedAgent.id,
          text
        );

      const newMessage =
        data?.message ||
        data?.data ||
        data;

      if (newMessage) {
        setMessages(
          (current) => [
            ...current,
            newMessage,
          ]
        );
      } else {
        const refreshed =
          await getManagerMessages(
            selectedAgent.id
          );

        setMessages(
          Array.isArray(
            refreshed
          )
            ? refreshed
            : refreshed?.messages || []
        );
      }

      setMessageText("");
    } catch (err) {
      console.error(
        "FAILED TO SEND MESSAGE:",
        err
      );

      alert(
        err?.response?.data?.message ||
        "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  }


  /* =====================================================
     ENTER TO SEND
  ===================================================== */

  function handleMessageKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSendMessage();
    }
  }


  /* =====================================================
     FORMAT MESSAGE TIME
  ===================================================== */

  function formatMessageTime(value) {
    if (!value) {
      return "";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString(
      [],
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }


  return (
    <AppShell
      role="manager"
      title="Field agents"
      subtitle="Manage your registered field force."
    >

      <div className="manager-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              FIELD FORCE
            </div>

            <h2>
              Field agents
            </h2>

            <p>
              Registered field agents and their availability.
            </p>

          </div>


          <button
            className="outline-button"
            type="button"
            onClick={loadAgents}
            disabled={loading}
          >

            <RefreshCw
              size={15}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="api-error">

            <span>
              {error}
            </span>

          </div>
        )}


        {/* =================================================
            AGENT GRID
        ================================================= */}

        <div className="agents-grid">

          {loading ? (

            <div className="page-state">

              <RefreshCw
                size={22}
                className="spin"
              />

              <strong>
                Loading agents...
              </strong>

            </div>

          ) : agents.length === 0 ? (

            <div className="page-state">

              <div className="page-state-icon">

                <Users
                  size={22}
                />

              </div>

              <strong>
                No registered agents
              </strong>

              <span>
                Agent accounts created through registration will appear here.
              </span>

            </div>

          ) : (

            agents.map((agent) => {

              const isAvailable =
                agent.status ===
                "available";

              return (
                <div
                  className="agent-manager-card agent-clickable-card"
                  key={agent.id}
                  onClick={() =>
                    openAgentChat(agent)
                  }
                >

                  {/* =================================================
                      AVATAR
                  ================================================= */}

                  <div className="agent-manager-avatar">

                    {agent.name
                      ? agent.name
                          .slice(
                            0,
                            2
                          )
                          .toUpperCase()
                      : "AG"}

                  </div>


                  {/* =================================================
                      AGENT INFORMATION
                  ================================================= */}

                  <div className="agent-manager-info">

                    <strong>
                      {
                        agent.name ||
                        agent.email
                      }
                    </strong>

                    <span>
                      {
                        agent.email ||
                        "No email"
                      }
                    </span>

                  </div>


                  {/* =================================================
                      STATUS
                  ================================================= */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap:
                        "6px",
                      fontSize:
                        "12px",
                      marginTop:
                        "8px",
                    }}
                  >

                    <Circle
                      size={9}
                      fill={
                        isAvailable
                          ? "currentColor"
                          : "none"
                      }
                    />

                    <span>
                      {
                        isAvailable
                          ? "Available"
                          : "Busy"
                      }
                    </span>

                  </div>


                  {/* =================================================
                      MESSAGE BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    className="agent-message-button"
                    onClick={(event) => {
                      event.stopPropagation();

                      openAgentChat(
                        agent
                      );
                    }}
                  >

                    <MessageCircle
                      size={15}
                    />

                    Message

                  </button>

                </div>
              );
            })

          )}

        </div>

      </div>


      {/* ===================================================
          PRIVATE AGENT CHAT
      =================================================== */}

      {selectedAgent && (

        <div
          className="agent-chat-overlay"
          onClick={closeAgentChat}
        >

          <div
            className="agent-chat-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                CHAT HEADER
            ================================================= */}

            <div className="agent-chat-header">

              <div className="agent-chat-user">

                <div className="agent-chat-avatar">

                  {selectedAgent.name
                    ? selectedAgent.name
                        .slice(
                          0,
                          2
                        )
                        .toUpperCase()
                    : "AG"}

                </div>

                <div>

                  <strong>
                    {
                      selectedAgent.name ||
                      selectedAgent.email
                    }
                  </strong>

                  <span>
                    {
                      selectedAgent.email
                    }
                  </span>

                </div>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeAgentChat}
              >

                <X
                  size={18}
                />

              </button>

            </div>


            {/* =================================================
                CHAT BODY
            ================================================= */}

            <div className="agent-chat-body">

              {messagesLoading ? (

                <div className="agent-chat-state">

                  <RefreshCw
                    size={20}
                    className="spin"
                  />

                  <span>
                    Loading conversation...
                  </span>

                </div>

              ) : messages.length === 0 ? (

                <div className="agent-chat-empty">

                  <div className="agent-chat-empty-icon">

                    <MessageCircle
                      size={22}
                    />

                  </div>

                  <strong>
                    No messages yet
                  </strong>

                  <span>
                    Start a private conversation with{" "}
                    {
                      selectedAgent.name ||
                      "this agent"
                    }.
                  </span>

                </div>

              ) : (

                <div className="agent-chat-messages">

                  {messages.map(
                    (
                      message,
                      index
                    ) => {

                      const isManager =
                        message.senderRole ===
                          "manager" ||
                        message.senderId ===
                          message.managerId;

                      return (
                        <div
                          className={
                            isManager
                              ? "agent-chat-message manager"
                              : "agent-chat-message agent"
                          }
                          key={
                            message.id ||
                            `${message.createdAt}-${index}`
                          }
                        >

                          <div className="agent-chat-bubble">

                            <p>
                              {
                                message.message ||
                                message.text ||
                                ""
                              }
                            </p>

                            <span>
                              {
                                formatMessageTime(
                                  message.createdAt ||
                                    message.timestamp
                                )
                              }
                            </span>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </div>


            {/* =================================================
                MESSAGE COMPOSER
            ================================================= */}

            <div className="agent-chat-composer">

              <textarea
                value={
                  messageText
                }
                onChange={(event) =>
                  setMessageText(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleMessageKeyDown
                }
                placeholder={`Message ${
                  selectedAgent.name ||
                  "agent"
                }...`}
                rows={2}
                disabled={
                  sending
                }
              />

              <button
                type="button"
                className="primary-small-button"
                onClick={
                  handleSendMessage
                }
                disabled={
                  sending ||
                  !messageText.trim()
                }
              >

                {sending ? (

                  <RefreshCw
                    size={15}
                    className="spin"
                  />

                ) : (

                  <Send
                    size={15}
                  />

                )}

                {
                  sending
                    ? "Sending..."
                    : "Send"
                }

              </button>

            </div>

          </div>

        </div>

      )}

    </AppShell>
  );
}


export default ManagerAgents;