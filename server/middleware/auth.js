import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "change-this-development-secret";


/* =========================================================
   AUTHENTICATE JWT
========================================================= */

export function authenticateToken(
  req,
  res,
  next
) {

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
    authHeader.substring(
      7
    );


  if (!token) {

    return res.status(401).json({
      success: false,
      message:
        "Authentication token missing.",
    });

  }


  try {

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );


    req.user =
      decoded;


    return next();

  } catch (error) {

    console.error(
      "JWT verification failed:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token.",
    });

  }
}


/* =========================================================
   ROLE PROTECTION
========================================================= */

export function requireRole(
  ...roles
) {

  return (
    req,
    res,
    next
  ) => {

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });

    }


    if (
      !roles.includes(
        req.user.role
      )
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Access denied.",
      });

    }


    return next();

  };
}