// import express from "express";

// import {
//   authenticateToken,
//   requireRole,
// } from "../middleware/auth.js";

// import {
//   readDatabase,
//   writeDatabase,
//   generateId,
// } from "../utils/db.js";

// import {
//   distanceInMeters,
//   geocodeAddress,
// } from "../utils/geo.js";

// const router = express.Router();


// /* =========================================================
//    DATABASE HELPERS
// ========================================================= */

// function ensureDatabase(database) {
//   if (!Array.isArray(database.users)) {
//     database.users = [];
//   }

//   if (!Array.isArray(database.agents)) {
//     database.agents = [];
//   }

//   if (!Array.isArray(database.cases)) {
//     database.cases = [];
//   }

//   if (!Array.isArray(database.assignments)) {
//     database.assignments = [];
//   }

//   if (!Array.isArray(database.locations)) {
//     database.locations = [];
//   }

//   if (!Array.isArray(database.fieldUpdates)) {
//     database.fieldUpdates = [];
//   }

//   if (!Array.isArray(database.evidence)) {
//     database.evidence = [];
//   }

//   if (!Array.isArray(database.activity)) {
//     database.activity = [];
//   }

//   if (!Array.isArray(database.messages)) {
//     database.messages = [];
//   }

//   if (!Array.isArray(database.agentLocationAssignments)) {
//     database.agentLocationAssignments = [];
//   }

//   return database;
// }


// /* =========================================================
//    CASE NUMBER HELPERS
// ========================================================= */

// function getCaseNumberValue(caseNumber) {
//   if (
//     typeof caseNumber !== "string"
//   ) {
//     return null;
//   }

//   const match =
//     caseNumber
//       .trim()
//       .match(/^FO-(\d+)$/i);

//   if (!match) {
//     return null;
//   }

//   const number =
//     Number(match[1]);

//   return Number.isFinite(number)
//     ? number
//     : null;
// }


// /* =========================================================
//    REPAIR DUPLICATE CASE NUMBERS
// ========================================================= */

// function repairCaseNumbers(database) {
//   const usedNumbers =
//     new Set();

//   let highestNumber =
//     1000;

//   let changed =
//     false;


//   /* -------------------------------------------------------
//      Find highest existing number
//   ------------------------------------------------------- */

//   for (
//     const recoveryCase of database.cases
//   ) {
//     const value =
//       getCaseNumberValue(
//         recoveryCase.caseNumber
//       );

//     if (
//       value !== null &&
//       value > highestNumber
//     ) {
//       highestNumber =
//         value;
//     }
//   }


//   /* -------------------------------------------------------
//      Repair duplicates / invalid numbers
//   ------------------------------------------------------- */

//   for (
//     const recoveryCase of database.cases
//   ) {

//     const currentNumber =
//       getCaseNumberValue(
//         recoveryCase.caseNumber
//       );


//     if (
//       currentNumber !== null &&
//       !usedNumbers.has(
//         currentNumber
//       )
//     ) {

//       usedNumbers.add(
//         currentNumber
//       );

//       continue;
//     }


//     do {
//       highestNumber += 1;
//     } while (
//       usedNumbers.has(
//         highestNumber
//       )
//     );


//     recoveryCase.caseNumber =
//       `FO-${highestNumber}`;

//     usedNumbers.add(
//       highestNumber
//     );

//     changed = true;
//   }


//   return changed;
// }


// /* =========================================================
//    GENERATE NEXT CASE NUMBER
// ========================================================= */

// function generateNextCaseNumber(database) {

//   let highestNumber =
//     1000;


//   for (
//     const recoveryCase of database.cases
//   ) {

//     const value =
//       getCaseNumberValue(
//         recoveryCase.caseNumber
//       );

//     if (
//       value !== null &&
//       value > highestNumber
//     ) {
//       highestNumber =
//         value;
//     }
//   }


//   let nextNumber =
//     highestNumber + 1;


//   const existingNumbers =
//     new Set(
//       database.cases
//         .map(
//           (recoveryCase) =>
//             getCaseNumberValue(
//               recoveryCase.caseNumber
//             )
//         )
//         .filter(
//           (value) =>
//             value !== null
//         )
//     );


//   while (
//     existingNumbers.has(
//       nextNumber
//     )
//   ) {
//     nextNumber += 1;
//   }


//   return `FO-${nextNumber}`;
// }


// /* =========================================================
//    LIVE GPS CHECK
// ========================================================= */

// function isLiveAgent(agent) {

//   if (
//     agent.locationConsent !== true
//   ) {
//     return false;
//   }


//   if (
//     typeof agent.latitude !== "number" ||
//     typeof agent.longitude !== "number"
//   ) {
//     return false;
//   }


//   if (!agent.lastLocationAt) {
//     return false;
//   }


//   const timestamp =
//     new Date(
//       agent.lastLocationAt
//     ).getTime();


//   if (
//     Number.isNaN(timestamp)
//   ) {
//     return false;
//   }


//   const age =
//     Date.now() -
//     timestamp;


//   return (
//     age >= 0 &&
//     age <=
//       10 * 60 * 1000
//   );
// }


// /* =========================================================
//    GET REGISTERED FIELD AGENTS
// ========================================================= */

// function getFieldAgents(database) {

//   const agentUsers =
//     database.users.filter(
//       (user) =>
//         user.role === "agent"
//     );


//   return agentUsers.map(
//     (user) => {

//       let agent =
//         database.agents.find(
//           (item) =>
//             item.userId ===
//             user.id
//         );


//       /* ---------------------------------------------------
//          Create missing agent profile
//       --------------------------------------------------- */

//       if (!agent) {

//         agent = {

//           id:
//             generateId("agent"),

//           userId:
//             user.id,

//           name:
//             user.name,

//           email:
//             user.email,

//           status:
//             "available",

//           latitude:
//             null,

//           longitude:
//             null,

//           locationConsent:
//             false,

//           lastLocationAt:
//             null,

//         };

//         database.agents.push(
//           agent
//         );
//       }


//       /* ---------------------------------------------------
//          Synchronize case status
//       --------------------------------------------------- */

//       const activeCases =
//         database.cases.filter(
//           (item) =>
//             item.assignedAgentId ===
//               agent.id &&
//             item.status !==
//               "completed"
//         );


//       if (
//         activeCases.length > 0
//       ) {

//         agent.status =
//           "busy";

//       } else {

//         agent.status =
//           "available";

//       }


//       return {

//         ...agent,

//         name:
//           user.name ||
//           agent.name,

//         email:
//           user.email ||
//           agent.email,

//         isLive:
//           isLiveAgent(
//             agent
//           ),

//       };
//     }
//   );
// }


// /* =========================================================
//    TODAY
// ========================================================= */

// function todayPrefix() {

//   return new Date()
//     .toISOString()
//     .slice(
//       0,
//       10
//     );
// }


// /* =========================================================
//    MANAGER DASHBOARD
// ========================================================= */

// router.get(
//   "/dashboard",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const numbersChanged =
//         repairCaseNumbers(
//           database
//         );


//       const agents =
//         getFieldAgents(
//           database
//         );


//       if (
//         numbersChanged ||
//         agents.length >= 0
//       ) {

//         writeDatabase(
//           database
//         );

//       }


//       const cases =
//         database.cases;


//       res.json({

//         success: true,

//         metrics: {

//           openCases:
//             cases.filter(
//               (item) =>
//                 item.status !==
//                 "completed"
//             ).length,

//           awaitingAssignment:
//             cases.filter(
//               (item) =>
//                 !item.assignedAgentId
//             ).length,

//           availableAgents:
//             agents.filter(
//               (agent) =>
//                 agent.status ===
//                 "available"
//             ).length,

//           activeAgents:
//             agents.filter(
//               (agent) =>
//                 agent.status ===
//                 "busy"
//             ).length,

//           completedToday:
//             cases.filter(
//               (item) =>
//                 item.status ===
//                   "completed" &&
//                 item.completedAt &&
//                 item.completedAt.startsWith(
//                   todayPrefix()
//                 )
//             ).length,

//           totalOutstanding:
//             cases
//               .filter(
//                 (item) =>
//                   item.status !==
//                   "completed"
//               )
//               .reduce(
//                 (sum, item) =>
//                   sum +
//                   Number(
//                     item.amount ||
//                     0
//                   ),
//                 0
//               ),

//         },

//         cases,

//         agents,

//         activity:
//           database.activity
//             .slice(-30)
//             .reverse(),

//       });

//     } catch (error) {

//       console.error(
//         "DASHBOARD ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to load dashboard.",

//       });

//     }
//   }
// );


// /* =========================================================
//    GET RECOVERY CASES
// ========================================================= */

// router.get(
//   "/cases",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const changed =
//         repairCaseNumbers(
//           database
//         );


//       if (changed) {

//         writeDatabase(
//           database
//         );

//       }


//       const cases =
//         database.cases.map(
//           (recoveryCase) => {

//             const agent =
//               database.agents.find(
//                 (item) =>
//                   item.id ===
//                   recoveryCase.assignedAgentId
//               );


//             return {

//               ...recoveryCase,

//               assignedAgent:
//                 agent
//                   ? {

//                       id:
//                         agent.id,

//                       userId:
//                         agent.userId,

//                       name:
//                         agent.name,

//                       email:
//                         agent.email,

//                       status:
//                         agent.status,

//                     }
//                   : null,

//             };
//           }
//         );


//       res.json({

//         success: true,

//         cases,

//       });

//     } catch (error) {

//       console.error(
//         "GET CASES ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to load recovery cases.",

//       });

//     }
//   }
// );


// /* =========================================================
//    CREATE RECOVERY CASE
// ========================================================= */

// router.post(
//   "/cases",
//   authenticateToken,
//   requireRole("manager"),
//   async (req, res) => {

//     try {

//       const {
//         customerName,
//         phone,
//         address,
//         amount,
//         priority,
//       } = req.body;


//       /* ---------------------------------------------------
//          VALIDATION
//       --------------------------------------------------- */

//       if (
//         !customerName?.trim()
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Customer name is required.",

//         });

//       }


//       if (
//         !phone?.trim()
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Customer phone number is required.",

//         });

//       }


//       if (
//         !address?.trim()
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Customer address is required.",

//         });

//       }


//       const numericAmount =
//         Number(
//           amount || 0
//         );


//       if (
//         !Number.isFinite(
//           numericAmount
//         ) ||
//         numericAmount < 0
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Enter a valid recovery amount.",

//         });

//       }


//       /* ---------------------------------------------------
//          GEOCODE ADDRESS
//       --------------------------------------------------- */

//       let coordinates;

//       try {

//         coordinates =
//           await geocodeAddress(
//             address.trim()
//           );

//       } catch (geoError) {

//         return res.status(400).json({

//           success: false,

//           message:
//             geoError.message ||
//             "Unable to locate the address.",

//         });

//       }


//       /* ---------------------------------------------------
//          DATABASE
//       --------------------------------------------------- */

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       /*
//        * Repair any existing duplicates
//        * before generating a new number.
//        */

//       repairCaseNumbers(
//         database
//       );


//       const caseNumber =
//         generateNextCaseNumber(
//           database
//         );


//       const timestamp =
//         new Date().toISOString();


//       const recoveryCase = {

//         id:
//           generateId(
//             "case"
//           ),

//         caseNumber,

//         customerName:
//           customerName.trim(),

//         phone:
//           phone.trim(),

//         address:
//           address.trim(),

//         latitude:
//           coordinates.latitude,

//         longitude:
//           coordinates.longitude,

//         geocodedAddress:
//           coordinates.displayName,

//         locationSource:
//           coordinates.source ||
//           "geocoding",

//         amount:
//           numericAmount,

//         priority:
//           priority ||
//           "medium",

//         status:
//           "pending",

//         assignedAgentId:
//           null,

//         checkedInAt:
//           null,

//         startedAt:
//           null,

//         completedAt:
//           null,

//         outcome:
//           null,

//         createdAt:
//           timestamp,

//         updatedAt:
//           timestamp,

//       };


//       database.cases.push(
//         recoveryCase
//       );


//       database.activity.push({

//         id:
//           generateId(
//             "activity"
//           ),

//         type:
//           "case_created",

//         caseId:
//           recoveryCase.id,

//         message:
//           `Recovery case ${recoveryCase.caseNumber} was created at ${address.trim()}`,

//         createdAt:
//           timestamp,

//       });


//       writeDatabase(
//         database
//       );


//       res.status(201).json({

//         success: true,

//         message:
//           "Recovery case created and location resolved.",

//         case:
//           recoveryCase,

//       });

//     } catch (error) {

//       console.error(
//         "CREATE CASE ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to create recovery case.",

//       });

//     }
//   }
// );


// /* =========================================================
//    FIELD AGENTS
// ========================================================= */

// router.get(
//   "/agents",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const agents =
//         getFieldAgents(
//           database
//         );


//       writeDatabase(
//         database
//       );


//       res.json({

//         success: true,

//         agents,

//       });

//     } catch (error) {

//       console.error(
//         "GET AGENTS ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to load field agents.",

//       });

//     }
//   }
// );


// /* =========================================================
//    FIND NEAREST AVAILABLE AGENT
// ========================================================= */

// router.get(
//   "/cases/:caseId/nearest-agent",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const recoveryCase =
//         database.cases.find(
//           (item) =>
//             item.id ===
//             req.params.caseId
//         );


//       if (!recoveryCase) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Recovery case not found.",

//         });

//       }


//       if (
//         typeof recoveryCase.latitude !==
//           "number" ||
//         typeof recoveryCase.longitude !==
//           "number"
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "This case does not have a valid map location.",

//         });

//       }


//       const candidates =
//         getFieldAgents(
//           database
//         )
//           .filter(
//             (agent) =>
//               agent.status ===
//                 "available" &&
//               agent.isLive &&
//               typeof agent.latitude ===
//                 "number" &&
//               typeof agent.longitude ===
//                 "number"
//           )
//           .map(
//             (agent) => ({

//               agent,

//               distance:
//                 distanceInMeters(
//                   agent.latitude,
//                   agent.longitude,
//                   recoveryCase.latitude,
//                   recoveryCase.longitude
//                 ),

//             })
//           )
//           .sort(
//             (a, b) =>
//               a.distance -
//               b.distance
//           );


//       if (
//         candidates.length ===
//         0
//       ) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "No available agents currently sharing a live GPS location.",

//         });

//       }


//       const nearest =
//         candidates[0];


//       res.json({

//         success: true,

//         case:
//           recoveryCase,

//         agent:
//           nearest.agent,

//         distance:
//           Math.round(
//             nearest.distance
//           ),

//         candidates:
//           candidates.map(
//             (item) => ({

//               agent:
//                 item.agent,

//               distance:
//                 Math.round(
//                   item.distance
//                 ),

//             })
//           ),

//       });

//     } catch (error) {

//       console.error(
//         "NEAREST AGENT ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to find nearest agent.",

//       });

//     }
//   }
// );


// /* =========================================================
//    ASSIGN SPECIFIC AGENT TO CASE
// ========================================================= */

// router.post(
//   "/cases/:caseId/assign",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const {
//         agentId,
//       } = req.body;


//       if (!agentId) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Agent selection is required.",

//         });

//       }


//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const recoveryCase =
//         database.cases.find(
//           (item) =>
//             item.id ===
//             req.params.caseId
//         );


//       if (!recoveryCase) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Recovery case not found.",

//         });

//       }


//       const fieldAgents =
//         getFieldAgents(
//           database
//         );


//       const agent =
//         fieldAgents.find(
//           (item) =>
//             item.id ===
//             agentId
//         );


//       if (!agent) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Agent not found.",

//         });

//       }


//       if (
//         agent.status !==
//         "available"
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             `${agent.name} is currently busy.`,

//         });

//       }


//       const timestamp =
//         new Date().toISOString();


//       /* ---------------------------------------------------
//          RELEASE PREVIOUS AGENT
//       --------------------------------------------------- */

//       if (
//         recoveryCase.assignedAgentId &&
//         recoveryCase.assignedAgentId !==
//           agent.id
//       ) {

//         const previousAgent =
//           database.agents.find(
//             (item) =>
//               item.id ===
//               recoveryCase.assignedAgentId
//           );


//         if (previousAgent) {

//           const otherActiveCases =
//             database.cases.filter(
//               (item) =>
//                 item.id !==
//                   recoveryCase.id &&
//                 item.assignedAgentId ===
//                   previousAgent.id &&
//                 item.status !==
//                   "completed"
//             );


//           if (
//             otherActiveCases.length ===
//             0
//           ) {

//             previousAgent.status =
//               "available";

//           }

//         }

//       }


//       recoveryCase.assignedAgentId =
//         agent.id;

//       recoveryCase.status =
//         "assigned";

//       recoveryCase.updatedAt =
//         timestamp;


//       const actualAgent =
//         database.agents.find(
//           (item) =>
//             item.id ===
//             agent.id
//         );


//       if (actualAgent) {

//         actualAgent.status =
//           "busy";

//       }


//       const assignment = {

//         id:
//           generateId(
//             "assignment"
//           ),

//         caseId:
//           recoveryCase.id,

//         agentId:
//           agent.id,

//         assignedBy:
//           req.user.id,

//         assignedAt:
//           timestamp,

//         assignmentType:
//           "manual",

//       };


//       database.assignments.push(
//         assignment
//       );


//       database.activity.push({

//         id:
//           generateId(
//             "activity"
//           ),

//         type:
//           "case_assigned",

//         caseId:
//           recoveryCase.id,

//         agentId:
//           agent.id,

//         message:
//           `${recoveryCase.caseNumber} manually assigned to ${agent.name}`,

//         createdAt:
//           timestamp,

//       });


//       writeDatabase(
//         database
//       );


//       res.json({

//         success: true,

//         message:
//           `${recoveryCase.caseNumber} assigned to ${agent.name}.`,

//         assignment,

//         case:
//           recoveryCase,

//         agent,

//       });

//     } catch (error) {

//       console.error(
//         "ASSIGN ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to assign case.",

//       });

//     }
//   }
// );


// /* =========================================================
//    ASSIGN NEAREST AGENT TO CASE
// ========================================================= */

// router.post(
//   "/cases/:caseId/assign-nearest",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const recoveryCase =
//         database.cases.find(
//           (item) =>
//             item.id ===
//             req.params.caseId
//         );


//       if (!recoveryCase) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Recovery case not found.",

//         });

//       }


//       if (
//         typeof recoveryCase.latitude !==
//           "number" ||
//         typeof recoveryCase.longitude !==
//           "number"
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "This case does not have a valid map location.",

//         });

//       }


//       const candidates =
//         getFieldAgents(
//           database
//         )
//           .filter(
//             (agent) =>
//               agent.status ===
//                 "available" &&
//               agent.isLive &&
//               typeof agent.latitude ===
//                 "number" &&
//               typeof agent.longitude ===
//                 "number"
//           )
//           .map(
//             (agent) => ({

//               agent,

//               distance:
//                 distanceInMeters(
//                   agent.latitude,
//                   agent.longitude,
//                   recoveryCase.latitude,
//                   recoveryCase.longitude
//                 ),

//             })
//           )
//           .sort(
//             (a, b) =>
//               a.distance -
//               b.distance
//           );


//       if (
//         candidates.length ===
//         0
//       ) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "No available agents currently sharing a live GPS location.",

//         });

//       }


//       const nearest =
//         candidates[0];


//       const timestamp =
//         new Date().toISOString();


//       const actualAgent =
//         database.agents.find(
//           (item) =>
//             item.id ===
//             nearest.agent.id
//         );


//       if (actualAgent) {

//         actualAgent.status =
//           "busy";

//       }


//       recoveryCase.assignedAgentId =
//         nearest.agent.id;

//       recoveryCase.status =
//         "assigned";

//       recoveryCase.updatedAt =
//         timestamp;


//       const assignment = {

//         id:
//           generateId(
//             "assignment"
//           ),

//         caseId:
//           recoveryCase.id,

//         agentId:
//           nearest.agent.id,

//         assignedBy:
//           req.user.id,

//         assignedAt:
//           timestamp,

//         distanceAtAssignment:
//           Math.round(
//             nearest.distance
//           ),

//         assignmentType:
//           "nearest",

//       };


//       database.assignments.push(
//         assignment
//       );


//       database.activity.push({

//         id:
//           generateId(
//             "activity"
//           ),

//         type:
//           "case_assigned",

//         caseId:
//           recoveryCase.id,

//         agentId:
//           nearest.agent.id,

//         message:
//           `${recoveryCase.caseNumber} assigned to nearest agent ${nearest.agent.name}`,

//         createdAt:
//           timestamp,

//       });


//       writeDatabase(
//         database
//       );


//       res.json({

//         success: true,

//         message:
//           "Nearest available agent assigned.",

//         assignment,

//         case:
//           recoveryCase,

//         agent:
//           nearest.agent,

//         distance:
//           Math.round(
//             nearest.distance
//           ),

//       });

//     } catch (error) {

//       console.error(
//         "ASSIGN NEAREST ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to assign nearest agent.",

//       });

//     }
//   }
// );


// /* =========================================================
//    UNASSIGN CASE
// ========================================================= */

// router.post(
//   "/cases/:caseId/unassign",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const recoveryCase =
//         database.cases.find(
//           (item) =>
//             item.id ===
//             req.params.caseId
//         );


//       if (!recoveryCase) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Recovery case not found.",

//         });

//       }


//       const oldAgent =
//         database.agents.find(
//           (agent) =>
//             agent.id ===
//             recoveryCase.assignedAgentId
//         );


//       if (oldAgent) {

//         const otherActiveCases =
//           database.cases.filter(
//             (item) =>
//               item.id !==
//                 recoveryCase.id &&
//               item.assignedAgentId ===
//                 oldAgent.id &&
//               item.status !==
//                 "completed"
//           );


//         if (
//           otherActiveCases.length ===
//           0
//         ) {

//           oldAgent.status =
//             "available";

//         }

//       }


//       recoveryCase.assignedAgentId =
//         null;

//       recoveryCase.status =
//         "pending";

//       recoveryCase.updatedAt =
//         new Date().toISOString();


//       database.activity.push({

//         id:
//           generateId(
//             "activity"
//           ),

//         type:
//           "case_unassigned",

//         caseId:
//           recoveryCase.id,

//         message:
//           `${recoveryCase.caseNumber} was unassigned`,

//         createdAt:
//           recoveryCase.updatedAt,

//       });


//       writeDatabase(
//         database
//       );


//       res.json({

//         success: true,

//         message:
//           "Case unassigned.",

//         case:
//           recoveryCase,

//       });

//     } catch (error) {

//       console.error(
//         "UNASSIGN ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to unassign case.",

//       });

//     }
//   }
// );


// /* =========================================================
//    DELETE CASE
// ========================================================= */

// router.delete(
//   "/cases/:caseId",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const caseIndex =
//         database.cases.findIndex(
//           (item) =>
//             item.id ===
//             req.params.caseId
//         );


//       if (
//         caseIndex ===
//         -1
//       ) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Recovery case not found.",

//         });

//       }


//       const recoveryCase =
//         database.cases[
//           caseIndex
//         ];


//       const assignedAgent =
//         database.agents.find(
//           (agent) =>
//             agent.id ===
//             recoveryCase.assignedAgentId
//         );


//       if (assignedAgent) {

//         const remainingCases =
//           database.cases.filter(
//             (item, index) =>
//               index !==
//                 caseIndex &&
//               item.assignedAgentId ===
//                 assignedAgent.id &&
//               item.status !==
//                 "completed"
//           );


//         if (
//           remainingCases.length ===
//           0
//         ) {

//           assignedAgent.status =
//             "available";

//         }

//       }


//       database.cases.splice(
//         caseIndex,
//         1
//       );


//       database.assignments =
//         database.assignments.filter(
//           (item) =>
//             item.caseId !==
//             recoveryCase.id
//         );


//       database.fieldUpdates =
//         database.fieldUpdates.filter(
//           (item) =>
//             item.caseId !==
//             recoveryCase.id
//         );


//       database.evidence =
//         database.evidence.filter(
//           (item) =>
//             item.caseId !==
//             recoveryCase.id
//         );


//       database.activity =
//         database.activity.filter(
//           (item) =>
//             item.caseId !==
//             recoveryCase.id
//         );


//       database.locations =
//         database.locations.filter(
//           (item) =>
//             item.caseId !==
//             recoveryCase.id
//         );


//       writeDatabase(
//         database
//       );


//       res.json({

//         success: true,

//         message:
//           `${recoveryCase.caseNumber} deleted successfully.`,

//       });

//     } catch (error) {

//       console.error(
//         "DELETE CASE ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to delete case.",

//       });

//     }
//   }
// );


// /* =========================================================
//    ASSIGN ANY AGENT TO ANY LOCATION
// ========================================================= */

// /*
//  * This is DIFFERENT from case assignment.
//  *
//  * Manager chooses:
//  *
//  *   Agent → Any destination
//  *
//  * GPS proximity is NOT required.
//  *
//  * Example:
//  *
//  * Rahul Kumar
//  * →
//  * 5J58+MJ, Hunasamaranahalli, Karnataka 562157
//  *
//  * The destination is geocoded and stored.
//  */

// router.post(
//   "/agent-assignments",
//   authenticateToken,
//   requireRole("manager"),
//   async (req, res) => {

//     try {

//       const {
//         agentId,
//         address,
//       } = req.body;


//       /* ---------------------------------------------------
//          VALIDATION
//       --------------------------------------------------- */

//       if (!agentId) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Agent selection is required.",

//         });

//       }


//       if (
//         !address?.trim()
//       ) {

//         return res.status(400).json({

//           success: false,

//           message:
//             "Destination or location is required.",

//         });

//       }


//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       /* ---------------------------------------------------
//          FIND REGISTERED AGENT
//       --------------------------------------------------- */

//       const fieldAgents =
//         getFieldAgents(
//           database
//         );


//       const agent =
//         fieldAgents.find(
//           (item) =>
//             item.id ===
//             agentId
//         );


//       if (!agent) {

//         return res.status(404).json({

//           success: false,

//           message:
//             "Registered field agent not found.",

//         });

//       }


//       /* ---------------------------------------------------
//          GEOCODE LOCATION
//       --------------------------------------------------- */

//       let coordinates;

//       try {

//         coordinates =
//           await geocodeAddress(
//             address.trim()
//           );

//       } catch (geoError) {

//         return res.status(400).json({

//           success: false,

//           message:
//             geoError.message ||
//             "Unable to resolve the destination.",

//         });

//       }


//       /* ---------------------------------------------------
//          CREATE LOCATION ASSIGNMENT
//       --------------------------------------------------- */

//       const timestamp =
//         new Date().toISOString();


//       const assignment = {

//         id:
//           generateId(
//             "agent_assignment"
//           ),

//         agentId:
//           agent.id,

//         assignedBy:
//           req.user.id,

//         address:
//           address.trim(),

//         latitude:
//           coordinates.latitude,

//         longitude:
//           coordinates.longitude,

//         geocodedAddress:
//           coordinates.displayName,

//         locationSource:
//           coordinates.source ||
//           "geocoding",

//         status:
//           "assigned",

//         createdAt:
//           timestamp,

//         updatedAt:
//           timestamp,

//       };


//       database.agentLocationAssignments.push(
//         assignment
//       );


//       /* ---------------------------------------------------
//          ACTIVITY LOG
//       --------------------------------------------------- */

//       database.activity.push({

//         id:
//           generateId(
//             "activity"
//           ),

//         type:
//           "agent_location_assigned",

//         agentId:
//           agent.id,

//         message:
//           `${agent.name} was assigned to ${coordinates.displayName || address.trim()}`,

//         createdAt:
//           timestamp,

//       });


//       writeDatabase(
//         database
//       );


//       res.status(201).json({

//         success: true,

//         message:
//           `${agent.name} assigned to the selected location.`,

//         assignment: {

//           ...assignment,

//           agent,

//         },

//       });

//     } catch (error) {

//       console.error(
//         "AGENT LOCATION ASSIGNMENT ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to assign agent to the location.",

//       });

//     }
//   }
// );


// /* =========================================================
//    GET AGENT LOCATION ASSIGNMENTS
// ========================================================= */

// router.get(
//   "/agent-assignments",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const assignments =
//         database.agentLocationAssignments
//           .map(
//             (assignment) => {

//               const agent =
//                 database.agents.find(
//                   (item) =>
//                     item.id ===
//                     assignment.agentId
//                 );


//               return {

//                 ...assignment,

//                 agent:
//                   agent
//                     ? {

//                         id:
//                           agent.id,

//                         userId:
//                           agent.userId,

//                         name:
//                           agent.name,

//                         email:
//                           agent.email,

//                         status:
//                           agent.status,

//                       }
//                     : null,

//               };

//             }
//           )
//           .reverse();


//       res.json({

//         success: true,

//         assignments,

//       });

//     } catch (error) {

//       console.error(
//         "GET AGENT LOCATION ASSIGNMENTS ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to load agent location assignments.",

//       });

//     }
//   }
// );


// /* =========================================================
//    REPORTS
// ========================================================= */

// router.get(
//   "/reports",
//   authenticateToken,
//   requireRole("manager"),
//   (req, res) => {

//     try {

//       const database =
//         ensureDatabase(
//           readDatabase()
//         );


//       const changed =
//         repairCaseNumbers(
//           database
//         );


//       if (changed) {

//         writeDatabase(
//           database
//         );

//       }


//       const cases =
//         database.cases;


//       const total =
//         cases.length;


//       const completed =
//         cases.filter(
//           (item) =>
//             item.status ===
//             "completed"
//         ).length;


//       const inProgress =
//         cases.filter(
//           (item) =>
//             item.status ===
//             "in_progress"
//         ).length;


//       const assigned =
//         cases.filter(
//           (item) =>
//             item.status ===
//             "assigned"
//         ).length;


//       const pending =
//         cases.filter(
//           (item) =>
//             item.status ===
//             "pending"
//         ).length;


//       const totalAmount =
//         cases.reduce(
//           (sum, item) =>
//             sum +
//             Number(
//               item.amount ||
//               0
//             ),
//           0
//         );


//       const completedAmount =
//         cases
//           .filter(
//             (item) =>
//               item.status ===
//               "completed"
//           )
//           .reduce(
//             (sum, item) =>
//               sum +
//               Number(
//                 item.amount ||
//                 0
//               ),
//             0
//           );


//       res.json({

//         success: true,

//         summary: {

//           totalCases:
//             total,

//           pendingCases:
//             pending,

//           assignedCases:
//             assigned,

//           inProgressCases:
//             inProgress,

//           completedCases:
//             completed,

//           completionRate:
//             total
//               ? Math.round(
//                   (
//                     completed /
//                     total
//                   ) *
//                     100
//                 )
//               : 0,

//           totalOutstanding:
//             totalAmount,

//           recoveredAmount:
//             completedAmount,

//         },

//         cases,

//         activity:
//           database.activity
//             .slice(-50)
//             .reverse(),

//       });

//     } catch (error) {

//       console.error(
//         "REPORTS ERROR:",
//         error
//       );

//       res.status(500).json({

//         success: false,

//         message:
//           "Unable to load reports.",

//       });

//     }
//   }
// );


// export default router;

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

import {
  distanceInMeters,
  geocodeAddress,
} from "../utils/geo.js";

const router = express.Router();


/* =========================================================
   DATABASE HELPERS
========================================================= */

function ensureDatabase(database) {
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
   NUMBER HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


/* =========================================================
   CASE NUMBER HELPERS
========================================================= */

function getCaseNumberValue(caseNumber) {
  if (typeof caseNumber !== "string") {
    return null;
  }

  const match = caseNumber
    .trim()
    .match(/^FO-(\d+)$/i);

  if (!match) {
    return null;
  }

  const number = Number(match[1]);

  return Number.isFinite(number)
    ? number
    : null;
}


/* =========================================================
   REPAIR DUPLICATE CASE NUMBERS
========================================================= */

function repairCaseNumbers(database) {
  const usedNumbers = new Set();

  let highestNumber = 1000;

  let changed = false;

  for (const recoveryCase of database.cases) {
    const value = getCaseNumberValue(
      recoveryCase.caseNumber
    );

    if (
      value !== null &&
      value > highestNumber
    ) {
      highestNumber = value;
    }
  }

  for (const recoveryCase of database.cases) {
    const currentNumber = getCaseNumberValue(
      recoveryCase.caseNumber
    );

    if (
      currentNumber !== null &&
      !usedNumbers.has(currentNumber)
    ) {
      usedNumbers.add(currentNumber);
      continue;
    }

    do {
      highestNumber += 1;
    } while (
      usedNumbers.has(highestNumber)
    );

    recoveryCase.caseNumber =
      `FO-${highestNumber}`;

    usedNumbers.add(highestNumber);

    changed = true;
  }

  return changed;
}


/* =========================================================
   GENERATE NEXT CASE NUMBER
========================================================= */

function generateNextCaseNumber(database) {
  let highestNumber = 1000;

  for (const recoveryCase of database.cases) {
    const value = getCaseNumberValue(
      recoveryCase.caseNumber
    );

    if (
      value !== null &&
      value > highestNumber
    ) {
      highestNumber = value;
    }
  }

  let nextNumber = highestNumber + 1;

  const existingNumbers = new Set(
    database.cases
      .map((recoveryCase) =>
        getCaseNumberValue(
          recoveryCase.caseNumber
        )
      )
      .filter(
        (value) => value !== null
      )
  );

  while (
    existingNumbers.has(nextNumber)
  ) {
    nextNumber += 1;
  }

  return `FO-${nextNumber}`;
}


/* =========================================================
   LIVE GPS CHECK
========================================================= */

function isLiveAgent(agent) {
  if (
    agent.locationConsent !== true
  ) {
    return false;
  }

  const latitude = toNumber(
    agent.latitude
  );

  const longitude = toNumber(
    agent.longitude
  );

  if (
    latitude === null ||
    longitude === null
  ) {
    return false;
  }

  if (!agent.lastLocationAt) {
    return false;
  }

  const timestamp = new Date(
    agent.lastLocationAt
  ).getTime();

  if (Number.isNaN(timestamp)) {
    return false;
  }

  const age =
    Date.now() - timestamp;

  return (
    age >= 0 &&
    age <= 10 * 60 * 1000
  );
}


/* =========================================================
   GET REGISTERED FIELD AGENTS
========================================================= */

function getFieldAgents(database) {
  const agentUsers =
    database.users.filter(
      (user) =>
        user.role === "agent"
    );

  return agentUsers.map(
    (user) => {
      let agent =
        database.agents.find(
          (item) =>
            String(item.userId) ===
            String(user.id)
        );

      /* ---------------------------------------------------
         CREATE MISSING AGENT PROFILE
      --------------------------------------------------- */

      if (!agent) {
        agent = {
          id: generateId("agent"),

          userId: user.id,

          name: user.name,

          email: user.email,

          status: "available",

          latitude: null,

          longitude: null,

          locationConsent: false,

          lastLocationAt: null,
        };

        database.agents.push(agent);
      }

      /* ---------------------------------------------------
         SYNC NAME / EMAIL FROM USER
      --------------------------------------------------- */

      agent.name =
        user.name ||
        agent.name;

      agent.email =
        user.email ||
        agent.email;

      /* ---------------------------------------------------
         SYNCHRONIZE CASE STATUS

         Match by agent.id OR user.id so old
         assignments are also recognized.
      --------------------------------------------------- */

      const activeCases =
        database.cases.filter(
          (item) =>
            (
              String(
                item.assignedAgentId || ""
              ) === String(agent.id) ||
              String(
                item.assignedAgentId || ""
              ) === String(agent.userId)
            ) &&
            item.status !==
              "completed"
        );

      agent.status =
        activeCases.length > 0
          ? "busy"
          : "available";

      return {
        ...agent,

        name:
          user.name ||
          agent.name,

        email:
          user.email ||
          agent.email,

        latitude:
          toNumber(agent.latitude),

        longitude:
          toNumber(agent.longitude),

        isLive:
          isLiveAgent(agent),
      };
    }
  );
}


/* =========================================================
   RESOLVE AGENT

   IMPORTANT FIX

   The frontend may send either:

      agent.id

   OR:

      agent.userId

   This function ALWAYS returns the real
   database.agents profile.

   Therefore every case ultimately stores:

      assignedAgentId = agent.id
========================================================= */

function resolveAgent(
  database,
  suppliedAgentId
) {
  if (!suppliedAgentId) {
    return null;
  }

  const requestedId =
    String(suppliedAgentId);

  /* -------------------------------------------------------
     First look through actual agent profiles.
  ------------------------------------------------------- */

  let agent =
    database.agents.find(
      (item) =>
        String(item.id) ===
          requestedId ||
        String(item.userId) ===
          requestedId
    );

  if (agent) {
    return agent;
  }

  /* -------------------------------------------------------
     If profile doesn't exist, check registered users.
  ------------------------------------------------------- */

  const user =
    database.users.find(
      (item) =>
        (
          String(item.id) ===
          requestedId
        ) &&
        item.role === "agent"
    );

  if (!user) {
    return null;
  }

  /* -------------------------------------------------------
     Recreate missing profile.
  ------------------------------------------------------- */

  agent = {
    id:
      generateId("agent"),

    userId:
      user.id,

    name:
      user.name,

    email:
      user.email,

    status:
      "available",

    latitude:
      null,

    longitude:
      null,

    locationConsent:
      false,

    lastLocationAt:
      null,
  };

  database.agents.push(agent);

  return agent;
}


/* =========================================================
   TODAY
========================================================= */

function todayPrefix() {
  return new Date()
    .toISOString()
    .slice(0, 10);
}


/* =========================================================
   MANAGER DASHBOARD
========================================================= */

router.get(
  "/dashboard",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const numbersChanged =
        repairCaseNumbers(
          database
        );

      const agents =
        getFieldAgents(
          database
        );

      writeDatabase(
        database
      );

      const cases =
        database.cases;

      return res.json({
        success: true,

        metrics: {
          openCases:
            cases.filter(
              (item) =>
                item.status !==
                "completed"
            ).length,

          awaitingAssignment:
            cases.filter(
              (item) =>
                !item.assignedAgentId
            ).length,

          availableAgents:
            agents.filter(
              (agent) =>
                agent.status ===
                "available"
            ).length,

          activeAgents:
            agents.filter(
              (agent) =>
                agent.status ===
                "busy"
            ).length,

          completedToday:
            cases.filter(
              (item) =>
                item.status ===
                  "completed" &&
                item.completedAt &&
                item.completedAt.startsWith(
                  todayPrefix()
                )
            ).length,

          totalOutstanding:
            cases
              .filter(
                (item) =>
                  item.status !==
                  "completed"
              )
              .reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.amount || 0
                  ),
                0
              ),
        },

        cases,

        agents,

        activity:
          database.activity
            .slice(-30)
            .reverse(),
      });
    } catch (error) {
      console.error(
        "DASHBOARD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load dashboard.",
      });
    }
  }
);


/* =========================================================
   GET RECOVERY CASES
========================================================= */

router.get(
  "/cases",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const changed =
        repairCaseNumbers(
          database
        );

      if (changed) {
        writeDatabase(
          database
        );
      }

      const cases =
        database.cases.map(
          (recoveryCase) => {
            const agent =
              resolveAgent(
                database,
                recoveryCase.assignedAgentId
              );

            return {
              ...recoveryCase,

              assignedAgent:
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

                      status:
                        agent.status,
                    }
                  : null,
            };
          }
        );

      return res.json({
        success: true,
        cases,
      });
    } catch (error) {
      console.error(
        "GET CASES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load recovery cases.",
      });
    }
  }
);


/* =========================================================
   CREATE RECOVERY CASE
========================================================= */

router.post(
  "/cases",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    try {
      const {
        customerName,
        phone,
        address,
        amount,
        priority,
      } = req.body;

      if (!customerName?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer name is required.",
        });
      }

      if (!phone?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer phone number is required.",
        });
      }

      if (!address?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Customer address is required.",
        });
      }

      const numericAmount =
        Number(amount || 0);

      if (
        !Number.isFinite(
          numericAmount
        ) ||
        numericAmount < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Enter a valid recovery amount.",
        });
      }

      /* ---------------------------------------------------
         GEOCODE ADDRESS
      --------------------------------------------------- */

      let coordinates;

      try {
        coordinates =
          await geocodeAddress(
            address.trim()
          );
      } catch (geoError) {
        return res.status(400).json({
          success: false,
          message:
            geoError.message ||
            "Unable to locate the address.",
        });
      }

      const database =
        ensureDatabase(
          readDatabase()
        );

      repairCaseNumbers(
        database
      );

      const caseNumber =
        generateNextCaseNumber(
          database
        );

      const timestamp =
        new Date().toISOString();

      const recoveryCase = {
        id:
          generateId("case"),

        caseNumber,

        customerName:
          customerName.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        latitude:
          toNumber(
            coordinates.latitude
          ),

        longitude:
          toNumber(
            coordinates.longitude
          ),

        geocodedAddress:
          coordinates.displayName,

        locationSource:
          coordinates.source ||
          "geocoding",

        amount:
          numericAmount,

        priority:
          priority ||
          "medium",

        status:
          "pending",

        assignedAgentId:
          null,

        checkedInAt:
          null,

        startedAt:
          null,

        completedAt:
          null,

        outcome:
          null,

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

      database.cases.push(
        recoveryCase
      );

      database.activity.push({
        id:
          generateId("activity"),

        type:
          "case_created",

        caseId:
          recoveryCase.id,

        message:
          `Recovery case ${recoveryCase.caseNumber} was created at ${address.trim()}`,

        createdAt:
          timestamp,
      });

      writeDatabase(
        database
      );

      return res.status(201).json({
        success: true,

        message:
          "Recovery case created and location resolved.",

        case:
          recoveryCase,
      });
    } catch (error) {
      console.error(
        "CREATE CASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create recovery case.",
      });
    }
  }
);


/* =========================================================
   FIELD AGENTS
========================================================= */

router.get(
  "/agents",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const agents =
        getFieldAgents(
          database
        );

      writeDatabase(
        database
      );

      return res.json({
        success: true,
        agents,
      });
    } catch (error) {
      console.error(
        "GET AGENTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load field agents.",
      });
    }
  }
);


/* =========================================================
   FIND NEAREST AGENT
========================================================= */

router.get(
  "/cases/:caseId/nearest-agent",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(
              req.params.caseId
            )
        );

      if (!recoveryCase) {
        return res.status(404).json({
          success: false,
          message:
            "Recovery case not found.",
        });
      }

      const caseLatitude =
        toNumber(
          recoveryCase.latitude
        );

      const caseLongitude =
        toNumber(
          recoveryCase.longitude
        );

      if (
        caseLatitude === null ||
        caseLongitude === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This case does not have a valid map location.",
        });
      }

      const candidates =
        getFieldAgents(
          database
        )
          .filter(
            (agent) =>
              agent.status ===
                "available" &&
              agent.isLive &&
              agent.latitude !== null &&
              agent.longitude !== null
          )
          .map(
            (agent) => ({
              agent,

              distance:
                distanceInMeters(
                  agent.latitude,
                  agent.longitude,
                  caseLatitude,
                  caseLongitude
                ),
            })
          )
          .sort(
            (a, b) =>
              a.distance -
              b.distance
          );

      if (
        candidates.length ===
        0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No available agents currently sharing a live GPS location.",
        });
      }

      const nearest =
        candidates[0];

      return res.json({
        success: true,

        case:
          recoveryCase,

        agent:
          nearest.agent,

        distance:
          Math.round(
            nearest.distance
          ),

        candidates:
          candidates.map(
            (item) => ({
              agent:
                item.agent,

              distance:
                Math.round(
                  item.distance
                ),
            })
          ),
      });
    } catch (error) {
      console.error(
        "NEAREST AGENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to find nearest agent.",
      });
    }
  }
);


/* =========================================================
   MANUAL CASE ASSIGNMENT
=========================================================

   IMPORTANT:

   Accepts BOTH:

      agent.id

   and:

      agent.userId

   Then ALWAYS stores:

      recoveryCase.assignedAgentId = agent.id
========================================================= */

router.post(
  "/cases/:caseId/assign",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const {
        agentId,
      } = req.body;

      if (!agentId) {
        return res.status(400).json({
          success: false,
          message:
            "Agent selection is required.",
        });
      }

      const database =
        ensureDatabase(
          readDatabase()
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(
              req.params.caseId
            )
        );

      if (!recoveryCase) {
        return res.status(404).json({
          success: false,
          message:
            "Recovery case not found.",
        });
      }

      /* ---------------------------------------------------
         RESOLVE EITHER AGENT ID OR USER ID
      --------------------------------------------------- */

      const agent =
        resolveAgent(
          database,
          agentId
        );

      if (!agent) {
        return res.status(404).json({
          success: false,
          message:
            "Registered field agent not found.",
        });
      }

      /* ---------------------------------------------------
         IMPORTANT:
         Save canonical AGENT PROFILE ID.
      --------------------------------------------------- */

      const canonicalAgentId =
        String(agent.id);

      /* ---------------------------------------------------
         Previous assignment
      --------------------------------------------------- */

      const previousAgent =
        recoveryCase.assignedAgentId
          ? resolveAgent(
              database,
              recoveryCase.assignedAgentId
            )
          : null;

      /* ---------------------------------------------------
         If assigning to another agent,
         release previous agent if needed.
      --------------------------------------------------- */

      if (
        previousAgent &&
        String(previousAgent.id) !==
          canonicalAgentId
      ) {
        const previousActiveCases =
          database.cases.filter(
            (item) =>
              String(item.id) !==
                String(
                  recoveryCase.id
                ) &&
              (
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    previousAgent.id
                  ) ||
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    previousAgent.userId
                  )
              ) &&
              item.status !==
                "completed"
          );

        if (
          previousActiveCases.length ===
          0
        ) {
          previousAgent.status =
            "available";
        }
      }

      /* ---------------------------------------------------
         ASSIGN CASE
      --------------------------------------------------- */

      recoveryCase.assignedAgentId =
        canonicalAgentId;

      recoveryCase.status =
        "assigned";

      recoveryCase.updatedAt =
        new Date().toISOString();

      /* ---------------------------------------------------
         Agent becomes busy
      --------------------------------------------------- */

      const actualAgent =
        database.agents.find(
          (item) =>
            String(item.id) ===
            canonicalAgentId
        );

      if (actualAgent) {
        actualAgent.status =
          "busy";
      }

      /* ---------------------------------------------------
         Assignment record
      --------------------------------------------------- */

      const assignment = {
        id:
          generateId(
            "assignment"
          ),

        caseId:
          recoveryCase.id,

        agentId:
          canonicalAgentId,

        agentUserId:
          agent.userId,

        assignedBy:
          req.user.id,

        assignedAt:
          recoveryCase.updatedAt,

        assignmentType:
          "manual",
      };

      database.assignments.push(
        assignment
      );

      /* ---------------------------------------------------
         Activity
      --------------------------------------------------- */

      database.activity.push({
        id:
          generateId(
            "activity"
          ),

        type:
          "case_assigned",

        caseId:
          recoveryCase.id,

        agentId:
          canonicalAgentId,

        message:
          `${recoveryCase.caseNumber} manually assigned to ${agent.name}`,

        createdAt:
          recoveryCase.updatedAt,
      });

      writeDatabase(
        database
      );

      console.log(
        "========================================"
      );

      console.log(
        "FIELDOPS CASE ASSIGNMENT"
      );

      console.log({
        caseId:
          recoveryCase.id,

        caseNumber:
          recoveryCase.caseNumber,

        receivedAgentId:
          agentId,

        resolvedAgentId:
          agent.id,

        resolvedUserId:
          agent.userId,

        assignedAgentId:
          recoveryCase.assignedAgentId,

        agentName:
          agent.name,
      });

      console.log(
        "========================================"
      );

      return res.json({
        success: true,

        message:
          `${recoveryCase.caseNumber} assigned to ${agent.name}.`,

        assignment,

        case:
          recoveryCase,

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
      });
    } catch (error) {
      console.error(
        "ASSIGN ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to assign case.",
        error:
          error.message,
      });
    }
  }
);


/* =========================================================
   ASSIGN NEAREST AGENT
========================================================= */

router.post(
  "/cases/:caseId/assign-nearest",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(
              req.params.caseId
            )
        );

      if (!recoveryCase) {
        return res.status(404).json({
          success: false,
          message:
            "Recovery case not found.",
        });
      }

      const caseLatitude =
        toNumber(
          recoveryCase.latitude
        );

      const caseLongitude =
        toNumber(
          recoveryCase.longitude
        );

      if (
        caseLatitude === null ||
        caseLongitude === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "This case does not have a valid map location.",
        });
      }

      const candidates =
        getFieldAgents(
          database
        )
          .filter(
            (agent) =>
              agent.status ===
                "available" &&
              agent.isLive &&
              agent.latitude !== null &&
              agent.longitude !== null
          )
          .map(
            (agent) => ({
              agent,

              distance:
                distanceInMeters(
                  agent.latitude,
                  agent.longitude,
                  caseLatitude,
                  caseLongitude
                ),
            })
          )
          .sort(
            (a, b) =>
              a.distance -
              b.distance
          );

      if (
        candidates.length ===
        0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No available agents currently sharing a live GPS location.",
        });
      }

      const nearest =
        candidates[0];

      const timestamp =
        new Date().toISOString();

      const actualAgent =
        database.agents.find(
          (item) =>
            String(item.id) ===
            String(
              nearest.agent.id
            )
        );

      if (actualAgent) {
        actualAgent.status =
          "busy";
      }

      recoveryCase.assignedAgentId =
        nearest.agent.id;

      recoveryCase.status =
        "assigned";

      recoveryCase.updatedAt =
        timestamp;

      const assignment = {
        id:
          generateId(
            "assignment"
          ),

        caseId:
          recoveryCase.id,

        agentId:
          nearest.agent.id,

        agentUserId:
          nearest.agent.userId,

        assignedBy:
          req.user.id,

        assignedAt:
          timestamp,

        distanceAtAssignment:
          Math.round(
            nearest.distance
          ),

        assignmentType:
          "nearest",
      };

      database.assignments.push(
        assignment
      );

      database.activity.push({
        id:
          generateId(
            "activity"
          ),

        type:
          "case_assigned",

        caseId:
          recoveryCase.id,

        agentId:
          nearest.agent.id,

        message:
          `${recoveryCase.caseNumber} assigned to nearest agent ${nearest.agent.name}`,

        createdAt:
          timestamp,
      });

      writeDatabase(
        database
      );

      return res.json({
        success: true,

        message:
          "Nearest available agent assigned.",

        assignment,

        case:
          recoveryCase,

        agent:
          nearest.agent,

        distance:
          Math.round(
            nearest.distance
          ),
      });
    } catch (error) {
      console.error(
        "ASSIGN NEAREST ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to assign nearest agent.",
      });
    }
  }
);


/* =========================================================
   UNASSIGN CASE
========================================================= */

router.post(
  "/cases/:caseId/unassign",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const recoveryCase =
        database.cases.find(
          (item) =>
            String(item.id) ===
            String(
              req.params.caseId
            )
        );

      if (!recoveryCase) {
        return res.status(404).json({
          success: false,
          message:
            "Recovery case not found.",
        });
      }

      const oldAgent =
        resolveAgent(
          database,
          recoveryCase.assignedAgentId
        );

      if (oldAgent) {
        const otherActiveCases =
          database.cases.filter(
            (item) =>
              String(item.id) !==
                String(
                  recoveryCase.id
                ) &&
              (
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    oldAgent.id
                  ) ||
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    oldAgent.userId
                  )
              ) &&
              item.status !==
                "completed"
          );

        if (
          otherActiveCases.length ===
          0
        ) {
          oldAgent.status =
            "available";
        }
      }

      recoveryCase.assignedAgentId =
        null;

      recoveryCase.status =
        "pending";

      recoveryCase.updatedAt =
        new Date().toISOString();

      database.activity.push({
        id:
          generateId(
            "activity"
          ),

        type:
          "case_unassigned",

        caseId:
          recoveryCase.id,

        message:
          `${recoveryCase.caseNumber} was unassigned`,

        createdAt:
          recoveryCase.updatedAt,
      });

      writeDatabase(
        database
      );

      return res.json({
        success: true,

        message:
          "Case unassigned.",

        case:
          recoveryCase,
      });
    } catch (error) {
      console.error(
        "UNASSIGN ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to unassign case.",
      });
    }
  }
);


/* =========================================================
   DELETE CASE
========================================================= */

router.delete(
  "/cases/:caseId",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const caseIndex =
        database.cases.findIndex(
          (item) =>
            String(item.id) ===
            String(
              req.params.caseId
            )
        );

      if (
        caseIndex ===
        -1
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Recovery case not found.",
        });
      }

      const recoveryCase =
        database.cases[
          caseIndex
        ];

      const assignedAgent =
        resolveAgent(
          database,
          recoveryCase.assignedAgentId
        );

      if (assignedAgent) {
        const remainingCases =
          database.cases.filter(
            (item, index) =>
              index !==
                caseIndex &&
              (
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    assignedAgent.id
                  ) ||
                String(
                  item.assignedAgentId ||
                    ""
                ) ===
                  String(
                    assignedAgent.userId
                  )
              ) &&
              item.status !==
                "completed"
          );

        if (
          remainingCases.length ===
          0
        ) {
          assignedAgent.status =
            "available";
        }
      }

      database.cases.splice(
        caseIndex,
        1
      );

      database.assignments =
        database.assignments.filter(
          (item) =>
            String(item.caseId) !==
            String(
              recoveryCase.id
            )
        );

      database.fieldUpdates =
        database.fieldUpdates.filter(
          (item) =>
            String(item.caseId) !==
            String(
              recoveryCase.id
            )
        );

      database.evidence =
        database.evidence.filter(
          (item) =>
            String(item.caseId) !==
            String(
              recoveryCase.id
            )
        );

      database.activity =
        database.activity.filter(
          (item) =>
            String(item.caseId) !==
            String(
              recoveryCase.id
            )
        );

      database.locations =
        database.locations.filter(
          (item) =>
            String(item.caseId) !==
            String(
              recoveryCase.id
            )
        );

      writeDatabase(
        database
      );

      return res.json({
        success: true,

        message:
          `${recoveryCase.caseNumber} deleted successfully.`,
      });
    } catch (error) {
      console.error(
        "DELETE CASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to delete case.",
      });
    }
  }
);


/* =========================================================
   ASSIGN AGENT TO ANY LOCATION
========================================================= */

router.post(
  "/agent-assignments",
  authenticateToken,
  requireRole("manager"),
  async (req, res) => {
    try {
      const {
        agentId,
        address,
      } = req.body;

      if (!agentId) {
        return res.status(400).json({
          success: false,
          message:
            "Agent selection is required.",
        });
      }

      if (!address?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Destination or location is required.",
        });
      }

      const database =
        ensureDatabase(
          readDatabase()
        );

      const agent =
        resolveAgent(
          database,
          agentId
        );

      if (!agent) {
        return res.status(404).json({
          success: false,
          message:
            "Registered field agent not found.",
        });
      }

      let coordinates;

      try {
        coordinates =
          await geocodeAddress(
            address.trim()
          );
      } catch (geoError) {
        return res.status(400).json({
          success: false,
          message:
            geoError.message ||
            "Unable to resolve the destination.",
        });
      }

      const timestamp =
        new Date().toISOString();

      const assignment = {
        id:
          generateId(
            "agent_assignment"
          ),

        agentId:
          agent.id,

        agentUserId:
          agent.userId,

        assignedBy:
          req.user.id,

        address:
          address.trim(),

        latitude:
          toNumber(
            coordinates.latitude
          ),

        longitude:
          toNumber(
            coordinates.longitude
          ),

        geocodedAddress:
          coordinates.displayName,

        locationSource:
          coordinates.source ||
          "geocoding",

        status:
          "assigned",

        createdAt:
          timestamp,

        updatedAt:
          timestamp,
      };

      database.agentLocationAssignments.push(
        assignment
      );

      database.activity.push({
        id:
          generateId(
            "activity"
          ),

        type:
          "agent_location_assigned",

        agentId:
          agent.id,

        message:
          `${agent.name} was assigned to ${coordinates.displayName || address.trim()}`,

        createdAt:
          timestamp,
      });

      writeDatabase(
        database
      );

      return res.status(201).json({
        success: true,

        message:
          `${agent.name} assigned to the selected location.`,

        assignment: {
          ...assignment,

          agent,
        },
      });
    } catch (error) {
      console.error(
        "AGENT LOCATION ASSIGNMENT ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to assign agent to the location.",
      });
    }
  }
);


/* =========================================================
   GET AGENT LOCATION ASSIGNMENTS
========================================================= */

router.get(
  "/agent-assignments",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const assignments =
        database.agentLocationAssignments
          .map(
            (assignment) => {
              const agent =
                resolveAgent(
                  database,
                  assignment.agentId
                );

              return {
                ...assignment,

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

                        status:
                          agent.status,
                      }
                    : null,
              };
            }
          )
          .reverse();

      return res.json({
        success: true,
        assignments,
      });
    } catch (error) {
      console.error(
        "GET AGENT LOCATION ASSIGNMENTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load agent location assignments.",
      });
    }
  }
);


/* =========================================================
   REPORTS
========================================================= */

router.get(
  "/reports",
  authenticateToken,
  requireRole("manager"),
  (req, res) => {
    try {
      const database =
        ensureDatabase(
          readDatabase()
        );

      const changed =
        repairCaseNumbers(
          database
        );

      if (changed) {
        writeDatabase(
          database
        );
      }

      const cases =
        database.cases;

      const total =
        cases.length;

      const completed =
        cases.filter(
          (item) =>
            item.status ===
            "completed"
        ).length;

      const inProgress =
        cases.filter(
          (item) =>
            item.status ===
            "in_progress"
        ).length;

      const assigned =
        cases.filter(
          (item) =>
            item.status ===
            "assigned"
        ).length;

      const pending =
        cases.filter(
          (item) =>
            item.status ===
            "pending"
        ).length;

      const totalAmount =
        cases.reduce(
          (sum, item) =>
            sum +
            Number(
              item.amount || 0
            ),
          0
        );

      const completedAmount =
        cases
          .filter(
            (item) =>
              item.status ===
              "completed"
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(
                item.amount || 0
              ),
            0
          );

      return res.json({
        success: true,

        summary: {
          totalCases:
            total,

          pendingCases:
            pending,

          assignedCases:
            assigned,

          inProgressCases:
            inProgress,

          completedCases:
            completed,

          completionRate:
            total
              ? Math.round(
                  (
                    completed /
                    total
                  ) *
                    100
                )
              : 0,

          totalOutstanding:
            totalAmount,

          recoveredAmount:
            completedAmount,
        },

        cases,

        activity:
          database.activity
            .slice(-50)
            .reverse(),
      });
    } catch (error) {
      console.error(
        "REPORTS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load reports.",
      });
    }
  }
);


export default router;