// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// function AppShell({
//   role,
//   title,
//   subtitle,
//   children,
// }) {
//   const [sidebarOpen, setSidebarOpen] =
//     useState(false);

//   return (
//     <div className="app-shell">

//       {/* Mobile overlay */}

//       {sidebarOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}


//       {/* Sidebar */}

//       <div
//         className={
//           sidebarOpen
//             ? "sidebar-wrapper open"
//             : "sidebar-wrapper"
//         }
//       >
//         <Sidebar role={role} />
//       </div>


//       {/* Main application */}

//       <main className="app-main">

//         <Topbar
//           role={role}
//           title={title}
//           subtitle={subtitle}
//           onMenuClick={() =>
//             setSidebarOpen(true)
//           }
//         />

//         <div className="app-content">
//           {children}
//         </div>

//       </main>

//     </div>
//   );
// }

// export default AppShell;

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import {
  updateAgentLocation,
} from "../../api/api";


function AppShell({
  role,
  title,
  subtitle,
  children,
}) {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  /* =========================================================
     LIVE AGENT LOCATION
     
     Whenever an agent enters the application:
     - Request browser location permission
     - Start watching GPS
     - Send location to backend
     - Keep sending updated positions
  ========================================================= */

  useEffect(() => {

    if (role !== "agent") {
      return undefined;
    }


    if (
      !navigator.geolocation
    ) {

      console.warn(
        "Geolocation is not supported by this browser."
      );

      return undefined;
    }


    let active = true;


    function handlePosition(
      position
    ) {

      if (!active) {
        return;
      }


      const latitude =
        Number(
          position.coords.latitude
        );

      const longitude =
        Number(
          position.coords.longitude
        );

      const accuracy =
        Number(
          position.coords.accuracy
        );


      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {

        return;
      }


      updateAgentLocation(
        latitude,
        longitude,
        Number.isFinite(accuracy)
          ? accuracy
          : null
      ).catch(
        (error) => {
          console.error(
            "Unable to update agent location:",
            error
          );
        }
      );
    }


    function handleError(
      error
    ) {

      console.warn(
        "Agent location error:",
        error.message
      );
    }


    /*
     * Request the current location immediately.
     * This triggers the browser permission dialog
     * when permission has not been granted yet.
     */

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );


    /*
     * Continue tracking movement.
     *
     * The browser decides when a new GPS position
     * is available and calls handlePosition.
     */

    const watchId =
      navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        }
      );


    return () => {

      active = false;

      navigator.geolocation.clearWatch(
        watchId
      );

    };

  }, [role]);


  return (
    <div className="app-shell">

      {sidebarOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}


      <div
        className={
          sidebarOpen
            ? "sidebar-wrapper open"
            : "sidebar-wrapper"
        }
      >

        <Sidebar
          role={role}
        />

      </div>


      <main className="app-main">

        <Topbar
          role={role}
          title={title}
          subtitle={subtitle}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        <div className="app-content">

          {children}

        </div>

      </main>

    </div>
  );
}


export default AppShell;