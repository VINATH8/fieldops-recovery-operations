import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  authenticateToken,
  requireRole,
} from "../middleware/auth.js";

import {
  readDatabase,
  writeDatabase,
  generateId,
} from "../utils/db.js";

import {
  isWithinGeofence,
} from "../utils/geo.js";

const router = express.Router();


/* =========================================================
   UPLOAD CONFIGURATION
========================================================= */

const uploadDirectory = path.join(
  process.cwd(),
  "server",
  "uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}


const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {

    const extension =
      path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}${extension}`;

    cb(null, filename);
  },

});


const upload = multer({

  storage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, WEBP and PDF files are allowed."
        )
      );
    }
  },

});


/* =========================================================
   DATABASE SAFETY
========================================================= */

function ensureDatabase(database) {

  if (!database || typeof database !== "object") {
    database = {};
  }

  if (!Array.isArray(database.users)) {
    database.users = [];
  }

  if (!Array.isArray(database.agents)) {
    database.agents = [];
  }

  if (!Array.isArray(database.cases)) {
    database.cases = [];
  }

  if (!Array.isArray(database.assignments)) {
    database.assignments = [];
  }

  if (!Array.isArray(database.locations)) {
    database.locations = [];
  }

  if (!Array.isArray(database.fieldUpdates)) {
    database.fieldUpdates = [];
  }

  if (!Array.isArray(database.evidence)) {
    database.evidence = [];
  }

  if (!Array.isArray(database.activity)) {
    database.activity = [];
  }

  if (!Array.isArray(database.messages)) {
    database.messages = [];
  }

  if (!Array.isArray(database.agentLocationAssignments)) {
    database.agentLocationAssignments = [];
  }

  return database;
}


/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function hasCoordinates(item) {

  return (
    toNumber(item?.latitude) !== null &&
    toNumber(item?.longitude) !== null
  );
}


/* =========================================================
   GET AGENT
========================================================= */

function getAgent(database, userId) {

  let agent =
    database.agents.find(
      (item) =>
        String(item.userId) === String(userId)
    );

  if (agent) {
    return agent;
  }


  const user =
    database.users.find(
      (item) =>
        String(item.id) === String(userId)
    );

  if (!user || user.role !== "agent") {
    return null;
  }


  agent =
    database.agents.find(
      (item) =>
        String(item.userId) === String(user.id)
    );

  if (agent) {
    return agent;
  }


  agent = {

    id:
      generateId("agent"),

    userId:
      user.id,

    name:
      user.name ||
      user.fullName ||
      user.email ||
      "Field Agent",

    email:
      user.email || "",

    phone:
      user.phone || "",

    status:
      "available",

    latitude:
      null,

    longitude:
      null,

    accuracy:
      null,

    lastLocationAt:
      null,

    locationConsent:
      false,

    createdAt:
      new Date().toISOString(),

  };


  database.agents.push(agent);

  return agent;
}


/* =========================================================
   ASSIGNMENT HELPERS
========================================================= */

function isCaseAssignedToAgent(
  recoveryCase,
  agent
) {

  if (!recoveryCase || !agent) {
    return false;
  }

  const assigned =
    recoveryCase.assignedAgentId;

  return (
    String(assigned) === String(agent.id) ||
    String(assigned) === String(agent.userId)
  );
}


function isLocationAssignedToAgent(
  assignment,
  agent
) {

  if (!assignment || !agent) {
    return false;
  }

  const assignedAgent =
    String(assignment.agentId || "");

  return (
    assignedAgent === String(agent.id) ||
    assignedAgent === String(agent.userId)
  );
}


/* =========================================================
   CASE NORMALIZATION
========================================================= */

function normalizeCase(recoveryCase) {

  return {

    ...recoveryCase,

    latitude:
      toNumber(
        recoveryCase.latitude
      ),

    longitude:
      toNumber(
        recoveryCase.longitude
      ),

    amount:
      Number(
        recoveryCase.amount || 0
      ),

  };
}


/* =========================================================
   GET RECOVERY CASES
========================================================= */

function getCasesForAgent(
  database,
  agent
) {

  return (
    database.cases || []
  )
    .filter(
      (item) =>
        isCaseAssignedToAgent(
          item,
          agent
        )
    )
    .map(normalizeCase);
}


/* =========================================================
   GET DIRECT LOCATION ASSIGNMENTS
========================================================= */

function getLocationAssignmentsForAgent(
  database,
  agent
) {

  return (
    database.agentLocationAssignments || []
  )
    .filter(
      (assignment) => {

        if (
          assignment.status ===
          "completed"
        ) {
          return false;
        }

        return isLocationAssignedToAgent(
          assignment,
          agent
        );
      }
    )
    .map(
      (assignment) => ({

        id:
          assignment.id,

        taskType:
          "location_assignment",

        caseNumber:
          `TASK-${assignment.id}`,

        customerName:
          "Assigned destination",

        phone:
          "",

        address:
          assignment.address ||
          assignment.geocodedAddress ||
          "",

        latitude:
          toNumber(
            assignment.latitude
          ),

        longitude:
          toNumber(
            assignment.longitude
          ),

        geocodedAddress:
          assignment.geocodedAddress,

        amount:
          0,

        priority:
          "normal",

        status:
          assignment.status ||
          "assigned",

        assignedAgentId:
          agent.id,

        locationAssignmentId:
          assignment.id,

        createdAt:
          assignment.createdAt,

        updatedAt:
          assignment.updatedAt,

      })
    );
}


/* =========================================================
   ALL AGENT TASKS
========================================================= */

function getAgentTasks(
  database,
  agent
) {

  return [

    ...getCasesForAgent(
      database,
      agent
    ),

    ...getLocationAssignmentsForAgent(
      database,
      agent
    ),

  ];
}


/* =========================================================
   DASHBOARD
========================================================= */

router.get(
  "/dashboard",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      const tasks =
        getAgentTasks(
          database,
          agent
        );

      writeDatabase(database);

      return res.json({

        success: true,

        agent: {

          ...agent,

          latitude:
            toNumber(
              agent.latitude
            ),

          longitude:
            toNumber(
              agent.longitude
            ),

        },

        metrics: {

          assigned:
            tasks.length,

          pending:
            tasks.filter(
              (item) =>
                item.status === "assigned"
            ).length,

          inProgress:
            tasks.filter(
              (item) =>
                item.status === "in_progress"
            ).length,

          completed:
            tasks.filter(
              (item) =>
                item.status === "completed"
            ).length,

        },

        cases:
          tasks,

      });

    } catch (error) {

      console.error(
        "AGENT DASHBOARD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to load agent dashboard.",

      });

    }
  }
);


/* =========================================================
   MY CASES / TASKS
========================================================= */

router.get(
  "/cases",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      const cases =
        getAgentTasks(
          database,
          agent
        );

      writeDatabase(database);

      console.log(
        "AGENT CASES:",
        {
          userId: req.user.id,
          agentId: agent.id,
          count: cases.length,
          cases,
        }
      );

      return res.json({

        success: true,

        agent: {

          id:
            agent.id,

          userId:
            agent.userId,

          name:
            agent.name,

          email:
            agent.email,

          latitude:
            toNumber(
              agent.latitude
            ),

          longitude:
            toNumber(
              agent.longitude
            ),

        },

        cases,

      });

    } catch (error) {

      console.error(
        "GET AGENT CASES ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to load assigned cases.",

      });

    }
  }
);


/* =========================================================
   SINGLE CASE
========================================================= */

router.get(
  "/cases/:caseId",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );

      if (!recoveryCase) {

        return res.status(404).json({

          success: false,

          message:
            "Recovery case not found",

        });

      }

      if (
        !isCaseAssignedToAgent(
          recoveryCase,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This case is not assigned to you",

        });

      }

      const updates =
        database.fieldUpdates.filter(
          (item) =>
            String(item.caseId) ===
            String(recoveryCase.id)
        );

      const evidence =
        database.evidence.filter(
          (item) =>
            String(item.caseId) ===
            String(recoveryCase.id)
        );

      return res.json({

        success: true,

        case:
          normalizeCase(
            recoveryCase
          ),

        updates,

        evidence,

      });

    } catch (error) {

      console.error(
        "GET SINGLE CASE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to load case.",

      });

    }
  }
);


/* =========================================================
   LIVE LOCATION
========================================================= */

router.post(
  "/location",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const latitude =
        toNumber(
          req.body?.latitude
        );

      const longitude =
        toNumber(
          req.body?.longitude
        );

      const accuracy =
        toNumber(
          req.body?.accuracy
        );

      if (
        latitude === null ||
        longitude === null
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Valid latitude and longitude are required.",

        });

      }

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      const timestamp =
        new Date().toISOString();

      agent.latitude =
        latitude;

      agent.longitude =
        longitude;

      agent.accuracy =
        accuracy;

      agent.lastLocationAt =
        timestamp;

      database.locations.push({

        id:
          generateId("location"),

        agentId:
          agent.id,

        latitude,

        longitude,

        accuracy,

        timestamp,

      });

      database.activity.push({

        id:
          generateId("activity"),

        type:
          "agent_location_updated",

        agentId:
          agent.id,

        message:
          `${agent.name} updated live location.`,

        createdAt:
          timestamp,

      });

      writeDatabase(database);

      return res.json({

        success: true,

        message:
          "Agent location updated.",

        agent: {

          id:
            agent.id,

          latitude:
            agent.latitude,

          longitude:
            agent.longitude,

          accuracy:
            agent.accuracy,

          lastLocationAt:
            agent.lastLocationAt,

        },

      });

    } catch (error) {

      console.error(
        "LOCATION UPDATE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to update location.",

      });

    }
  }
);


/* =========================================================
   LOCATION CONSENT
========================================================= */

router.post(
  "/location/consent",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const enabled =
        req.body?.enabled === true;

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      agent.locationConsent =
        enabled;

      if (!enabled) {

        agent.latitude = null;
        agent.longitude = null;
        agent.accuracy = null;
        agent.lastLocationAt = null;

      }

      writeDatabase(database);

      return res.json({

        success: true,

        locationConsent:
          enabled,

      });

    } catch (error) {

      console.error(
        "LOCATION CONSENT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to update location consent.",

      });

    }
  }
);


/* =========================================================
   CHECK-IN
========================================================= */

router.post(
  "/cases/:caseId/check-in",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const latitude =
        toNumber(
          req.body?.latitude
        );

      const longitude =
        toNumber(
          req.body?.longitude
        );

      if (
        latitude === null ||
        longitude === null
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Current location is required",

        });

      }

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      if (!recoveryCase) {

        return res.status(404).json({

          success: false,

          message:
            "Recovery case not found",

        });

      }

      if (
        !isCaseAssignedToAgent(
          recoveryCase,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This case is not assigned to you",

        });

      }

      if (
        recoveryCase.status ===
        "completed"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "This case is already completed",

        });

      }

      if (
        !hasCoordinates(
          recoveryCase
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Recovery case location is unavailable",

        });

      }

      const geofence =
        isWithinGeofence(
          latitude,
          longitude,
          toNumber(
            recoveryCase.latitude
          ),
          toNumber(
            recoveryCase.longitude
          ),
          300
        );

      if (!geofence.allowed) {

        return res.status(403).json({

          success: false,

          message:
            `You are ${geofence.distance}m away. Check-in requires you to be within 300m.`,

          distance:
            geofence.distance,

          radius:
            geofence.radius,

        });

      }

      const timestamp =
        new Date().toISOString();

      recoveryCase.status =
        "in_progress";

      recoveryCase.checkedInAt =
        timestamp;

      recoveryCase.startedAt =
        recoveryCase.startedAt ||
        timestamp;

      recoveryCase.checkInLocation = {

        latitude,
        longitude,

        distance:
          geofence.distance,

      };

      recoveryCase.updatedAt =
        timestamp;

      agent.latitude =
        latitude;

      agent.longitude =
        longitude;

      agent.lastLocationAt =
        timestamp;

      agent.locationConsent =
        true;

      database.activity.push({

        id:
          generateId("activity"),

        type:
          "case_check_in",

        caseId:
          recoveryCase.id,

        agentId:
          agent.id,

        message:
          `${agent.name} checked in to ${recoveryCase.caseNumber}`,

        createdAt:
          timestamp,

      });

      writeDatabase(database);

      return res.json({

        success: true,

        message:
          "Check-in successful",

        distance:
          geofence.distance,

        checkedInAt:
          timestamp,

        case:
          normalizeCase(
            recoveryCase
          ),

      });

    } catch (error) {

      console.error(
        "CHECK-IN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to check in.",

      });

    }
  }
);


/* =========================================================
   ROUTE
========================================================= */

router.get(
  "/cases/:caseId/route",
  authenticateToken,
  requireRole("agent"),
  async (req, res) => {

    try {

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        getAgent(
          database,
          req.user.id
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );

      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }

      if (!recoveryCase) {

        return res.status(404).json({

          success: false,

          message:
            "Recovery case not found",

        });

      }

      if (
        !isCaseAssignedToAgent(
          recoveryCase,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This case is not assigned to you",

        });

      }

      const agentLatitude =
        toNumber(agent.latitude);

      const agentLongitude =
        toNumber(agent.longitude);

      const destinationLatitude =
        toNumber(
          recoveryCase.latitude
        );

      const destinationLongitude =
        toNumber(
          recoveryCase.longitude
        );

      if (
        agentLatitude === null ||
        agentLongitude === null
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Agent location is not available",

        });

      }

      if (
        destinationLatitude === null ||
        destinationLongitude === null
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Case destination coordinates are not available",

        });

      }

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${agentLongitude},${agentLatitude};` +
        `${destinationLongitude},${destinationLatitude}` +
        `?overview=full&geometries=geojson&steps=true`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Routing service unavailable"
        );
      }

      const route =
        await response.json();

      if (
        route.code !== "Ok" ||
        !route.routes?.length
      ) {

        return res.status(502).json({

          success: false,

          message:
            "Unable to calculate route",

        });

      }

      const selectedRoute =
        route.routes[0];

      return res.json({

        success: true,

        distanceMeters:
          selectedRoute.distance,

        durationSeconds:
          selectedRoute.duration,

        geometry:
          selectedRoute.geometry,

        steps:
          selectedRoute.legs
            ?.flatMap(
              (leg) =>
                leg.steps || []
            )
            .map(
              (step) => ({

                distance:
                  step.distance,

                duration:
                  step.duration,

                name:
                  step.name,

                instruction:
                  step.maneuver?.type,

              })
            ),

      });

    } catch (error) {

      console.error(
        "ROUTE ERROR:",
        error
      );

      return res.status(502).json({

        success: false,

        message:
          "Unable to calculate route",

      });

    }
  }
);


/* =========================================================
   FIELD UPDATE
=========================================================

   IMPORTANT:

   This route accepts BOTH:

   1. application/json
   2. multipart/form-data

   Therefore it works whether AgentUpdates.jsx
   sends normal JSON or FormData.

   Notes = optional
   Outcome = optional
   Evidence = optional

   A manager message is always created when
   a manager exists.
========================================================= */

router.post(
  "/cases/:caseId/updates",
  authenticateToken,
  requireRole("agent"),

  /* ---------------------------------------------------------
     MULTER ONLY ACTUALLY PROCESSES multipart requests.
     Normal JSON requests continue normally.
  --------------------------------------------------------- */

  upload.any(),

  async (req, res) => {

    try {

      /* =====================================================
         NEVER DESTRUCTURE req.body DIRECTLY
      ===================================================== */

      const body =
        req.body || {};


      const cleanNotes =
        typeof body.notes === "string"
          ? body.notes.trim()
          : "";


      const cleanOutcome =
        typeof body.outcome === "string"
          ? body.outcome.trim()
          : "";


      /* =====================================================
         DATABASE
      ===================================================== */

      const database =
        ensureDatabase(
          readDatabase()
        );


      const agent =
        getAgent(
          database,
          req.user.id
        );


      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }


      /* =====================================================
         FIND RECOVERY CASE
      ===================================================== */

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );


      /* =====================================================
         FIND DIRECT DESTINATION
      ===================================================== */

      const locationAssignment =
        database.agentLocationAssignments.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );


      let task = null;

      let taskType = null;

      let caseId = null;

      let caseLabel = null;

      let customerLabel = null;

      let addressLabel = null;


      /* =====================================================
         NORMAL RECOVERY CASE
      ===================================================== */

      if (recoveryCase) {

        if (
          !isCaseAssignedToAgent(
            recoveryCase,
            agent
          )
        ) {

          return res.status(403).json({

            success: false,

            message:
              "This case is not assigned to you",

          });

        }


        task =
          recoveryCase;

        taskType =
          "recovery_case";

        caseId =
          recoveryCase.id;

        caseLabel =
          recoveryCase.caseNumber ||
          recoveryCase.id;

        customerLabel =
          recoveryCase.customerName ||
          "Customer";

        addressLabel =
          recoveryCase.address ||
          recoveryCase.location ||
          "Address not provided";

      }


      /* =====================================================
         DIRECT MANAGER DESTINATION
      ===================================================== */

      else if (
        locationAssignment
      ) {

        if (
          !isLocationAssignedToAgent(
            locationAssignment,
            agent
          )
        ) {

          return res.status(403).json({

            success: false,

            message:
              "This destination is not assigned to you",

          });

        }


        if (
          locationAssignment.status ===
          "completed"
        ) {

          return res.status(400).json({

            success: false,

            message:
              "This destination assignment is already completed",

          });

        }


        task =
          locationAssignment;

        taskType =
          "location_assignment";

        caseId =
          locationAssignment.id;

        caseLabel =
          `TASK-${locationAssignment.id}`;

        customerLabel =
          "Assigned destination";

        addressLabel =
          locationAssignment.address ||
          locationAssignment.geocodedAddress ||
          "Address not provided";

      }


      /* =====================================================
         NOTHING FOUND
      ===================================================== */

      else {

        return res.status(404).json({

          success: false,

          message:
            "Assigned case or destination not found",

        });

      }


      /* =====================================================
         TIMESTAMP
      ===================================================== */

      const timestamp =
        new Date().toISOString();


      /* =====================================================
         EVIDENCE ALREADY SAVED
      ===================================================== */

      let existingEvidence =
        database.evidence.filter(
          (item) =>
            String(item.caseId) ===
            String(caseId)
        );


      /* =====================================================
         IF FILE WAS INCLUDED DIRECTLY IN THIS REQUEST,
         SAVE IT NOW.
      ===================================================== */

      const uploadedFile =
        req.files?.[0] || null;


      let newlyUploadedEvidence =
        null;


      if (uploadedFile) {

        newlyUploadedEvidence = {

          id:
            generateId("evidence"),

          caseId:
            caseId,

          taskType:
            taskType,

          agentId:
            agent.id,

          originalName:
            uploadedFile.originalname,

          filename:
            uploadedFile.filename,

          path:
            `/uploads/${uploadedFile.filename}`,

          mimeType:
            uploadedFile.mimetype,

          size:
            uploadedFile.size,

          createdAt:
            timestamp,

        };


        database.evidence.push(
          newlyUploadedEvidence
        );


        existingEvidence.push(
          newlyUploadedEvidence
        );


        if (recoveryCase) {
          recoveryCase.updatedAt =
            timestamp;
        }

        if (locationAssignment) {
          locationAssignment.updatedAt =
            timestamp;
        }


        database.activity.push({

          id:
            generateId("activity"),

          type:
            "evidence_uploaded",

          caseId:
            caseId,

          agentId:
            agent.id,

          taskType:
            taskType,

          message:
            `${agent.name} uploaded evidence for ${caseLabel}`,

          createdAt:
            timestamp,

        });

      }


      /* =====================================================
         EVIDENCE LABEL
      ===================================================== */

      const evidenceLabel =
        existingEvidence.length > 0
          ? `Attached (${existingEvidence.length} file${
              existingEvidence.length === 1
                ? ""
                : "s"
            })`
          : "None attached";


      /* =====================================================
         SAVE FIELD UPDATE
      ===================================================== */

      const update = {

        id:
          generateId("update"),

        caseId:
          caseId,

        taskType:
          taskType,

        agentId:
          agent.id,

        notes:
          cleanNotes,

        outcome:
          cleanOutcome ||
          null,

        createdAt:
          timestamp,

      };


      database.fieldUpdates.push(
        update
      );


      /* =====================================================
         UPDATE TASK
      ===================================================== */

      task.updatedAt =
        timestamp;


      /* =====================================================
         ACTIVITY
      ===================================================== */

      database.activity.push({

        id:
          generateId("activity"),

        type:
          "field_update",

        caseId:
          caseId,

        agentId:
          agent.id,

        taskType:
          taskType,

        message:
          `${agent.name} submitted a field update for ${caseLabel}`,

        createdAt:
          timestamp,

      });


      /* =====================================================
         FIND MANAGER
      ===================================================== */

      const manager =
        database.users.find(
          (user) =>
            user.role === "manager"
        );


      if (!manager) {

        console.error(
          "FIELD UPDATE ERROR: No manager account exists."
        );

        return res.status(500).json({

          success: false,

          message:
            "Field update could not be sent because no manager account exists.",

        });

      }


      /* =====================================================
         MESSAGE CONTENT
      ===================================================== */

      const outcomeLabel =
        cleanOutcome ||
        "Not specified";


      const notesLabel =
        cleanNotes ||
        "No field notes provided.";


      const formattedMessage =
`FIELD UPDATE

Case: ${caseLabel}
Customer: ${customerLabel}
Agent: ${agent.name || "Field Agent"}
Outcome: ${outcomeLabel}

Address:
${addressLabel}

Field notes:
${notesLabel}

Evidence:
${evidenceLabel}`;


      /* =====================================================
         CREATE MANAGER MESSAGE
      ===================================================== */

      const managerMessage = {

        id:
          generateId("message"),

        senderId:
          req.user.id,

        receiverId:
          manager.id,

        senderRole:
          "agent",

        receiverRole:
          "manager",

        text:
          formattedMessage,

        message:
          formattedMessage,

        messageType:
          "field_update",

        caseId:
          caseId,

        caseNumber:
          caseLabel,

        agentId:
          agent.id,

        updateId:
          update.id,

        taskType:
          taskType,

        read:
          false,

        readAt:
          null,

        createdAt:
          timestamp,

      };


      database.messages.push(
        managerMessage
      );


      /* =====================================================
         WRITE EVERYTHING
      ===================================================== */

      writeDatabase(
        database
      );


      /* =====================================================
         SUCCESS
      ===================================================== */

      return res.status(201).json({

        success: true,

        message:
          "Field update sent to manager successfully.",

        update,

        evidence:
          newlyUploadedEvidence,

        managerMessage: {

          id:
            managerMessage.id,

          messageType:
            managerMessage.messageType,

          caseId:
            managerMessage.caseId,

          caseNumber:
            managerMessage.caseNumber,

          taskType:
            managerMessage.taskType,

          createdAt:
            managerMessage.createdAt,

        },

      });

    } catch (error) {

      console.error(
        "========================================"
      );

      console.error(
        "FIELD UPDATE ERROR"
      );

      console.error(
        error
      );

      console.error(
        error?.stack
      );

      console.error(
        "========================================"
      );


      /* -----------------------------------------------------
         Remove uploaded files if database operation failed.
      ----------------------------------------------------- */

      if (
        req.files?.length
      ) {

        for (
          const file of req.files
        ) {

          try {

            if (
              fs.existsSync(
                file.path
              )
            ) {

              fs.unlinkSync(
                file.path
              );

            }

          } catch {}

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Unable to send field update to manager.",

        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,

      });

    }
  }
);


/* =========================================================
   EVIDENCE UPLOAD
=========================================================

   This remains available separately.

   Supports ANY multipart field name.
========================================================= */

router.post(
  "/cases/:caseId/evidence",
  authenticateToken,
  requireRole("agent"),

  upload.any(),

  (req, res) => {

    try {

      const database =
        ensureDatabase(
          readDatabase()
        );


      const agent =
        getAgent(
          database,
          req.user.id
        );


      if (!agent) {

        return res.status(404).json({

          success: false,

          message:
            "Agent profile not found",

        });

      }


      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );


      const locationAssignment =
        database.agentLocationAssignments.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );


      if (
        !recoveryCase &&
        !locationAssignment
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Assigned case or destination not found",

        });

      }


      if (
        recoveryCase &&
        !isCaseAssignedToAgent(
          recoveryCase,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This case is not assigned to you",

        });

      }


      if (
        locationAssignment &&
        !isLocationAssignedToAgent(
          locationAssignment,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This destination is not assigned to you",

        });

      }


      const file =
        req.files?.[0] || null;


      if (!file) {

        return res.status(400).json({

          success: false,

          message:
            "Evidence file is required",

        });

      }


      /* Delete additional uploaded files */
      if (
        req.files.length > 1
      ) {

        for (
          let i = 1;
          i < req.files.length;
          i++
        ) {

          try {

            fs.unlinkSync(
              req.files[i].path
            );

          } catch {}

        }

      }


      const timestamp =
        new Date().toISOString();


      const taskId =
        recoveryCase
          ? recoveryCase.id
          : locationAssignment.id;


      const taskType =
        recoveryCase
          ? "recovery_case"
          : "location_assignment";


      const evidence = {

        id:
          generateId("evidence"),

        caseId:
          taskId,

        taskType:
          taskType,

        agentId:
          agent.id,

        originalName:
          file.originalname,

        filename:
          file.filename,

        path:
          `/uploads/${file.filename}`,

        mimeType:
          file.mimetype,

        size:
          file.size,

        createdAt:
          timestamp,

      };


      database.evidence.push(
        evidence
      );


      if (recoveryCase) {
        recoveryCase.updatedAt =
          timestamp;
      }


      if (locationAssignment) {
        locationAssignment.updatedAt =
          timestamp;
      }


      database.activity.push({

        id:
          generateId("activity"),

        type:
          "evidence_uploaded",

        caseId:
          taskId,

        agentId:
          agent.id,

        taskType:
          taskType,

        message:
          `${agent.name} uploaded evidence.`,

        createdAt:
          timestamp,

      });


      writeDatabase(
        database
      );


      return res.status(201).json({

        success: true,

        message:
          "Evidence uploaded.",

        evidence,

      });

    } catch (error) {

      console.error(
        "EVIDENCE UPLOAD ERROR:",
        error
      );

      if (
        req.files?.length
      ) {

        for (
          const file of req.files
        ) {

          try {

            if (
              fs.existsSync(
                file.path
              )
            ) {

              fs.unlinkSync(
                file.path
              );

            }

          } catch {}

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Unable to upload evidence.",

        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,

      });

    }
  }
);


/* =========================================================
   COMPLETE CASE
========================================================= */

router.post(
  "/cases/:caseId/complete",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const outcome =
        typeof req.body?.outcome === "string"
          ? req.body.outcome.trim()
          : "";


      const notes =
        typeof req.body?.notes === "string"
          ? req.body.notes.trim()
          : "";


      const database =
        ensureDatabase(
          readDatabase()
        );


      const agent =
        getAgent(
          database,
          req.user.id
        );


      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(req.params.caseId)
        );


      if (
        !agent ||
        !recoveryCase
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Agent or case not found",

        });

      }


      if (
        !isCaseAssignedToAgent(
          recoveryCase,
          agent
        )
      ) {

        return res.status(403).json({

          success: false,

          message:
            "This case is not assigned to you",

        });

      }


      if (
        !recoveryCase.checkedInAt
      ) {

        return res.status(400).json({

          success: false,

          message:
            "You must check in before completing the case",

        });

      }


      if (
        recoveryCase.status ===
        "completed"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Case is already completed",

        });

      }


      if (!outcome) {

        return res.status(400).json({

          success: false,

          message:
            "Completion outcome is required",

        });

      }


      const timestamp =
        new Date().toISOString();


      recoveryCase.status =
        "completed";

      recoveryCase.completedAt =
        timestamp;

      recoveryCase.outcome =
        outcome;

      recoveryCase.updatedAt =
        timestamp;


      if (notes) {

        database.fieldUpdates.push({

          id:
            generateId("update"),

          caseId:
            recoveryCase.id,

          agentId:
            agent.id,

          notes,

          outcome,

          createdAt:
            timestamp,

        });

      }


      agent.status =
        "available";


      database.activity.push({

        id:
          generateId("activity"),

        type:
          "case_completed",

        caseId:
          recoveryCase.id,

        agentId:
          agent.id,

        message:
          `${agent.name} completed ${recoveryCase.caseNumber}`,

        createdAt:
          timestamp,

      });


      writeDatabase(
        database
      );


      return res.json({

        success: true,

        message:
          "Recovery case completed",

        case:
          normalizeCase(
            recoveryCase
          ),

      });

    } catch (error) {

      console.error(
        "COMPLETE CASE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to complete case.",

      });

    }
  }
);


/* =========================================================
   SERVE EVIDENCE
========================================================= */

router.get(
  "/evidence/:filename",
  authenticateToken,
  requireRole("agent"),
  (req, res) => {

    try {

      const filename =
        path.basename(
          req.params.filename
        );


      const filePath =
        path.join(
          uploadDirectory,
          filename
        );


      if (
        !fs.existsSync(
          filePath
        )
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Evidence file not found.",

        });

      }


      return res.sendFile(
        filePath
      );

    } catch (error) {

      console.error(
        "SERVE EVIDENCE ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to serve evidence file.",

      });

    }
  }
);


/* =========================================================
   EXPORT
========================================================= */

export default router;