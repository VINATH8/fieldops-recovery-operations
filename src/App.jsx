import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


/* =========================================================
   PUBLIC PAGES
========================================================= */

import Login from "./pages/Login";
import Register from "./pages/Register";


/* =========================================================
   MANAGER PAGES
========================================================= */

import ManagerOverview from "./pages/manager/ManagerOverview";
import ManagerCases from "./pages/manager/ManagerCases";
import ManagerAgents from "./pages/manager/ManagerAgents";
import ManagerAssignments from "./pages/manager/ManagerAssignments";
import ManagerMessages from "./pages/manager/ManagerMessages";


/* =========================================================
   AGENT PAGES
========================================================= */

import AgentDashboard from "./pages/agent/AgentDashboard";
import AgentCases from "./pages/agent/AgentCases";
import AgentRoute from "./pages/agent/AgentRoute";
import AgentUpdates from "./pages/agent/AgentUpdates";
import AgentMessages from "./pages/agent/AgentMessages";


/* =========================================================
   AUTH
========================================================= */

import ProtectedRoute from "./components/auth/ProtectedRoute";


function App() {

  return (

    <Routes>


      {/* =====================================================
          DEFAULT
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />


      {/* =====================================================
          PUBLIC — LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={
          <Login />
        }
      />


      {/* =====================================================
          PUBLIC — REGISTER
          
          This restores the old:
          
          Login
             ↓
          Create a new account
             ↓
          /register
      ===================================================== */}

      <Route
        path="/register"
        element={
          <Register />
        }
      />


      {/* =====================================================
          MANAGER — OVERVIEW
      ===================================================== */}

      <Route
        path="/manager"
        element={
          <ProtectedRoute
            role="manager"
          >
            <ManagerOverview />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          MANAGER — RECOVERY CASES
      ===================================================== */}

      <Route
        path="/manager/cases"
        element={
          <ProtectedRoute
            role="manager"
          >
            <ManagerCases />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          MANAGER — FIELD AGENTS
      ===================================================== */}

      <Route
        path="/manager/agents"
        element={
          <ProtectedRoute
            role="manager"
          >
            <ManagerAgents />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          MANAGER — AGENT ASSIGNMENTS
      ===================================================== */}

      <Route
        path="/manager/assignments"
        element={
          <ProtectedRoute
            role="manager"
          >
            <ManagerAssignments />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          MANAGER — MESSAGES
          
          Reports intentionally removed.
      ===================================================== */}

      <Route
        path="/manager/messages"
        element={
          <ProtectedRoute
            role="manager"
          >
            <ManagerMessages />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AGENT — DASHBOARD
      ===================================================== */}

      <Route
        path="/agent"
        element={
          <ProtectedRoute
            role="agent"
          >
            <AgentDashboard />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AGENT — CASES
      ===================================================== */}

      <Route
        path="/agent/cases"
        element={
          <ProtectedRoute
            role="agent"
          >
            <AgentCases />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AGENT — ROUTE
      ===================================================== */}

      <Route
        path="/agent/route"
        element={
          <ProtectedRoute
            role="agent"
          >
            <AgentRoute />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AGENT — UPDATES
      ===================================================== */}

      <Route
        path="/agent/updates"
        element={
          <ProtectedRoute
            role="agent"
          >
            <AgentUpdates />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          AGENT — MESSAGES
      ===================================================== */}

      <Route
        path="/agent/messages"
        element={
          <ProtectedRoute
            role="agent"
          >
            <AgentMessages />
          </ProtectedRoute>
        }
      />


      {/* =====================================================
          UNKNOWN ROUTES
      ===================================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;