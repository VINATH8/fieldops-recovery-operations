import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  MessageCircle,
  Send,
  RefreshCw,
  Circle,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getAgentMessages,
  sendAgentMessage,
} from "../../api/api";

import "../messages/Messages.css";


function AgentMessages() {

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    manager,
    setManager,
  ] = useState(null);

  const [
    text,
    setText,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  /* =====================================================
     LOAD MESSAGES
  ===================================================== */

  const loadMessages =
    useCallback(
      async (
        showLoading = true
      ) => {

        try {

          if (showLoading) {
            setLoading(true);
          }

          setError("");


          const data =
            await getAgentMessages();


          const receivedMessages =
            Array.isArray(
              data?.messages
            )
              ? data.messages
              : [];


          setMessages(
            receivedMessages
          );


          setManager(
            data?.manager ||
            null
          );

        } catch (err) {

          console.error(
            "Agent messages error:",
            err
          );


          setError(
            err.response?.data?.message ||
            "Unable to load messages."
          );

        } finally {

          if (showLoading) {
            setLoading(false);
          }

        }

      },
      []
    );


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadMessages(true);

  }, [
    loadMessages,
  ]);


  /* =====================================================
     AUTO REFRESH
  ===================================================== */

  useEffect(() => {

    const interval =
      setInterval(
        () => {
          loadMessages(false);
        },
        3000
      );


    return () => {
      clearInterval(
        interval
      );
    };

  }, [
    loadMessages,
  ]);


  /* =====================================================
     SEND
  ===================================================== */

  async function handleSend(
    event
  ) {

    event.preventDefault();


    const cleanText =
      text.trim();


    if (
      !cleanText ||
      sending
    ) {

      return;

    }


    try {

      setSending(true);

      setError("");


      const data =
        await sendAgentMessage(
          cleanText
        );


      if (data?.message) {

        setMessages(
          (previous) => {

            const exists =
              previous.some(
                (item) =>
                  item.id ===
                  data.message.id
              );


            if (exists) {
              return previous;
            }


            return [
              ...previous,
              data.message,
            ];

          }
        );

      }


      setText("");


      await loadMessages(
        false
      );

    } catch (err) {

      console.error(
        "Agent send message error:",
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


  return (

    <AppShell
      role="agent"
      title="Communication"
      subtitle="Stay connected with your manager."
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
              Communicate directly with your manager.
            </p>

          </div>


          <button
            type="button"
            className="outline-button"
            onClick={() =>
              loadMessages(true)
            }
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

            <MessageCircle
              size={17}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            CHAT
        ================================================= */}

        <section className="agent-chat-card">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="chat-header">

            <div className="chat-user-avatar">

              {(
                manager?.name ||
                "M"
              )
                .charAt(0)
                .toUpperCase()}

            </div>


            <div>

              <strong>
                {manager?.name ||
                  "Operations Manager"}
              </strong>


              <span>

                <Circle
                  size={7}
                  fill="currentColor"
                />

                Operations Manager

              </span>

            </div>

          </div>


          {/* =================================================
              MESSAGES
          ================================================= */}

          <div className="chat-messages">

            {loading ? (

              <div className="chat-empty">

                <RefreshCw
                  size={22}
                  className="spin"
                />

                <strong>
                  Loading messages...
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
                  Your conversation with the manager
                  will appear here.
                </span>

              </div>

            ) : (

              messages.map(
                (message) => {

                  const own =
                    message.senderRole ===
                    "agent";


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


          {/* =================================================
              COMPOSER
          ================================================= */}

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
              placeholder="Message your manager..."
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

              {sending ? (

                <RefreshCw
                  size={17}
                  className="spin"
                />

              ) : (

                <Send
                  size={17}
                />

              )}

            </button>

          </form>

        </section>

      </div>

    </AppShell>

  );

}


export default AgentMessages;