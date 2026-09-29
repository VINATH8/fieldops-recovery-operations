import { useState } from "react";

import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  login,
  saveSession,
} from "../api/api";


function Login() {

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  async function handleLogin(
    event
  ) {

    event.preventDefault();

    setError("");


    if (!email.trim()) {

      setError(
        "Enter your email address."
      );

      return;
    }


    if (!password) {

      setError(
        "Enter your password."
      );

      return;
    }


    try {

      setLoading(true);


      const result =
        await login(
          email.trim(),
          password
        );


      if (
        !result?.success ||
        !result?.token ||
        !result?.user
      ) {

        throw new Error(
          "Invalid login response."
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

        return;
      }


      if (
        result.user.role ===
        "agent"
      ) {

        navigate(
          "/agent",
          {
            replace: true,
          }
        );

        return;
      }


      setError(
        "Your account has an invalid role."
      );

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );


      if (
        err.response?.data?.message
      ) {

        setError(
          err.response.data.message
        );

      } else if (
        err.code ===
        "ERR_NETWORK"
      ) {

        setError(
          "Unable to connect to the FieldOps server."
        );

      } else {

        setError(
          "Login failed. Please try again."
        );

      }

    } finally {

      setLoading(false);

    }
  }


  return (

    <div className="login-page">

      {/* =========================================
          BRAND
      ========================================= */}

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
            RECOVERY OPERATIONS PLATFORM
          </div>


          <h1>
            Recover smarter.
          </h1>


          <p>
            Coordinate field recovery operations
            with live locations, intelligent
            assignment and verified field visits.
          </p>


          <div className="workflow">

            <div>
              <span>01</span>
              <p>Assign</p>
            </div>

            <div className="workflow-line" />

            <div>
              <span>02</span>
              <p>Navigate</p>
            </div>

            <div className="workflow-line" />

            <div>
              <span>03</span>
              <p>Check in</p>
            </div>

            <div className="workflow-line" />

            <div>
              <span>04</span>
              <p>Report</p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          LOGIN
      ========================================= */}

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
              SECURE SIGN IN
            </div>

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in using your registered
              email address and password.
            </p>

          </div>


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


          <form
            onSubmit={
              handleLogin
            }
          >

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


            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              disabled={loading}
              autoComplete="current-password"
            />


            <button
              className="primary-button"
              type="submit"
              disabled={loading}
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign in securely

                  <ArrowRight
                    size={18}
                  />
                </>
              )}

            </button>

          </form>


          <div className="login-security">

            <ShieldCheck
              size={16}
            />

            <span>
              Passwords are securely hashed
              before storage
            </span>

          </div>


          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
            }}
          >

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Create a new account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}


export default Login;