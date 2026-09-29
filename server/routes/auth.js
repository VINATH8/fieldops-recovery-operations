import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  readDatabase,
  writeDatabase,
  generateId,
} from "../utils/db.js";

dotenv.config();

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "change-this-development-secret";

const MANAGER_SIGNUP_KEY =
  process.env.MANAGER_SIGNUP_KEY || "";


/* =========================================================
   HELPERS
========================================================= */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );
}


function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}


/* =========================================================
   REGISTER
========================================================= */

router.post(
  "/register",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role = "agent",
        managerSignupKey,
      } = req.body;


      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required.",
        });
      }


      const cleanName =
        String(name).trim();

      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();


      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message:
            "Name must contain at least 2 characters.",
        });
      }


      if (!isValidEmail(cleanEmail)) {
        return res.status(400).json({
          success: false,
          message:
            "Enter a valid email address.",
        });
      }


      if (String(password).length < 8) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least 8 characters.",
        });
      }


      const requestedRole =
        role === "manager"
          ? "manager"
          : "agent";


      /* =====================================================
         MANAGER SECURITY
      ===================================================== */

      if (
        requestedRole === "manager" &&
        (
          !MANAGER_SIGNUP_KEY ||
          managerSignupKey !==
            MANAGER_SIGNUP_KEY
        )
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Manager registration requires a valid manager signup key.",
        });
      }


      /* =====================================================
         DATABASE
      ===================================================== */

      const database =
        readDatabase();


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


      /* =====================================================
         DUPLICATE EMAIL
      ===================================================== */

      const existingUser =
        database.users.find(
          (user) =>
            String(user.email)
              .toLowerCase() ===
            cleanEmail
        );


      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
      }


      /* =====================================================
         HASH PASSWORD
      ===================================================== */

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );


      /* =====================================================
         CREATE USER
      ===================================================== */

      const userId =
        generateId("user");

      const timestamp =
        new Date().toISOString();


      const newUser = {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: requestedRole,
        createdAt: timestamp,
      };


      database.users.push(
        newUser
      );


      /* =====================================================
         CREATE AGENT PROFILE
      ===================================================== */

      if (
        requestedRole === "agent"
      ) {

        const newAgent = {
          id: generateId("agent"),

          userId,

          name: cleanName,

          email: cleanEmail,

          status: "available",

          latitude: null,

          longitude: null,

          locationConsent: false,

          lastLocationAt: null,

        };


        database.agents.push(
          newAgent
        );


        database.activity.push({
          id:
            generateId("activity"),

          type:
            "agent_registered",

          agentId:
            newAgent.id,

          message:
            `${cleanName} registered as a field agent`,

          createdAt:
            timestamp,
        });

      } else {

        database.activity.push({
          id:
            generateId("activity"),

          type:
            "manager_registered",

          message:
            `${cleanName} registered as a manager`,

          createdAt:
            timestamp,
        });

      }


      /* =====================================================
         SAVE
      ===================================================== */

      writeDatabase(
        database
      );


      /* =====================================================
         JWT
      ===================================================== */

      const token =
        createToken(
          newUser
        );


      return res.status(201).json({
        success: true,

        message:
          "Account created successfully.",

        token,

        user:
          publicUser(
            newUser
          ),
      });

    } catch (error) {

      console.error(
        "REGISTRATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create account.",
      });
    }
  }
);


/* =========================================================
   LOGIN
========================================================= */

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;


      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required.",
        });
      }


      const cleanEmail =
        String(email)
          .trim()
          .toLowerCase();


      const database =
        readDatabase();


      const user =
        database.users.find(
          (item) =>
            String(item.email)
              .toLowerCase() ===
            cleanEmail
        );


      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }


      if (!user.passwordHash) {
        return res.status(401).json({
          success: false,
          message:
            "This account has an invalid password configuration.",
        });
      }


      const passwordValid =
        await bcrypt.compare(
          password,
          user.passwordHash
        );


      if (!passwordValid) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password.",
        });
      }


      const token =
        createToken(
          user
        );


      return res.json({
        success: true,

        message:
          "Login successful.",

        token,

        user:
          publicUser(
            user
          ),
      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Login failed.",
      });
    }
  }
);


/* =========================================================
   CURRENT USER
========================================================= */

router.get(
  "/me",
  async (req, res) => {

    try {

      const authHeader =
        req.headers.authorization;


      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }


      const token =
        authHeader.substring(7);


      const decoded =
        jwt.verify(
          token,
          JWT_SECRET
        );


      const database =
        readDatabase();


      const user =
        database.users.find(
          (item) =>
            item.id ===
            decoded.id
        );


      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "User account no longer exists.",
        });
      }


      return res.json({
        success: true,

        user:
          publicUser(
            user
          ),
      });

    } catch (error) {

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired token.",
      });
    }
  }
);


export default router;