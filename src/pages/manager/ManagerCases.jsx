// // // // import { useEffect, useState } from "react";

// // // // import {
// // // //   ClipboardList,
// // // //   RefreshCw,
// // // //   MapPin,
// // // //   UserCheck,
// // // //   Navigation,
// // // //   X,
// // // //   AlertCircle,
// // // //   FileImage,
// // // //   FileText,
// // // //   CheckCircle2,
// // // //   Clock3,
// // // //   Eye,
// // // // } from "lucide-react";

// // // // import AppShell from "../../components/layout/AppShell";

// // // // import {
// // // //   getRecoveryCases,
// // // //   findNearestAgent,
// // // //   assignNearestAgent,
// // // //   unassignCase,
// // // // } from "../../api/api";


// // // // function ManagerCases() {
// // // //   const [cases, setCases] = useState([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   const [error, setError] = useState("");

// // // //   const [assigningCase, setAssigningCase] =
// // // //     useState(null);

// // // //   const [nearest, setNearest] =
// // // //     useState(null);

// // // //   const [reviewCase, setReviewCase] =
// // // //     useState(null);

// // // //   const [actionLoading, setActionLoading] =
// // // //     useState(false);


// // // //   async function loadCases() {
// // // //     try {
// // // //       setLoading(true);
// // // //       setError("");

// // // //       const data =
// // // //         await getRecoveryCases();

// // // //       const result =
// // // //         Array.isArray(data)
// // // //           ? data
// // // //           : data.cases || [];

// // // //       setCases(result);
// // // //     } catch (err) {
// // // //       console.error(err);

// // // //       setError(
// // // //         err.response?.data?.message ||
// // // //         "Unable to load recovery cases."
// // // //       );
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }


// // // //   useEffect(() => {
// // // //     loadCases();
// // // //   }, []);


// // // //   async function handleFindNearest(item) {
// // // //     try {
// // // //       setAssigningCase(item);
// // // //       setNearest(null);
// // // //       setError("");

// // // //       const result =
// // // //         await findNearestAgent(item.id);

// // // //       setNearest(result);
// // // //     } catch (err) {
// // // //       console.error(err);

// // // //       setError(
// // // //         err.response?.data?.message ||
// // // //         "Unable to find a nearby agent."
// // // //       );
// // // //     }
// // // //   }


// // // //   async function handleAssignNearest() {
// // // //     if (!assigningCase) {
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setActionLoading(true);
// // // //       setError("");

// // // //       await assignNearestAgent(
// // // //         assigningCase.id
// // // //       );

// // // //       setAssigningCase(null);
// // // //       setNearest(null);

// // // //       await loadCases();
// // // //     } catch (err) {
// // // //       console.error(err);

// // // //       setError(
// // // //         err.response?.data?.message ||
// // // //         "Unable to assign the nearest agent."
// // // //       );
// // // //     } finally {
// // // //       setActionLoading(false);
// // // //     }
// // // //   }


// // // //   async function handleUnassign(caseId) {
// // // //     try {
// // // //       setActionLoading(true);
// // // //       setError("");

// // // //       await unassignCase(caseId);

// // // //       await loadCases();
// // // //     } catch (err) {
// // // //       console.error(err);

// // // //       setError(
// // // //         err.response?.data?.message ||
// // // //         "Unable to unassign case."
// // // //       );
// // // //     } finally {
// // // //       setActionLoading(false);
// // // //     }
// // // //   }


// // // //   function formatDistance(distance) {
// // // //     if (
// // // //       distance === null ||
// // // //       distance === undefined
// // // //     ) {
// // // //       return "—";
// // // //     }

// // // //     if (distance < 1000) {
// // // //       return `${Math.round(distance)} m`;
// // // //     }

// // // //     return `${(
// // // //       distance / 1000
// // // //     ).toFixed(1)} km`;
// // // //   }


// // // //   return (
// // // //     <AppShell
// // // //       role="manager"
// // // //       title="Recovery cases"
// // // //       subtitle="Monitor, assign and review field recovery cases."
// // // //     >

// // // //       <div className="manager-page">

// // // //         <div className="section-page-header">

// // // //           <div>
// // // //             <div className="dashboard-eyebrow">
// // // //               CASE MANAGEMENT
// // // //             </div>

// // // //             <h2>
// // // //               Recovery cases
// // // //             </h2>

// // // //             <p>
// // // //               Assign agents and review recovery activity.
// // // //             </p>
// // // //           </div>


// // // //           <button
// // // //             className="outline-button"
// // // //             type="button"
// // // //             onClick={loadCases}
// // // //             disabled={loading}
// // // //           >
// // // //             <RefreshCw
// // // //               size={15}
// // // //               className={
// // // //                 loading ? "spin" : ""
// // // //               }
// // // //             />

// // // //             Refresh
// // // //           </button>

// // // //         </div>


// // // //         {error && (
// // // //           <div className="api-error">
// // // //             <AlertCircle size={18} />

// // // //             <span>
// // // //               {error}
// // // //             </span>
// // // //           </div>
// // // //         )}


// // // //         <div className="manager-table-card">

// // // //           {loading ? (

// // // //             <div className="page-state">

// // // //               <RefreshCw
// // // //                 size={22}
// // // //                 className="spin"
// // // //               />

// // // //               <strong>
// // // //                 Loading recovery cases...
// // // //               </strong>

// // // //             </div>

// // // //           ) : cases.length === 0 ? (

// // // //             <div className="page-state">

// // // //               <div className="page-state-icon">
// // // //                 <ClipboardList size={22} />
// // // //               </div>

// // // //               <strong>
// // // //                 No recovery cases
// // // //               </strong>

// // // //               <span>
// // // //                 No cases are currently available.
// // // //               </span>

// // // //             </div>

// // // //           ) : (

// // // //             <div className="case-table-wrapper">

// // // //               <table className="case-table">

// // // //                 <thead>
// // // //                   <tr>
// // // //                     <th>Case</th>
// // // //                     <th>Customer</th>
// // // //                     <th>Location</th>
// // // //                     <th>Priority</th>
// // // //                     <th>Status</th>
// // // //                     <th>Agent</th>
// // // //                     <th>Actions</th>
// // // //                   </tr>
// // // //                 </thead>


// // // //                 <tbody>

// // // //                   {cases.map((item) => (

// // // //                     <tr key={item.id}>

// // // //                       <td>
// // // //                         <strong>
// // // //                           {item.caseNumber ||
// // // //                             item.id}
// // // //                         </strong>
// // // //                       </td>


// // // //                       <td>
// // // //                         {item.customerName ||
// // // //                           "—"}
// // // //                       </td>


// // // //                       <td>
// // // //                         <div className="case-location-cell">

// // // //                           <MapPin size={14} />

// // // //                           <span>
// // // //                             {item.address ||
// // // //                               "Location unavailable"}
// // // //                           </span>

// // // //                         </div>
// // // //                       </td>


// // // //                       <td>
// // // //                         <span
// // // //                           className={`case-priority ${
// // // //                             item.priority ||
// // // //                             "medium"
// // // //                           }`}
// // // //                         >
// // // //                           {item.priority ||
// // // //                             "medium"}
// // // //                         </span>
// // // //                       </td>


// // // //                       <td>
// // // //                         <span
// // // //                           className={`case-status ${
// // // //                             item.status ||
// // // //                             "pending"
// // // //                           }`}
// // // //                         >
// // // //                           {item.status ||
// // // //                             "pending"}
// // // //                         </span>
// // // //                       </td>


// // // //                       <td>

// // // //                         {item.assignedAgent ? (

// // // //                           <div className="assigned-agent-cell">

// // // //                             <UserCheck size={15} />

// // // //                             <div>

// // // //                               <strong>
// // // //                                 {
// // // //                                   item
// // // //                                     .assignedAgent
// // // //                                     .name
// // // //                                 }
// // // //                               </strong>

// // // //                               <span>
// // // //                                 Assigned
// // // //                               </span>

// // // //                             </div>

// // // //                           </div>

// // // //                         ) : (

// // // //                           <span className="unassigned-label">
// // // //                             Unassigned
// // // //                           </span>

// // // //                         )}

// // // //                       </td>


// // // //                       <td>

// // // //                         <div className="case-action-group">

// // // //                           <button
// // // //                             type="button"
// // // //                             className="outline-small-button"
// // // //                             onClick={() =>
// // // //                               setReviewCase(item)
// // // //                             }
// // // //                           >

// // // //                             <Eye size={14} />

// // // //                             Review

// // // //                           </button>


// // // //                           {!item.assignedAgentId ? (

// // // //                             <button
// // // //                               type="button"
// // // //                               className="primary-small-button"
// // // //                               onClick={() =>
// // // //                                 handleFindNearest(item)
// // // //                               }
// // // //                             >

// // // //                               <Navigation size={14} />

// // // //                               Assign nearest

// // // //                             </button>

// // // //                           ) : (

// // // //                             <button
// // // //                               type="button"
// // // //                               className="outline-small-button"
// // // //                               onClick={() =>
// // // //                                 handleUnassign(item.id)
// // // //                               }
// // // //                               disabled={
// // // //                                 actionLoading
// // // //                               }
// // // //                             >

// // // //                               <X size={14} />

// // // //                               Unassign

// // // //                             </button>

// // // //                           )}

// // // //                         </div>

// // // //                       </td>

// // // //                     </tr>

// // // //                   ))}

// // // //                 </tbody>

// // // //               </table>

// // // //             </div>

// // // //           )}

// // // //         </div>

// // // //       </div>


// // // //       {/* =================================================
// // // //           ASSIGNMENT MODAL
// // // //       ================================================= */}

// // // //       {assigningCase && (

// // // //         <div
// // // //           className="assignment-overlay"
// // // //           onClick={() => {
// // // //             if (!actionLoading) {
// // // //               setAssigningCase(null);
// // // //               setNearest(null);
// // // //             }
// // // //           }}
// // // //         >

// // // //           <div
// // // //             className="assignment-modal"
// // // //             onClick={(event) =>
// // // //               event.stopPropagation()
// // // //             }
// // // //           >

// // // //             <div className="assignment-modal-header">

// // // //               <div>

// // // //                 <div className="dashboard-eyebrow">
// // // //                   SMART ASSIGNMENT
// // // //                 </div>

// // // //                 <h3>
// // // //                   Find nearest agent
// // // //                 </h3>

// // // //                 <p>
// // // //                   {assigningCase.caseNumber ||
// // // //                     assigningCase.id}
// // // //                   {" · "}
// // // //                   {assigningCase.customerName}
// // // //                 </p>

// // // //               </div>


// // // //               <button
// // // //                 type="button"
// // // //                 className="modal-close"
// // // //                 onClick={() => {
// // // //                   setAssigningCase(null);
// // // //                   setNearest(null);
// // // //                 }}
// // // //               >
// // // //                 <X size={19} />
// // // //               </button>

// // // //             </div>


// // // //             {!nearest ? (

// // // //               <div className="assignment-loading">

// // // //                 <Navigation size={28} />

// // // //                 <strong>
// // // //                   Finding nearest available agent...
// // // //                 </strong>

// // // //                 <span>
// // // //                   Checking consented live locations.
// // // //                 </span>

// // // //               </div>

// // // //             ) : (

// // // //               <>

// // // //                 <div className="nearest-agent-card">

// // // //                   <div className="nearest-agent-icon">
// // // //                     <UserCheck size={22} />
// // // //                   </div>


// // // //                   <div className="nearest-agent-info">

// // // //                     <span>
// // // //                       NEAREST AVAILABLE AGENT
// // // //                     </span>

// // // //                     <strong>
// // // //                       {nearest.agent?.name ||
// // // //                         nearest.assignment?.agentName ||
// // // //                         "Agent"}
// // // //                     </strong>

// // // //                     <small>
// // // //                       Available
// // // //                     </small>

// // // //                   </div>


// // // //                   <div className="nearest-distance">

// // // //                     <Navigation size={17} />

// // // //                     <strong>
// // // //                       {formatDistance(
// // // //                         nearest.distance
// // // //                       )}
// // // //                     </strong>

// // // //                     <span>
// // // //                       from case
// // // //                     </span>

// // // //                   </div>

// // // //                 </div>


// // // //                 <div className="assignment-modal-actions">

// // // //                   <button
// // // //                     type="button"
// // // //                     className="outline-button"
// // // //                     onClick={() => {
// // // //                       setAssigningCase(null);
// // // //                       setNearest(null);
// // // //                     }}
// // // //                     disabled={actionLoading}
// // // //                   >
// // // //                     Cancel
// // // //                   </button>


// // // //                   <button
// // // //                     type="button"
// // // //                     className="primary-small-button"
// // // //                     onClick={
// // // //                       handleAssignNearest
// // // //                     }
// // // //                     disabled={actionLoading}
// // // //                   >

// // // //                     <UserCheck size={16} />

// // // //                     {actionLoading
// // // //                       ? "Assigning..."
// // // //                       : "Assign nearest agent"}

// // // //                   </button>

// // // //                 </div>

// // // //               </>

// // // //             )}

// // // //           </div>

// // // //         </div>

// // // //       )}


// // // //       {/* =================================================
// // // //           CASE REVIEW MODAL
// // // //       ================================================= */}

// // // //       {reviewCase && (

// // // //         <CaseReviewModal
// // // //           caseData={reviewCase}
// // // //           onClose={() =>
// // // //             setReviewCase(null)
// // // //           }
// // // //         />

// // // //       )}

// // // //     </AppShell>
// // // //   );
// // // // }


// // // // /* =========================================================
// // // //    CASE REVIEW
// // // // ========================================================= */

// // // // function CaseReviewModal({
// // // //   caseData,
// // // //   onClose,
// // // // }) {

// // // //   const evidence =
// // // //     caseData.evidence ||
// // // //     [];

// // // //   const updates =
// // // //     caseData.updates ||
// // // //     caseData.fieldUpdates ||
// // // //     [];

// // // //   const assignedAgent =
// // // //     caseData.assignedAgent;


// // // //   return (

// // // //     <div
// // // //       className="assignment-overlay"
// // // //       onClick={onClose}
// // // //     >

// // // //       <div
// // // //         className="case-review-modal"
// // // //         onClick={(event) =>
// // // //           event.stopPropagation()
// // // //         }
// // // //       >

// // // //         <div className="case-review-header">

// // // //           <div>

// // // //             <div className="dashboard-eyebrow">
// // // //               CASE REVIEW
// // // //             </div>

// // // //             <h3>
// // // //               {caseData.caseNumber ||
// // // //                 caseData.id}
// // // //             </h3>

// // // //             <p>
// // // //               {caseData.customerName ||
// // // //                 "Recovery case"}
// // // //             </p>

// // // //           </div>


// // // //           <button
// // // //             type="button"
// // // //             className="modal-close"
// // // //             onClick={onClose}
// // // //           >
// // // //             <X size={19} />
// // // //           </button>

// // // //         </div>


// // // //         <div className="case-review-grid">

// // // //           <ReviewField
// // // //             label="Customer"
// // // //             value={
// // // //               caseData.customerName
// // // //             }
// // // //           />

// // // //           <ReviewField
// // // //             label="Status"
// // // //             value={
// // // //               caseData.status ||
// // // //               "Pending"
// // // //             }
// // // //           />

// // // //           <ReviewField
// // // //             label="Priority"
// // // //             value={
// // // //               caseData.priority ||
// // // //               "Medium"
// // // //             }
// // // //           />

// // // //           <ReviewField
// // // //             label="Address"
// // // //             value={
// // // //               caseData.address
// // // //             }
// // // //           />

// // // //           <ReviewField
// // // //             label="Assigned agent"
// // // //             value={
// // // //               assignedAgent?.name ||
// // // //               caseData.agentName ||
// // // //               "Unassigned"
// // // //             }
// // // //           />

// // // //           <ReviewField
// // // //             label="Recovery amount"
// // // //             value={
// // // //               caseData.amount !==
// // // //               undefined
// // // //                 ? `₹${Number(
// // // //                     caseData.amount
// // // //                   ).toLocaleString(
// // // //                     "en-IN"
// // // //                   )}`
// // // //                 : "—"
// // // //             }
// // // //           />

// // // //         </div>


// // // //         <div className="case-review-section">

// // // //           <div className="case-review-section-title">

// // // //             <Clock3 size={17} />

// // // //             <h4>
// // // //               Field activity
// // // //             </h4>

// // // //           </div>


// // // //           {updates.length === 0 ? (

// // // //             <div className="review-empty">
// // // //               No field updates recorded yet.
// // // //             </div>

// // // //           ) : (

// // // //             <div className="review-updates">

// // // //               {updates.map(
// // // //                 (update, index) => (

// // // //                   <div
// // // //                     className="review-update"
// // // //                     key={
// // // //                       update.id ||
// // // //                       index
// // // //                     }
// // // //                   >

// // // //                     <div className="review-update-dot">
// // // //                       <CheckCircle2 size={14} />
// // // //                     </div>

// // // //                     <div>

// // // //                       <strong>
// // // //                         {update.outcome ||
// // // //                           "Field update"}
// // // //                       </strong>

// // // //                       <p>
// // // //                         {update.notes ||
// // // //                           "No notes provided."}
// // // //                       </p>

// // // //                       <span>
// // // //                         {update.createdAt
// // // //                           ? new Date(
// // // //                               update.createdAt
// // // //                             ).toLocaleString()
// // // //                           : ""}
// // // //                       </span>

// // // //                     </div>

// // // //                   </div>

// // // //                 )
// // // //               )}

// // // //             </div>

// // // //           )}

// // // //         </div>


// // // //         <div className="case-review-section">

// // // //           <div className="case-review-section-title">

// // // //             <FileImage size={17} />

// // // //             <h4>
// // // //               Evidence
// // // //             </h4>

// // // //           </div>


// // // //           {evidence.length === 0 ? (

// // // //             <div className="review-empty">
// // // //               No evidence uploaded yet.
// // // //             </div>

// // // //           ) : (

// // // //             <div className="evidence-review-grid">

// // // //               {evidence.map(
// // // //                 (item, index) => {

// // // //                   const url =
// // // //                     item.path ||
// // // //                     item.url ||
// // // //                     "";

// // // //                   const isImage =
// // // //                     item.mimeType?.startsWith(
// // // //                       "image/"
// // // //                     );

// // // //                   return (

// // // //                     <div
// // // //                       className="evidence-review-item"
// // // //                       key={
// // // //                         item.id ||
// // // //                         index
// // // //                       }
// // // //                     >

// // // //                       {isImage && url ? (

// // // //                         <img
// // // //                           src={
// // // //                             url.startsWith(
// // // //                               "http"
// // // //                             )
// // // //                               ? url
// // // //                               : `http://localhost:4000${url}`
// // // //                           }
// // // //                           alt={
// // // //                             item.originalName ||
// // // //                             "Evidence"
// // // //                           }
// // // //                         />

// // // //                       ) : (

// // // //                         <div className="evidence-document">

// // // //                           <FileText size={26} />

// // // //                         </div>

// // // //                       )}


// // // //                       <div>

// // // //                         <strong>
// // // //                           {item.originalName ||
// // // //                             item.filename ||
// // // //                             "Evidence file"}
// // // //                         </strong>

// // // //                         <span>
// // // //                           {item.createdAt
// // // //                             ? new Date(
// // // //                                 item.createdAt
// // // //                               ).toLocaleString()
// // // //                             : ""}
// // // //                         </span>

// // // //                       </div>

// // // //                     </div>

// // // //                   );
// // // //                 }
// // // //               )}

// // // //             </div>

// // // //           )}

// // // //         </div>


// // // //         <div className="case-review-footer">

// // // //           <button
// // // //             type="button"
// // // //             className="primary-small-button"
// // // //             onClick={onClose}
// // // //           >
// // // //             Close review
// // // //           </button>

// // // //         </div>

// // // //       </div>

// // // //     </div>

// // // //   );
// // // // }


// // // // function ReviewField({
// // // //   label,
// // // //   value,
// // // // }) {

// // // //   return (

// // // //     <div className="review-field">

// // // //       <span>
// // // //         {label}
// // // //       </span>

// // // //       <strong>
// // // //         {value || "—"}
// // // //       </strong>

// // // //     </div>

// // // //   );
// // // // }


// // // // export default ManagerCases;


// // // import { useEffect, useState } from "react";

// // // import {
// // //   ClipboardList,
// // //   RefreshCw,
// // //   MapPin,
// // //   UserCheck,
// // //   Navigation,
// // //   X,
// // //   AlertCircle,
// // //   FileImage,
// // //   FileText,
// // //   CheckCircle2,
// // //   Clock3,
// // //   Eye,
// // //   Plus,
// // // } from "lucide-react";

// // // import AppShell from "../../components/layout/AppShell";

// // // import {
// // //   getRecoveryCases,
// // //   createRecoveryCase,
// // //   findNearestAgent,
// // //   assignNearestAgent,
// // //   unassignCase,
// // // } from "../../api/api";


// // // function ManagerCases() {
// // //   const [cases, setCases] = useState([]);
// // //   const [loading, setLoading] = useState(true);

// // //   const [error, setError] = useState("");

// // //   const [assigningCase, setAssigningCase] =
// // //     useState(null);

// // //   const [nearest, setNearest] =
// // //     useState(null);

// // //   const [reviewCase, setReviewCase] =
// // //     useState(null);

// // //   const [createOpen, setCreateOpen] =
// // //     useState(false);

// // //   const [actionLoading, setActionLoading] =
// // //     useState(false);

// // //   const [formLoading, setFormLoading] =
// // //     useState(false);

// // //   const [form, setForm] = useState({
// // //     customerName: "",
// // //     phone: "",
// // //     address: "",
// // //     amount: "",
// // //     priority: "medium",
// // //     status: "pending",
// // //   });




// // //   async function loadCases() {
// // //     try {
// // //       setLoading(true);
// // //       setError("");

// // //       const data =
// // //         await getRecoveryCases();

// // //       const result =
// // //         Array.isArray(data)
// // //           ? data
// // //           : data?.cases || [];

// // //       setCases(result);

// // //     } catch (err) {
// // //       console.error(
// // //         "LOAD CASES ERROR:",
// // //         err
// // //       );

// // //       setError(
// // //         err.response?.data?.message ||
// // //         "Unable to load recovery cases."
// // //       );

// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }


// // //   useEffect(() => {
// // //     loadCases();
// // //   }, []);


// // //   /* =======================================================
// // //      CREATE CASE FORM
// // //   ======================================================= */

// // //   function handleFormChange(event) {
// // //     const {
// // //       name,
// // //       value,
// // //     } = event.target;

// // //     setForm((previous) => ({
// // //       ...previous,
// // //       [name]: value,
// // //     }));
// // //   }


// // //   function resetForm() {
// // //     setForm({
// // //       customerName: "",
// // //       phone: "",
// // //       address: "",
// // //       amount: "",
// // //       priority: "medium",
// // //       status: "pending",
// // //     });
// // //   }


// // //   function openCreateModal() {
// // //     setError("");
// // //     resetForm();
// // //     setCreateOpen(true);
// // //   }


// // //   function closeCreateModal() {
// // //     if (formLoading) {
// // //       return;
// // //     }

// // //     setCreateOpen(false);
// // //     resetForm();
// // //     setError("");
// // //   }


// // //   async function handleCreateCase(event) {
// // //     event.preventDefault();

// // //     setError("");


// // //     /* -------------------------------------------------------
// // //        VALIDATION
// // //     ------------------------------------------------------- */

// // //     if (!form.customerName.trim()) {
// // //       setError(
// // //         "Customer name is required."
// // //       );
// // //       return;
// // //     }


// // //     if (!form.phone.trim()) {
// // //       setError(
// // //         "Customer phone number is required."
// // //       );
// // //       return;
// // //     }


// // //     if (!form.address.trim()) {
// // //       setError(
// // //         "Customer address is required."
// // //       );
// // //       return;
// // //     }


// // //     if (form.amount === "") {
// // //       setError(
// // //         "Recovery amount is required."
// // //       );
// // //       return;
// // //     }


// // //     const amount =
// // //       Number(form.amount);


// // //     if (
// // //       !Number.isFinite(amount) ||
// // //       amount < 0
// // //     ) {
// // //       setError(
// // //         "Enter a valid recovery amount."
// // //       );
// // //       return;
// // //     }


// // //     try {
// // //       setFormLoading(true);


// // //       /* -----------------------------------------------------
// // //          SEND REAL CASE TO BACKEND
// // //       ----------------------------------------------------- */

// // //       const result =
// // //         await createRecoveryCase({
// // //           customerName:
// // //             form.customerName.trim(),

// // //           phone:
// // //             form.phone.trim(),

// // //           address:
// // //             form.address.trim(),

// // //           amount,

// // //           priority:
// // //             form.priority,

// // //           status:
// // //             form.status,
// // //         });


// // //       if (
// // //         !result ||
// // //         result.success === false
// // //       ) {
// // //         throw new Error(
// // //           result?.message ||
// // //           "Unable to create recovery case."
// // //         );
// // //       }


// // //       /* -----------------------------------------------------
// // //          IMPORTANT:
// // //          Add the newly created case immediately.
// // //       ----------------------------------------------------- */

// // //       if (result.case) {

// // //         setCases((previous) => [
// // //           ...previous,
// // //           result.case,
// // //         ]);

// // //       } else {

// // //         /*
// // //           If the backend doesn't return the
// // //           created case, reload from database.
// // //         */

// // //         await loadCases();

// // //       }


// // //       resetForm();

// // //       setCreateOpen(false);

// // //       setError("");

// // //     } catch (err) {
// // //       console.error(
// // //         "CREATE CASE ERROR:",
// // //         err
// // //       );

// // //       setError(
// // //         err.response?.data?.message ||
// // //         err.message ||
// // //         "Unable to create recovery case."
// // //       );

// // //     } finally {
// // //       setFormLoading(false);
// // //     }
// // //   }


// // //   /* =======================================================
// // //      FIND NEAREST AGENT
// // //   ======================================================= */

// // //   async function handleFindNearest(item) {
// // //     try {
// // //       setAssigningCase(item);
// // //       setNearest(null);
// // //       setError("");

// // //       const result =
// // //         await findNearestAgent(item.id);

// // //       setNearest(result);

// // //     } catch (err) {
// // //       console.error(
// // //         "FIND NEAREST ERROR:",
// // //         err
// // //       );

// // //       setError(
// // //         err.response?.data?.message ||
// // //         "Unable to find a nearby agent."
// // //       );
// // //     }
// // //   }


// // //   /* =======================================================
// // //      ASSIGN NEAREST AGENT
// // //   ======================================================= */

// // //   async function handleAssignNearest() {
// // //     if (!assigningCase) {
// // //       return;
// // //     }

// // //     try {
// // //       setActionLoading(true);
// // //       setError("");

// // //       await assignNearestAgent(
// // //         assigningCase.id
// // //       );

// // //       setAssigningCase(null);
// // //       setNearest(null);

// // //       await loadCases();

// // //     } catch (err) {
// // //       console.error(
// // //         "ASSIGN NEAREST ERROR:",
// // //         err
// // //       );

// // //       setError(
// // //         err.response?.data?.message ||
// // //         "Unable to assign the nearest agent."
// // //       );

// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   }


// // //   /* =======================================================
// // //      UNASSIGN CASE
// // //   ======================================================= */

// // //   async function handleUnassign(caseId) {
// // //     try {
// // //       setActionLoading(true);
// // //       setError("");

// // //       await unassignCase(caseId);

// // //       await loadCases();

// // //     } catch (err) {
// // //       console.error(
// // //         "UNASSIGN ERROR:",
// // //         err
// // //       );

// // //       setError(
// // //         err.response?.data?.message ||
// // //         "Unable to unassign case."
// // //       );

// // //     } finally {
// // //       setActionLoading(false);
// // //     }
// // //   }


// // //   /* =======================================================
// // //      FORMAT DISTANCE
// // //   ======================================================= */

// // //   function formatDistance(distance) {
// // //     if (
// // //       distance === null ||
// // //       distance === undefined
// // //     ) {
// // //       return "—";
// // //     }

// // //     if (distance < 1000) {
// // //       return `${Math.round(distance)} m`;
// // //     }

// // //     return `${(
// // //       distance / 1000
// // //     ).toFixed(1)} km`;
// // //   }


// // //   return (
// // //     <AppShell
// // //       role="manager"
// // //       title="Recovery cases"
// // //       subtitle="Monitor, assign and review field recovery cases."
// // //     >

// // //       <div className="manager-page">


// // //         {/* =================================================
// // //             PAGE HEADER
// // //         ================================================= */}

// // //         <div className="section-page-header">

// // //           <div>

// // //             <div className="dashboard-eyebrow">
// // //               CASE MANAGEMENT
// // //             </div>

// // //             <h2>
// // //               Recovery cases
// // //             </h2>

// // //             <p>
// // //               Create, assign and review recovery activity.
// // //             </p>

// // //           </div>


// // //           <div
// // //             style={{
// // //               display: "flex",
// // //               alignItems: "center",
// // //               gap: "10px",
// // //               flexWrap: "wrap",
// // //             }}
// // //           >

// // //             <button
// // //               className="outline-button"
// // //               type="button"
// // //               onClick={loadCases}
// // //               disabled={loading}
// // //             >

// // //               <RefreshCw
// // //                 size={15}
// // //                 className={
// // //                   loading
// // //                     ? "spin"
// // //                     : ""
// // //                 }
// // //               />

// // //               Refresh

// // //             </button>


// // //             <button
// // //               className="primary-small-button"
// // //               type="button"
// // //               onClick={openCreateModal}
// // //             >

// // //               <Plus size={16} />

// // //               Create case

// // //             </button>

// // //           </div>

// // //         </div>


// // //         {/* =================================================
// // //             ERROR
// // //         ================================================= */}

// // //         {error && (
// // //           <div className="api-error">

// // //             <AlertCircle size={18} />

// // //             <span>
// // //               {error}
// // //             </span>

// // //           </div>
// // //         )}


// // //         {/* =================================================
// // //             CASE TABLE
// // //         ================================================= */}

// // //         <div className="manager-table-card">

// // //           {loading ? (

// // //             <div className="page-state">

// // //               <RefreshCw
// // //                 size={22}
// // //                 className="spin"
// // //               />

// // //               <strong>
// // //                 Loading recovery cases...
// // //               </strong>

// // //             </div>

// // //           ) : cases.length === 0 ? (

// // //             <div className="page-state">

// // //               <div className="page-state-icon">

// // //                 <ClipboardList
// // //                   size={22}
// // //                 />

// // //               </div>

// // //               <strong>
// // //                 No recovery cases
// // //               </strong>

// // //               <span>
// // //                 Create your first recovery case to get started.
// // //               </span>


// // //               <button
// // //                 type="button"
// // //                 className="primary-small-button"
// // //                 onClick={openCreateModal}
// // //                 style={{
// // //                   marginTop: "12px",
// // //                 }}
// // //               >

// // //                 <Plus size={16} />

// // //                 Create case

// // //               </button>

// // //             </div>

// // //           ) : (

// // //             <div className="case-table-wrapper">

// // //               <table className="case-table">

// // //                 <thead>

// // //                   <tr>

// // //                     <th>
// // //                       Case
// // //                     </th>

// // //                     <th>
// // //                       Customer
// // //                     </th>

// // //                     <th>
// // //                       Location
// // //                     </th>

// // //                     <th>
// // //                       Priority
// // //                     </th>

// // //                     <th>
// // //                       Status
// // //                     </th>

// // //                     <th>
// // //                       Agent
// // //                     </th>

// // //                     <th>
// // //                       Actions
// // //                     </th>

// // //                   </tr>

// // //                 </thead>


// // //                 <tbody>

// // //                   {cases.map(
// // //                     (item) => (

// // //                       <tr
// // //                         key={item.id}
// // //                       >

// // //                         <td>

// // //                           <strong>
// // //                             {item.caseNumber ||
// // //                               item.id}
// // //                           </strong>

// // //                         </td>


// // //                         <td>

// // //                           <div>

// // //                             <strong>
// // //                               {item.customerName ||
// // //                                 "—"}
// // //                             </strong>

// // //                             {item.phone && (
// // //                               <div
// // //                                 style={{
// // //                                   fontSize:
// // //                                     "12px",
// // //                                   marginTop:
// // //                                     "3px",
// // //                                   opacity:
// // //                                     0.7,
// // //                                 }}
// // //                               >
// // //                                 {item.phone}
// // //                               </div>
// // //                             )}

// // //                           </div>

// // //                         </td>


// // //                         <td>

// // //                           <div className="case-location-cell">

// // //                             <MapPin
// // //                               size={14}
// // //                             />

// // //                             <span>
// // //                               {item.address ||
// // //                                 "Location unavailable"}
// // //                             </span>

// // //                           </div>

// // //                         </td>


// // //                         <td>

// // //                           <span
// // //                             className={`case-priority ${
// // //                               item.priority ||
// // //                               "medium"
// // //                             }`}
// // //                           >
// // //                             {item.priority ||
// // //                               "medium"}
// // //                           </span>

// // //                         </td>


// // //                         <td>

// // //                           <span
// // //                             className={`case-status ${
// // //                               item.status ||
// // //                               "pending"
// // //                             }`}
// // //                           >
// // //                             {item.status ||
// // //                               "pending"}
// // //                           </span>

// // //                         </td>


// // //                         <td>

// // //                           {item.assignedAgent ? (

// // //                             <div className="assigned-agent-cell">

// // //                               <UserCheck
// // //                                 size={15}
// // //                               />

// // //                               <div>

// // //                                 <strong>
// // //                                   {
// // //                                     item
// // //                                       .assignedAgent
// // //                                       .name
// // //                                   }
// // //                                 </strong>

// // //                                 <span>
// // //                                   Assigned
// // //                                 </span>

// // //                               </div>

// // //                             </div>

// // //                           ) : (

// // //                             <span className="unassigned-label">
// // //                               Unassigned
// // //                             </span>

// // //                           )}

// // //                         </td>


// // //                         <td>

// // //                           <div className="case-action-group">

// // //                             <button
// // //                               type="button"
// // //                               className="outline-small-button"
// // //                               onClick={() =>
// // //                                 setReviewCase(
// // //                                   item
// // //                                 )
// // //                               }
// // //                             >

// // //                               <Eye
// // //                                 size={14}
// // //                               />

// // //                               Review

// // //                             </button>


// // //                             {!item.assignedAgentId ? (

// // //                               <button
// // //                                 type="button"
// // //                                 className="primary-small-button"
// // //                                 onClick={() =>
// // //                                   handleFindNearest(
// // //                                     item
// // //                                   )
// // //                                 }
// // //                               >

// // //                                 <Navigation
// // //                                   size={14}
// // //                                 />

// // //                                 Assign nearest

// // //                               </button>

// // //                             ) : (

// // //                               <button
// // //                                 type="button"
// // //                                 className="outline-small-button"
// // //                                 onClick={() =>
// // //                                   handleUnassign(
// // //                                     item.id
// // //                                   )
// // //                                 }
// // //                                 disabled={
// // //                                   actionLoading
// // //                                 }
// // //                               >

// // //                                 <X
// // //                                   size={14}
// // //                                 />

// // //                                 Unassign

// // //                               </button>

// // //                             )}

// // //                           </div>

// // //                         </td>

// // //                       </tr>

// // //                     )
// // //                   )}

// // //                 </tbody>

// // //               </table>

// // //             </div>

// // //           )}

// // //         </div>

// // //       </div>


// // //       {/* =================================================
// // //           CREATE CASE MODAL
// // //       ================================================= */}

// // //       {createOpen && (

// // //         <div
// // //           className="assignment-overlay"
// // //           onClick={closeCreateModal}
// // //         >

// // //           <div
// // //             className="case-create-modal"
// // //             onClick={(event) =>
// // //               event.stopPropagation()
// // //             }
// // //           >

// // //             {/* HEADER */}

// // //             <div className="case-review-header">

// // //               <div>

// // //                 <div className="dashboard-eyebrow">
// // //                   NEW RECOVERY CASE
// // //                 </div>

// // //                 <h3>
// // //                   Create recovery case
// // //                 </h3>

// // //                 <p>
// // //                   Enter the customer's recovery details.
// // //                 </p>

// // //               </div>


// // //               <button
// // //                 type="button"
// // //                 className="modal-close"
// // //                 onClick={closeCreateModal}
// // //                 disabled={formLoading}
// // //               >

// // //                 <X size={19} />

// // //               </button>

// // //             </div>


// // //             {/* FORM */}

// // //             <form
// // //               className="case-create-form"
// // //               onSubmit={
// // //                 handleCreateCase
// // //               }
// // //             >

// // //               <div className="case-form-grid">


// // //                 {/* CUSTOMER */}

// // //                 <div className="case-form-field">

// // //                   <label>
// // //                     Customer name *
// // //                   </label>

// // //                   <input
// // //                     type="text"
// // //                     name="customerName"
// // //                     value={
// // //                       form.customerName
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     placeholder="Rahul Kumar"
// // //                     disabled={formLoading}
// // //                     autoComplete="name"
// // //                   />

// // //                 </div>


// // //                 {/* PHONE */}

// // //                 <div className="case-form-field">

// // //                   <label>
// // //                     Phone number *
// // //                   </label>

// // //                   <input
// // //                     type="tel"
// // //                     name="phone"
// // //                     value={
// // //                       form.phone
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     placeholder="9876543210"
// // //                     disabled={formLoading}
// // //                     autoComplete="tel"
// // //                   />

// // //                 </div>


// // //                 {/* ADDRESS */}

// // //                 <div className="case-form-field case-form-full">

// // //                   <label>
// // //                     Customer address *
// // //                   </label>

// // //                   <input
// // //                     type="text"
// // //                     name="address"
// // //                     value={
// // //                       form.address
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     placeholder="Indiranagar, Bengaluru"
// // //                     disabled={formLoading}
// // //                   />

// // //                 </div>


// // //                 {/* AMOUNT */}

// // //                 <div className="case-form-field">

// // //                   <label>
// // //                     Recovery amount *
// // //                   </label>

// // //                   <input
// // //                     type="number"
// // //                     name="amount"
// // //                     value={
// // //                       form.amount
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     placeholder="25000"
// // //                     min="0"
// // //                     step="0.01"
// // //                     disabled={formLoading}
// // //                   />

// // //                 </div>


// // //                 {/* PRIORITY */}

// // //                 <div className="case-form-field">

// // //                   <label>
// // //                     Priority
// // //                   </label>

// // //                   <select
// // //                     name="priority"
// // //                     value={
// // //                       form.priority
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     disabled={formLoading}
// // //                   >

// // //                     <option value="low">
// // //                       Low
// // //                     </option>

// // //                     <option value="medium">
// // //                       Medium
// // //                     </option>

// // //                     <option value="high">
// // //                       High
// // //                     </option>

// // //                     <option value="critical">
// // //                       Critical
// // //                     </option>

// // //                   </select>

// // //                 </div>


// // //                 {/* STATUS */}

// // //                 <div className="case-form-field">

// // //                   <label>
// // //                     Status
// // //                   </label>

// // //                   <select
// // //                     name="status"
// // //                     value={
// // //                       form.status
// // //                     }
// // //                     onChange={
// // //                       handleFormChange
// // //                     }
// // //                     disabled={formLoading}
// // //                   >

// // //                     <option value="pending">
// // //                       Pending
// // //                     </option>

// // //                     <option value="in_progress">
// // //                       In progress
// // //                     </option>

// // //                   </select>

// // //                 </div>

// // //               </div>


// // //               {/* FOOTER */}

// // //               <div className="case-create-footer">

// // //                 <button
// // //                   type="button"
// // //                   className="outline-button"
// // //                   onClick={
// // //                     closeCreateModal
// // //                   }
// // //                   disabled={formLoading}
// // //                 >
// // //                   Cancel
// // //                 </button>


// // //                 <button
// // //                   type="submit"
// // //                   className="primary-small-button"
// // //                   disabled={formLoading}
// // //                 >

// // //                   <Plus size={16} />

// // //                   {formLoading
// // //                     ? "Creating..."
// // //                     : "Create case"}

// // //                 </button>

// // //               </div>

// // //             </form>

// // //           </div>

// // //         </div>

// // //       )}


// // //       {/* =================================================
// // //           ASSIGNMENT MODAL
// // //       ================================================= */}

// // //       {assigningCase && (

// // //         <div
// // //           className="assignment-overlay"
// // //           onClick={() => {

// // //             if (!actionLoading) {

// // //               setAssigningCase(
// // //                 null
// // //               );

// // //               setNearest(
// // //                 null
// // //               );

// // //             }

// // //           }}
// // //         >

// // //           <div
// // //             className="assignment-modal"
// // //             onClick={(event) =>
// // //               event.stopPropagation()
// // //             }
// // //           >

// // //             <div className="assignment-modal-header">

// // //               <div>

// // //                 <div className="dashboard-eyebrow">
// // //                   SMART ASSIGNMENT
// // //                 </div>

// // //                 <h3>
// // //                   Find nearest agent
// // //                 </h3>

// // //                 <p>
// // //                   {assigningCase.caseNumber ||
// // //                     assigningCase.id}
// // //                   {" · "}
// // //                   {
// // //                     assigningCase.customerName
// // //                   }
// // //                 </p>

// // //               </div>


// // //               <button
// // //                 type="button"
// // //                 className="modal-close"
// // //                 onClick={() => {

// // //                   setAssigningCase(
// // //                     null
// // //                   );

// // //                   setNearest(
// // //                     null
// // //                   );

// // //                 }}
// // //               >
// // //                 <X size={19} />
// // //               </button>

// // //             </div>


// // //             {!nearest ? (

// // //               <div className="assignment-loading">

// // //                 <Navigation
// // //                   size={28}
// // //                 />

// // //                 <strong>
// // //                   Finding nearest available agent...
// // //                 </strong>

// // //                 <span>
// // //                   Checking consented live locations.
// // //                 </span>

// // //               </div>

// // //             ) : (

// // //               <>

// // //                 <div className="nearest-agent-card">

// // //                   <div className="nearest-agent-icon">
// // //                     <UserCheck
// // //                       size={22}
// // //                     />
// // //                   </div>


// // //                   <div className="nearest-agent-info">

// // //                     <span>
// // //                       NEAREST AVAILABLE AGENT
// // //                     </span>

// // //                     <strong>
// // //                       {nearest.agent?.name ||
// // //                         nearest.assignment?.agentName ||
// // //                         "Agent"}
// // //                     </strong>

// // //                     <small>
// // //                       Available
// // //                     </small>

// // //                   </div>


// // //                   <div className="nearest-distance">

// // //                     <Navigation
// // //                       size={17}
// // //                     />

// // //                     <strong>
// // //                       {formatDistance(
// // //                         nearest.distance
// // //                       )}
// // //                     </strong>

// // //                     <span>
// // //                       from case
// // //                     </span>

// // //                   </div>

// // //                 </div>


// // //                 <div className="assignment-modal-actions">

// // //                   <button
// // //                     type="button"
// // //                     className="outline-button"
// // //                     onClick={() => {

// // //                       setAssigningCase(
// // //                         null
// // //                       );

// // //                       setNearest(
// // //                         null
// // //                       );

// // //                     }}
// // //                     disabled={
// // //                       actionLoading
// // //                     }
// // //                   >
// // //                     Cancel
// // //                   </button>


// // //                   <button
// // //                     type="button"
// // //                     className="primary-small-button"
// // //                     onClick={
// // //                       handleAssignNearest
// // //                     }
// // //                     disabled={
// // //                       actionLoading
// // //                     }
// // //                   >

// // //                     <UserCheck
// // //                       size={16}
// // //                     />

// // //                     {actionLoading
// // //                       ? "Assigning..."
// // //                       : "Assign nearest agent"}

// // //                   </button>

// // //                 </div>

// // //               </>

// // //             )}

// // //           </div>

// // //         </div>

// // //       )}


// // //       {/* =================================================
// // //           CASE REVIEW MODAL
// // //       ================================================= */}

// // //       {reviewCase && (

// // //         <CaseReviewModal
// // //           caseData={
// // //             reviewCase
// // //           }
// // //           onClose={() =>
// // //             setReviewCase(
// // //               null
// // //             )
// // //           }
// // //         />

// // //       )}

// // //     </AppShell>
// // //   );
// // // }


// // // /* =========================================================
// // //    CASE REVIEW MODAL
// // // ========================================================= */

// // // function CaseReviewModal({
// // //   caseData,
// // //   onClose,
// // // }) {

// // //   const evidence =
// // //     caseData.evidence ||
// // //     [];

// // //   const updates =
// // //     caseData.updates ||
// // //     caseData.fieldUpdates ||
// // //     [];

// // //   const assignedAgent =
// // //     caseData.assignedAgent;


// // //   return (

// // //     <div
// // //       className="assignment-overlay"
// // //       onClick={onClose}
// // //     >

// // //       <div
// // //         className="case-review-modal"
// // //         onClick={(event) =>
// // //           event.stopPropagation()
// // //         }
// // //       >

// // //         <div className="case-review-header">

// // //           <div>

// // //             <div className="dashboard-eyebrow">
// // //               CASE REVIEW
// // //             </div>

// // //             <h3>
// // //               {caseData.caseNumber ||
// // //                 caseData.id}
// // //             </h3>

// // //             <p>
// // //               {caseData.customerName ||
// // //                 "Recovery case"}
// // //             </p>

// // //           </div>


// // //           <button
// // //             type="button"
// // //             className="modal-close"
// // //             onClick={onClose}
// // //           >
// // //             <X size={19} />
// // //           </button>

// // //         </div>


// // //         <div className="case-review-grid">

// // //           <ReviewField
// // //             label="Customer"
// // //             value={
// // //               caseData.customerName
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Phone"
// // //             value={
// // //               caseData.phone
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Status"
// // //             value={
// // //               caseData.status ||
// // //               "Pending"
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Priority"
// // //             value={
// // //               caseData.priority ||
// // //               "Medium"
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Address"
// // //             value={
// // //               caseData.address
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Assigned agent"
// // //             value={
// // //               assignedAgent?.name ||
// // //               caseData.agentName ||
// // //               "Unassigned"
// // //             }
// // //           />

// // //           <ReviewField
// // //             label="Recovery amount"
// // //             value={
// // //               caseData.amount !==
// // //               undefined
// // //                 ? `₹${Number(
// // //                     caseData.amount
// // //                   ).toLocaleString(
// // //                     "en-IN"
// // //                   )}`
// // //                 : "—"
// // //             }
// // //           />

// // //         </div>


// // //         {/* FIELD ACTIVITY */}

// // //         <div className="case-review-section">

// // //           <div className="case-review-section-title">

// // //             <Clock3
// // //               size={17}
// // //             />

// // //             <h4>
// // //               Field activity
// // //             </h4>

// // //           </div>


// // //           {updates.length === 0 ? (

// // //             <div className="review-empty">
// // //               No field updates recorded yet.
// // //             </div>

// // //           ) : (

// // //             <div className="review-updates">

// // //               {updates.map(
// // //                 (
// // //                   update,
// // //                   index
// // //                 ) => (

// // //                   <div
// // //                     className="review-update"
// // //                     key={
// // //                       update.id ||
// // //                       index
// // //                     }
// // //                   >

// // //                     <div className="review-update-dot">

// // //                       <CheckCircle2
// // //                         size={14}
// // //                       />

// // //                     </div>

// // //                     <div>

// // //                       <strong>
// // //                         {update.outcome ||
// // //                           "Field update"}
// // //                       </strong>

// // //                       <p>
// // //                         {update.notes ||
// // //                           "No notes provided."}
// // //                       </p>

// // //                       <span>
// // //                         {update.createdAt
// // //                           ? new Date(
// // //                               update.createdAt
// // //                             ).toLocaleString()
// // //                           : ""}
// // //                       </span>

// // //                     </div>

// // //                   </div>

// // //                 )
// // //               )}

// // //             </div>

// // //           )}

// // //         </div>


// // //         {/* EVIDENCE */}

// // //         <div className="case-review-section">

// // //           <div className="case-review-section-title">

// // //             <FileImage
// // //               size={17}
// // //             />

// // //             <h4>
// // //               Evidence
// // //             </h4>

// // //           </div>


// // //           {evidence.length === 0 ? (

// // //             <div className="review-empty">
// // //               No evidence uploaded yet.
// // //             </div>

// // //           ) : (

// // //             <div className="evidence-review-grid">

// // //               {evidence.map(
// // //                 (
// // //                   item,
// // //                   index
// // //                 ) => {

// // //                   const url =
// // //                     item.path ||
// // //                     item.url ||
// // //                     "";

// // //                   const isImage =
// // //                     item.mimeType?.startsWith(
// // //                       "image/"
// // //                     );

// // //                   return (

// // //                     <div
// // //                       className="evidence-review-item"
// // //                       key={
// // //                         item.id ||
// // //                         index
// // //                       }
// // //                     >

// // //                       {isImage &&
// // //                       url ? (

// // //                         <img
// // //                           src={
// // //                             url.startsWith(
// // //                               "http"
// // //                             )
// // //                               ? url
// // //                               : `http://localhost:4000${url}`
// // //                           }
// // //                           alt={
// // //                             item.originalName ||
// // //                             "Evidence"
// // //                           }
// // //                         />

// // //                       ) : (

// // //                         <div className="evidence-document">

// // //                           <FileText
// // //                             size={26}
// // //                           />

// // //                         </div>

// // //                       )}


// // //                       <div>

// // //                         <strong>
// // //                           {item.originalName ||
// // //                             item.filename ||
// // //                             "Evidence file"}
// // //                         </strong>

// // //                         <span>
// // //                           {item.createdAt
// // //                             ? new Date(
// // //                                 item.createdAt
// // //                               ).toLocaleString()
// // //                             : ""}
// // //                         </span>

// // //                       </div>

// // //                     </div>

// // //                   );

// // //                 }
// // //               )}

// // //             </div>

// // //           )}

// // //         </div>


// // //         <div className="case-review-footer">

// // //           <button
// // //             type="button"
// // //             className="primary-small-button"
// // //             onClick={onClose}
// // //           >
// // //             Close review
// // //           </button>

// // //         </div>

// // //       </div>

// // //     </div>

// // //   );
// // // }


// // // /* =========================================================
// // //    REVIEW FIELD
// // // ========================================================= */

// // // function ReviewField({
// // //   label,
// // //   value,
// // // }) {

// // //   return (

// // //     <div className="review-field">

// // //       <span>
// // //         {label}
// // //       </span>

// // //       <strong>
// // //         {value || "—"}
// // //       </strong>

// // //     </div>

// // //   );
// // // }


// // // export default ManagerCases;



// // import { useEffect, useState } from "react";

// // import {
// //   ClipboardList,
// //   RefreshCw,
// //   MapPin,
// //   UserCheck,
// //   Navigation,
// //   X,
// //   AlertCircle,
// //   FileImage,
// //   FileText,
// //   CheckCircle2,
// //   Clock3,
// //   Eye,
// //   Plus,
// //   Trash2,
// //   AlertTriangle,
// // } from "lucide-react";

// // import AppShell from "../../components/layout/AppShell";

// // import {
// //   getRecoveryCases,
// //   createRecoveryCase,
// //   findNearestAgent,
// //   assignNearestAgent,
// //   unassignCase,
// //   deleteRecoveryCase,
// // } from "../../api/api";


// // function ManagerCases() {
// //   const [cases, setCases] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const [error, setError] = useState("");

// //   const [assigningCase, setAssigningCase] =
// //     useState(null);

// //   const [nearest, setNearest] =
// //     useState(null);

// //   const [reviewCase, setReviewCase] =
// //     useState(null);

// //   const [deleteCase, setDeleteCase] =
// //     useState(null);

// //   const [createOpen, setCreateOpen] =
// //     useState(false);

// //   const [actionLoading, setActionLoading] =
// //     useState(false);

// //   const [deleteLoading, setDeleteLoading] =
// //     useState(false);

// //   const [formLoading, setFormLoading] =
// //     useState(false);

// //   const [form, setForm] = useState({
// //     customerName: "",
// //     phone: "",
// //     address: "",
// //     amount: "",
// //     priority: "medium",
// //     status: "pending",
// //   });


// //   /* =======================================================
// //      LOAD CASES
// //   ======================================================= */

// //   async function loadCases() {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const data =
// //         await getRecoveryCases();

// //       const result =
// //         Array.isArray(data)
// //           ? data
// //           : data?.cases || [];

// //       setCases(result);

// //     } catch (err) {
// //       console.error(
// //         "LOAD CASES ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         "Unable to load recovery cases."
// //       );

// //     } finally {
// //       setLoading(false);
// //     }
// //   }


// //   useEffect(() => {
// //     loadCases();
// //   }, []);


// //   /* =======================================================
// //      CREATE CASE FORM
// //   ======================================================= */

// //   function handleFormChange(event) {
// //     const {
// //       name,
// //       value,
// //     } = event.target;

// //     setForm((previous) => ({
// //       ...previous,
// //       [name]: value,
// //     }));
// //   }


// //   function resetForm() {
// //     setForm({
// //       customerName: "",
// //       phone: "",
// //       address: "",
// //       amount: "",
// //       priority: "medium",
// //       status: "pending",
// //     });
// //   }


// //   function openCreateModal() {
// //     setError("");
// //     resetForm();
// //     setCreateOpen(true);
// //   }


// //   function closeCreateModal() {
// //     if (formLoading) {
// //       return;
// //     }

// //     setCreateOpen(false);
// //     resetForm();
// //     setError("");
// //   }


// //   async function handleCreateCase(event) {
// //     event.preventDefault();

// //     setError("");


// //     if (!form.customerName.trim()) {
// //       setError(
// //         "Customer name is required."
// //       );
// //       return;
// //     }


// //     if (!form.phone.trim()) {
// //       setError(
// //         "Customer phone number is required."
// //       );
// //       return;
// //     }


// //     if (!form.address.trim()) {
// //       setError(
// //         "Customer address is required."
// //       );
// //       return;
// //     }


// //     if (form.amount === "") {
// //       setError(
// //         "Recovery amount is required."
// //       );
// //       return;
// //     }


// //     const amount =
// //       Number(form.amount);


// //     if (
// //       !Number.isFinite(amount) ||
// //       amount < 0
// //     ) {
// //       setError(
// //         "Enter a valid recovery amount."
// //       );
// //       return;
// //     }


// //     try {
// //       setFormLoading(true);


// //       const result =
// //         await createRecoveryCase({
// //           customerName:
// //             form.customerName.trim(),

// //           phone:
// //             form.phone.trim(),

// //           address:
// //             form.address.trim(),

// //           amount,

// //           priority:
// //             form.priority,

// //           status:
// //             form.status,
// //         });


// //       if (
// //         !result ||
// //         result.success === false
// //       ) {
// //         throw new Error(
// //           result?.message ||
// //           "Unable to create recovery case."
// //         );
// //       }


// //       if (result.case) {

// //         setCases((previous) => [
// //           ...previous,
// //           result.case,
// //         ]);

// //       } else {

// //         await loadCases();

// //       }


// //       resetForm();

// //       setCreateOpen(false);

// //       setError("");

// //     } catch (err) {
// //       console.error(
// //         "CREATE CASE ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Unable to create recovery case."
// //       );

// //     } finally {
// //       setFormLoading(false);
// //     }
// //   }


// //   /* =======================================================
// //      FIND NEAREST AGENT
// //   ======================================================= */

// //   async function handleFindNearest(item) {
// //     try {
// //       setAssigningCase(item);
// //       setNearest(null);
// //       setError("");

// //       const result =
// //         await findNearestAgent(
// //           item.id
// //         );

// //       setNearest(result);

// //     } catch (err) {
// //       console.error(
// //         "FIND NEAREST ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         "Unable to find a nearby agent."
// //       );
// //     }
// //   }


// //   /* =======================================================
// //      ASSIGN NEAREST AGENT
// //   ======================================================= */

// //   async function handleAssignNearest() {
// //     if (!assigningCase) {
// //       return;
// //     }

// //     try {
// //       setActionLoading(true);
// //       setError("");

// //       await assignNearestAgent(
// //         assigningCase.id
// //       );

// //       setAssigningCase(null);
// //       setNearest(null);

// //       await loadCases();

// //     } catch (err) {
// //       console.error(
// //         "ASSIGN NEAREST ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         "Unable to assign the nearest agent."
// //       );

// //     } finally {
// //       setActionLoading(false);
// //     }
// //   }


// //   /* =======================================================
// //      UNASSIGN CASE
// //   ======================================================= */

// //   async function handleUnassign(
// //     caseId
// //   ) {
// //     try {
// //       setActionLoading(true);
// //       setError("");

// //       await unassignCase(
// //         caseId
// //       );

// //       await loadCases();

// //     } catch (err) {
// //       console.error(
// //         "UNASSIGN ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         "Unable to unassign case."
// //       );

// //     } finally {
// //       setActionLoading(false);
// //     }
// //   }


// //   /* =======================================================
// //      DELETE CASE
// //   ======================================================= */

// //   function openDeleteModal(item) {
// //     setError("");
// //     setDeleteCase(item);
// //   }


// //   function closeDeleteModal() {
// //     if (deleteLoading) {
// //       return;
// //     }

// //     setDeleteCase(null);
// //   }


// //   async function handleDeleteCase() {
// //     if (!deleteCase) {
// //       return;
// //     }

// //     try {
// //       setDeleteLoading(true);
// //       setError("");


// //       const result =
// //         await deleteRecoveryCase(
// //           deleteCase.id
// //         );


// //       if (
// //         !result ||
// //         result.success === false
// //       ) {
// //         throw new Error(
// //           result?.message ||
// //           "Unable to delete recovery case."
// //         );
// //       }


// //       /*
// //         Remove immediately from local UI.
// //       */
// //       setCases((previous) =>
// //         previous.filter(
// //           (item) =>
// //             item.id !==
// //             deleteCase.id
// //         )
// //       );


// //       /*
// //         Close delete modal.
// //       */
// //       setDeleteCase(null);

// //     } catch (err) {
// //       console.error(
// //         "DELETE CASE ERROR:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         err.message ||
// //         "Unable to delete recovery case."
// //       );

// //     } finally {
// //       setDeleteLoading(false);
// //     }
// //   }


// //   /* =======================================================
// //      FORMAT DISTANCE
// //   ======================================================= */

// //   function formatDistance(
// //     distance
// //   ) {
// //     if (
// //       distance === null ||
// //       distance === undefined
// //     ) {
// //       return "—";
// //     }

// //     if (distance < 1000) {
// //       return `${Math.round(
// //         distance
// //       )} m`;
// //     }

// //     return `${(
// //       distance / 1000
// //     ).toFixed(1)} km`;
// //   }


// //   return (
// //     <AppShell
// //       role="manager"
// //       title="Recovery cases"
// //       subtitle="Monitor, assign and review field recovery cases."
// //     >

// //       <div className="manager-page">


// //         {/* =================================================
// //             PAGE HEADER
// //         ================================================= */}

// //         <div className="section-page-header">

// //           <div>

// //             <div className="dashboard-eyebrow">
// //               CASE MANAGEMENT
// //             </div>

// //             <h2>
// //               Recovery cases
// //             </h2>

// //             <p>
// //               Create, assign and review recovery activity.
// //             </p>

// //           </div>


// //           <div
// //             style={{
// //               display: "flex",
// //               alignItems: "center",
// //               gap: "10px",
// //               flexWrap: "wrap",
// //             }}
// //           >

// //             <button
// //               className="outline-button"
// //               type="button"
// //               onClick={loadCases}
// //               disabled={loading}
// //             >

// //               <RefreshCw
// //                 size={15}
// //                 className={
// //                   loading
// //                     ? "spin"
// //                     : ""
// //                 }
// //               />

// //               Refresh

// //             </button>


// //             <button
// //               className="primary-small-button"
// //               type="button"
// //               onClick={
// //                 openCreateModal
// //               }
// //             >

// //               <Plus size={16} />

// //               Create case

// //             </button>

// //           </div>

// //         </div>


// //         {/* =================================================
// //             ERROR
// //         ================================================= */}

// //         {error && (
// //           <div className="api-error">

// //             <AlertCircle size={18} />

// //             <span>
// //               {error}
// //             </span>

// //           </div>
// //         )}


// //         {/* =================================================
// //             CASE TABLE
// //         ================================================= */}

// //         <div className="manager-table-card">

// //           {loading ? (

// //             <div className="page-state">

// //               <RefreshCw
// //                 size={22}
// //                 className="spin"
// //               />

// //               <strong>
// //                 Loading recovery cases...
// //               </strong>

// //             </div>

// //           ) : cases.length === 0 ? (

// //             <div className="page-state">

// //               <div className="page-state-icon">

// //                 <ClipboardList
// //                   size={22}
// //                 />

// //               </div>

// //               <strong>
// //                 No recovery cases
// //               </strong>

// //               <span>
// //                 Create your first recovery case to get started.
// //               </span>


// //               <button
// //                 type="button"
// //                 className="primary-small-button"
// //                 onClick={
// //                   openCreateModal
// //                 }
// //                 style={{
// //                   marginTop:
// //                     "12px",
// //                 }}
// //               >

// //                 <Plus size={16} />

// //                 Create case

// //               </button>

// //             </div>

// //           ) : (

// //             <div className="case-table-wrapper">

// //               <table className="case-table">

// //                 <thead>

// //                   <tr>

// //                     <th>
// //                       Case
// //                     </th>

// //                     <th>
// //                       Customer
// //                     </th>

// //                     <th>
// //                       Location
// //                     </th>

// //                     <th>
// //                       Priority
// //                     </th>

// //                     <th>
// //                       Status
// //                     </th>

// //                     <th>
// //                       Agent
// //                     </th>

// //                     <th>
// //                       Actions
// //                     </th>

// //                   </tr>

// //                 </thead>


// //                 <tbody>

// //                   {cases.map(
// //                     (item) => (

// //                       <tr
// //                         key={
// //                           item.id
// //                         }
// //                       >

// //                         <td>

// //                           <strong>
// //                             {
// //                               item.caseNumber ||
// //                               item.id
// //                             }
// //                           </strong>

// //                         </td>


// //                         <td>

// //                           <div>

// //                             <strong>
// //                               {
// //                                 item.customerName ||
// //                                 "—"
// //                               }
// //                             </strong>

// //                             {item.phone && (
// //                               <div
// //                                 style={{
// //                                   fontSize:
// //                                     "12px",
// //                                   marginTop:
// //                                     "3px",
// //                                   opacity:
// //                                     0.7,
// //                                 }}
// //                               >
// //                                 {
// //                                   item.phone
// //                                 }
// //                               </div>
// //                             )}

// //                           </div>

// //                         </td>


// //                         <td>

// //                           <div className="case-location-cell">

// //                             <MapPin
// //                               size={14}
// //                             />

// //                             <span>
// //                               {
// //                                 item.address ||
// //                                 "Location unavailable"
// //                               }
// //                             </span>

// //                           </div>

// //                         </td>


// //                         <td>

// //                           <span
// //                             className={`case-priority ${
// //                               item.priority ||
// //                               "medium"
// //                             }`}
// //                           >
// //                             {
// //                               item.priority ||
// //                               "medium"
// //                             }
// //                           </span>

// //                         </td>


// //                         <td>

// //                           <span
// //                             className={`case-status ${
// //                               item.status ||
// //                               "pending"
// //                             }`}
// //                           >
// //                             {
// //                               item.status ||
// //                               "pending"
// //                             }
// //                           </span>

// //                         </td>


// //                         <td>

// //                           {item.assignedAgent ? (

// //                             <div className="assigned-agent-cell">

// //                               <UserCheck
// //                                 size={15}
// //                               />

// //                               <div>

// //                                 <strong>
// //                                   {
// //                                     item
// //                                       .assignedAgent
// //                                       .name
// //                                   }
// //                                 </strong>

// //                                 <span>
// //                                   Assigned
// //                                 </span>

// //                               </div>

// //                             </div>

// //                           ) : (

// //                             <span className="unassigned-label">
// //                               Unassigned
// //                             </span>

// //                           )}

// //                         </td>


// //                         <td>

// //                           <div className="case-action-group">

// //                             {/* REVIEW */}

// //                             <button
// //                               type="button"
// //                               className="outline-small-button"
// //                               onClick={() =>
// //                                 setReviewCase(
// //                                   item
// //                                 )
// //                               }
// //                             >

// //                               <Eye
// //                                 size={14}
// //                               />

// //                               Review

// //                             </button>


// //                             {/* ASSIGN / UNASSIGN */}

// //                             {!item.assignedAgentId ? (

// //                               <button
// //                                 type="button"
// //                                 className="primary-small-button"
// //                                 onClick={() =>
// //                                   handleFindNearest(
// //                                     item
// //                                   )
// //                                 }
// //                               >

// //                                 <Navigation
// //                                   size={14}
// //                                 />

// //                                 Assign nearest

// //                               </button>

// //                             ) : (

// //                               <button
// //                                 type="button"
// //                                 className="outline-small-button"
// //                                 onClick={() =>
// //                                   handleUnassign(
// //                                     item.id
// //                                   )
// //                                 }
// //                                 disabled={
// //                                   actionLoading
// //                                 }
// //                               >

// //                                 <X
// //                                   size={14}
// //                                 />

// //                                 Unassign

// //                               </button>

// //                             )}


// //                             {/* DELETE */}

// //                             <button
// //                               type="button"
// //                               className="danger-small-button"
// //                               onClick={() =>
// //                                 openDeleteModal(
// //                                   item
// //                                 )
// //                               }
// //                               disabled={
// //                                 actionLoading ||
// //                                 deleteLoading
// //                               }
// //                               title="Delete case"
// //                             >

// //                               <Trash2
// //                                 size={14}
// //                               />

// //                               Delete

// //                             </button>

// //                           </div>

// //                         </td>

// //                       </tr>

// //                     )
// //                   )}

// //                 </tbody>

// //               </table>

// //             </div>

// //           )}

// //         </div>

// //       </div>


// //       {/* =================================================
// //           CREATE CASE MODAL
// //       ================================================= */}

// //       {createOpen && (

// //         <div
// //           className="assignment-overlay"
// //           onClick={
// //             closeCreateModal
// //           }
// //         >

// //           <div
// //             className="case-create-modal"
// //             onClick={(event) =>
// //               event.stopPropagation()
// //             }
// //           >

// //             <div className="case-review-header">

// //               <div>

// //                 <div className="dashboard-eyebrow">
// //                   NEW RECOVERY CASE
// //                 </div>

// //                 <h3>
// //                   Create recovery case
// //                 </h3>

// //                 <p>
// //                   Enter the customer's recovery details.
// //                 </p>

// //               </div>


// //               <button
// //                 type="button"
// //                 className="modal-close"
// //                 onClick={
// //                   closeCreateModal
// //                 }
// //                 disabled={
// //                   formLoading
// //                 }
// //               >

// //                 <X size={19} />

// //               </button>

// //             </div>


// //             <form
// //               className="case-create-form"
// //               onSubmit={
// //                 handleCreateCase
// //               }
// //             >

// //               <div className="case-form-grid">


// //                 <div className="case-form-field">

// //                   <label>
// //                     Customer name *
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="customerName"
// //                     value={
// //                       form.customerName
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     placeholder="Rahul Kumar"
// //                     disabled={
// //                       formLoading
// //                     }
// //                     autoComplete="name"
// //                   />

// //                 </div>


// //                 <div className="case-form-field">

// //                   <label>
// //                     Phone number *
// //                   </label>

// //                   <input
// //                     type="tel"
// //                     name="phone"
// //                     value={
// //                       form.phone
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     placeholder="9876543210"
// //                     disabled={
// //                       formLoading
// //                     }
// //                     autoComplete="tel"
// //                   />

// //                 </div>


// //                 <div className="case-form-field case-form-full">

// //                   <label>
// //                     Customer address *
// //                   </label>

// //                   <input
// //                     type="text"
// //                     name="address"
// //                     value={
// //                       form.address
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     placeholder="Indiranagar, Bengaluru"
// //                     disabled={
// //                       formLoading
// //                     }
// //                   />

// //                 </div>


// //                 <div className="case-form-field">

// //                   <label>
// //                     Recovery amount *
// //                   </label>

// //                   <input
// //                     type="number"
// //                     name="amount"
// //                     value={
// //                       form.amount
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     placeholder="25000"
// //                     min="0"
// //                     step="0.01"
// //                     disabled={
// //                       formLoading
// //                     }
// //                   />

// //                 </div>


// //                 <div className="case-form-field">

// //                   <label>
// //                     Priority
// //                   </label>

// //                   <select
// //                     name="priority"
// //                     value={
// //                       form.priority
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     disabled={
// //                       formLoading
// //                     }
// //                   >

// //                     <option value="low">
// //                       Low
// //                     </option>

// //                     <option value="medium">
// //                       Medium
// //                     </option>

// //                     <option value="high">
// //                       High
// //                     </option>

// //                     <option value="critical">
// //                       Critical
// //                     </option>

// //                   </select>

// //                 </div>


// //                 <div className="case-form-field">

// //                   <label>
// //                     Status
// //                   </label>

// //                   <select
// //                     name="status"
// //                     value={
// //                       form.status
// //                     }
// //                     onChange={
// //                       handleFormChange
// //                     }
// //                     disabled={
// //                       formLoading
// //                     }
// //                   >

// //                     <option value="pending">
// //                       Pending
// //                     </option>

// //                     <option value="in_progress">
// //                       In progress
// //                     </option>

// //                   </select>

// //                 </div>

// //               </div>


// //               <div className="case-create-footer">

// //                 <button
// //                   type="button"
// //                   className="outline-button"
// //                   onClick={
// //                     closeCreateModal
// //                   }
// //                   disabled={
// //                     formLoading
// //                   }
// //                 >
// //                   Cancel
// //                 </button>


// //                 <button
// //                   type="submit"
// //                   className="primary-small-button"
// //                   disabled={
// //                     formLoading
// //                   }
// //                 >

// //                   <Plus size={16} />

// //                   {
// //                     formLoading
// //                       ? "Creating..."
// //                       : "Create case"
// //                   }

// //                 </button>

// //               </div>

// //             </form>

// //           </div>

// //         </div>

// //       )}


// //       {/* =================================================
// //           ASSIGNMENT MODAL
// //       ================================================= */}

// //       {assigningCase && (

// //         <div
// //           className="assignment-overlay"
// //           onClick={() => {

// //             if (!actionLoading) {

// //               setAssigningCase(
// //                 null
// //               );

// //               setNearest(
// //                 null
// //               );

// //             }

// //           }}
// //         >

// //           <div
// //             className="assignment-modal"
// //             onClick={(event) =>
// //               event.stopPropagation()
// //             }
// //           >

// //             <div className="assignment-modal-header">

// //               <div>

// //                 <div className="dashboard-eyebrow">
// //                   SMART ASSIGNMENT
// //                 </div>

// //                 <h3>
// //                   Find nearest agent
// //                 </h3>

// //                 <p>
// //                   {
// //                     assigningCase.caseNumber ||
// //                     assigningCase.id
// //                   }
// //                   {" · "}
// //                   {
// //                     assigningCase.customerName
// //                   }
// //                 </p>

// //               </div>


// //               <button
// //                 type="button"
// //                 className="modal-close"
// //                 onClick={() => {

// //                   setAssigningCase(
// //                     null
// //                   );

// //                   setNearest(
// //                     null
// //                   );

// //                 }}
// //               >
// //                 <X size={19} />
// //               </button>

// //             </div>


// //             {!nearest ? (

// //               <div className="assignment-loading">

// //                 <Navigation
// //                   size={28}
// //                 />

// //                 <strong>
// //                   Finding nearest available agent...
// //                 </strong>

// //                 <span>
// //                   Checking consented live locations.
// //                 </span>

// //               </div>

// //             ) : (

// //               <>

// //                 <div className="nearest-agent-card">

// //                   <div className="nearest-agent-icon">
// //                     <UserCheck
// //                       size={22}
// //                     />
// //                   </div>


// //                   <div className="nearest-agent-info">

// //                     <span>
// //                       NEAREST AVAILABLE AGENT
// //                     </span>

// //                     <strong>
// //                       {
// //                         nearest.agent?.name ||
// //                         nearest.assignment?.agentName ||
// //                         "Agent"
// //                       }
// //                     </strong>

// //                     <small>
// //                       Available
// //                     </small>

// //                   </div>


// //                   <div className="nearest-distance">

// //                     <Navigation
// //                       size={17}
// //                     />

// //                     <strong>
// //                       {
// //                         formatDistance(
// //                           nearest.distance
// //                         )
// //                       }
// //                     </strong>

// //                     <span>
// //                       from case
// //                     </span>

// //                   </div>

// //                 </div>


// //                 <div className="assignment-modal-actions">

// //                   <button
// //                     type="button"
// //                     className="outline-button"
// //                     onClick={() => {

// //                       setAssigningCase(
// //                         null
// //                       );

// //                       setNearest(
// //                         null
// //                       );

// //                     }}
// //                     disabled={
// //                       actionLoading
// //                     }
// //                   >
// //                     Cancel
// //                   </button>


// //                   <button
// //                     type="button"
// //                     className="primary-small-button"
// //                     onClick={
// //                       handleAssignNearest
// //                     }
// //                     disabled={
// //                       actionLoading
// //                     }
// //                   >

// //                     <UserCheck
// //                       size={16}
// //                     />

// //                     {
// //                       actionLoading
// //                         ? "Assigning..."
// //                         : "Assign nearest agent"
// //                     }

// //                   </button>

// //                 </div>

// //               </>

// //             )}

// //           </div>

// //         </div>

// //       )}


// //       {/* =================================================
// //           DELETE CONFIRMATION MODAL
// //       ================================================= */}

// //       {deleteCase && (

// //         <div
// //           className="assignment-overlay"
// //           onClick={
// //             closeDeleteModal
// //           }
// //         >

// //           <div
// //             className="delete-case-modal"
// //             onClick={(event) =>
// //               event.stopPropagation()
// //             }
// //           >

// //             <div className="delete-case-icon">
// //               <AlertTriangle
// //                 size={24}
// //               />
// //             </div>


// //             <div className="delete-case-content">

// //               <div className="dashboard-eyebrow">
// //                 DELETE CASE
// //               </div>

// //               <h3>
// //                 Delete this recovery case?
// //               </h3>

// //               <p>
// //                 You are about to permanently
// //                 delete{" "}
// //                 <strong>
// //                   {
// //                     deleteCase.caseNumber ||
// //                     deleteCase.id
// //                   }
// //                 </strong>
// //                 {" "}
// //                 for{" "}
// //                 <strong>
// //                   {
// //                     deleteCase.customerName ||
// //                     "this customer"
// //                   }
// //                 </strong>
// //                 .
// //               </p>

// //               <span className="delete-case-warning">
// //                 This will remove the case and
// //                 its related field activity,
// //                 evidence records and assignments.
// //               </span>

// //             </div>


// //             <div className="delete-case-actions">

// //               <button
// //                 type="button"
// //                 className="outline-button"
// //                 onClick={
// //                   closeDeleteModal
// //                 }
// //                 disabled={
// //                   deleteLoading
// //                 }
// //               >
// //                 Cancel
// //               </button>


// //               <button
// //                 type="button"
// //                 className="danger-button"
// //                 onClick={
// //                   handleDeleteCase
// //                 }
// //                 disabled={
// //                   deleteLoading
// //                 }
// //               >

// //                 <Trash2
// //                   size={16}
// //                 />

// //                 {
// //                   deleteLoading
// //                     ? "Deleting..."
// //                     : "Delete case"
// //                 }

// //               </button>

// //             </div>

// //           </div>

// //         </div>

// //       )}


// //       {/* =================================================
// //           CASE REVIEW MODAL
// //       ================================================= */}

// //       {reviewCase && (

// //         <CaseReviewModal
// //           caseData={
// //             reviewCase
// //           }
// //           onClose={() =>
// //             setReviewCase(
// //               null
// //             )
// //           }
// //         />

// //       )}

// //     </AppShell>
// //   );
// // }


// // /* =========================================================
// //    CASE REVIEW MODAL
// // ========================================================= */

// // function CaseReviewModal({
// //   caseData,
// //   onClose,
// // }) {

// //   const evidence =
// //     caseData.evidence ||
// //     [];

// //   const updates =
// //     caseData.updates ||
// //     caseData.fieldUpdates ||
// //     [];

// //   const assignedAgent =
// //     caseData.assignedAgent;


// //   return (

// //     <div
// //       className="assignment-overlay"
// //       onClick={onClose}
// //     >

// //       <div
// //         className="case-review-modal"
// //         onClick={(event) =>
// //           event.stopPropagation()
// //         }
// //       >

// //         <div className="case-review-header">

// //           <div>

// //             <div className="dashboard-eyebrow">
// //               CASE REVIEW
// //             </div>

// //             <h3>
// //               {
// //                 caseData.caseNumber ||
// //                 caseData.id
// //               }
// //             </h3>

// //             <p>
// //               {
// //                 caseData.customerName ||
// //                 "Recovery case"
// //               }
// //             </p>

// //           </div>


// //           <button
// //             type="button"
// //             className="modal-close"
// //             onClick={onClose}
// //           >
// //             <X size={19} />
// //           </button>

// //         </div>


// //         <div className="case-review-grid">

// //           <ReviewField
// //             label="Customer"
// //             value={
// //               caseData.customerName
// //             }
// //           />

// //           <ReviewField
// //             label="Phone"
// //             value={
// //               caseData.phone
// //             }
// //           />

// //           <ReviewField
// //             label="Status"
// //             value={
// //               caseData.status ||
// //               "Pending"
// //             }
// //           />

// //           <ReviewField
// //             label="Priority"
// //             value={
// //               caseData.priority ||
// //               "Medium"
// //             }
// //           />

// //           <ReviewField
// //             label="Address"
// //             value={
// //               caseData.address
// //             }
// //           />

// //           <ReviewField
// //             label="Assigned agent"
// //             value={
// //               assignedAgent?.name ||
// //               caseData.agentName ||
// //               "Unassigned"
// //             }
// //           />

// //           <ReviewField
// //             label="Recovery amount"
// //             value={
// //               caseData.amount !==
// //               undefined
// //                 ? `₹${Number(
// //                     caseData.amount
// //                   ).toLocaleString(
// //                     "en-IN"
// //                   )}`
// //                 : "—"
// //             }
// //           />

// //         </div>


// //         {/* FIELD ACTIVITY */}

// //         <div className="case-review-section">

// //           <div className="case-review-section-title">

// //             <Clock3
// //               size={17}
// //             />

// //             <h4>
// //               Field activity
// //             </h4>

// //           </div>


// //           {updates.length === 0 ? (

// //             <div className="review-empty">
// //               No field updates recorded yet.
// //             </div>

// //           ) : (

// //             <div className="review-updates">

// //               {updates.map(
// //                 (
// //                   update,
// //                   index
// //                 ) => (

// //                   <div
// //                     className="review-update"
// //                     key={
// //                       update.id ||
// //                       index
// //                     }
// //                   >

// //                     <div className="review-update-dot">

// //                       <CheckCircle2
// //                         size={14}
// //                       />

// //                     </div>

// //                     <div>

// //                       <strong>
// //                         {
// //                           update.outcome ||
// //                           "Field update"
// //                         }
// //                       </strong>

// //                       <p>
// //                         {
// //                           update.notes ||
// //                           "No notes provided."
// //                         }
// //                       </p>

// //                       <span>
// //                         {
// //                           update.createdAt
// //                             ? new Date(
// //                                 update.createdAt
// //                               ).toLocaleString()
// //                             : ""
// //                         }
// //                       </span>

// //                     </div>

// //                   </div>

// //                 )
// //               )}

// //             </div>

// //           )}

// //         </div>


// //         {/* EVIDENCE */}

// //         <div className="case-review-section">

// //           <div className="case-review-section-title">

// //             <FileImage
// //               size={17}
// //             />

// //             <h4>
// //               Evidence
// //             </h4>

// //           </div>


// //           {evidence.length === 0 ? (

// //             <div className="review-empty">
// //               No evidence uploaded yet.
// //             </div>

// //           ) : (

// //             <div className="evidence-review-grid">

// //               {evidence.map(
// //                 (
// //                   item,
// //                   index
// //                 ) => {

// //                   const url =
// //                     item.path ||
// //                     item.url ||
// //                     "";

// //                   const isImage =
// //                     item.mimeType?.startsWith(
// //                       "image/"
// //                     );

// //                   return (

// //                     <div
// //                       className="evidence-review-item"
// //                       key={
// //                         item.id ||
// //                         index
// //                       }
// //                     >

// //                       {isImage &&
// //                       url ? (

// //                         <img
// //                           src={
// //                             url.startsWith(
// //                               "http"
// //                             )
// //                               ? url
// //                               : `http://localhost:4000${url}`
// //                           }
// //                           alt={
// //                             item.originalName ||
// //                             "Evidence"
// //                           }
// //                         />

// //                       ) : (

// //                         <div className="evidence-document">

// //                           <FileText
// //                             size={26}
// //                           />

// //                         </div>

// //                       )}


// //                       <div>

// //                         <strong>
// //                           {
// //                             item.originalName ||
// //                             item.filename ||
// //                             "Evidence file"
// //                           }
// //                         </strong>

// //                         <span>
// //                           {
// //                             item.createdAt
// //                               ? new Date(
// //                                   item.createdAt
// //                                 ).toLocaleString()
// //                               : ""
// //                           }
// //                         </span>

// //                       </div>

// //                     </div>

// //                   );

// //                 }
// //               )}

// //             </div>

// //           )}

// //         </div>


// //         <div className="case-review-footer">

// //           <button
// //             type="button"
// //             className="primary-small-button"
// //             onClick={onClose}
// //           >
// //             Close review
// //           </button>

// //         </div>

// //       </div>

// //     </div>

// //   );
// // }


// // /* =========================================================
// //    REVIEW FIELD
// // ========================================================= */

// // function ReviewField({
// //   label,
// //   value,
// // }) {

// //   return (

// //     <div className="review-field">

// //       <span>
// //         {label}
// //       </span>

// //       <strong>
// //         {value || "—"}
// //       </strong>

// //     </div>

// //   );
// // }


// // export default ManagerCases;

// import { useEffect, useState } from "react";

// import {
//   ClipboardList,
//   RefreshCw,
//   MapPin,
//   UserCheck,
//   Navigation,
//   X,
//   AlertCircle,
//   FileImage,
//   FileText,
//   CheckCircle2,
//   Clock3,
//   Eye,
//   Plus,
//   Trash2,
//   AlertTriangle,
//   Users,
//   ExternalLink,
// } from "lucide-react";

// import AppShell from "../../components/layout/AppShell";

// import {
//   getRecoveryCases,
//   createRecoveryCase,
//   getFieldAgents,
//   findNearestAgent,
//   assignNearestAgent,
//   assignAgent,
//   unassignCase,
//   deleteRecoveryCase,
// } from "../../api/api";


// function ManagerCases() {
//   const [cases, setCases] =
//     useState([]);

//   const [agents, setAgents] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [agentsLoading, setAgentsLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [assigningCase, setAssigningCase] =
//     useState(null);

//   const [nearest, setNearest] =
//     useState(null);

//   const [reviewCase, setReviewCase] =
//     useState(null);

//   const [deleteCase, setDeleteCase] =
//     useState(null);

//   const [createOpen, setCreateOpen] =
//     useState(false);

//   const [assignMode, setAssignMode] =
//     useState(null);

//   const [selectedAgentId, setSelectedAgentId] =
//     useState("");

//   const [actionLoading, setActionLoading] =
//     useState(false);

//   const [deleteLoading, setDeleteLoading] =
//     useState(false);

//   const [formLoading, setFormLoading] =
//     useState(false);

//   const [form, setForm] = useState({
//     customerName: "",
//     phone: "",
//     address: "",
//     amount: "",
//     priority: "medium",
//     status: "pending",
//   });


//   /* =======================================================
//      LOAD CASES
//   ======================================================= */

//   async function loadCases() {
//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await getRecoveryCases();

//       const result =
//         Array.isArray(data)
//           ? data
//           : data?.cases || [];

//       setCases(result);
//     } catch (err) {
//       console.error(
//         "LOAD CASES ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to load recovery cases."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }


//   /* =======================================================
//      LOAD AGENTS
//   ======================================================= */

//   async function loadAgents() {
//     try {
//       setAgentsLoading(true);

//       const data =
//         await getFieldAgents();

//       const result =
//         Array.isArray(data)
//           ? data
//           : data?.agents || [];

//       setAgents(result);
//     } catch (err) {
//       console.error(
//         "LOAD AGENTS ERROR:",
//         err
//       );
//     } finally {
//       setAgentsLoading(false);
//     }
//   }


//   useEffect(() => {
//     loadCases();
//     loadAgents();
//   }, []);


//   /* =======================================================
//      FORM
//   ======================================================= */

//   function handleFormChange(
//     event
//   ) {
//     const {
//       name,
//       value,
//     } = event.target;

//     setForm(
//       (previous) => ({
//         ...previous,
//         [name]: value,
//       })
//     );
//   }


//   function resetForm() {
//     setForm({
//       customerName: "",
//       phone: "",
//       address: "",
//       amount: "",
//       priority: "medium",
//       status: "pending",
//     });
//   }


//   function openCreateModal() {
//     setError("");
//     resetForm();
//     setCreateOpen(true);
//   }


//   function closeCreateModal() {
//     if (formLoading) {
//       return;
//     }

//     setCreateOpen(false);
//     resetForm();
//   }


//   /* =======================================================
//      CREATE CASE
//   ======================================================= */

//   async function handleCreateCase(
//     event
//   ) {
//     event.preventDefault();

//     setError("");

//     if (!form.customerName.trim()) {
//       setError(
//         "Customer name is required."
//       );
//       return;
//     }

//     if (!form.phone.trim()) {
//       setError(
//         "Customer phone number is required."
//       );
//       return;
//     }

//     if (!form.address.trim()) {
//       setError(
//         "Customer address is required."
//       );
//       return;
//     }

//     if (form.amount === "") {
//       setError(
//         "Recovery amount is required."
//       );
//       return;
//     }

//     const amount =
//       Number(form.amount);

//     if (
//       !Number.isFinite(amount) ||
//       amount < 0
//     ) {
//       setError(
//         "Enter a valid recovery amount."
//       );
//       return;
//     }

//     try {
//       setFormLoading(true);

//       const result =
//         await createRecoveryCase({
//           customerName:
//             form.customerName.trim(),

//           phone:
//             form.phone.trim(),

//           address:
//             form.address.trim(),

//           amount,

//           priority:
//             form.priority,

//           status:
//             form.status,
//         });

//       if (
//         !result ||
//         result.success === false
//       ) {
//         throw new Error(
//           result?.message ||
//           "Unable to create recovery case."
//         );
//       }

//       if (result.case) {
//         setCases(
//           (previous) => [
//             ...previous,
//             result.case,
//           ]
//         );
//       } else {
//         await loadCases();
//       }

//       resetForm();
//       setCreateOpen(false);
//       setError("");
//     } catch (err) {
//       console.error(
//         "CREATE CASE ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Unable to create recovery case."
//       );
//     } finally {
//       setFormLoading(false);
//     }
//   }


//   /* =======================================================
//      OPEN ASSIGNMENT
//   ======================================================= */

//   function openAssignment(
//     item
//   ) {
//     setError("");
//     setAssigningCase(item);
//     setNearest(null);
//     setAssignMode(null);
//     setSelectedAgentId("");
//   }


//   function closeAssignment() {
//     if (actionLoading) {
//       return;
//     }

//     setAssigningCase(null);
//     setNearest(null);
//     setAssignMode(null);
//     setSelectedAgentId("");
//   }


//   /* =======================================================
//      FIND NEAREST
//   ======================================================= */

//   async function handleFindNearest() {
//     if (!assigningCase) {
//       return;
//     }

//     try {
//       setAssignMode(
//         "nearest"
//       );

//       setActionLoading(true);
//       setNearest(null);
//       setError("");

//       const result =
//         await findNearestAgent(
//           assigningCase.id
//         );

//       setNearest(result);
//     } catch (err) {
//       console.error(
//         "FIND NEAREST ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to find a nearby agent."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   }


//   /* =======================================================
//      ASSIGN NEAREST
//   ======================================================= */

//   async function handleAssignNearest() {
//     if (!assigningCase) {
//       return;
//     }

//     try {
//       setActionLoading(true);
//       setError("");

//       await assignNearestAgent(
//         assigningCase.id
//       );

//       closeAssignment();

//       await loadCases();
//       await loadAgents();
//     } catch (err) {
//       console.error(
//         "ASSIGN NEAREST ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to assign the nearest agent."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   }


//   /* =======================================================
//      ASSIGN SPECIFIC AGENT
//   ======================================================= */

//   async function handleAssignSpecific() {
//     if (
//       !assigningCase ||
//       !selectedAgentId
//     ) {
//       setError(
//         "Select an agent first."
//       );
//       return;
//     }

//     try {
//       setActionLoading(true);
//       setError("");

//       await assignAgent(
//         assigningCase.id,
//         selectedAgentId
//       );

//       closeAssignment();

//       await loadCases();
//       await loadAgents();
//     } catch (err) {
//       console.error(
//         "ASSIGN SPECIFIC ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to assign the selected agent."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   }


//   /* =======================================================
//      UNASSIGN
//   ======================================================= */

//   async function handleUnassign(
//     caseId
//   ) {
//     try {
//       setActionLoading(true);
//       setError("");

//       await unassignCase(
//         caseId
//       );

//       await loadCases();
//       await loadAgents();
//     } catch (err) {
//       console.error(
//         "UNASSIGN ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to unassign case."
//       );
//     } finally {
//       setActionLoading(false);
//     }
//   }


//   /* =======================================================
//      DELETE
//   ======================================================= */

//   function openDeleteModal(
//     item
//   ) {
//     setError("");
//     setDeleteCase(item);
//   }


//   function closeDeleteModal() {
//     if (deleteLoading) {
//       return;
//     }

//     setDeleteCase(null);
//   }


//   async function handleDeleteCase() {
//     if (!deleteCase) {
//       return;
//     }

//     try {
//       setDeleteLoading(true);
//       setError("");

//       const result =
//         await deleteRecoveryCase(
//           deleteCase.id
//         );

//       if (
//         !result ||
//         result.success === false
//       ) {
//         throw new Error(
//           result?.message ||
//           "Unable to delete recovery case."
//         );
//       }

//       setCases(
//         (previous) =>
//           previous.filter(
//             (item) =>
//               item.id !==
//               deleteCase.id
//           )
//       );

//       setDeleteCase(null);
//       await loadAgents();
//     } catch (err) {
//       console.error(
//         "DELETE CASE ERROR:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "Unable to delete recovery case."
//       );
//     } finally {
//       setDeleteLoading(false);
//     }
//   }


//   /* =======================================================
//      DISTANCE
//   ======================================================= */

//   function formatDistance(
//     distance
//   ) {
//     if (
//       distance === null ||
//       distance === undefined
//     ) {
//       return "—";
//     }

//     if (distance < 1000) {
//       return `${Math.round(
//         distance
//       )} m`;
//     }

//     return `${(
//       distance / 1000
//     ).toFixed(1)} km`;
//   }


//   /* =======================================================
//      MAP LINK
//   ======================================================= */

//   function openCaseMap(
//     item
//   ) {
//     if (
//       typeof item.latitude !==
//         "number" ||
//       typeof item.longitude !==
//         "number"
//     ) {
//       return;
//     }

//     const url =
//       `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;

//     window.open(
//       url,
//       "_blank",
//       "noopener,noreferrer"
//     );
//   }


//   return (
//     <AppShell
//       role="manager"
//       title="Recovery cases"
//       subtitle="Monitor, assign and review field recovery cases."
//     >

//       <div className="manager-page">

//         <div className="section-page-header">

//           <div>

//             <div className="dashboard-eyebrow">
//               CASE MANAGEMENT
//             </div>

//             <h2>
//               Recovery cases
//             </h2>

//             <p>
//               Create, assign and review recovery activity.
//             </p>

//           </div>


//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "10px",
//               flexWrap: "wrap",
//             }}
//           >

//             <button
//               className="outline-button"
//               type="button"
//               onClick={() => {
//                 loadCases();
//                 loadAgents();
//               }}
//               disabled={loading}
//             >

//               <RefreshCw
//                 size={15}
//                 className={
//                   loading
//                     ? "spin"
//                     : ""
//                 }
//               />

//               Refresh

//             </button>


//             <button
//               className="primary-small-button"
//               type="button"
//               onClick={
//                 openCreateModal
//               }
//             >

//               <Plus size={16} />

//               Create case

//             </button>

//           </div>

//         </div>


//         {error && (
//           <div className="api-error">

//             <AlertCircle size={18} />

//             <span>
//               {error}
//             </span>

//           </div>
//         )}


//         <div className="manager-table-card">

//           {loading ? (

//             <div className="page-state">

//               <RefreshCw
//                 size={22}
//                 className="spin"
//               />

//               <strong>
//                 Loading recovery cases...
//               </strong>

//             </div>

//           ) : cases.length === 0 ? (

//             <div className="page-state">

//               <div className="page-state-icon">
//                 <ClipboardList
//                   size={22}
//                 />
//               </div>

//               <strong>
//                 No recovery cases
//               </strong>

//               <span>
//                 Create your first recovery case to get started.
//               </span>

//               <button
//                 type="button"
//                 className="primary-small-button"
//                 onClick={
//                   openCreateModal
//                 }
//                 style={{
//                   marginTop:
//                     "12px",
//                 }}
//               >

//                 <Plus size={16} />

//                 Create case

//               </button>

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
//                       Location
//                     </th>

//                     <th>
//                       Priority
//                     </th>

//                     <th>
//                       Status
//                     </th>

//                     <th>
//                       Agent
//                     </th>

//                     <th>
//                       Actions
//                     </th>

//                   </tr>

//                 </thead>


//                 <tbody>

//                   {cases.map(
//                     (item) => (

//                       <tr
//                         key={
//                           item.id
//                         }
//                       >

//                         <td>
//                           <strong>
//                             {
//                               item.caseNumber ||
//                               item.id
//                             }
//                           </strong>
//                         </td>


//                         <td>

//                           <strong>
//                             {
//                               item.customerName ||
//                               "—"
//                             }
//                           </strong>

//                           {item.phone && (
//                             <div
//                               style={{
//                                 fontSize:
//                                   "12px",
//                                 marginTop:
//                                   "3px",
//                                 opacity:
//                                   0.7,
//                               }}
//                             >
//                               {
//                                 item.phone
//                               }
//                             </div>
//                           )}

//                         </td>


//                         <td>

//                           <div className="case-location-cell">

//                             <MapPin
//                               size={14}
//                             />

//                             <span>
//                               {
//                                 item.address ||
//                                 "Location unavailable"
//                               }
//                             </span>

//                             {typeof item.latitude ===
//                               "number" &&
//                             typeof item.longitude ===
//                               "number" && (
//                               <button
//                                 type="button"
//                                 className="outline-small-button"
//                                 onClick={() =>
//                                   openCaseMap(
//                                     item
//                                   )
//                                 }
//                                 title="Open location in Google Maps"
//                               >
//                                 <ExternalLink
//                                   size={13}
//                                 />
//                               </button>
//                             )}

//                           </div>

//                         </td>


//                         <td>

//                           <span
//                             className={`case-priority ${
//                               item.priority ||
//                               "medium"
//                             }`}
//                           >
//                             {
//                               item.priority ||
//                               "medium"
//                             }
//                           </span>

//                         </td>


//                         <td>

//                           <span
//                             className={`case-status ${
//                               item.status ||
//                               "pending"
//                             }`}
//                           >
//                             {
//                               item.status ||
//                               "pending"
//                             }
//                           </span>

//                         </td>


//                         <td>

//                           {item.assignedAgent ? (

//                             <div className="assigned-agent-cell">

//                               <UserCheck
//                                 size={15}
//                               />

//                               <div>

//                                 <strong>
//                                   {
//                                     item
//                                       .assignedAgent
//                                       .name
//                                   }
//                                 </strong>

//                                 <span>
//                                   Assigned
//                                 </span>

//                               </div>

//                             </div>

//                           ) : (

//                             <span className="unassigned-label">
//                               Unassigned
//                             </span>

//                           )}

//                         </td>


//                         <td>

//                           <div className="case-action-group">

//                             <button
//                               type="button"
//                               className="outline-small-button"
//                               onClick={() =>
//                                 setReviewCase(
//                                   item
//                                 )
//                               }
//                             >

//                               <Eye
//                                 size={14}
//                               />

//                               Review

//                             </button>


//                             {item.assignedAgentId ? (

//                               <button
//                                 type="button"
//                                 className="outline-small-button"
//                                 onClick={() =>
//                                   handleUnassign(
//                                     item.id
//                                   )
//                                 }
//                                 disabled={
//                                   actionLoading
//                                 }
//                               >

//                                 <X
//                                   size={14}
//                                 />

//                                 Unassign

//                               </button>

//                             ) : (

//                               <button
//                                 type="button"
//                                 className="primary-small-button"
//                                 onClick={() =>
//                                   openAssignment(
//                                     item
//                                   )
//                                 }
//                               >

//                                 <UserCheck
//                                   size={14}
//                                 />

//                                 Assign

//                               </button>

//                             )}


//                             <button
//                               type="button"
//                               className="danger-small-button"
//                               onClick={() =>
//                                 openDeleteModal(
//                                   item
//                                 )
//                               }
//                               disabled={
//                                 actionLoading ||
//                                 deleteLoading
//                               }
//                             >

//                               <Trash2
//                                 size={14}
//                               />

//                               Delete

//                             </button>

//                           </div>

//                         </td>

//                       </tr>

//                     )
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           )}

//         </div>

//       </div>


//       {/* =================================================
//           CREATE CASE
//       ================================================= */}

//       {createOpen && (

//         <div
//           className="assignment-overlay"
//           onClick={
//             closeCreateModal
//           }
//         >

//           <div
//             className="case-create-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             <div className="case-review-header">

//               <div>

//                 <div className="dashboard-eyebrow">
//                   NEW RECOVERY CASE
//                 </div>

//                 <h3>
//                   Create recovery case
//                 </h3>

//                 <p>
//                   Enter the customer's recovery details.
//                 </p>

//               </div>


//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={
//                   closeCreateModal
//                 }
//                 disabled={
//                   formLoading
//                 }
//               >
//                 <X size={19} />
//               </button>

//             </div>


//             <form
//               className="case-create-form"
//               onSubmit={
//                 handleCreateCase
//               }
//             >

//               <div className="case-form-grid">

//                 <div className="case-form-field">

//                   <label>
//                     Customer name *
//                   </label>

//                   <input
//                     type="text"
//                     name="customerName"
//                     value={
//                       form.customerName
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     placeholder="Rahul Kumar"
//                     disabled={
//                       formLoading
//                     }
//                   />

//                 </div>


//                 <div className="case-form-field">

//                   <label>
//                     Phone number *
//                   </label>

//                   <input
//                     type="tel"
//                     name="phone"
//                     value={
//                       form.phone
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     placeholder="9876543210"
//                     disabled={
//                       formLoading
//                     }
//                   />

//                 </div>


//                 <div className="case-form-field case-form-full">

//                   <label>
//                     Customer address / Plus Code *
//                   </label>

//                   <input
//                     type="text"
//                     name="address"
//                     value={
//                       form.address
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     placeholder="5J58+MJ, Hunasamaranahalli, Karnataka 562157"
//                     disabled={
//                       formLoading
//                     }
//                   />

//                   <small
//                     style={{
//                       marginTop:
//                         "6px",
//                       display:
//                         "block",
//                       opacity:
//                         0.65,
//                     }}
//                   >
//                     Enter a normal address or a Google Plus Code. Latitude and longitude are not required.
//                   </small>

//                 </div>


//                 <div className="case-form-field">

//                   <label>
//                     Recovery amount *
//                   </label>

//                   <input
//                     type="number"
//                     name="amount"
//                     value={
//                       form.amount
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     placeholder="25000"
//                     min="0"
//                     step="0.01"
//                     disabled={
//                       formLoading
//                     }
//                   />

//                 </div>


//                 <div className="case-form-field">

//                   <label>
//                     Priority
//                   </label>

//                   <select
//                     name="priority"
//                     value={
//                       form.priority
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     disabled={
//                       formLoading
//                     }
//                   >

//                     <option value="low">
//                       Low
//                     </option>

//                     <option value="medium">
//                       Medium
//                     </option>

//                     <option value="high">
//                       High
//                     </option>

//                     <option value="critical">
//                       Critical
//                     </option>

//                   </select>

//                 </div>


//                 <div className="case-form-field">

//                   <label>
//                     Status
//                   </label>

//                   <select
//                     name="status"
//                     value={
//                       form.status
//                     }
//                     onChange={
//                       handleFormChange
//                     }
//                     disabled={
//                       formLoading
//                     }
//                   >

//                     <option value="pending">
//                       Pending
//                     </option>

//                     <option value="in_progress">
//                       In progress
//                     </option>

//                   </select>

//                 </div>

//               </div>


//               <div className="case-create-footer">

//                 <button
//                   type="button"
//                   className="outline-button"
//                   onClick={
//                     closeCreateModal
//                   }
//                   disabled={
//                     formLoading
//                   }
//                 >
//                   Cancel
//                 </button>


//                 <button
//                   type="submit"
//                   className="primary-small-button"
//                   disabled={
//                     formLoading
//                   }
//                 >

//                   <Plus size={16} />

//                   {
//                     formLoading
//                       ? "Locating & creating..."
//                       : "Create case"
//                   }

//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       )}


//       {/* =================================================
//           ASSIGNMENT MODAL
//       ================================================= */}

//       {assigningCase && (

//         <div
//           className="assignment-overlay"
//           onClick={
//             closeAssignment
//           }
//         >

//           <div
//             className="assignment-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             <div className="assignment-modal-header">

//               <div>

//                 <div className="dashboard-eyebrow">
//                   CASE ASSIGNMENT
//                 </div>

//                 <h3>
//                   Assign field agent
//                 </h3>

//                 <p>
//                   {
//                     assigningCase.caseNumber ||
//                     assigningCase.id
//                   }
//                   {" · "}
//                   {
//                     assigningCase.customerName
//                   }
//                 </p>

//               </div>


//               <button
//                 type="button"
//                 className="modal-close"
//                 onClick={
//                   closeAssignment
//                 }
//               >
//                 <X size={19} />
//               </button>

//             </div>


//             {!assignMode && (

//               <div
//                 style={{
//                   display:
//                     "grid",
//                   gridTemplateColumns:
//                     "repeat(2, minmax(0, 1fr))",
//                   gap:
//                     "14px",
//                   marginTop:
//                     "20px",
//                 }}
//               >

//                 <button
//                   type="button"
//                   className="outline-button"
//                   onClick={() =>
//                     setAssignMode(
//                       "specific"
//                     )
//                   }
//                 >

//                   <Users size={18} />

//                   Assign specific agent

//                 </button>


//                 <button
//                   type="button"
//                   className="primary-small-button"
//                   onClick={
//                     handleFindNearest
//                   }
//                   disabled={
//                     actionLoading
//                   }
//                 >

//                   <Navigation size={18} />

//                   {actionLoading
//                     ? "Finding..."
//                     : "Assign nearest"}

//                 </button>

//               </div>

//             )}


//             {assignMode ===
//               "specific" && (

//               <div
//                 style={{
//                   marginTop:
//                     "20px",
//                 }}
//               >

//                 <label
//                   style={{
//                     display:
//                       "block",
//                     marginBottom:
//                       "8px",
//                     fontWeight:
//                       700,
//                   }}
//                 >
//                   Select agent
//                 </label>


//                 {agentsLoading ? (

//                   <div className="assignment-loading">

//                     <RefreshCw
//                       size={24}
//                       className="spin"
//                     />

//                     <strong>
//                       Loading agents...
//                     </strong>

//                   </div>

//                 ) : agents.length === 0 ? (

//                   <div className="assignment-loading">

//                     <Users
//                       size={24}
//                     />

//                     <strong>
//                       No registered agents found
//                     </strong>

//                     <span>
//                       Register an agent account first.
//                     </span>

//                   </div>

//                 ) : (

//                   <>

//                     <select
//                       value={
//                         selectedAgentId
//                       }
//                       onChange={(event) =>
//                         setSelectedAgentId(
//                           event.target.value
//                         )
//                       }
//                       style={{
//                         width:
//                           "100%",
//                         padding:
//                           "12px",
//                         borderRadius:
//                           "10px",
//                         border:
//                           "1px solid rgba(148,163,184,.35)",
//                         background:
//                           "var(--surface, #fff)",
//                       }}
//                     >

//                       <option value="">
//                         Select an agent
//                       </option>

//                       {agents
//                         .filter(
//                           (agent) =>
//                             agent.status ===
//                             "available"
//                         )
//                         .map(
//                           (agent) => (
//                             <option
//                               key={
//                                 agent.id
//                               }
//                               value={
//                                 agent.id
//                               }
//                             >
//                               {
//                                 agent.name
//                               }
//                               {" — "}
//                               {
//                                 agent.email
//                               }
//                               {" — "}
//                               {
//                                 agent.isLive
//                                   ? "GPS live"
//                                   : "GPS unavailable"
//                               }
//                             </option>
//                           )
//                         )}

//                     </select>


//                     <div className="assignment-modal-actions">

//                       <button
//                         type="button"
//                         className="outline-button"
//                         onClick={() =>
//                           setAssignMode(
//                             null
//                           )
//                         }
//                         disabled={
//                           actionLoading
//                         }
//                       >
//                         Back
//                       </button>


//                       <button
//                         type="button"
//                         className="primary-small-button"
//                         onClick={
//                           handleAssignSpecific
//                         }
//                         disabled={
//                           actionLoading ||
//                           !selectedAgentId
//                         }
//                       >

//                         <UserCheck
//                           size={16}
//                         />

//                         {
//                           actionLoading
//                             ? "Assigning..."
//                             : "Assign selected agent"
//                         }

//                       </button>

//                     </div>

//                   </>

//                 )}

//               </div>

//             )}


//             {assignMode ===
//               "nearest" && (

//               <>

//                 {!nearest ? (

//                   <div className="assignment-loading">

//                     <Navigation
//                       size={28}
//                     />

//                     <strong>
//                       Finding nearest available agent...
//                     </strong>

//                     <span>
//                       Checking currently available GPS locations.
//                     </span>

//                   </div>

//                 ) : (

//                   <>

//                     <div className="nearest-agent-card">

//                       <div className="nearest-agent-icon">

//                         <UserCheck
//                           size={22}
//                         />

//                       </div>


//                       <div className="nearest-agent-info">

//                         <span>
//                           NEAREST AVAILABLE AGENT
//                         </span>

//                         <strong>
//                           {
//                             nearest.agent?.name ||
//                             "Agent"
//                           }
//                         </strong>

//                         <small>
//                           {
//                             nearest.agent?.email ||
//                             "GPS available"
//                           }
//                         </small>

//                       </div>


//                       <div className="nearest-distance">

//                         <Navigation
//                           size={17}
//                         />

//                         <strong>
//                           {
//                             formatDistance(
//                               nearest.distance
//                             )
//                           }
//                         </strong>

//                         <span>
//                           from case
//                         </span>

//                       </div>

//                     </div>


//                     <div className="assignment-modal-actions">

//                       <button
//                         type="button"
//                         className="outline-button"
//                         onClick={() => {
//                           setAssignMode(
//                             null
//                           );
//                           setNearest(
//                             null
//                           );
//                         }}
//                         disabled={
//                           actionLoading
//                         }
//                       >
//                         Back
//                       </button>


//                       <button
//                         type="button"
//                         className="primary-small-button"
//                         onClick={
//                           handleAssignNearest
//                         }
//                         disabled={
//                           actionLoading
//                         }
//                       >

//                         <UserCheck
//                           size={16}
//                         />

//                         {
//                           actionLoading
//                             ? "Assigning..."
//                             : "Assign nearest agent"
//                         }

//                       </button>

//                     </div>

//                   </>

//                 )}

//               </>

//             )}

//           </div>

//         </div>

//       )}


//       {/* =================================================
//           DELETE
//       ================================================= */}

//       {deleteCase && (

//         <div
//           className="assignment-overlay"
//           onClick={
//             closeDeleteModal
//           }
//         >

//           <div
//             className="delete-case-modal"
//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             <div className="delete-case-icon">
//               <AlertTriangle
//                 size={24}
//               />
//             </div>


//             <div className="delete-case-content">

//               <div className="dashboard-eyebrow">
//                 DELETE CASE
//               </div>

//               <h3>
//                 Delete this recovery case?
//               </h3>

//               <p>
//                 You are about to permanently
//                 delete{" "}
//                 <strong>
//                   {
//                     deleteCase.caseNumber ||
//                     deleteCase.id
//                   }
//                 </strong>
//                 {" "}
//                 for{" "}
//                 <strong>
//                   {
//                     deleteCase.customerName ||
//                     "this customer"
//                   }
//                 </strong>
//                 .
//               </p>

//               <span className="delete-case-warning">
//                 This will remove the case and its related activity, evidence and assignment records.
//               </span>

//             </div>


//             <div className="delete-case-actions">

//               <button
//                 type="button"
//                 className="outline-button"
//                 onClick={
//                   closeDeleteModal
//                 }
//                 disabled={
//                   deleteLoading
//                 }
//               >
//                 Cancel
//               </button>


//               <button
//                 type="button"
//                 className="danger-button"
//                 onClick={
//                   handleDeleteCase
//                 }
//                 disabled={
//                   deleteLoading
//                 }
//               >

//                 <Trash2
//                   size={16}
//                 />

//                 {
//                   deleteLoading
//                     ? "Deleting..."
//                     : "Delete case"
//                 }

//               </button>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* =================================================
//           REVIEW
//       ================================================= */}

//       {reviewCase && (

//         <CaseReviewModal
//           caseData={
//             reviewCase
//           }
//           onClose={() =>
//             setReviewCase(
//               null
//             )
//           }
//         />

//       )}

//     </AppShell>
//   );
// }


// /* =========================================================
//    CASE REVIEW MODAL
// ========================================================= */

// function CaseReviewModal({
//   caseData,
//   onClose,
// }) {
//   const evidence =
//     caseData.evidence ||
//     [];

//   const updates =
//     caseData.updates ||
//     caseData.fieldUpdates ||
//     [];

//   const assignedAgent =
//     caseData.assignedAgent;

//   return (
//     <div
//       className="assignment-overlay"
//       onClick={
//         onClose
//       }
//     >

//       <div
//         className="case-review-modal"
//         onClick={(event) =>
//           event.stopPropagation()
//         }
//       >

//         <div className="case-review-header">

//           <div>

//             <div className="dashboard-eyebrow">
//               CASE REVIEW
//             </div>

//             <h3>
//               {
//                 caseData.caseNumber ||
//                 caseData.id
//               }
//             </h3>

//             <p>
//               {
//                 caseData.customerName ||
//                 "Recovery case"
//               }
//             </p>

//           </div>


//           <button
//             type="button"
//             className="modal-close"
//             onClick={
//               onClose
//             }
//           >
//             <X size={19} />
//           </button>

//         </div>


//         <div className="case-review-grid">

//           <ReviewField
//             label="Customer"
//             value={
//               caseData.customerName
//             }
//           />

//           <ReviewField
//             label="Phone"
//             value={
//               caseData.phone
//             }
//           />

//           <ReviewField
//             label="Status"
//             value={
//               caseData.status ||
//               "Pending"
//             }
//           />

//           <ReviewField
//             label="Priority"
//             value={
//               caseData.priority ||
//               "Medium"
//             }
//           />

//           <ReviewField
//             label="Address"
//             value={
//               caseData.address
//             }
//           />

//           <ReviewField
//             label="Map coordinates"
//             value={
//               typeof caseData.latitude ===
//                 "number" &&
//               typeof caseData.longitude ===
//                 "number"
//                 ? `${caseData.latitude.toFixed(6)}, ${caseData.longitude.toFixed(6)}`
//                 : "Not resolved"
//             }
//           />

//           <ReviewField
//             label="Assigned agent"
//             value={
//               assignedAgent?.name ||
//               caseData.agentName ||
//               "Unassigned"
//             }
//           />

//           <ReviewField
//             label="Recovery amount"
//             value={
//               caseData.amount !==
//               undefined
//                 ? `₹${Number(
//                     caseData.amount
//                   ).toLocaleString(
//                     "en-IN"
//                   )}`
//                 : "—"
//             }
//           />

//         </div>


//         <div className="case-review-section">

//           <div className="case-review-section-title">

//             <Clock3
//               size={17}
//             />

//             <h4>
//               Field activity
//             </h4>

//           </div>


//           {updates.length === 0 ? (

//             <div className="review-empty">
//               No field updates recorded yet.
//             </div>

//           ) : (

//             <div className="review-updates">

//               {updates.map(
//                 (
//                   update,
//                   index
//                 ) => (

//                   <div
//                     className="review-update"
//                     key={
//                       update.id ||
//                       index
//                     }
//                   >

//                     <div className="review-update-dot">

//                       <CheckCircle2
//                         size={14}
//                       />

//                     </div>

//                     <div>

//                       <strong>
//                         {
//                           update.outcome ||
//                           "Field update"
//                         }
//                       </strong>

//                       <p>
//                         {
//                           update.notes ||
//                           "No notes provided."
//                         }
//                       </p>

//                       <span>
//                         {
//                           update.createdAt
//                             ? new Date(
//                                 update.createdAt
//                               ).toLocaleString()
//                             : ""
//                         }
//                       </span>

//                     </div>

//                   </div>
//                 )
//               )}

//             </div>
//           )}

//         </div>


//         <div className="case-review-section">

//           <div className="case-review-section-title">

//             <FileImage
//               size={17}
//             />

//             <h4>
//               Evidence
//             </h4>

//           </div>


//           {evidence.length === 0 ? (

//             <div className="review-empty">
//               No evidence uploaded yet.
//             </div>

//           ) : (

//             <div className="evidence-review-grid">

//               {evidence.map(
//                 (
//                   item,
//                   index
//                 ) => {

//                   const url =
//                     item.path ||
//                     item.url ||
//                     "";

//                   const isImage =
//                     item.mimeType?.startsWith(
//                       "image/"
//                     );

//                   return (
//                     <div
//                       className="evidence-review-item"
//                       key={
//                         item.id ||
//                         index
//                       }
//                     >

//                       {isImage &&
//                       url ? (

//                         <img
//                           src={
//                             url.startsWith(
//                               "http"
//                             )
//                               ? url
//                               : `http://localhost:4000${url}`
//                           }
//                           alt={
//                             item.originalName ||
//                             "Evidence"
//                           }
//                         />

//                       ) : (

//                         <div className="evidence-document">

//                           <FileText
//                             size={26}
//                           />

//                         </div>
//                       )}


//                       <div>

//                         <strong>
//                           {
//                             item.originalName ||
//                             item.filename ||
//                             "Evidence file"
//                           }
//                         </strong>

//                         <span>
//                           {
//                             item.createdAt
//                               ? new Date(
//                                   item.createdAt
//                                 ).toLocaleString()
//                               : ""
//                           }
//                         </span>

//                       </div>

//                     </div>
//                   );
//                 }
//               )}

//             </div>
//           )}

//         </div>


//         <div className="case-review-footer">

//           <button
//             type="button"
//             className="primary-small-button"
//             onClick={
//               onClose
//             }
//           >
//             Close review
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }


// /* =========================================================
//    REVIEW FIELD
// ========================================================= */

// function ReviewField({
//   label,
//   value,
// }) {
//   return (
//     <div className="review-field">

//       <span>
//         {label}
//       </span>

//       <strong>
//         {value || "—"}
//       </strong>

//     </div>
//   );
// }


// export default ManagerCases;
import { useEffect, useState } from "react";

import {
  ClipboardList,
  RefreshCw,
  MapPin,
  UserCheck,
  Navigation,
  X,
  AlertCircle,
  FileImage,
  FileText,
  CheckCircle2,
  Clock3,
  Eye,
  Plus,
  Trash2,
  AlertTriangle,
  Users,
  ExternalLink,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getRecoveryCases,
  createRecoveryCase,
  getFieldAgents,
  findNearestAgent,
  assignNearestAgent,
  assignAgent,
  unassignCase,
  deleteRecoveryCase,
} from "../../api/api";


function ManagerCases() {
  const [cases, setCases] = useState([]);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [agentsLoading, setAgentsLoading] = useState(true);

  const [error, setError] = useState("");

  const [assigningCase, setAssigningCase] = useState(null);
  const [nearest, setNearest] = useState(null);
  const [reviewCase, setReviewCase] = useState(null);
  const [deleteCase, setDeleteCase] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const [assignMode, setAssignMode] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    amount: "",
    priority: "medium",
    status: "pending",
    agentId: "",
  });


  /* =======================================================
     LOAD CASES
  ======================================================= */

  async function loadCases() {
    try {
      setLoading(true);
      setError("");

      const data = await getRecoveryCases();

      const result =
        Array.isArray(data)
          ? data
          : data?.cases || [];

      setCases(result);
    } catch (err) {
      console.error(
        "LOAD CASES ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load recovery cases."
      );
    } finally {
      setLoading(false);
    }
  }


  /* =======================================================
     LOAD AGENTS
  ======================================================= */

  async function loadAgents() {
    try {
      setAgentsLoading(true);

      const data =
        await getFieldAgents();

      const result =
        Array.isArray(data)
          ? data
          : data?.agents || [];

      setAgents(result);
    } catch (err) {
      console.error(
        "LOAD AGENTS ERROR:",
        err
      );
    } finally {
      setAgentsLoading(false);
    }
  }


  useEffect(() => {
    loadCases();
    loadAgents();
  }, []);


  /* =======================================================
     REFRESH EVERYTHING
  ======================================================= */

  async function refreshAll() {
    await Promise.all([
      loadCases(),
      loadAgents(),
    ]);
  }


  /* =======================================================
     FORM
  ======================================================= */

  function handleFormChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  function resetForm() {
    setForm({
      customerName: "",
      phone: "",
      address: "",
      amount: "",
      priority: "medium",
      status: "pending",
      agentId: "",
    });
  }


  function openCreateModal() {
    setError("");
    resetForm();
    setCreateOpen(true);

    loadAgents();
  }


  function closeCreateModal() {
    if (formLoading) {
      return;
    }

    setCreateOpen(false);
    resetForm();
  }


  /* =======================================================
     CREATE CASE + ASSIGN AGENT
  ======================================================= */

  async function handleCreateCase(event) {
    event.preventDefault();

    setError("");

    if (!form.customerName.trim()) {
      setError(
        "Customer name is required."
      );
      return;
    }

    if (!form.phone.trim()) {
      setError(
        "Customer phone number is required."
      );
      return;
    }

    if (!form.address.trim()) {
      setError(
        "Customer address is required."
      );
      return;
    }

    if (form.amount === "") {
      setError(
        "Recovery amount is required."
      );
      return;
    }

    const amount =
      Number(form.amount);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      setError(
        "Enter a valid recovery amount."
      );
      return;
    }

    try {
      setFormLoading(true);

      /*
       * IMPORTANT:
       * agentId is now sent directly with
       * the create-case request.
       *
       * The backend must persist the assignment
       * before returning the case.
       */

      const result =
        await createRecoveryCase({
          customerName:
            form.customerName.trim(),

          phone:
            form.phone.trim(),

          address:
            form.address.trim(),

          amount,

          priority:
            form.priority,

          status:
            form.agentId
              ? "assigned"
              : form.status,

          agentId:
            form.agentId || null,
        });


      if (
        !result ||
        result.success === false
      ) {
        throw new Error(
          result?.message ||
          "Unable to create recovery case."
        );
      }


      /*
       * The backend should now return
       * the assignedAgent information.
       */

      if (result.case) {
        setCases(
          (previous) => [
            ...previous,
            result.case,
          ]
        );
      }


      resetForm();
      setCreateOpen(false);

      /*
       * Reload from database.
       * This guarantees manager UI reflects
       * the actual persisted state.
       */

      await refreshAll();

    } catch (err) {
      console.error(
        "CREATE CASE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to create recovery case."
      );
    } finally {
      setFormLoading(false);
    }
  }


  /* =======================================================
     OPEN ASSIGNMENT
  ======================================================= */

  function openAssignment(item) {
    setError("");

    setAssigningCase(item);
    setNearest(null);
    setAssignMode(null);
    setSelectedAgentId("");
  }


  function closeAssignment() {
    if (actionLoading) {
      return;
    }

    setAssigningCase(null);
    setNearest(null);
    setAssignMode(null);
    setSelectedAgentId("");
  }


  /* =======================================================
     FIND NEAREST
  ======================================================= */

  async function handleFindNearest() {
    if (!assigningCase) {
      return;
    }

    try {
      setAssignMode("nearest");
      setActionLoading(true);
      setNearest(null);
      setError("");

      const result =
        await findNearestAgent(
          assigningCase.id
        );

      setNearest(result);

    } catch (err) {
      console.error(
        "FIND NEAREST ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to find a nearby agent."
      );
    } finally {
      setActionLoading(false);
    }
  }


  /* =======================================================
     ASSIGN NEAREST
  ======================================================= */

  async function handleAssignNearest() {
    if (!assigningCase) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await assignNearestAgent(
        assigningCase.id
      );

      setAssigningCase(null);
      setNearest(null);
      setAssignMode(null);

      await refreshAll();

    } catch (err) {
      console.error(
        "ASSIGN NEAREST ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to assign nearest agent."
      );
    } finally {
      setActionLoading(false);
    }
  }


  /* =======================================================
     ASSIGN SPECIFIC AGENT
  ======================================================= */

  async function handleAssignSpecific() {
    if (
      !assigningCase ||
      !selectedAgentId
    ) {
      setError(
        "Select an agent first."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const result =
        await assignAgent(
          assigningCase.id,
          selectedAgentId
        );

      if (
        result &&
        result.success === false
      ) {
        throw new Error(
          result.message ||
          "Unable to assign agent."
        );
      }

      setAssigningCase(null);
      setNearest(null);
      setAssignMode(null);
      setSelectedAgentId("");

      await refreshAll();

    } catch (err) {
      console.error(
        "ASSIGN SPECIFIC ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to assign selected agent."
      );
    } finally {
      setActionLoading(false);
    }
  }


  /* =======================================================
     UNASSIGN
  ======================================================= */

  async function handleUnassign(caseId) {
    try {
      setActionLoading(true);
      setError("");

      await unassignCase(caseId);

      await refreshAll();

    } catch (err) {
      console.error(
        "UNASSIGN ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to unassign case."
      );
    } finally {
      setActionLoading(false);
    }
  }


  /* =======================================================
     DELETE
  ======================================================= */

  function openDeleteModal(item) {
    setError("");
    setDeleteCase(item);
  }


  function closeDeleteModal() {
    if (deleteLoading) {
      return;
    }

    setDeleteCase(null);
  }


  async function handleDeleteCase() {
    if (!deleteCase) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      const result =
        await deleteRecoveryCase(
          deleteCase.id
        );

      if (
        !result ||
        result.success === false
      ) {
        throw new Error(
          result?.message ||
          "Unable to delete recovery case."
        );
      }

      setDeleteCase(null);

      await refreshAll();

    } catch (err) {
      console.error(
        "DELETE CASE ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to delete recovery case."
      );
    } finally {
      setDeleteLoading(false);
    }
  }


  /* =======================================================
     DISTANCE
  ======================================================= */

  function formatDistance(distance) {
    if (
      distance === null ||
      distance === undefined
    ) {
      return "—";
    }

    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    }

    return `${(
      distance / 1000
    ).toFixed(1)} km`;
  }


  /* =======================================================
     MAP
  ======================================================= */

  function openCaseMap(item) {
    const latitude =
      Number(item.latitude);

    const longitude =
      Number(item.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank",
      "noopener,noreferrer"
    );
  }


  /* =======================================================
     AVAILABLE AGENTS
  ======================================================= */

  const availableAgents =
    agents.filter(
      (agent) =>
        agent.status ===
        "available"
    );


  return (
    <AppShell
      role="manager"
      title="Recovery cases"
      subtitle="Monitor, assign and review field recovery cases."
    >

      <div className="manager-page">

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              CASE MANAGEMENT
            </div>

            <h2>
              Recovery cases
            </h2>

            <p>
              Create, assign and review recovery activity.
            </p>

          </div>


          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >

            <button
              className="outline-button"
              type="button"
              onClick={refreshAll}
              disabled={
                loading ||
                agentsLoading
              }
            >

              <RefreshCw
                size={15}
                className={
                  loading
                    ? "spin"
                    : ""
                }
              />

              Refresh

            </button>


            <button
              className="primary-small-button"
              type="button"
              onClick={
                openCreateModal
              }
            >

              <Plus size={16} />

              Create case

            </button>

          </div>

        </div>


        {error && (
          <div className="api-error">

            <AlertCircle size={18} />

            <span>
              {error}
            </span>

          </div>
        )}


        <div className="manager-table-card">

          {loading ? (

            <div className="page-state">

              <RefreshCw
                size={22}
                className="spin"
              />

              <strong>
                Loading recovery cases...
              </strong>

            </div>

          ) : cases.length === 0 ? (

            <div className="page-state">

              <div className="page-state-icon">
                <ClipboardList size={22} />
              </div>

              <strong>
                No recovery cases
              </strong>

              <span>
                Create your first recovery case to get started.
              </span>

              <button
                type="button"
                className="primary-small-button"
                onClick={
                  openCreateModal
                }
                style={{
                  marginTop: "12px",
                }}
              >

                <Plus size={16} />

                Create case

              </button>

            </div>

          ) : (

            <div className="case-table-wrapper">

              <table className="case-table">

                <thead>

                  <tr>
                    <th>Case</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Agent</th>
                    <th>Actions</th>
                  </tr>

                </thead>


                <tbody>

                  {cases.map(
                    (item) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          <strong>
                            {
                              item.caseNumber ||
                              item.id
                            }
                          </strong>
                        </td>


                        <td>

                          <strong>
                            {
                              item.customerName ||
                              "—"
                            }
                          </strong>

                          {item.phone && (
                            <div
                              style={{
                                fontSize:
                                  "12px",
                                marginTop:
                                  "3px",
                                opacity:
                                  0.7,
                              }}
                            >
                              {
                                item.phone
                              }
                            </div>
                          )}

                        </td>


                        <td>

                          <div className="case-location-cell">

                            <MapPin
                              size={14}
                            />

                            <span>
                              {
                                item.address ||
                                "Location unavailable"
                              }
                            </span>

                            {Number.isFinite(
                              Number(
                                item.latitude
                              )
                            ) &&
                            Number.isFinite(
                              Number(
                                item.longitude
                              )
                            ) && (

                              <button
                                type="button"
                                className="outline-small-button"
                                onClick={() =>
                                  openCaseMap(
                                    item
                                  )
                                }
                              >

                                <ExternalLink
                                  size={13}
                                />

                              </button>

                            )}

                          </div>

                        </td>


                        <td>

                          <span
                            className={`case-priority ${
                              item.priority ||
                              "medium"
                            }`}
                          >
                            {
                              item.priority ||
                              "medium"
                            }
                          </span>

                        </td>


                        <td>

                          <span
                            className={`case-status ${
                              item.status ||
                              "pending"
                            }`}
                          >
                            {
                              item.status ||
                              "pending"
                            }
                          </span>

                        </td>


                        <td>

                          {item.assignedAgent ? (

                            <div className="assigned-agent-cell">

                              <UserCheck
                                size={15}
                              />

                              <div>

                                <strong>
                                  {
                                    item
                                      .assignedAgent
                                      .name
                                  }
                                </strong>

                                <span>
                                  Assigned
                                </span>

                              </div>

                            </div>

                          ) : (

                            <span className="unassigned-label">
                              Unassigned
                            </span>

                          )}

                        </td>


                        <td>

                          <div className="case-action-group">

                            <button
                              type="button"
                              className="outline-small-button"
                              onClick={() =>
                                setReviewCase(
                                  item
                                )
                              }
                            >

                              <Eye
                                size={14}
                              />

                              Review

                            </button>


                            {item.assignedAgentId ? (

                              <button
                                type="button"
                                className="outline-small-button"
                                onClick={() =>
                                  handleUnassign(
                                    item.id
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                              >

                                <X
                                  size={14}
                                />

                                Unassign

                              </button>

                            ) : (

                              <button
                                type="button"
                                className="primary-small-button"
                                onClick={() =>
                                  openAssignment(
                                    item
                                  )
                                }
                              >

                                <UserCheck
                                  size={14}
                                />

                                Assign

                              </button>

                            )}


                            <button
                              type="button"
                              className="danger-small-button"
                              onClick={() =>
                                openDeleteModal(
                                  item
                                )
                              }
                            >

                              <Trash2
                                size={14}
                              />

                              Delete

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          CREATE CASE MODAL
      ================================================= */}

      {createOpen && (

        <div
          className="assignment-overlay"
          onClick={
            closeCreateModal
          }
        >

          <div
            className="case-create-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="case-review-header">

              <div>

                <div className="dashboard-eyebrow">
                  NEW RECOVERY CASE
                </div>

                <h3>
                  Create recovery case
                </h3>

                <p>
                  Enter customer details and optionally assign an agent.
                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  closeCreateModal
                }
                disabled={
                  formLoading
                }
              >
                <X size={19} />
              </button>

            </div>


            <form
              className="case-create-form"
              onSubmit={
                handleCreateCase
              }
            >

              <div className="case-form-grid">

                <div className="case-form-field">

                  <label>
                    Customer name *
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    value={
                      form.customerName
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="Rahul Kumar"
                    disabled={
                      formLoading
                    }
                  />

                </div>


                <div className="case-form-field">

                  <label>
                    Phone number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="9876543210"
                    disabled={
                      formLoading
                    }
                  />

                </div>


                <div className="case-form-field case-form-full">

                  <label>
                    Customer address *
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="5J58+MJ, Hunasamaranahalli, Karnataka 562157"
                    disabled={
                      formLoading
                    }
                  />

                  <small
                    style={{
                      display:
                        "block",
                      marginTop:
                        "6px",
                      opacity:
                        0.65,
                    }}
                  >
                    Normal address or Google Plus Code is supported.
                  </small>

                </div>


                <div className="case-form-field">

                  <label>
                    Recovery amount *
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={
                      form.amount
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder="25000"
                    min="0"
                    step="0.01"
                    disabled={
                      formLoading
                    }
                  />

                </div>


                <div className="case-form-field">

                  <label>
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={
                      form.priority
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={
                      formLoading
                    }
                  >

                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="critical">
                      Critical
                    </option>

                  </select>

                </div>


                {/* =================================================
                    DIRECT AGENT ASSIGNMENT
                ================================================= */}

                <div className="case-form-field case-form-full">

                  <label>
                    Assign field agent
                  </label>

                  <select
                    name="agentId"
                    value={
                      form.agentId
                    }
                    onChange={
                      handleFormChange
                    }
                    disabled={
                      formLoading ||
                      agentsLoading
                    }
                  >

                    <option value="">
                      Leave unassigned
                    </option>

                    {availableAgents.map(
                      (agent) => (

                        <option
                          key={
                            agent.id
                          }
                          value={
                            agent.id
                          }
                        >
                          {
                            agent.name
                          }
                          {" — "}
                          {
                            agent.email
                          }
                        </option>

                      )
                    )}

                  </select>

                  <small
                    style={{
                      display:
                        "block",
                      marginTop:
                        "6px",
                      opacity:
                        0.65,
                    }}
                  >
                    Selecting an agent assigns the case immediately when it is created.
                  </small>

                </div>

              </div>


              <div className="case-create-footer">

                <button
                  type="button"
                  className="outline-button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    formLoading
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-small-button"
                  disabled={
                    formLoading
                  }
                >

                  <Plus size={16} />

                  {
                    formLoading
                      ? "Creating & assigning..."
                      : form.agentId
                        ? "Create & assign"
                        : "Create case"
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          ASSIGNMENT MODAL
      ================================================= */}

      {assigningCase && (

        <div
          className="assignment-overlay"
          onClick={
            closeAssignment
          }
        >

          <div
            className="assignment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="assignment-modal-header">

              <div>

                <div className="dashboard-eyebrow">
                  CASE ASSIGNMENT
                </div>

                <h3>
                  Assign field agent
                </h3>

                <p>
                  {
                    assigningCase.caseNumber ||
                    assigningCase.id
                  }
                  {" · "}
                  {
                    assigningCase.customerName
                  }
                </p>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={
                  closeAssignment
                }
              >
                <X size={19} />
              </button>

            </div>


            {!assignMode && (

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap:
                    "14px",
                  marginTop:
                    "20px",
                }}
              >

                <button
                  type="button"
                  className="outline-button"
                  onClick={() =>
                    setAssignMode(
                      "specific"
                    )
                  }
                >

                  <Users size={18} />

                  Assign specific agent

                </button>


                <button
                  type="button"
                  className="primary-small-button"
                  onClick={
                    handleFindNearest
                  }
                  disabled={
                    actionLoading
                  }
                >

                  <Navigation size={18} />

                  Assign nearest

                </button>

              </div>

            )}


            {assignMode ===
              "specific" && (

              <div
                style={{
                  marginTop:
                    "20px",
                }}
              >

                <label
                  style={{
                    display:
                      "block",
                    marginBottom:
                      "8px",
                    fontWeight:
                      700,
                  }}
                >
                  Select agent
                </label>


                <select
                  value={
                    selectedAgentId
                  }
                  onChange={(event) =>
                    setSelectedAgentId(
                      event.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "12px",
                    borderRadius:
                      "10px",
                    border:
                      "1px solid rgba(148,163,184,.35)",
                  }}
                >

                  <option value="">
                    Select an available agent
                  </option>

                  {availableAgents.map(
                    (agent) => (

                      <option
                        key={
                          agent.id
                        }
                        value={
                          agent.id
                        }
                      >
                        {
                          agent.name
                        }
                        {" — "}
                        {
                          agent.email
                        }
                      </option>

                    )
                  )}

                </select>


                <div className="assignment-modal-actions">

                  <button
                    type="button"
                    className="outline-button"
                    onClick={() =>
                      setAssignMode(
                        null
                      )
                    }
                  >
                    Back
                  </button>


                  <button
                    type="button"
                    className="primary-small-button"
                    onClick={
                      handleAssignSpecific
                    }
                    disabled={
                      actionLoading ||
                      !selectedAgentId
                    }
                  >

                    <UserCheck
                      size={16}
                    />

                    {
                      actionLoading
                        ? "Assigning..."
                        : "Assign selected agent"
                    }

                  </button>

                </div>

              </div>

            )}


            {assignMode ===
              "nearest" && (

              <>

                {!nearest ? (

                  <div className="assignment-loading">

                    <Navigation
                      size={28}
                    />

                    <strong>
                      Finding nearest available agent...
                    </strong>

                    <span>
                      Checking live GPS locations.
                    </span>

                  </div>

                ) : (

                  <>

                    <div className="nearest-agent-card">

                      <div className="nearest-agent-icon">

                        <UserCheck
                          size={22}
                        />

                      </div>


                      <div className="nearest-agent-info">

                        <span>
                          NEAREST AVAILABLE AGENT
                        </span>

                        <strong>
                          {
                            nearest.agent?.name ||
                            "Agent"
                          }
                        </strong>

                        <small>
                          {
                            nearest.agent?.email ||
                            "GPS available"
                          }
                        </small>

                      </div>


                      <div className="nearest-distance">

                        <Navigation
                          size={17}
                        />

                        <strong>
                          {
                            formatDistance(
                              nearest.distance
                            )
                          }
                        </strong>

                        <span>
                          from case
                        </span>

                      </div>

                    </div>


                    <div className="assignment-modal-actions">

                      <button
                        type="button"
                        className="outline-button"
                        onClick={() => {
                          setAssignMode(
                            null
                          );
                          setNearest(
                            null
                          );
                        }}
                      >
                        Back
                      </button>


                      <button
                        type="button"
                        className="primary-small-button"
                        onClick={
                          handleAssignNearest
                        }
                        disabled={
                          actionLoading
                        }
                      >

                        <UserCheck
                          size={16}
                        />

                        {
                          actionLoading
                            ? "Assigning..."
                            : "Assign nearest agent"
                        }

                      </button>

                    </div>

                  </>

                )}

              </>

            )}

          </div>

        </div>

      )}


      {/* =================================================
          DELETE
      ================================================= */}

      {deleteCase && (

        <div
          className="assignment-overlay"
          onClick={
            closeDeleteModal
          }
        >

          <div
            className="delete-case-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="delete-case-icon">

              <AlertTriangle
                size={24}
              />

            </div>


            <div className="delete-case-content">

              <div className="dashboard-eyebrow">
                DELETE CASE
              </div>

              <h3>
                Delete this recovery case?
              </h3>

              <p>
                You are about to permanently
                delete{" "}
                <strong>
                  {
                    deleteCase.caseNumber ||
                    deleteCase.id
                  }
                </strong>
                {" "}
                for{" "}
                <strong>
                  {
                    deleteCase.customerName ||
                    "this customer"
                  }
                </strong>
                .
              </p>

              <span className="delete-case-warning">
                This removes the case and related activity, evidence and assignment records.
              </span>

            </div>


            <div className="delete-case-actions">

              <button
                type="button"
                className="outline-button"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  deleteLoading
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="danger-button"
                onClick={
                  handleDeleteCase
                }
                disabled={
                  deleteLoading
                }
              >

                <Trash2
                  size={16}
                />

                {
                  deleteLoading
                    ? "Deleting..."
                    : "Delete case"
                }

              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          REVIEW
      ================================================= */}

      {reviewCase && (

        <CaseReviewModal
          caseData={
            reviewCase
          }
          onClose={() =>
            setReviewCase(
              null
            )
          }
        />

      )}

    </AppShell>
  );
}


/* =========================================================
   CASE REVIEW MODAL
========================================================= */

function CaseReviewModal({
  caseData,
  onClose,
}) {
  const evidence =
    caseData.evidence ||
    [];

  const updates =
    caseData.updates ||
    caseData.fieldUpdates ||
    [];

  const assignedAgent =
    caseData.assignedAgent;

  return (
    <div
      className="assignment-overlay"
      onClick={
        onClose
      }
    >

      <div
        className="case-review-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="case-review-header">

          <div>

            <div className="dashboard-eyebrow">
              CASE REVIEW
            </div>

            <h3>
              {
                caseData.caseNumber ||
                caseData.id
              }
            </h3>

            <p>
              {
                caseData.customerName ||
                "Recovery case"
              }
            </p>

          </div>


          <button
            type="button"
            className="modal-close"
            onClick={
              onClose
            }
          >
            <X size={19} />
          </button>

        </div>


        <div className="case-review-grid">

          <ReviewField
            label="Customer"
            value={
              caseData.customerName
            }
          />

          <ReviewField
            label="Phone"
            value={
              caseData.phone
            }
          />

          <ReviewField
            label="Status"
            value={
              caseData.status
            }
          />

          <ReviewField
            label="Priority"
            value={
              caseData.priority
            }
          />

          <ReviewField
            label="Address"
            value={
              caseData.address
            }
          />

          <ReviewField
            label="Assigned agent"
            value={
              assignedAgent?.name ||
              "Unassigned"
            }
          />

          <ReviewField
            label="Recovery amount"
            value={
              caseData.amount !==
              undefined
                ? `₹${Number(
                    caseData.amount
                  ).toLocaleString(
                    "en-IN"
                  )}`
                : "—"
            }
          />

        </div>


        <div className="case-review-section">

          <div className="case-review-section-title">

            <Clock3 size={17} />

            <h4>
              Field activity
            </h4>

          </div>


          {updates.length === 0 ? (

            <div className="review-empty">
              No field updates recorded yet.
            </div>

          ) : (

            <div className="review-updates">

              {updates.map(
                (
                  update,
                  index
                ) => (

                  <div
                    className="review-update"
                    key={
                      update.id ||
                      index
                    }
                  >

                    <div className="review-update-dot">

                      <CheckCircle2
                        size={14}
                      />

                    </div>

                    <div>

                      <strong>
                        {
                          update.outcome ||
                          "Field update"
                        }
                      </strong>

                      <p>
                        {
                          update.notes ||
                          "No notes provided."
                        }
                      </p>

                      <span>
                        {
                          update.createdAt
                            ? new Date(
                                update.createdAt
                              ).toLocaleString()
                            : ""
                        }
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        <div className="case-review-section">

          <div className="case-review-section-title">

            <FileImage size={17} />

            <h4>
              Evidence
            </h4>

          </div>


          {evidence.length === 0 ? (

            <div className="review-empty">
              No evidence uploaded yet.
            </div>

          ) : (

            <div className="evidence-review-grid">

              {evidence.map(
                (
                  item,
                  index
                ) => {

                  const url =
                    item.path ||
                    item.url ||
                    "";

                  const isImage =
                    item.mimeType?.startsWith(
                      "image/"
                    );

                  return (
                    <div
                      className="evidence-review-item"
                      key={
                        item.id ||
                        index
                      }
                    >

                      {isImage &&
                      url ? (

                        <img
                          src={
                            url.startsWith(
                              "http"
                            )
                              ? url
                              : `http://localhost:4000${url}`
                          }
                          alt={
                            item.originalName ||
                            "Evidence"
                          }
                        />

                      ) : (

                        <div className="evidence-document">

                          <FileText
                            size={26}
                          />

                        </div>

                      )}

                      <div>

                        <strong>
                          {
                            item.originalName ||
                            item.filename ||
                            "Evidence file"
                          }
                        </strong>

                        <span>
                          {
                            item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleString()
                              : ""
                          }
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>


        <div className="case-review-footer">

          <button
            type="button"
            className="primary-small-button"
            onClick={
              onClose
            }
          >
            Close review
          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   REVIEW FIELD
========================================================= */

function ReviewField({
  label,
  value,
}) {
  return (
    <div className="review-field">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}


export default ManagerCases;