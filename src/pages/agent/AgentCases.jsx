// import { useEffect, useState } from "react";

// import {
//   ClipboardList,
//   RefreshCw,
//   Search,
//   AlertCircle,
// } from "lucide-react";

// import AppShell from "../../components/layout/AppShell";

// import { getAgentCases } from "../../api/api";

// function AgentCases() {
//   const [cases, setCases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [search, setSearch] = useState("");

//   async function loadCases() {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getAgentCases();

//       /*
//         We accept either:

//         [...]
        
//         or:

//         { cases: [...] }
//       */

//       setCases(
//         Array.isArray(data)
//           ? data
//           : data.cases || []
//       );

//     } catch (err) {
//       console.error(err);

//       setError(
//         "Unable to load your cases. Make sure the API server is running."
//       );

//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadCases();
//   }, []);

//   const filteredCases = cases.filter((item) => {
//     const query =
//       search.trim().toLowerCase();

//     if (!query) {
//       return true;
//     }

//     return [
//       item.id,
//       item.caseNumber,
//       item.title,
//       item.customerName,
//       item.address,
//       item.status,
//     ]
//       .filter(Boolean)
//       .some((value) =>
//         String(value)
//           .toLowerCase()
//           .includes(query)
//       );
//   });

//   return (
//     <AppShell
//       role="agent"
//       title="My cases"
//       subtitle="Recovery cases currently assigned to you."
//     >

//       <div className="agent-section-page">

//         <div className="section-page-header">

//           <div>

//             <div className="dashboard-eyebrow">
//               RECOVERY OPERATIONS
//             </div>

//             <h2>
//               Assigned cases
//             </h2>

//             <p>
//               Review, navigate and update your assigned
//               recovery visits.
//             </p>

//           </div>


//           <button
//             type="button"
//             className="outline-button"
//             onClick={loadCases}
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

//             Refresh
//           </button>

//         </div>


//         <div className="cases-toolbar">

//           <div className="cases-search">

//             <Search size={17} />

//             <input
//               type="search"
//               placeholder="Search cases..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//             />

//           </div>

//         </div>


//         {error && (
//           <div className="api-error">

//             <AlertCircle size={18} />

//             <div>
//               <strong>
//                 API unavailable
//               </strong>

//               <span>
//                 {error}
//               </span>
//             </div>

//           </div>
//         )}


//         <div className="cases-card">

//           {loading ? (
//             <div className="page-state">

//               <RefreshCw
//                 size={22}
//                 className="spin"
//               />

//               <strong>
//                 Loading cases...
//               </strong>

//             </div>
//           ) : filteredCases.length === 0 ? (
//             <div className="page-state">

//               <div className="page-state-icon">
//                 <ClipboardList size={22} />
//               </div>

//               <strong>
//                 No assigned cases
//               </strong>

//               <span>
//                 Cases assigned to you by the manager
//                 will appear here.
//               </span>

//             </div>
//           ) : (
//             <div className="case-table-wrapper">

//               <table className="case-table">

//                 <thead>

//                   <tr>
//                     <th>Case</th>
//                     <th>Customer</th>
//                     <th>Location</th>
//                     <th>Status</th>
//                     <th>Priority</th>
//                   </tr>

//                 </thead>

//                 <tbody>

//                   {filteredCases.map((item) => (

//                     <tr key={item.id}>

//                       <td>
//                         <strong>
//                           {item.caseNumber ||
//                             item.id}
//                         </strong>
//                       </td>

//                       <td>
//                         {item.customerName ||
//                           "—"}
//                       </td>

//                       <td>
//                         {item.address ||
//                           "Location unavailable"}
//                       </td>

//                       <td>
//                         <span
//                           className={`case-status ${
//                             item.status || "pending"
//                           }`}
//                         >
//                           {item.status ||
//                             "Pending"}
//                         </span>
//                       </td>

//                       <td>
//                         {item.priority ||
//                           "—"}
//                       </td>

//                     </tr>

//                   ))}

//                 </tbody>

//               </table>

//             </div>
//           )}

//         </div>

//       </div>

//     </AppShell>
//   );
// }

// export default AgentCases;

import {
  useEffect,
  useState,
} from "react";

import {
  ClipboardList,
  RefreshCw,
  Search,
  AlertCircle,
  MapPin,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getAgentCases,
} from "../../api/api";


function AgentCases() {

  const [cases, setCases] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  /* =======================================================
     LOAD CASES
  ======================================================= */

  async function loadCases() {

    try {

      setLoading(true);
      setError("");

      const response =
        await getAgentCases();

      console.log(
        "AGENT CASES RESPONSE:",
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
      }

      /*
       * Normalize coordinates.
       *
       * JSON/API values can sometimes
       * arrive as strings.
       */

      const normalized =
        result.map(
          (item) => ({
            ...item,

            latitude:
              Number.isFinite(
                Number(
                  item.latitude
                )
              )
                ? Number(
                    item.latitude
                  )
                : null,

            longitude:
              Number.isFinite(
                Number(
                  item.longitude
                )
              )
                ? Number(
                    item.longitude
                  )
                : null,
          })
        );

      setCases(
        normalized
      );

    } catch (err) {

      console.error(
        "AGENT CASES ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load your cases. Make sure the API server is running."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {
    loadCases();
  }, []);


  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCases =
    cases.filter(
      (item) => {

        const query =
          search
            .trim()
            .toLowerCase();

        if (!query) {
          return true;
        }

        return [
          item.id,
          item.caseNumber,
          item.title,
          item.customerName,
          item.address,
          item.status,
          item.priority,
        ]
          .filter(Boolean)
          .some(
            (value) =>
              String(value)
                .toLowerCase()
                .includes(
                  query
                )
          );
      }
    );


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AppShell
      role="agent"
      title="My cases"
      subtitle="Recovery cases currently assigned to you."
    >

      <div className="agent-section-page">

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              RECOVERY OPERATIONS
            </div>

            <h2>
              Assigned cases
            </h2>

            <p>
              Review, navigate and update your assigned
              recovery visits.
            </p>

          </div>


          <button
            type="button"
            className="outline-button"
            onClick={
              loadCases
            }
            disabled={
              loading
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

        </div>


        {error && (

          <div className="api-error">

            <AlertCircle
              size={18}
            />

            <div>

              <strong>
                Unable to load cases
              </strong>

              <span>
                {error}
              </span>

            </div>

          </div>

        )}


        <div className="cases-toolbar">

          <div className="cases-search">

            <Search
              size={17}
            />

            <input
              type="search"
              placeholder="Search cases..."
              value={
                search
              }
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
            />

          </div>

        </div>


        <div className="cases-card">

          {loading ? (

            <div className="page-state">

              <RefreshCw
                size={22}
                className="spin"
              />

              <strong>
                Loading cases...
              </strong>

            </div>

          ) : filteredCases.length === 0 ? (

            <div className="page-state">

              <div className="page-state-icon">

                <ClipboardList
                  size={22}
                />

              </div>

              <strong>
                No assigned cases
              </strong>

              <span>
                Cases assigned to you by the manager
                will appear here.
              </span>

            </div>

          ) : (

            <div className="case-table-wrapper">

              <table className="case-table">

                <thead>

                  <tr>

                    <th>
                      Case
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Priority
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredCases.map(
                    (item) => {

                      const hasLocation =
                        Number.isFinite(
                          item.latitude
                        ) &&
                        Number.isFinite(
                          item.longitude
                        );

                      return (

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
                            {
                              item.customerName ||
                              "—"
                            }
                          </td>


                          <td>

                            <div
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap:
                                  "7px",
                              }}
                            >

                              <MapPin
                                size={
                                  15
                                }
                              />

                              <span>
                                {
                                  item.address ||
                                  item.location ||
                                  "Location unavailable"
                                }
                              </span>

                            </div>

                            {hasLocation && (

                              <small
                                style={{
                                  display:
                                    "block",
                                  marginTop:
                                    "4px",
                                  opacity:
                                    0.65,
                                }}
                              >
                                GPS destination available
                              </small>

                            )}

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
                                "Pending"
                              }

                            </span>

                          </td>


                          <td>

                            {
                              item.priority ||
                              "—"
                            }

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AppShell>
  );
}


export default AgentCases;