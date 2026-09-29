// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   Users,
//   ClipboardList,
//   MapPin,
//   Activity,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle2,
//   Clock3,
//   IndianRupee,
// } from "lucide-react";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   CircleMarker,
//   Tooltip,
//   useMap,
// } from "react-leaflet";

// import L from "leaflet";

// import AppShell from "../../components/layout/AppShell";

// import {
//   getManagerDashboard,
// } from "../../api/api";

// import "./ManagerOverview.css";


// /* =========================================================
//    LEAFLET ICONS
// ========================================================= */

// const agentIcon = new L.DivIcon({
//   className: "fieldops-agent-marker",

//   html: `
//     <div class="agent-marker">
//       <div class="agent-marker-pulse"></div>
//       <div class="agent-marker-core">
//         <span>●</span>
//       </div>
//     </div>
//   `,

//   iconSize: [42, 42],

//   iconAnchor: [21, 21],

//   popupAnchor: [0, -20],
// });


// /* =========================================================
//    MAP VIEW CONTROLLER
// ========================================================= */

// function MapController({
//   agents,
//   cases,
// }) {
//   const map = useMap();

//   useEffect(() => {

//     const coordinates = [
//       ...agents
//         .filter(
//           (agent) =>
//             typeof agent.latitude ===
//               "number" &&
//             typeof agent.longitude ===
//               "number"
//         )
//         .map(
//           (agent) => [
//             agent.latitude,
//             agent.longitude,
//           ]
//         ),

//       ...cases
//         .filter(
//           (recoveryCase) =>
//             typeof recoveryCase.latitude ===
//               "number" &&
//             typeof recoveryCase.longitude ===
//               "number"
//         )
//         .map(
//           (recoveryCase) => [
//             recoveryCase.latitude,
//             recoveryCase.longitude,
//           ]
//         ),
//     ];


//     if (!coordinates.length) {
//       return;
//     }


//     const bounds =
//       L.latLngBounds(
//         coordinates
//       );


//     map.fitBounds(
//       bounds,
//       {
//         padding: [45, 45],

//         maxZoom: 13,
//       }
//     );

//   }, [
//     agents,
//     cases,
//     map,
//   ]);


//   return null;
// }


// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// function ManagerOverview() {

//   const [
//     dashboard,
//     setDashboard,
//   ] = useState(null);


//   const [
//     loading,
//     setLoading,
//   ] = useState(true);


//   const [
//     error,
//     setError,
//   ] = useState("");


//   /* =======================================================
//      LOAD DASHBOARD
//   ======================================================= */

//   async function loadDashboard() {

//     try {

//       setLoading(true);

//       setError("");


//       const data =
//         await getManagerDashboard();


//       if (!data?.success) {

//         throw new Error(
//           data?.message ||
//           "Unable to load dashboard"
//         );

//       }


//       setDashboard(data);

//     } catch (err) {

//       console.error(
//         "Manager dashboard error:",
//         err
//       );


//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Unable to load manager dashboard."
//       );

//     } finally {

//       setLoading(false);

//     }
//   }


//   /* =======================================================
//      INITIAL LOAD
//   ======================================================= */

//   useEffect(() => {

//     loadDashboard();

//   }, []);


//   /* =======================================================
//      DATA
//   ======================================================= */

//   const metrics =
//     dashboard?.metrics || {};


//   const agents =
//     dashboard?.agents || [];


//   const cases =
//     dashboard?.cases || [];


//   const activity =
//     dashboard?.activity || [];


//   /* =======================================================
//      MAP CENTER
//   ======================================================= */

//   const mapCenter =
//     useMemo(() => {

//       const agent =
//         agents.find(
//           (item) =>
//             typeof item.latitude ===
//               "number" &&
//             typeof item.longitude ===
//               "number"
//         );


//       if (agent) {

//         return [
//           agent.latitude,
//           agent.longitude,
//         ];

//       }


//       const recoveryCase =
//         cases.find(
//           (item) =>
//             typeof item.latitude ===
//               "number" &&
//             typeof item.longitude ===
//               "number"
//         );


//       if (recoveryCase) {

//         return [
//           recoveryCase.latitude,
//           recoveryCase.longitude,
//         ];

//       }


//       // Bengaluru fallback
//       return [
//         12.9716,
//         77.5946,
//       ];

//     }, [
//       agents,
//       cases,
//     ]);


//   /* =======================================================
//      FORMAT MONEY
//   ======================================================= */

//   function formatMoney(
//     amount
//   ) {

//     return new Intl.NumberFormat(
//       "en-IN",
//       {
//         style: "currency",
//         currency: "INR",
//         maximumFractionDigits: 0,
//       }
//     ).format(
//       Number(amount || 0)
//     );

//   }


//   /* =======================================================
//      STATUS
//   ======================================================= */

//   function getCaseStatus(
//     status
//   ) {

//     switch (status) {

//       case "completed":
//         return "Completed";

//       case "in_progress":
//         return "In progress";

//       case "assigned":
//         return "Assigned";

//       default:
//         return "Pending";

//     }

//   }


//   return (
//     <AppShell
//       role="manager"
//       title="Recovery operations"
//       subtitle="Monitor cases, agents and field activity."
//     >

//       <div className="manager-dashboard">


//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <div className="section-page-header">

//           <div>

//             <div className="dashboard-eyebrow">
//               OPERATIONS CONTROL
//             </div>


//             <h2>
//               Field operations
//             </h2>


//             <p>
//               Live view of your recovery network,
//               cases and field agents.
//             </p>

//           </div>


//           <button
//             type="button"
//             className="outline-button"
//             onClick={loadDashboard}
//             disabled={loading}
//           >

//             <RefreshCw
//               size={15}
//               className={
//                 loading
//                   ? "spin"
//                   : ""
//               }
//             />

//             {loading
//               ? "Refreshing..."
//               : "Refresh"}

//           </button>

//         </div>


//         {/* =================================================
//             ERROR
//         ================================================= */}

//         {error && (

//           <div className="api-error">

//             <AlertCircle
//               size={18}
//             />

//             <span>
//               {error}
//             </span>

//             <button
//               onClick={loadDashboard}
//               type="button"
//             >
//               Retry
//             </button>

//           </div>

//         )}


//         {/* =================================================
//             METRICS
//         ================================================= */}

//         <div className="manager-metrics">


//           <Metric
//             icon={ClipboardList}
//             label="Open cases"
//             value={
//               metrics.openCases
//             }
//             tone="purple"
//           />


//           <Metric
//             icon={Users}
//             label="Available agents"
//             value={
//               metrics.availableAgents
//             }
//             tone="green"
//           />


//           <Metric
//             icon={MapPin}
//             label="Active agents"
//             value={
//               metrics.activeAgents
//             }
//             tone="orange"
//           />


//           <Metric
//             icon={CheckCircle2}
//             label="Completed today"
//             value={
//               metrics.completedToday
//             }
//             tone="blue"
//           />

//         </div>


//         {/* =================================================
//             MAP + CASE SUMMARY
//         ================================================= */}

//         <div className="manager-main-grid">


//           {/* =================================================
//               MAP
//           ================================================= */}

//           <section className="manager-map-card">

//             <div className="manager-card-heading">

//               <div>

//                 <div className="card-eyebrow">
//                   LIVE OPERATIONS
//                 </div>


//                 <h3>
//                   Field network
//                 </h3>


//                 <p className="card-subtitle">
//                   {agents.length} agents ·{" "}
//                   {cases.length} recovery cases
//                 </p>

//               </div>


//               <div className="live-pill">

//                 <span />

//                 Live data

//               </div>

//             </div>


//             <div className="manager-map">

//               <MapContainer
//                 center={mapCenter}
//                 zoom={12}
//                 scrollWheelZoom={true}
//                 className="operations-map"
//               >

//                 <TileLayer
//                   attribution='&copy; OpenStreetMap contributors'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />


//                 <MapController
//                   agents={agents}
//                   cases={cases}
//                 />


//                 {/* =========================================
//                     AGENTS
//                 ========================================= */}

//                 {agents
//                   .filter(
//                     (agent) =>
//                       typeof agent.latitude ===
//                         "number" &&
//                       typeof agent.longitude ===
//                         "number"
//                   )
//                   .map(
//                     (agent) => (

//                       <Marker
//                         key={
//                           agent.id
//                         }
//                         position={[
//                           agent.latitude,
//                           agent.longitude,
//                         ]}
//                         icon={
//                           agentIcon
//                         }
//                       >

//                         <Tooltip
//                           direction="top"
//                           offset={[
//                             0,
//                             -20,
//                           ]}
//                         >

//                           {agent.name}

//                         </Tooltip>


//                         <Popup>

//                           <div className="map-popup">

//                             <div className="popup-avatar">
//                               {agent.name
//                                 ?.charAt(
//                                   0
//                                 )
//                                 .toUpperCase()}
//                             </div>


//                             <div>

//                               <strong>
//                                 {agent.name}
//                               </strong>


//                               <span>
//                                 {agent.status ===
//                                 "available"
//                                   ? "Available"
//                                   : agent.status ===
//                                     "busy"
//                                   ? "Busy"
//                                   : agent.status}
//                               </span>

//                             </div>

//                           </div>


//                           <div className="popup-row">

//                             <span>
//                               Location
//                             </span>

//                             <strong>
//                               Consent given
//                             </strong>

//                           </div>


//                           <div className="popup-row">

//                             <span>
//                               Active cases
//                             </span>

//                             <strong>
//                               {agent.activeCaseCount ??
//                                 0}
//                             </strong>

//                           </div>

//                         </Popup>

//                       </Marker>

//                     )
//                   )}


//                 {/* =========================================
//                     RECOVERY CASES
//                 ========================================= */}

//                 {cases
//                   .filter(
//                     (recoveryCase) =>
//                       typeof recoveryCase.latitude ===
//                         "number" &&
//                       typeof recoveryCase.longitude ===
//                         "number"
//                   )
//                   .map(
//                     (recoveryCase) => {

//                       const isCompleted =
//                         recoveryCase.status ===
//                         "completed";


//                       const isActive =
//                         recoveryCase.status ===
//                           "assigned" ||
//                         recoveryCase.status ===
//                           "in_progress";


//                       return (

//                         <CircleMarker
//                           key={
//                             recoveryCase.id
//                           }
//                           center={[
//                             recoveryCase.latitude,
//                             recoveryCase.longitude,
//                           ]}
//                           radius={
//                             isCompleted
//                               ? 7
//                               : isActive
//                               ? 10
//                               : 9
//                           }
//                           pathOptions={{
//                             color:
//                               isCompleted
//                                 ? "#16a34a"
//                                 : isActive
//                                 ? "#7c3aed"
//                                 : "#ef4444",

//                             fillColor:
//                               isCompleted
//                                 ? "#22c55e"
//                                 : isActive
//                                 ? "#8b5cf6"
//                                 : "#f87171",

//                             fillOpacity:
//                               0.9,

//                             weight: 3,
//                           }}
//                         >

//                           <Popup>

//                             <div className="case-popup">

//                               <div className="case-popup-status">
//                                 {getCaseStatus(
//                                   recoveryCase.status
//                                 )}
//                               </div>


//                               <strong>
//                                 {
//                                   recoveryCase.caseNumber
//                                 }
//                               </strong>


//                               <span>
//                                 {
//                                   recoveryCase.customerName
//                                 }
//                               </span>


//                               <small>
//                                 {
//                                   recoveryCase.address
//                                 }
//                               </small>


//                               <div className="popup-amount">

//                                 <IndianRupee
//                                   size={14}
//                                 />

//                                 {formatMoney(
//                                   recoveryCase.amount
//                                 )}

//                               </div>

//                             </div>

//                           </Popup>

//                         </CircleMarker>

//                       );

//                     }
//                   )}

//               </MapContainer>


//               {/* MAP LEGEND */}

//               <div className="map-legend">

//                 <div>
//                   <span className="legend-agent" />
//                   Agent
//                 </div>


//                 <div>
//                   <span className="legend-case" />
//                   Recovery case
//                 </div>


//                 <div>
//                   <span className="legend-active" />
//                   Assigned
//                 </div>

//               </div>

//             </div>


//             <div className="map-footer">

//               <div>

//                 <span className="location-dot" />

//                 Real coordinates from API

//               </div>


//               <span>
//                 {agents.filter(
//                   (agent) =>
//                     typeof agent.latitude ===
//                       "number" &&
//                     typeof agent.longitude ===
//                       "number"
//                 ).length}{" "}
//                 locations
//               </span>

//             </div>

//           </section>


//           {/* =================================================
//               ACTIVITY
//           ================================================= */}

//           <section className="activity-card">

//             <div className="manager-card-heading">

//               <div>

//                 <div className="card-eyebrow">
//                   OPERATIONS FEED
//                 </div>


//                 <h3>
//                   Recent activity
//                 </h3>

//               </div>


//               <Activity
//                 size={19}
//               />

//             </div>


//             <div className="activity-list">

//               {activity.length === 0 ? (

//                 <div className="activity-empty">

//                   <Activity
//                     size={21}
//                   />


//                   <strong>
//                     No activity yet
//                   </strong>


//                   <span>
//                     Case assignments,
//                     check-ins and field
//                     events will appear here.
//                   </span>

//                 </div>

//               ) : (

//                 activity.map(
//                   (item) => (

//                     <div
//                       className="activity-item"
//                       key={
//                         item.id
//                       }
//                     >

//                       <div className="activity-icon">

//                         {item.type ===
//                         "case_completed" ? (

//                           <CheckCircle2
//                             size={16}
//                           />

//                         ) : item.type ===
//                           "case_check_in" ? (

//                           <MapPin
//                             size={16}
//                           />

//                         ) : (

//                           <Activity
//                             size={16}
//                           />

//                         )}

//                       </div>


//                       <div className="activity-content">

//                         <strong>
//                           {item.message}
//                         </strong>


//                         <span>

//                           {item.createdAt
//                             ? new Date(
//                                 item.createdAt
//                               ).toLocaleString(
//                                 "en-IN",
//                                 {
//                                   day: "2-digit",
//                                   month: "short",
//                                   hour: "2-digit",
//                                   minute: "2-digit",
//                                 }
//                               )
//                             : "Recently"}

//                         </span>

//                       </div>

//                     </div>

//                   )
//                 )

//               )}

//             </div>

//           </section>

//         </div>


//         {/* =================================================
//             CASE QUEUE
//         ================================================= */}

//         <section className="manager-case-card">

//           <div className="manager-card-heading">

//             <div>

//               <div className="card-eyebrow">
//                 RECOVERY QUEUE
//               </div>


//               <h3>
//                 Current recovery cases
//               </h3>

//             </div>


//             <span className="case-count">
//               {cases.length}
//             </span>

//           </div>


//           {cases.length === 0 ? (

//             <div className="empty-state">

//               <ClipboardList
//                 size={25}
//               />

//               <strong>
//                 No recovery cases
//               </strong>

//               <span>
//                 New cases created through the
//                 manager workspace will appear here.
//               </span>

//             </div>

//           ) : (

//             <div className="case-table-wrapper">

//               <table className="case-table">

//                 <thead>

//                   <tr>

//                     <th>
//                       Case
//                     </th>

//                     <th>
//                       Customer
//                     </th>

//                     <th>
//                       Amount
//                     </th>

//                     <th>
//                       Priority
//                     </th>

//                     <th>
//                       Agent
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody>

//                   {cases.map(
//                     (recoveryCase) => {

//                       const assignedAgent =
//                         agents.find(
//                           (agent) =>
//                             agent.id ===
//                             recoveryCase.assignedAgentId
//                         );


//                       return (

//                         <tr
//                           key={
//                             recoveryCase.id
//                           }
//                         >

//                           <td>

//                             <strong>
//                               {
//                                 recoveryCase.caseNumber
//                               }
//                             </strong>

//                           </td>


//                           <td>

//                             <div className="customer-cell">

//                               <strong>
//                                 {
//                                   recoveryCase.customerName
//                                 }
//                               </strong>

//                               <span>
//                                 {
//                                   recoveryCase.address
//                                 }
//                               </span>

//                             </div>

//                           </td>


//                           <td>

//                             <strong>
//                               {formatMoney(
//                                 recoveryCase.amount
//                               )}
//                             </strong>

//                           </td>


//                           <td>

//                             <span
//                               className={`priority-badge priority-${recoveryCase.priority}`}
//                             >

//                               {recoveryCase.priority ||
//                                 "medium"}

//                             </span>

//                           </td>


//                           <td>

//                             {assignedAgent ? (

//                               <div className="agent-cell">

//                                 <div className="mini-avatar">
//                                   {assignedAgent.name
//                                     ?.charAt(
//                                       0
//                                     )
//                                     .toUpperCase()}
//                                 </div>

//                                 <span>
//                                   {
//                                     assignedAgent.name
//                                   }
//                                 </span>

//                               </div>

//                             ) : (

//                               <span className="unassigned">
//                                 Awaiting assignment
//                               </span>

//                             )}

//                           </td>


//                           <td>

//                             <span
//                               className={`status-badge status-${recoveryCase.status}`}
//                             >

//                               <span />

//                               {getCaseStatus(
//                                 recoveryCase.status
//                               )}

//                             </span>

//                           </td>

//                         </tr>

//                       );

//                     }
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           )}

//         </section>


//         {/* =================================================
//             OPERATIONS SUMMARY
//         ================================================= */}

//         <section className="operations-summary">

//           <div className="summary-item">

//             <Clock3
//               size={18}
//             />

//             <div>

//               <span>
//                 Awaiting assignment
//               </span>

//               <strong>
//                 {metrics.awaitingAssignment ??
//                   0}
//               </strong>

//             </div>

//           </div>


//           <div className="summary-item">

//             <IndianRupee
//               size={18}
//             />

//             <div>

//               <span>
//                 Outstanding recovery
//               </span>

//               <strong>
//                 {formatMoney(
//                   metrics.totalOutstanding
//                 )}
//               </strong>

//             </div>

//           </div>


//           <div className="summary-item">

//             <CheckCircle2
//               size={18}
//             />

//             <div>

//               <span>
//                 Completed today
//               </span>

//               <strong>
//                 {metrics.completedToday ??
//                   0}
//               </strong>

//             </div>

//           </div>

//         </section>

//       </div>

//     </AppShell>
//   );
// }


// /* =========================================================
//    METRIC COMPONENT
// ========================================================= */

// function Metric({
//   icon: Icon,
//   label,
//   value,
//   tone = "purple",
// }) {

//   return (

//     <div
//       className={`manager-metric metric-${tone}`}
//     >

//       <div className="manager-metric-icon">

//         <Icon
//           size={19}
//         />

//       </div>


//       <div>

//         <span>
//           {label}
//         </span>

//         <strong>
//           {value ?? "0"}
//         </strong>

//       </div>

//     </div>

//   );
// }


// export default ManagerOverview;

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MapPin,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  IndianRupee,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import AppShell from "../../components/layout/AppShell";

import {
  getManagerDashboard,
} from "../../api/api";

import "./ManagerOverview.css";


/* =========================================================
   LIVE AGENT ICON
========================================================= */

const agentIcon =
  new L.DivIcon({

    className:
      "fieldops-agent-marker",

    html: `
      <div class="agent-marker">
        <div class="agent-marker-pulse"></div>

        <div class="agent-marker-core">
          <span>●</span>
        </div>
      </div>
    `,

    iconSize: [
      42,
      42,
    ],

    iconAnchor: [
      21,
      21,
    ],

    popupAnchor: [
      0,
      -20,
    ],

  });


/* =========================================================
   MAP VIEW CONTROLLER

   Only changes the map view when the available
   coordinate set changes meaningfully.

   It does NOT constantly zoom/recenter every
   three seconds.
========================================================= */

function MapController({
  agents,
  cases,
}) {

  const map =
    useMap();


  const coordinateKey =
    useMemo(
      () =>
        [
          ...agents
            .filter(
              (agent) =>
                typeof agent.latitude ===
                  "number" &&
                typeof agent.longitude ===
                  "number"
            )
            .map(
              (agent) =>
                `${agent.id}:${agent.latitude}:${agent.longitude}`
            ),

          ...cases
            .filter(
              (recoveryCase) =>
                typeof recoveryCase.latitude ===
                  "number" &&
                typeof recoveryCase.longitude ===
                  "number"
            )
            .map(
              (recoveryCase) =>
                `${recoveryCase.id}:${recoveryCase.latitude}:${recoveryCase.longitude}`
            ),
        ]
          .join("|"),
      [agents, cases]
    );


  useEffect(() => {

    const coordinates = [

      ...agents
        .filter(
          (agent) =>
            typeof agent.latitude ===
              "number" &&
            typeof agent.longitude ===
              "number"
        )
        .map(
          (agent) => [
            agent.latitude,
            agent.longitude,
          ]
        ),

      ...cases
        .filter(
          (recoveryCase) =>
            typeof recoveryCase.latitude ===
              "number" &&
            typeof recoveryCase.longitude ===
              "number"
        )
        .map(
          (recoveryCase) => [
            recoveryCase.latitude,
            recoveryCase.longitude,
          ]
        ),

    ];


    if (
      !coordinates.length
    ) {
      return;
    }


    /*
     * Only fit the map when it has not
     * been initialized around real data yet.
     */

    if (
      !map.__fieldopsHasInitialBounds
    ) {

      const bounds =
        L.latLngBounds(
          coordinates
        );


      map.fitBounds(
        bounds,
        {
          padding: [
            45,
            45,
          ],

          maxZoom: 13,
        }
      );


      map.__fieldopsHasInitialBounds =
        true;
    }

  }, [
    coordinateKey,
    agents,
    cases,
    map,
  ]);


  return null;
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

function ManagerOverview() {

  const [
    dashboard,
    setDashboard,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    refreshing,
    setRefreshing,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState("");


  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  async function loadDashboard(
    initial = false
  ) {

    try {

      if (initial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }


      setError("");


      const data =
        await getManagerDashboard();


      if (
        !data?.success
      ) {

        throw new Error(
          data?.message ||
          "Unable to load dashboard."
        );

      }


      setDashboard(
        data
      );

    } catch (err) {

      console.error(
        "Manager dashboard error:",
        err
      );


      /*
       * Do not destroy existing map data
       * just because one polling request failed.
       */

      if (!dashboard) {

        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to load manager dashboard."
        );

      }

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  }


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {

    loadDashboard(true);

  }, []);


  /* =======================================================
     REAL-TIME POLLING
     
     Every 3 seconds the manager asks the API
     for the newest agent coordinates.
  ======================================================= */

  useEffect(() => {

    const interval =
      window.setInterval(
        () => {
          loadDashboard(false);
        },
        3000
      );


    return () => {

      window.clearInterval(
        interval
      );

    };

  }, []);


  /* =======================================================
     DATA
  ======================================================= */

  const agents =
    dashboard?.agents || [];


  const cases =
    dashboard?.cases || [];


  const activity =
    dashboard?.activity || [];


  /* =======================================================
     AGENTS WITH REAL LOCATION
  ======================================================= */

  const locatedAgents =
    agents.filter(
      (agent) =>
        typeof agent.latitude ===
          "number" &&
        typeof agent.longitude ===
          "number"
    );


  /* =======================================================
     MAP CENTER
  ======================================================= */

  const mapCenter =
    useMemo(() => {

      const agent =
        agents.find(
          (item) =>
            typeof item.latitude ===
              "number" &&
            typeof item.longitude ===
              "number"
        );


      if (agent) {

        return [
          agent.latitude,
          agent.longitude,
        ];

      }


      const recoveryCase =
        cases.find(
          (item) =>
            typeof item.latitude ===
              "number" &&
            typeof item.longitude ===
              "number"
        );


      if (recoveryCase) {

        return [
          recoveryCase.latitude,
          recoveryCase.longitude,
        ];

      }


      /*
       * Only a visual fallback when there are
       * no real coordinates available yet.
       */

      return [
        12.9716,
        77.5946,
      ];

    }, [
      agents,
      cases,
    ]);


  /* =======================================================
     MONEY
  ======================================================= */

  function formatMoney(
    amount
  ) {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style:
          "currency",

        currency:
          "INR",

        maximumFractionDigits:
          0,
      }
    ).format(
      Number(
        amount || 0
      )
    );

  }


  /* =======================================================
     CASE STATUS
  ======================================================= */

  function getCaseStatus(
    status
  ) {

    switch (
      status
    ) {

      case "completed":
        return "Completed";

      case "in_progress":
        return "In progress";

      case "assigned":
        return "Assigned";

      case "checked_in":
        return "Checked in";

      default:
        return "Pending";

    }

  }


  /* =======================================================
     LOCATION TIME
  ======================================================= */

  function getLocationTime(
    agent
  ) {

    if (
      !agent.lastLocationAt
    ) {

      return "Waiting for location";

    }


    const date =
      new Date(
        agent.lastLocationAt
      );


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return "Location available";

    }


    return date.toLocaleTimeString(
      "en-IN",
      {
        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",
      }
    );

  }


  return (
    <AppShell
      role="manager"
      title="Recovery operations"
      subtitle="Monitor cases, agents and field activity."
    >

      <div className="manager-dashboard">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              OPERATIONS CONTROL
            </div>


            <h2>
              Field operations
            </h2>


            <p>
              Live view of your recovery network,
              cases and field agents.
            </p>

          </div>


          <button
            type="button"
            className="outline-button"
            onClick={() =>
              loadDashboard(false)
            }
            disabled={
              refreshing
            }
          >

            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="api-error">

            <AlertCircle
              size={18}
            />

            <span>
              {error}
            </span>


            <button
              onClick={() =>
                loadDashboard(false)
              }
              type="button"
            >
              Retry
            </button>

          </div>

        )}


        {/* =================================================
            INITIAL LOADING
        ================================================= */}

        {loading && !dashboard ? (

          <div className="page-state">

            <RefreshCw
              size={22}
              className="spin"
            />

            <strong>
              Loading live operations...
            </strong>

            <span>
              Connecting to the FieldOps API.
            </span>

          </div>

        ) : (

          <>


            {/* =============================================
                MAP + ACTIVITY
            ============================================= */}

            <div className="manager-main-grid">


              {/* ===========================================
                  FIELD NETWORK MAP
              =========================================== */}

              <section
                className="manager-map-card"
              >

                <div
                  className="manager-card-heading"
                >

                  <div>

                    <div className="card-eyebrow">
                      LIVE OPERATIONS
                    </div>


                    <h3>
                      Field network
                    </h3>


                    <p className="card-subtitle">

                      {agents.length}{" "}
                      agents ·{" "}
                      {cases.length}{" "}
                      recovery cases

                    </p>

                  </div>


                  <div
                    className="live-pill"
                  >

                    <span />

                    Live tracking

                  </div>

                </div>


                {/* =======================================
                    LOCATION STATUS BAR
                ======================================= */}

                <div className="live-location-status">

                  <div>

                    <span className="location-dot" />

                    <strong>
                      {locatedAgents.length}
                    </strong>

                    <span>
                      agents sharing live location
                    </span>

                  </div>


                  <span>
                    Updates every 3 seconds
                  </span>

                </div>


                {/* =======================================
                    MAP
                ======================================= */}

                <div
                  className="manager-map"
                >

                  <MapContainer
                    center={
                      mapCenter
                    }
                    zoom={12}
                    scrollWheelZoom={
                      true
                    }
                    className="operations-map"
                  >

                    <TileLayer
                      attribution="&copy; OpenStreetMap contributors"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    <MapController
                      agents={
                        agents
                      }
                      cases={
                        cases
                      }
                    />


                    {/* =================================
                        LIVE AGENT MARKERS
                    ================================= */}

                    {agents
                      .filter(
                        (agent) =>
                          typeof agent.latitude ===
                            "number" &&
                          typeof agent.longitude ===
                            "number"
                      )
                      .map(
                        (agent) => (

                          <Marker
                            key={
                              agent.id
                            }
                            position={[
                              agent.latitude,
                              agent.longitude,
                            ]}
                            icon={
                              agentIcon
                            }
                          >

                            <Tooltip
                              direction="top"
                              offset={[
                                0,
                                -20,
                              ]}
                            >

                              {agent.name}

                            </Tooltip>


                            <Popup>

                              <div
                                className="map-popup"
                              >

                                <div
                                  className="popup-avatar"
                                >
                                  {agent.name
                                    ?.charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>


                                <div>

                                  <strong>
                                    {agent.name}
                                  </strong>


                                  <span>

                                    {agent.status ===
                                    "available"
                                      ? "Available"
                                      : agent.status ===
                                        "busy"
                                      ? "Busy"
                                      : agent.status ||
                                        "Status unavailable"}

                                  </span>


                                  <small>

                                    GPS updated{" "}
                                    {getLocationTime(
                                      agent
                                    )}

                                  </small>


                                  <small>

                                    Accuracy:{" "}
                                    {agent.accuracy
                                      ? `${Math.round(
                                          agent.accuracy
                                        )} m`
                                      : "Not reported"}

                                  </small>

                                </div>

                              </div>

                            </Popup>

                          </Marker>

                        )
                      )}


                    {/* =================================
                        RECOVERY CASE MARKERS
                    ================================= */}

                    {cases
                      .filter(
                        (recoveryCase) =>
                          typeof recoveryCase.latitude ===
                            "number" &&
                          typeof recoveryCase.longitude ===
                            "number"
                      )
                      .map(
                        (
                          recoveryCase
                        ) => (

                          <CircleMarker
                            key={
                              recoveryCase.id
                            }
                            center={[
                              recoveryCase.latitude,
                              recoveryCase.longitude,
                            ]}
                            radius={9}
                            pathOptions={{
                              className:
                                recoveryCase.assignedAgentId
                                  ? "assigned-case-marker"
                                  : "recovery-case-marker",
                            }}
                          >

                            <Tooltip>

                              {recoveryCase.caseNumber}

                            </Tooltip>


                            <Popup>

                              <div
                                className="map-popup"
                              >

                                <div
                                  className="popup-avatar"
                                >

                                  <IndianRupee
                                    size={16}
                                  />

                                </div>


                                <div>

                                  <strong>
                                    {
                                      recoveryCase.caseNumber
                                    }
                                  </strong>


                                  <span>
                                    {
                                      recoveryCase.customerName
                                    }
                                  </span>


                                  <small>
                                    {
                                      recoveryCase.address
                                    }
                                  </small>


                                  <small>
                                    Status:{" "}
                                    {
                                      getCaseStatus(
                                        recoveryCase.status
                                      )
                                    }
                                  </small>


                                  <div
                                    className="popup-amount"
                                  >

                                    <IndianRupee
                                      size={14}
                                    />

                                    {formatMoney(
                                      recoveryCase.amount
                                    )}

                                  </div>

                                </div>

                              </div>

                            </Popup>

                          </CircleMarker>

                        )
                      )}

                  </MapContainer>


                  {/* =====================================
                      MAP LEGEND
                  ===================================== */}

                  <div
                    className="map-legend"
                  >

                    <div>

                      <span
                        className="legend-agent"
                      />

                      Agent

                    </div>


                    <div>

                      <span
                        className="legend-case"
                      />

                      Recovery case

                    </div>


                    <div>

                      <span
                        className="legend-active"
                      />

                      Assigned

                    </div>

                  </div>

                </div>


                {/* =======================================
                    MAP FOOTER
                ======================================= */}

                <div
                  className="map-footer"
                >

                  <div>

                    <span
                      className="location-dot"
                    />

                    Real GPS coordinates from agents

                  </div>


                  <span>

                    {locatedAgents.length}{" "}
                    live locations

                  </span>

                </div>

              </section>


              {/* ===========================================
                  ACTIVITY
              =========================================== */}

              <section
                className="activity-card"
              >

                <div
                  className="manager-card-heading"
                >

                  <div>

                    <div className="card-eyebrow">
                      OPERATIONS FEED
                    </div>


                    <h3>
                      Recent activity
                    </h3>

                  </div>


                  <Activity
                    size={19}
                  />

                </div>


                <div
                  className="activity-list"
                >

                  {activity.length ===
                  0 ? (

                    <div
                      className="activity-empty"
                    >

                      <Activity
                        size={21}
                      />


                      <strong>
                        No activity yet
                      </strong>


                      <span>
                        Location updates,
                        assignments,
                        check-ins and field
                        events will appear here.
                      </span>

                    </div>

                  ) : (

                    activity.map(
                      (item) => (

                        <div
                          className="activity-item"
                          key={
                            item.id
                          }
                        >

                          <div
                            className="activity-icon"
                          >

                            {item.type ===
                            "case_completed" ? (

                              <CheckCircle2
                                size={16}
                              />

                            ) : item.type ===
                              "case_check_in" ||
                              item.type ===
                                "location_shared" ? (

                              <MapPin
                                size={16}
                              />

                            ) : (

                              <Activity
                                size={16}
                              />

                            )}

                          </div>


                          <div
                            className="activity-content"
                          >

                            <strong>
                              {item.message}
                            </strong>


                            <span>

                              {item.createdAt
                                ? new Date(
                                    item.createdAt
                                  ).toLocaleString(
                                    "en-IN",
                                    {
                                      day:
                                        "2-digit",

                                      month:
                                        "short",

                                      hour:
                                        "2-digit",

                                      minute:
                                        "2-digit",
                                    }
                                  )
                                : "Recently"}

                            </span>

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

              </section>

            </div>


            {/* =============================================
                LIVE AGENT STATUS
            ============================================= */}

            <section
              className="live-agents-strip"
            >

              <div
                className="live-agents-strip-header"
              >

                <div>

                  <div className="card-eyebrow">
                    FIELD FORCE
                  </div>

                  <h3>
                    Live agent locations
                  </h3>

                </div>


                <span>
                  {locatedAgents.length}/
                  {agents.length}{" "}
                  reporting GPS
                </span>

              </div>


              <div
                className="live-agents-list"
              >

                {agents.length ===
                0 ? (

                  <div
                    className="activity-empty"
                  >
                    No field agents registered.
                  </div>

                ) : (

                  agents.map(
                    (agent) => {

                      const hasLocation =
                        typeof agent.latitude ===
                          "number" &&
                        typeof agent.longitude ===
                          "number";


                      return (

                        <div
                          className="live-agent-row"
                          key={
                            agent.id
                          }
                        >

                          <div
                            className="live-agent-avatar"
                          >

                            {agent.name
                              ?.slice(
                                0,
                                2
                              )
                              .toUpperCase() ||
                              "AG"}

                          </div>


                          <div
                            className="live-agent-info"
                          >

                            <strong>
                              {agent.name ||
                                agent.email}
                            </strong>


                            <span>
                              {agent.status ||
                                "Status unavailable"}
                            </span>

                          </div>


                          <div
                            className={
                              hasLocation
                                ? "live-agent-location active"
                                : "live-agent-location"
                            }
                          >

                            <span />

                            {hasLocation
                              ? `GPS live · ${getLocationTime(
                                  agent
                                )}`
                              : "Waiting for GPS"}

                          </div>

                        </div>

                      );

                    }
                  )

                )}

              </div>

            </section>

          </>

        )}

      </div>

    </AppShell>
  );
}


export default ManagerOverview;