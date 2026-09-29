import express from "express";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.js";

import {
  readDatabase,
  writeDatabase,
  generateId,
} from "../utils/db.js";

const router = express.Router();


/* =========================================================
   HELPERS
========================================================= */

function ensureMessages(database) {

  if (
    !Array.isArray(
      database.messages
    )
  ) {
    database.messages = [];
  }

  return database.messages;
}


function ensureActivity(database) {

  if (
    !Array.isArray(
      database.activity
    )
  ) {
    database.activity = [];
  }

  return database.activity;
}


function getUserById(
  database,
  userId
) {

  return (
    database.users || []
  ).find(
    user =>
      user.id === userId
  );

}


function getManager(database) {

  return (
    database.users || []
  ).find(
    user =>
      user.role === "manager"
  );

}


function getAgentById(
  database,
  agentId
) {

  return (
    database.agents || []
  ).find(
    agent =>
      agent.id === agentId
  );

}


function getAgentByUserId(
  database,
  userId
) {

  return (
    database.agents || []
  ).find(
    agent =>
      agent.userId === userId
  );

}


/* =========================================================
   GET CONVERSATION
========================================================= */

function getConversation(
  database,
  userA,
  userB
) {

  return ensureMessages(database)
    .filter(message => {

      const direct =
        message.senderId === userA &&
        message.receiverId === userB;


      const reverse =
        message.senderId === userB &&
        message.receiverId === userA;


      return (
        direct ||
        reverse
      );

    })
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    );

}


/* =========================================================
   MARK MESSAGES AS READ
========================================================= */

function markMessagesRead(
  database,
  messages,
  receiverId
) {

  let changed = false;


  messages.forEach(
    message => {

      if (
        message.receiverId ===
          receiverId &&
        message.read !== true
      ) {

        message.read = true;

        message.readAt =
          new Date().toISOString();

        changed = true;

      }

    }
  );


  return changed;

}


/* =========================================================
   MANAGER
   GET ALL AGENT CONVERSATIONS
========================================================= */

router.get(
  "/conversations",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {

    try {

      const database =
        readDatabase();


      const managerId =
        req.user.id;


      const agents =
        database.agents || [];


      const messages =
        ensureMessages(
          database
        );


      const conversations =
        agents.map(
          agent => {

            const conversation =
              messages
                .filter(
                  message =>
                    (
                      message.senderId ===
                        managerId &&
                      message.receiverId ===
                        agent.userId
                    ) ||
                    (
                      message.senderId ===
                        agent.userId &&
                      message.receiverId ===
                        managerId
                    )
                )
                .sort(
                  (a, b) =>
                    new Date(
                      a.createdAt
                    ) -
                    new Date(
                      b.createdAt
                    )
                );


            const lastMessage =
              conversation[
                conversation.length - 1
              ] || null;


            const unread =
              conversation.filter(
                message =>
                  message.receiverId ===
                    managerId &&
                  message.read !== true
              ).length;


            const user =
              getUserById(
                database,
                agent.userId
              );


            return {

              agent: {

                id:
                  agent.id,

                userId:
                  agent.userId,

                name:
                  agent.name ||
                  user?.name ||
                  "Field Agent",

                email:
                  agent.email ||
                  user?.email ||
                  "",

                status:
                  agent.status ||
                  "available",

                latitude:
                  agent.latitude ??
                  null,

                longitude:
                  agent.longitude ??
                  null,

                locationConsent:
                  agent.locationConsent ??
                  false,

                lastLocationAt:
                  agent.lastLocationAt ??
                  null,

              },

              lastMessage,

              unread,

            };

          }
        );


      return res.json({

        success: true,

        conversations,

      });

    } catch (error) {

      console.error(
        "GET MANAGER CONVERSATIONS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to load conversations.",

      });

    }

  }
);


/* =========================================================
   AGENT
   GET MANAGER CONVERSATION SUMMARY
========================================================= */

router.get(
  "/conversations",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const database =
        readDatabase();


      const manager =
        getManager(
          database
        );


      if (!manager) {

        return res.status(404).json({

          success: false,

          message:
            "Manager account not found.",

        });

      }


      const messages =
        getConversation(
          database,
          req.user.id,
          manager.id
        );


      const unread =
        messages.filter(
          message =>
            message.receiverId ===
              req.user.id &&
            message.read !== true
        ).length;


      return res.json({

        success: true,

        conversations: [

          {

            agent: {

              id:
                manager.id,

              userId:
                manager.id,

              name:
                manager.name ||
                "Operations Manager",

              email:
                manager.email ||
                "",

              status:
                "manager",

            },

            lastMessage:
              messages[
                messages.length - 1
              ] || null,

            unread,

          },

        ],

      });

    } catch (error) {

      console.error(
        "GET AGENT CONVERSATION ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to load conversation.",

      });

    }

  }
);


/* =========================================================
   MANAGER
   GET MESSAGES FOR ONE AGENT
========================================================= */

router.get(
  "/agent/:agentId",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {

    try {

      const database =
        readDatabase();


      const agent =
        getAgentById(
          database,
          req.params.agentId
        );


      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Field agent not found.",

        });

      }


      const managerId =
        req.user.id;


      const messages =
        getConversation(
          database,
          managerId,
          agent.userId
        );


      const changed =
        markMessagesRead(
          database,
          messages,
          managerId
        );


      if (changed) {

        writeDatabase(
          database
        );

      }


      const user =
        getUserById(
          database,
          agent.userId
        );


      return res.json({

        success: true,

        agent: {

          id:
            agent.id,

          userId:
            agent.userId,

          name:
            agent.name ||
            user?.name ||
            "Field Agent",

          email:
            agent.email ||
            user?.email ||
            "",

          status:
            agent.status ||
            "available",

        },

        messages,

      });

    } catch (error) {

      console.error(
        "GET MANAGER MESSAGES ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to load messages.",

      });

    }

  }
);


/* =========================================================
   AGENT
   GET MESSAGES FROM MANAGER
========================================================= */

router.get(
  "/manager",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const database =
        readDatabase();


      const manager =
        getManager(
          database
        );


      if (!manager) {

        return res.status(404).json({

          success: false,

          message:
            "Manager account not found.",

        });

      }


      const agent =
        getAgentByUserId(
          database,
          req.user.id
        );


      const messages =
        getConversation(
          database,
          req.user.id,
          manager.id
        );


      const changed =
        markMessagesRead(
          database,
          messages,
          req.user.id
        );


      if (changed) {

        writeDatabase(
          database
        );

      }


      return res.json({

        success: true,

        manager: {

          id:
            manager.id,

          userId:
            manager.id,

          name:
            manager.name ||
            "Operations Manager",

          email:
            manager.email ||
            "",

          role:
            "manager",

        },

        agent:
          agent
            ? {

                id:
                  agent.id,

                userId:
                  agent.userId,

                name:
                  agent.name,

                email:
                  agent.email,

              }
            : null,

        messages,

      });

    } catch (error) {

      console.error(
        "GET AGENT MESSAGES ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to load messages.",

      });

    }

  }
);


/* =========================================================
   MANAGER → AGENT
   SEND MESSAGE
========================================================= */

router.post(
  "/agent/:agentId",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {

    try {

      const text =
        typeof req.body?.message ===
        "string"
          ? req.body.message.trim()
          : "";


      if (!text) {

        return res.status(400).json({

          success: false,

          message:
            "Message cannot be empty.",

        });

      }


      const database =
        readDatabase();


      const agent =
        getAgentById(
          database,
          req.params.agentId
        );


      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Field agent not found.",

        });

      }


      const timestamp =
        new Date().toISOString();


      const newMessage = {

        id:
          generateId(
            "message"
          ),

        senderId:
          req.user.id,

        receiverId:
          agent.userId,

        senderRole:
          "manager",

        receiverRole:
          "agent",

        text,

        read:
          false,

        createdAt:
          timestamp,

        readAt:
          null,

      };


      ensureMessages(
        database
      ).push(
        newMessage
      );


      ensureActivity(
        database
      ).push({

        id:
          generateId(
            "activity"
          ),

        type:
          "message_sent",

        agentId:
          agent.id,

        message:
          `Message sent to ${
            agent.name ||
            "Field Agent"
          }`,

        createdAt:
          timestamp,

      });


      writeDatabase(
        database
      );


      return res.status(201).json({

        success: true,

        message:
          newMessage,

      });

    } catch (error) {

      console.error(
        "SEND MANAGER MESSAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to send message.",

      });

    }

  }
);


/* =========================================================
   AGENT → MANAGER
   SEND MESSAGE
========================================================= */

router.post(
  "/manager",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const text =
        typeof req.body?.message ===
        "string"
          ? req.body.message.trim()
          : "";


      if (!text) {

        return res.status(400).json({

          success: false,

          message:
            "Message cannot be empty.",

        });

      }


      const database =
        readDatabase();


      const manager =
        getManager(
          database
        );


      if (!manager) {

        return res.status(404).json({

          success: false,

          message:
            "Manager account not found.",

        });

      }


      const agent =
        getAgentByUserId(
          database,
          req.user.id
        );


      const timestamp =
        new Date().toISOString();


      const newMessage = {

        id:
          generateId(
            "message"
          ),

        senderId:
          req.user.id,

        receiverId:
          manager.id,

        senderRole:
          "agent",

        receiverRole:
          "manager",

        text,

        read:
          false,

        createdAt:
          timestamp,

        readAt:
          null,

      };


      ensureMessages(
        database
      ).push(
        newMessage
      );


      ensureActivity(
        database
      ).push({

        id:
          generateId(
            "activity"
          ),

        type:
          "message_sent",

        agentId:
          agent?.id ||
          null,

        message:
          `${
            agent?.name ||
            "Field Agent"
          } sent a message to the manager`,

        createdAt:
          timestamp,

      });


      writeDatabase(
        database
      );


      return res.status(201).json({

        success: true,

        message:
          newMessage,

      });

    } catch (error) {

      console.error(
        "SEND AGENT MESSAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to send message.",

      });

    }

  }
);


export default router;