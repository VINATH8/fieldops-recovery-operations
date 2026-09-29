// import {
//   useCallback,
//   useEffect,
//   useState,
// } from "react";

// import {
//   ClipboardPenLine,
//   Camera,
//   Send,
//   Upload,
//   FileImage,
//   CheckCircle2,
//   X,
//   RefreshCw,
//   AlertCircle,
// } from "lucide-react";

// import AppShell from "../../components/layout/AppShell";

// import {
//   getAgentCases,
//   createFieldUpdate,
//   uploadEvidence,
// } from "../../api/api";


// /* =========================================================
//    HELPERS
// ========================================================= */

// function normalizeTask(item) {

//   if (!item) {
//     return null;
//   }


//   const isLocationAssignment =
//     item.taskType ===
//       "location_assignment" ||
//     String(
//       item.caseNumber ||
//       ""
//     ).startsWith(
//       "TASK-agent_assignment_"
//     );


//   return {

//     ...item,

//     id:
//       item.id,

//     caseNumber:
//       item.caseNumber ||
//       item.id,

//     customerName:
//       item.customerName ||
//       (
//         isLocationAssignment
//           ? "Assigned destination"
//           : "Recovery case"
//       ),

//     address:
//       item.address ||
//       item.location ||
//       item.geocodedAddress ||
//       "",

//     status:
//       item.status ||
//       "assigned",

//     taskType:
//       isLocationAssignment
//         ? "location_assignment"
//         : "recovery_case",

//     isLocationAssignment,

//   };

// }


// /* =========================================================
//    AGENT UPDATES
// ========================================================= */

// function AgentUpdates() {

//   const [cases, setCases] =
//     useState([]);

//   const [selectedCase, setSelectedCase] =
//     useState("");

//   const [notes, setNotes] =
//     useState("");

//   const [outcome, setOutcome] =
//     useState("");

//   const [file, setFile] =
//     useState(null);

//   const [loading, setLoading] =
//     useState(true);

//   const [submitting, setSubmitting] =
//     useState(false);

//   const [uploading, setUploading] =
//     useState(false);

//   const [message, setMessage] =
//     useState("");

//   const [error, setError] =
//     useState("");


//   /* =========================================================
//      LOAD ALL ASSIGNED WORK
//   ========================================================= */

//   const loadCases =
//     useCallback(
//       async ({
//         silent = false,
//       } = {}) => {

//         try {

//           if (!silent) {

//             setLoading(
//               true
//             );

//           }


//           if (!silent) {

//             setError("");

//           }


//           const response =
//             await getAgentCases();


//           console.log(
//             "AGENT UPDATES CASES RESPONSE:",
//             response
//           );


//           let result = [];


//           if (
//             Array.isArray(
//               response
//             )
//           ) {

//             result =
//               response;

//           } else if (
//             Array.isArray(
//               response?.cases
//             )
//           ) {

//             result =
//               response.cases;

//           } else if (
//             Array.isArray(
//               response?.data?.cases
//             )
//           ) {

//             result =
//               response.data.cases;

//           } else if (
//             Array.isArray(
//               response?.tasks
//             )
//           ) {

//             result =
//               response.tasks;

//           } else if (
//             Array.isArray(
//               response?.data?.tasks
//             )
//           ) {

//             result =
//               response.data.tasks;

//           }


//           console.log(
//             "AGENT UPDATES RAW CASES:",
//             result
//           );


//           /*
//            * IMPORTANT:
//            *
//            * Do NOT filter out location assignments.
//            *
//            * Both manager-assigned recovery cases
//            * and manager-assigned destinations can
//            * now appear in Visit Report.
//            */

//           const assignedTasks =
//             result
//               .map(
//                 normalizeTask
//               )
//               .filter(Boolean);


//           console.log(
//             "AGENT UPDATES ASSIGNED TASKS:",
//             assignedTasks
//           );


//           setCases(
//             assignedTasks
//           );


//           /*
//            * Keep the current selection if
//            * it still exists.
//            */

//           setSelectedCase(
//             (current) => {

//               if (
//                 !assignedTasks.length
//               ) {

//                 return "";

//               }


//               const exists =
//                 current &&
//                 assignedTasks.some(
//                   (item) =>
//                     String(
//                       item.id
//                     ) ===
//                     String(
//                       current
//                     )
//                 );


//               if (
//                 exists
//               ) {

//                 return current;

//               }


//               return String(
//                 assignedTasks[0].id
//               );

//             }
//           );


//         } catch (err) {

//           console.error(
//             "AGENT UPDATES LOAD ERROR:",
//             err
//           );


//           if (!silent) {

//             setError(
//               err?.response?.data?.message ||
//               "Unable to load assigned work."
//             );

//           }

//         } finally {

//           if (!silent) {

//             setLoading(
//               false
//             );

//           }

//         }

//       },
//       []
//     );


//   /* =========================================================
//      INITIAL LOAD + AUTO REFRESH
//   ========================================================= */

//   useEffect(() => {

//     loadCases();


//     const interval =
//       window.setInterval(
//         () => {

//           loadCases({
//             silent: true,
//           });

//         },
//         5000
//       );


//     function handleFocus() {

//       loadCases({
//         silent: true,
//       });

//     }


//     window.addEventListener(
//       "focus",
//       handleFocus
//     );


//     return () => {

//       window.clearInterval(
//         interval
//       );

//       window.removeEventListener(
//         "focus",
//         handleFocus
//       );

//     };

//   }, [
//     loadCases,
//   ]);


//   /* =========================================================
//      FILE SELECTION
//   ========================================================= */

//   function handleFileChange(
//     event
//   ) {

//     const selectedFile =
//       event.target.files?.[0];


//     if (!selectedFile) {
//       return;
//     }


//     const allowedTypes = [

//       "image/jpeg",

//       "image/png",

//       "image/webp",

//       "application/pdf",

//     ];


//     if (
//       !allowedTypes.includes(
//         selectedFile.type
//       )
//     ) {

//       setError(
//         "Only JPG, PNG, WEBP and PDF files are allowed."
//       );


//       event.target.value =
//         "";


//       return;

//     }


//     if (
//       selectedFile.size >
//       10 * 1024 * 1024
//     ) {

//       setError(
//         "File size must be below 10 MB."
//       );


//       event.target.value =
//         "";


//       return;

//     }


//     setError("");

//     setFile(
//       selectedFile
//     );

//   }


//   /* =========================================================
//      REMOVE FILE
//   ========================================================= */

//   function removeFile() {

//     setFile(
//       null
//     );

//   }


//   /* =========================================================
//      SUBMIT FIELD UPDATE
//   ========================================================= */

//   async function handleSubmit(
//     event
//   ) {

//     event.preventDefault();


//     setError("");

//     setMessage("");


//     if (!selectedCase) {

//       setError(
//         "Select an assigned case first."
//       );

//       return;

//     }


//     const selectedTask =
//       cases.find(
//         (item) =>
//           String(
//             item.id
//           ) ===
//           String(
//             selectedCase
//           )
//       );


//     if (!selectedTask) {

//       setError(
//         "The selected assignment is no longer available. Please refresh."
//       );

//       return;

//     }


//     if (!notes.trim()) {

//       setError(
//         "Field notes are required."
//       );

//       return;

//     }


//     try {

//       setSubmitting(
//         true
//       );


//       /*
//        * Evidence remains completely optional.
//        */

//       if (file) {

//         setUploading(
//           true
//         );


//         await uploadEvidence(
//           selectedCase,
//           file
//         );


//         setUploading(
//           false
//         );

//       }


//       /*
//        * Send the update.
//        *
//        * For a normal recovery case this uses
//        * the recovery-case ID.
//        *
//        * For a direct assignment it uses the
//        * assignment ID. The backend replacement
//        * below handles both.
//        */

//       await createFieldUpdate(
//         selectedCase,
//         {

//           notes:
//             notes.trim(),

//           outcome:
//             outcome.trim(),

//           taskType:
//             selectedTask.taskType,

//           address:
//             selectedTask.address,

//           customerName:
//             selectedTask.customerName,

//         }
//       );


//       setMessage(
//         file
//           ? "Field update and evidence submitted to the manager."
//           : "Field update submitted to the manager."
//       );


//       setNotes("");

//       setOutcome("");

//       setFile(
//         null
//       );


//       await loadCases({
//         silent: true,
//       });


//     } catch (err) {

//       console.error(
//         "FIELD UPDATE SUBMIT ERROR:",
//         err
//       );


//       setUploading(
//         false
//       );


//       setError(
//         err?.response?.data?.message ||
//         "Unable to submit the field update."
//       );


//     } finally {

//       setSubmitting(
//         false
//       );

//     }

//   }


//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (

//     <AppShell
//       role="agent"
//       title="Field updates"
//       subtitle="Record verified information from recovery visits."
//     >

//       <div className="updates-page">


//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <div className="section-page-header">

//           <div>

//             <div className="dashboard-eyebrow">
//               FIELD REPORTING
//             </div>

//             <h2>
//               Field updates
//             </h2>

//             <p>
//               Record what happened during your
//               recovery visit.
//             </p>

//           </div>

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

//           </div>

//         )}


//         {/* =================================================
//             SUCCESS
//         ================================================= */}

//         {message && (

//           <div className="success-message">

//             <CheckCircle2
//               size={17}
//             />

//             <span>
//               {message}
//             </span>

//           </div>

//         )}


//         {/* =================================================
//             MAIN UPDATE LAYOUT
//         ================================================= */}

//         <div className="updates-layout">


//           {/* =================================================
//               FORM
//           ================================================= */}

//           <section className="update-form-card">


//             <div className="update-card-heading">

//               <div className="update-heading-icon">

//                 <ClipboardPenLine
//                   size={20}
//                 />

//               </div>


//               <div>

//                 <h3>
//                   Visit report
//                 </h3>

//                 <p>
//                   Submit verified field information
//                   against an assigned case.
//                 </p>

//               </div>

//             </div>


//             <form
//               className="field-update-form"
//               onSubmit={
//                 handleSubmit
//               }
//             >


//               {/* =================================================
//                   RECOVERY CASE
//               ================================================= */}

//               <label>
//                 Recovery case
//               </label>


//               <select
//                 value={
//                   selectedCase
//                 }
//                 onChange={(
//                   event
//                 ) =>
//                   setSelectedCase(
//                     event.target.value
//                   )
//                 }
//                 disabled={
//                   loading ||
//                   submitting ||
//                   !cases.length
//                 }
//               >

//                 <option value="">

//                   {
//                     loading
//                       ? "Loading assigned cases..."
//                       : cases.length
//                         ? "Select a case"
//                         : "No assigned recovery cases"
//                   }

//                 </option>


//                 {cases.map(
//                   (
//                     item
//                   ) => (

//                     <option
//                       key={
//                         item.id
//                       }
//                       value={
//                         item.id
//                       }
//                     >

//                       {
//                         item.isLocationAssignment
//                           ? "Assigned destination"
//                           : (
//                               item.caseNumber ||
//                               item.id
//                             )
//                       }

//                       {" — "}

//                       {
//                         item.customerName ||
//                         "Recovery case"
//                       }

//                     </option>

//                   )
//                 )}

//               </select>


//               {/* =================================================
//                   SELECTED ASSIGNMENT INFO
//               ================================================= */}

//               {selectedCase && (

//                 <div
//                   style={{
//                     marginTop:
//                       "8px",
//                     marginBottom:
//                       "8px",
//                     fontSize:
//                       "13px",
//                     lineHeight:
//                       "1.5",
//                     color:
//                       "#64748b",
//                   }}
//                 >

//                   {
//                     cases.find(
//                       (item) =>
//                         String(
//                           item.id
//                         ) ===
//                         String(
//                           selectedCase
//                         )
//                     )?.address
//                   }

//                 </div>

//               )}


//               {/* =================================================
//                   OUTCOME
//               ================================================= */}

//               <label>
//                 Visit outcome
//               </label>


//               <select
//                 value={
//                   outcome
//                 }
//                 onChange={(
//                   event
//                 ) =>
//                   setOutcome(
//                     event.target.value
//                   )
//                 }
//                 disabled={
//                   submitting
//                 }
//               >

//                 <option value="">
//                   Select outcome
//                 </option>

//                 <option value="contacted">
//                   Customer contacted
//                 </option>

//                 <option value="promise_to_pay">
//                   Promise to pay
//                 </option>

//                 <option value="rescheduled">
//                   Visit rescheduled
//                 </option>

//                 <option value="unreachable">
//                   Customer unreachable
//                 </option>

//                 <option value="address_not_found">
//                   Address not found
//                 </option>

//                 <option value="other">
//                   Other
//                 </option>

//               </select>


//               {/* =================================================
//                   NOTES
//               ================================================= */}

//               <label>
//                 Field notes
//               </label>


//               <textarea
//                 rows="7"
//                 value={
//                   notes
//                 }
//                 onChange={(
//                   event
//                 ) =>
//                   setNotes(
//                     event.target.value
//                   )
//                 }
//                 disabled={
//                   submitting
//                 }
//                 placeholder="Record what you observed, who you contacted, and the outcome of the visit..."
//               />


//               {/* =================================================
//                   OPTIONAL EVIDENCE
//               ================================================= */}

//               <div className="evidence-upload-section">


//                 <div className="evidence-upload-heading">

//                   <div>

//                     <strong>

//                       Proof of visit{" "}

//                       <span>
//                         (optional)
//                       </span>

//                     </strong>


//                     <span>
//                       Add a photo or PDF only
//                       when you have supporting evidence.
//                     </span>

//                   </div>


//                   <Camera
//                     size={19}
//                   />

//                 </div>


//                 {!file ? (

//                   <label
//                     className="evidence-dropzone"
//                   >

//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/webp,application/pdf"
//                       onChange={
//                         handleFileChange
//                       }
//                       disabled={
//                         submitting
//                       }
//                       hidden
//                     />


//                     <Upload
//                       size={24}
//                     />


//                     <strong>
//                       Add optional evidence
//                     </strong>


//                     <span>
//                       JPG, PNG, WEBP or PDF
//                       · Maximum 10 MB
//                     </span>

//                   </label>

//                 ) : (

//                   <div
//                     className="selected-evidence"
//                   >

//                     <div
//                       className="selected-evidence-icon"
//                     >

//                       <FileImage
//                         size={22}
//                       />

//                     </div>


//                     <div
//                       className="selected-evidence-info"
//                     >

//                       <strong>
//                         {file.name}
//                       </strong>


//                       <span>

//                         {(
//                           file.size /
//                           1024 /
//                           1024
//                         ).toFixed(2)}

//                         {" MB"}

//                       </span>

//                     </div>


//                     <button
//                       type="button"
//                       className="remove-evidence-button"
//                       onClick={
//                         removeFile
//                       }
//                       disabled={
//                         submitting
//                       }
//                     >

//                       <X
//                         size={17}
//                       />

//                     </button>

//                   </div>

//                 )}

//               </div>


//               {/* =================================================
//                   SUBMIT
//               ================================================= */}

//               <button
//                 type="submit"
//                 className="primary-small-button submit-update"
//                 disabled={
//                   submitting ||
//                   loading ||
//                   !cases.length
//                 }
//               >

//                 {uploading ? (

//                   <>

//                     <Upload
//                       size={16}
//                     />

//                     Uploading evidence...

//                   </>

//                 ) : submitting ? (

//                   <>

//                     <Send
//                       size={16}
//                     />

//                     Sending update...

//                   </>

//                 ) : (

//                   <>

//                     <Send
//                       size={16}
//                     />

//                     Submit field update

//                   </>

//                 )}

//               </button>

//             </form>

//           </section>


//           {/* =================================================
//               INFO CARD
//           ================================================= */}

//           <aside
//             className="update-info-card"
//           >

//             <div className="card-eyebrow">
//               FIELD VISIT
//             </div>


//             <h3>
//               Keep updates factual
//             </h3>


//             <p>
//               Record only information observed
//               or verified during the visit.
//             </p>


//             <div className="update-rule">

//               <div>
//                 01
//               </div>

//               <span>
//                 Select the assigned recovery case.
//               </span>

//             </div>


//             <div className="update-rule">

//               <div>
//                 02
//               </div>

//               <span>
//                 Record the actual visit outcome.
//               </span>

//             </div>


//             <div className="update-rule">

//               <div>
//                 03
//               </div>

//               <span>
//                 Add proof only when available.
//                 It is optional.
//               </span>

//             </div>


//             <div className="update-rule">

//               <div>
//                 04
//               </div>

//               <span>
//                 Submit clear field notes.
//               </span>

//             </div>

//           </aside>

//         </div>

//       </div>

//     </AppShell>

//   );
// }


// export default AgentUpdates;

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ClipboardPenLine,
  Camera,
  Send,
  Upload,
  FileImage,
  CheckCircle2,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getAgentCases,
  createFieldUpdate,
  uploadEvidence,
} from "../../api/api";


/* =========================================================
   NORMALIZE ASSIGNED TASK
========================================================= */

function normalizeTask(item) {

  if (!item) {
    return null;
  }


  const isLocationAssignment =
    item.taskType ===
      "location_assignment" ||
    String(
      item.caseNumber ||
      ""
    ).startsWith(
      "TASK-agent_assignment_"
    );


  return {

    ...item,

    id:
      item.id,

    caseNumber:
      item.caseNumber ||
      item.id,

    customerName:
      item.customerName ||
      (
        isLocationAssignment
          ? "Assigned destination"
          : "Recovery case"
      ),

    address:
      item.address ||
      item.location ||
      item.geocodedAddress ||
      "",

    status:
      item.status ||
      "assigned",

    taskType:
      isLocationAssignment
        ? "location_assignment"
        : "recovery_case",

    isLocationAssignment,

  };

}


/* =========================================================
   AGENT UPDATES
========================================================= */

function AgentUpdates() {

  const [cases, setCases] =
    useState([]);

  const [selectedCase, setSelectedCase] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const [outcome, setOutcome] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  /* =========================================================
     LOAD ASSIGNED WORK
  ========================================================= */

  const loadCases =
    useCallback(
      async ({
        silent = false,
      } = {}) => {

        try {

          if (!silent) {
            setLoading(true);
          }


          if (!silent) {
            setError("");
          }


          const response =
            await getAgentCases();


          console.log(
            "AGENT UPDATES CASES RESPONSE:",
            response
          );


          let result = [];


          if (
            Array.isArray(response)
          ) {

            result =
              response;

          } else if (
            Array.isArray(
              response?.cases
            )
          ) {

            result =
              response.cases;

          } else if (
            Array.isArray(
              response?.data?.cases
            )
          ) {

            result =
              response.data.cases;

          } else if (
            Array.isArray(
              response?.tasks
            )
          ) {

            result =
              response.tasks;

          } else if (
            Array.isArray(
              response?.data?.tasks
            )
          ) {

            result =
              response.data.tasks;

          }


          console.log(
            "AGENT UPDATES RAW CASES:",
            result
          );


          /*
           * KEEP BOTH:
           *
           * 1. Real recovery cases
           * 2. Manager-created destinations
           */

          const assignedTasks =
            result
              .map(
                normalizeTask
              )
              .filter(Boolean);


          console.log(
            "AGENT UPDATES ASSIGNED TASKS:",
            assignedTasks
          );


          setCases(
            assignedTasks
          );


          /*
           * Preserve current selection.
           */

          setSelectedCase(
            (current) => {

              if (
                !assignedTasks.length
              ) {

                return "";

              }


              const exists =
                current &&
                assignedTasks.some(
                  (item) =>
                    String(
                      item.id
                    ) ===
                    String(
                      current
                    )
                );


              if (
                exists
              ) {

                return current;

              }


              return String(
                assignedTasks[0].id
              );

            }
          );


        } catch (err) {

          console.error(
            "AGENT UPDATES LOAD ERROR:",
            err
          );


          if (!silent) {

            setError(
              err?.response?.data?.message ||
              "Unable to load assigned work."
            );

          }

        } finally {

          if (!silent) {

            setLoading(false);

          }

        }

      },
      []
    );


  /* =========================================================
     INITIAL LOAD + AUTO REFRESH
  ========================================================= */

  useEffect(() => {

    loadCases();


    const interval =
      window.setInterval(
        () => {

          loadCases({
            silent: true,
          });

        },
        5000
      );


    function handleFocus() {

      loadCases({
        silent: true,
      });

    }


    window.addEventListener(
      "focus",
      handleFocus
    );


    return () => {

      window.clearInterval(
        interval
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

    };

  }, [
    loadCases,
  ]);


  /* =========================================================
     FILE SELECTION
  ========================================================= */

  function handleFileChange(
    event
  ) {

    const selectedFile =
      event.target.files?.[0];


    if (!selectedFile) {
      return;
    }


    const allowedTypes = [

      "image/jpeg",

      "image/png",

      "image/webp",

      "application/pdf",

    ];


    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {

      setError(
        "Only JPG, PNG, WEBP and PDF files are allowed."
      );


      event.target.value =
        "";


      return;

    }


    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {

      setError(
        "File size must be below 10 MB."
      );


      event.target.value =
        "";


      return;

    }


    setError("");

    setFile(
      selectedFile
    );

  }


  /* =========================================================
     REMOVE FILE
  ========================================================= */

  function removeFile() {

    setFile(
      null
    );

  }


  /* =========================================================
     SUBMIT FIELD UPDATE
  ========================================================= */

  async function handleSubmit(
    event
  ) {

    event.preventDefault();


    setError("");

    setMessage("");


    /*
     * ONLY THE ASSIGNMENT IS REQUIRED.
     *
     * Notes are OPTIONAL.
     */

    if (!selectedCase) {

      setError(
        "Select an assigned case first."
      );

      return;

    }


    const selectedTask =
      cases.find(
        (item) =>
          String(
            item.id
          ) ===
          String(
            selectedCase
          )
      );


    if (!selectedTask) {

      setError(
        "The selected assignment is no longer available. Please refresh."
      );

      return;

    }


    try {

      setSubmitting(
        true
      );


      /*
       * Evidence is optional.
       *
       * Only call upload endpoint when
       * the agent actually selected a file.
       */

      if (file) {

        setUploading(
          true
        );


        await uploadEvidence(
          selectedCase,
          file
        );


        setUploading(
          false
        );

      }


      /*
       * SEND FIELD UPDATE IMMEDIATELY.
       *
       * Notes and outcome may both be empty.
       */

      await createFieldUpdate(
        selectedCase,
        {

          notes:
            notes.trim(),

          outcome:
            outcome.trim(),

          taskType:
            selectedTask.taskType,

          address:
            selectedTask.address,

          customerName:
            selectedTask.customerName,

        }
      );


      /*
       * SUCCESS
       */

      setMessage(
        "Field update sent to manager successfully."
      );


      setNotes("");

      setOutcome("");

      setFile(
        null
      );


      /*
       * Refresh assignment data.
       */

      await loadCases({
        silent: true,
      });


    } catch (err) {

      console.error(
        "FIELD UPDATE SUBMIT ERROR:",
        err
      );


      setUploading(
        false
      );


      setError(
        err?.response?.data?.message ||
        "Unable to send field update to manager."
      );


    } finally {

      setSubmitting(
        false
      );

    }

  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <AppShell
      role="agent"
      title="Field updates"
      subtitle="Record verified information from recovery visits."
    >

      <div className="updates-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              FIELD REPORTING
            </div>

            <h2>
              Field updates
            </h2>

            <p>
              Record what happened during your
              recovery visit.
            </p>

          </div>

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

          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (

          <div className="success-message">

            <CheckCircle2
              size={17}
            />

            <span>
              {message}
            </span>

          </div>

        )}


        {/* =================================================
            MAIN UPDATE LAYOUT
        ================================================= */}

        <div className="updates-layout">


          {/* =================================================
              FORM
          ================================================= */}

          <section className="update-form-card">


            <div className="update-card-heading">

              <div className="update-heading-icon">

                <ClipboardPenLine
                  size={20}
                />

              </div>


              <div>

                <h3>
                  Visit report
                </h3>

                <p>
                  Submit verified field information
                  against an assigned case.
                </p>

              </div>

            </div>


            <form
              className="field-update-form"
              onSubmit={
                handleSubmit
              }
            >


              {/* =================================================
                  ASSIGNED CASE
              ================================================= */}

              <label>
                Recovery case
              </label>


              <select
                value={
                  selectedCase
                }
                onChange={(
                  event
                ) =>
                  setSelectedCase(
                    event.target.value
                  )
                }
                disabled={
                  loading ||
                  submitting ||
                  !cases.length
                }
              >

                <option value="">

                  {
                    loading
                      ? "Loading assigned cases..."
                      : cases.length
                        ? "Select a case"
                        : "No assigned recovery cases"
                  }

                </option>


                {cases.map(
                  (
                    item
                  ) => (

                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >

                      {
                        item.isLocationAssignment
                          ? "Assigned destination"
                          : (
                              item.caseNumber ||
                              item.id
                            )
                      }

                      {" — "}

                      {
                        item.customerName ||
                        "Recovery case"
                      }

                    </option>

                  )
                )}

              </select>


              {/* =================================================
                  OUTCOME
              ================================================= */}

              <label>
                Visit outcome
              </label>


              <select
                value={
                  outcome
                }
                onChange={(
                  event
                ) =>
                  setOutcome(
                    event.target.value
                  )
                }
                disabled={
                  submitting
                }
              >

                <option value="">
                  Select outcome
                </option>

                <option value="contacted">
                  Customer contacted
                </option>

                <option value="promise_to_pay">
                  Promise to pay
                </option>

                <option value="rescheduled">
                  Visit rescheduled
                </option>

                <option value="unreachable">
                  Customer unreachable
                </option>

                <option value="address_not_found">
                  Address not found
                </option>

                <option value="other">
                  Other
                </option>

              </select>


              {/* =================================================
                  NOTES
              ================================================= */}

              <label>
                Field notes
              </label>


              <textarea
                rows="7"
                value={
                  notes
                }
                onChange={(
                  event
                ) =>
                  setNotes(
                    event.target.value
                  )
                }
                disabled={
                  submitting
                }
                placeholder="Record what you observed, who you contacted, and the outcome of the visit..."
              />


              {/* =================================================
                  OPTIONAL EVIDENCE
              ================================================= */}

              <div className="evidence-upload-section">


                <div className="evidence-upload-heading">

                  <div>

                    <strong>

                      Proof of visit{" "}

                      <span>
                        (optional)
                      </span>

                    </strong>


                    <span>
                      Add a photo or PDF only
                      when you have supporting evidence.
                    </span>

                  </div>


                  <Camera
                    size={19}
                  />

                </div>


                {!file ? (

                  <label
                    className="evidence-dropzone"
                  >

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={
                        handleFileChange
                      }
                      disabled={
                        submitting
                      }
                      hidden
                    />


                    <Upload
                      size={24}
                    />


                    <strong>
                      Add optional evidence
                    </strong>


                    <span>
                      JPG, PNG, WEBP or PDF
                      · Maximum 10 MB
                    </span>

                  </label>

                ) : (

                  <div
                    className="selected-evidence"
                  >

                    <div
                      className="selected-evidence-icon"
                    >

                      <FileImage
                        size={22}
                      />

                    </div>


                    <div
                      className="selected-evidence-info"
                    >

                      <strong>
                        {file.name}
                      </strong>


                      <span>

                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)}

                        {" MB"}

                      </span>

                    </div>


                    <button
                      type="button"
                      className="remove-evidence-button"
                      onClick={
                        removeFile
                      }
                      disabled={
                        submitting
                      }
                    >

                      <X
                        size={17}
                      />

                    </button>

                  </div>

                )}

              </div>


              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="primary-small-button submit-update"
                disabled={
                  submitting ||
                  loading ||
                  !cases.length ||
                  !selectedCase
                }
              >

                {uploading ? (

                  <>

                    <Upload
                      size={16}
                    />

                    Uploading evidence...

                  </>

                ) : submitting ? (

                  <>

                    <Send
                      size={16}
                    />

                    Sending update...

                  </>

                ) : (

                  <>

                    <Send
                      size={16}
                    />

                    Submit field update

                  </>

                )}

              </button>

            </form>

          </section>


          {/* =================================================
              INFO CARD
          ================================================= */}

          <aside
            className="update-info-card"
          >

            <div className="card-eyebrow">
              FIELD VISIT
            </div>


            <h3>
              Keep updates factual
            </h3>


            <p>
              Record only information observed
              or verified during the visit.
            </p>


            <div className="update-rule">

              <div>
                01
              </div>

              <span>
                Select the assigned recovery case.
              </span>

            </div>


            <div className="update-rule">

              <div>
                02
              </div>

              <span>
                Record the actual visit outcome.
              </span>

            </div>


            <div className="update-rule">

              <div>
                03
              </div>

              <span>
                Add proof only when available.
                It is optional.
              </span>

            </div>


            <div className="update-rule">

              <div>
                04
              </div>

              <span>
                Submit clear field notes.
              </span>

            </div>

          </aside>

        </div>

      </div>

    </AppShell>

  );
}


export default AgentUpdates;