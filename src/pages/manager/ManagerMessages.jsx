import {
  useEffect,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  User,
  RefreshCw,
  Circle,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getManagerConversations,
  getManagerMessages,
  sendManagerMessage,
} from "../../api/api";

import "../messages/Messages.css";


function ManagerMessages() {

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    selectedAgent,
    setSelectedAgent,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    text,
    setText,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     LOAD AGENTS / CONVERSATIONS
  ===================================================== */

  async function loadConversations() {

    try {

      setLoading(true);
      setError("");

      const data =
        await getManagerConversations();

      setConversations(
        Array.isArray(
          data?.conversations
        )
          ? data.conversations
          : []
      );

    } catch (err) {

      console.error(
        "Manager conversations error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load field agents."
      );

    } finally {

      setLoading(false);

    }

  }


  /* =====================================================
     LOAD CONVERSATION
  ===================================================== */

  async function openConversation(
    agent
  ) {

    try {

      setSelectedAgent(agent);

      setLoadingMessages(true);

      setError("");

      const data =
        await getManagerMessages(
          agent.id
        );

      setMessages(
        Array.isArray(
          data?.messages
        )
          ? data.messages
          : []
      );


      setConversations(
        (previous) =>
          previous.map(
            (conversation) => {

              if (
                conversation.agent?.id ===
                agent.id
              ) {

                return {
                  ...conversation,
                  unread: 0,
                };

              }

              return conversation;

            }
          )
      );

    } catch (err) {

      console.error(
        "Conversation loading error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load conversation."
      );

    } finally {

      setLoadingMessages(false);

    }

  }


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadConversations();

  }, []);


  /* =====================================================
     SEND MESSAGE
  ===================================================== */

  async function handleSend(
    event
  ) {

    event.preventDefault();


    const cleanText =
      text.trim();


    if (
      !selectedAgent ||
      !cleanText ||
      sending
    ) {

      return;

    }


    try {

      setSending(true);

      setError("");


      const data =
        await sendManagerMessage(
          selectedAgent.id,
          cleanText
        );


      if (data?.message) {

        setMessages(
          (previous) => [
            ...previous,
            data.message,
          ]
        );

      }


      setText("");


      setConversations(
        (previous) =>
          previous.map(
            (conversation) => {

              if (
                conversation.agent?.id ===
                selectedAgent.id
              ) {

                return {
                  ...conversation,

                  lastMessage:
                    data.message,

                  unread: 0,
                };

              }

              return conversation;

            }
          )
      );

    } catch (err) {

      console.error(
        "Send message error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to send message."
      );

    } finally {

      setSending(false);

    }

  }


  /* =====================================================
     REFRESH
  ===================================================== */

  async function handleRefresh() {

    await loadConversations();


    if (selectedAgent) {

      await openConversation(
        selectedAgent
      );

    }

  }


  return (

    <AppShell
      role="manager"
      title="Communication"
      subtitle="Communicate directly with your field agents."
    >

      <div className="messages-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              TEAM COMMUNICATION
            </div>

            <h2>
              Messages
            </h2>

            <p>
              Communicate directly with individual field agents.
            </p>

          </div>


          <button
            type="button"
            className="outline-button"
            onClick={
              handleRefresh
            }
            disabled={
              loading ||
              loadingMessages
            }
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

            <MessageCircle
              size={17}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            MAIN CHAT
        ================================================= */}

        <div className="messages-layout">


          {/* =================================================
              AGENT LIST
          ================================================= */}

          <aside className="conversation-list">

            <div className="conversation-list-header">

              <div>

                <div className="card-eyebrow">
                  FIELD TEAM
                </div>

                <h3>
                  Agents
                </h3>

              </div>


              <span>
                {conversations.length}
              </span>

            </div>


            <div className="conversation-items">

              {loading ? (

                <div className="messages-loading">

                  <RefreshCw
                    size={18}
                    className="spin"
                  />

                  <span>
                    Loading agents...
                  </span>

                </div>

              ) : conversations.length === 0 ? (

                <div className="messages-empty-small">

                  <User
                    size={20}
                  />

                  <strong>
                    No agents available
                  </strong>

                  <span>
                    Field agents will appear here.
                  </span>

                </div>

              ) : (

                conversations.map(
                  (conversation) => {

                    const agent =
                      conversation.agent;


                    if (!agent) {
                      return null;
                    }


                    const active =
                      selectedAgent?.id ===
                      agent.id;


                    return (

                      <button
                        type="button"
                        key={
                          agent.id
                        }
                        className={
                          active
                            ? "conversation-item active"
                            : "conversation-item"
                        }
                        onClick={() =>
                          openConversation(
                            agent
                          )
                        }
                      >

                        <div className="conversation-avatar">

                          {(
                            agent.name ||
                            "A"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                        <div className="conversation-info">

                          <strong>
                            {agent.name ||
                              "Field Agent"}
                          </strong>


                          <span>

                            {conversation.lastMessage
                              ?.text ||
                              "No messages yet"}

                          </span>

                        </div>


                        <div className="conversation-meta">

                          <Circle
                            size={7}
                            fill={
                              agent.status ===
                              "available"
                                ? "currentColor"
                                : "none"
                            }
                          />


                          {conversation.unread >
                            0 && (

                            <b>
                              {
                                conversation.unread
                              }
                            </b>

                          )}

                        </div>

                      </button>

                    );

                  }
                )

              )}

            </div>

          </aside>


          {/* =================================================
              CHAT
          ================================================= */}

          <section className="chat-panel">

            {!selectedAgent ? (

              <div className="chat-placeholder">

                <div className="chat-placeholder-icon">

                  <MessageCircle
                    size={25}
                  />

                </div>


                <strong>
                  Select an agent
                </strong>


                <span>
                  Choose a field agent to start a private conversation.
                </span>

              </div>

            ) : (

              <>

                {/* =========================================
                    CHAT HEADER
                ========================================= */}

                <div className="chat-header">

                  <div className="chat-user-avatar">

                    {(
                      selectedAgent.name ||
                      "A"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div>

                    <strong>
                      {selectedAgent.name ||
                        "Field Agent"}
                    </strong>


                    <span>

                      <Circle
                        size={7}
                        fill={
                          selectedAgent.status ===
                          "available"
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {selectedAgent.status ||
                        "offline"}

                    </span>

                  </div>

                </div>


                {/* =========================================
                    MESSAGES
                ========================================= */}

                <div className="chat-messages">

                  {loadingMessages ? (

                    <div className="chat-empty">

                      <RefreshCw
                        size={22}
                        className="spin"
                      />

                      <strong>
                        Loading conversation...
                      </strong>

                    </div>

                  ) : messages.length === 0 ? (

                    <div className="chat-empty">

                      <MessageCircle
                        size={22}
                      />

                      <strong>
                        No messages yet
                      </strong>

                      <span>
                        Send the first message to this agent.
                      </span>

                    </div>

                  ) : (

                    messages.map(
                      (message) => {

                        const own =
                          message.senderRole ===
                          "manager";


                        return (

                          <div
                            key={
                              message.id
                            }
                            className={
                              own
                                ? "message-row own"
                                : "message-row received"
                            }
                          >

                            <div className="message-bubble">

                              <p>
                                {message.text}
                              </p>


                              <span>

                                {new Date(
                                  message.createdAt
                                ).toLocaleTimeString(
                                  "en-IN",
                                  {
                                    hour:
                                      "2-digit",

                                    minute:
                                      "2-digit",
                                  }
                                )}

                              </span>

                            </div>

                          </div>

                        );

                      }
                    )

                  )}

                </div>


                {/* =========================================
                    COMPOSER
                ========================================= */}

                <form
                  className="chat-composer"
                  onSubmit={
                    handleSend
                  }
                >

                  <input
                    type="text"
                    value={text}
                    onChange={(event) =>
                      setText(
                        event.target.value
                      )
                    }
                    placeholder={
                      `Message ${
                        selectedAgent.name ||
                        "agent"
                      }...`
                    }
                    disabled={
                      sending
                    }
                  />


                  <button
                    type="submit"
                    disabled={
                      !text.trim() ||
                      sending
                    }
                    title="Send message"
                  >

                    <Send
                      size={17}
                    />

                  </button>

                </form>

              </>

            )}

          </section>

        </div>

      </div>

    </AppShell>

  );

}


export default ManagerMessages;