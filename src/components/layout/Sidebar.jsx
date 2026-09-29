import {
  LayoutDashboard,
  MapPin,
  Users,
  MessageCircle,
  UserRoundCog,
  ShieldCheck,
  Navigation,
  FileText,
  LogOut,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  getCurrentUser,
  logout,
} from "../../api/api";


function Sidebar({ role }) {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const user =
    getCurrentUser();


  /* =========================================================
     MANAGER NAVIGATION
  ========================================================= */

  const managerNavigation = [
    {
      label: "Overview",
      path: "/manager",
      icon: LayoutDashboard,
    },

    {
      label: "Recovery cases",
      path: "/manager/cases",
      icon: MapPin,
    },

    {
      label: "Field agents",
      path: "/manager/agents",
      icon: Users,
    },

    {
      label: "Agent assignments",
      path: "/manager/assignments",
      icon: UserRoundCog,
    },

    {
      label: "Messages",
      path: "/manager/messages",
      icon: MessageCircle,
    },
  ];


  /* =========================================================
     AGENT NAVIGATION
  ========================================================= */

  const agentNavigation = [
    {
      label: "Dashboard",
      path: "/agent",
      icon: LayoutDashboard,
    },

    {
      label: "My cases",
      path: "/agent/cases",
      icon: MapPin,
    },

    {
      label: "Route & map",
      path: "/agent/route",
      icon: Navigation,
    },

    {
      label: "Field updates",
      path: "/agent/updates",
      icon: FileText,
    },

    {
      label: "Messages",
      path: "/agent/messages",
      icon: MessageCircle,
    },
  ];


  const navigation =
    role === "manager"
      ? managerNavigation
      : agentNavigation;


  /* =========================================================
     ACTIVE LINK
  ========================================================= */

  function isActive(path) {

    if (
      path === "/manager" ||
      path === "/agent"
    ) {
      return (
        location.pathname ===
        path
      );
    }

    return location.pathname.startsWith(
      path
    );
  }


  /* =========================================================
     LOGOUT
  ========================================================= */

  function handleLogout() {

    logout();

    navigate(
      "/login",
      {
        replace: true,
      }
    );
  }


  /* =========================================================
     USER INITIALS
  ========================================================= */

  const initials =
    user?.name
      ? user.name
          .split(" ")
          .filter(Boolean)
          .map(
            (part) =>
              part[0]
          )
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : role === "manager"
        ? "M"
        : "AG";


  return (

    <aside className="app-sidebar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div className="sidebar-logo">

        <span className="sidebar-logo-icon">
          F
        </span>

        <span>
          fieldops
        </span>

      </div>


      {/* =====================================================
          WORKSPACE
      ===================================================== */}

      <div className="workspace-badge">

        <ShieldCheck
          size={16}
        />

        <span>
          {
            role === "manager"
              ? "Manager workspace"
              : "Agent workspace"
          }
        </span>

      </div>


      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="sidebar-navigation">

        {navigation.map(
          ({
            label,
            path,
            icon: Icon,
          }) => (

            <button
              key={path}
              type="button"
              className={
                isActive(path)
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() =>
                navigate(path)
              }
            >

              <Icon
                size={20}
              />

              <span>
                {label}
              </span>

              {isActive(path) && (

                <span className="sidebar-active-arrow">
                  ›
                </span>

              )}

            </button>

          )
        )}

      </nav>


      {/* =====================================================
          SIDEBAR BOTTOM
      ===================================================== */}

      <div className="sidebar-bottom">

        {/* LOCATION */}

        <div className="location-status">

          <div className="location-status-icon">

            <MapPin
              size={16}
            />

          </div>

          <div>

            <strong>
              Location-aware
            </strong>

            <span>
              Used only with consent
            </span>

          </div>

        </div>


        <div className="sidebar-divider" />


        {/* USER */}

        <div className="sidebar-user">

          <div className="sidebar-avatar">
            {initials}
          </div>

          <div className="sidebar-user-info">

            <strong>
              {
                user?.name ||
                (
                  role === "manager"
                    ? "Manager"
                    : "Field Agent"
                )
              }
            </strong>

            <span>
              {
                role === "manager"
                  ? "Operations Manager"
                  : "Field Agent"
              }
            </span>

          </div>


          <button
            type="button"
            className="logout-button"
            onClick={
              handleLogout
            }
            title="Sign out"
            aria-label="Sign out"
          >

            <LogOut
              size={17}
            />

          </button>

        </div>

      </div>

    </aside>
  );
}


export default Sidebar;