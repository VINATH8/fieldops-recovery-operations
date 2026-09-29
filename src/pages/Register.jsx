import { useState } from "react";

import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  register,
  saveSession,
} from "../api/api";


function Register() {

  const navigate =
    useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] =
    useState("agent");

  const [managerSignupKey, setManagerSignupKey] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleRegister(event) {

    event.preventDefault();

    setError("");


    if (!name.trim()) {

      setError(
        "Enter your full name."
      );

      return;
    }


    if (!email.trim()) {

      setError(
        "Enter your email address."
      );

      return;
    }


    if (password.length < 8) {

      setError(
        "Password must contain at least 8 characters."
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (
      role === "manager" &&
      !managerSignupKey.trim()
    ) {

      setError(
        "Manager signup key is required."
      );

      return;
    }


    try {

      setLoading(true);


      const result =
        await register({
          name:
            name.trim(),

          email:
            email.trim(),

          password,

          role,

          managerSignupKey:
            managerSignupKey.trim(),
        });


      if (
        !result?.success ||
        !result?.token ||
        !result?.user
      ) {

        throw new Error(
          "Invalid registration response."
        );

      }


      saveSession(
        result.token,
        result.user
      );


      if (
        result.user.role ===
        "manager"
      ) {

        navigate(
          "/manager",
          {
            replace: true,
          }
        );

      } else {

        navigate(
          "/agent",
          {
            replace: true,
          }
        );

      }

    } catch (err) {

      console.error(
        "REGISTRATION ERROR:",
        err
      );


      setError(
        err.response?.data?.message ||
        "Unable to create account."
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="login-page">

      {/* =====================================================
          BRAND
      ===================================================== */}

      <section className="login-brand">

        <div className="brand-logo">

          <div className="brand-icon">
            F
          </div>

          <span>
            fieldops
          </span>

        </div>


        <div className="brand-content">

          <div className="eyebrow">
            FIELDOPS ACCOUNT
          </div>

          <h1>
            Join the operation.
          </h1>

          <p>
            Create your FieldOps account and
            access the recovery operations
            workspace.
          </p>

        </div>

      </section>


      {/* =====================================================
          REGISTRATION PANEL
      ===================================================== */}

      <section className="login-panel">

        <div className="login-card">

          <div className="mobile-brand">

            <div className="brand-icon">
              F
            </div>

            <span>
              fieldops
            </span>

          </div>


          <div className="login-heading">

            <div className="eyebrow dark">
              CREATE ACCOUNT
            </div>

            <h2>
              Get started
            </h2>

            <p>
              Use your real email address
              and create a secure password.
            </p>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="login-error">

              <AlertCircle
                size={17}
              />

              <span>
                {error}
              </span>

            </div>

          )}


          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={
              handleRegister
            }
          >

            {/* FULL NAME */}

            <label>
              Full name
            </label>

            <input
              type="text"
              value={name}
              placeholder="Your full name"
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="name"
            />


            {/* EMAIL */}

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="email"
            />


            {/* =================================================
                ACCOUNT TYPE
            ================================================= */}

            <label>
              Account type
            </label>

            <select
              className="account-type-select"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value
                )
              }
              disabled={loading}
            >

              <option value="agent">
                Field Agent
              </option>

              <option value="manager">
                Manager
              </option>

            </select>


            {/* =================================================
                MANAGER SIGNUP KEY
            ================================================= */}

            {role === "manager" && (

              <>

                <label>
                  Manager signup key
                </label>

                <input
                  type="password"
                  value={
                    managerSignupKey
                  }
                  placeholder="Enter manager signup key"
                  onChange={(event) =>
                    setManagerSignupKey(
                      event.target.value
                    )
                  }
                  disabled={loading}
                  autoComplete="off"
                />

              </>

            )}


            {/* PASSWORD */}

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Minimum 8 characters"
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="new-password"
            />


            {/* CONFIRM PASSWORD */}

            <label>
              Confirm password
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              placeholder="Repeat your password"
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="new-password"
            />


            {/* SUBMIT */}

            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >

              {loading ? (

                "Creating account..."

              ) : (

                <>

                  Create account

                  <ArrowRight
                    size={18}
                  />

                </>

              )}

            </button>

          </form>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="login-security">

            <ShieldCheck
              size={16}
            />

            <span>
              Passwords are protected with
              bcrypt hashing
            </span>

          </div>


          {/* =================================================
              LOGIN LINK
          ================================================= */}

          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
            }}
          >

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >

              Already have an account?
              {" "}
              Sign in

            </button>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Register;