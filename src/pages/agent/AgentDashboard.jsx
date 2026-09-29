import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AppShell from "../../components/layout/AppShell";

import AgentHeader from "../../components/agent/AgentHeader";
import AgentMap from "../../components/agent/AgentMap";
import Assignments from "../../components/agent/Assignments";

import {
  getAgentDashboard,
} from "../../api/api";


function AgentDashboard() {

  const [
    assignments,
    setAssignments,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState("");


  /* =========================================================
     LOAD REAL AGENT ASSIGNMENTS
  ========================================================= */

  const loadDashboard =
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
            await getAgentDashboard();


          console.log(
            "AGENT DASHBOARD RESPONSE:",
            response
          );


          let result = [];


          /*
           * Backend returns:
           *
           * {
           *   success: true,
           *   agent: {...},
           *   metrics: {...},
           *   cases: [...]
           * }
           *
           * Keep support for the alternate
           * response shapes as well.
           */

          if (
            Array.isArray(
              response?.cases
            )
          ) {

            result =
              response.cases;

          } else if (
            Array.isArray(
              response?.tasks
            )
          ) {

            result =
              response.tasks;

          } else if (
            Array.isArray(
              response?.data?.cases
            )
          ) {

            result =
              response.data.cases;

          } else if (
            Array.isArray(
              response?.data?.tasks
            )
          ) {

            result =
              response.data.tasks;

          } else if (
            Array.isArray(
              response
            )
          ) {

            result =
              response;

          }


          /*
           * Make sure only valid assignment
           * objects are passed to the UI.
           */

          const normalized =
            result
              .filter(
                (item) =>
                  item &&
                  typeof item ===
                    "object"
              )
              .map(
                (item) => ({
                  ...item,

                  id:
                    item.id
                      ? String(
                          item.id
                        )
                      : item.id,

                  caseNumber:
                    item.caseNumber ||
                    item.case_number ||
                    "",

                  customerName:
                    item.customerName ||
                    item.customer_name ||
                    "",

                  address:
                    item.address ||
                    item.location ||
                    item.geocodedAddress ||
                    "",

                  status:
                    item.status ||
                    "assigned",
                })
              );


          console.log(
            "AGENT DASHBOARD ASSIGNMENTS:",
            normalized
          );


          setAssignments(
            normalized
          );


        } catch (err) {

          console.error(
            "AGENT DASHBOARD LOAD ERROR:",
            err
          );


          if (!silent) {

            setError(
              err?.response?.data?.message ||
              "Unable to load your assignments."
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

    loadDashboard();


    /*
     * Keep the dashboard synchronized with
     * manager assignments.
     */

    const interval =
      window.setInterval(
        () => {

          loadDashboard({
            silent: true,
          });

        },
        5000
      );


    /*
     * Refresh immediately when the
     * browser tab becomes active again.
     */

    function handleFocus() {

      loadDashboard({
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
    loadDashboard,
  ]);


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <AppShell
      role="agent"
      title="My day"
      subtitle="Your assigned recovery operations at a glance."
    >

      <div className="agent-dashboard">


        {/* =================================================
            HEADER
        ================================================= */}

        <AgentHeader />


        {/* =================================================
            OPTIONAL ERROR
        ================================================= */}

        {error && (

          <div className="api-error">

            <span>
              {error}
            </span>

          </div>

        )}


        {/* =================================================
            MAP
        ================================================= */}

        <div className="agent-work-grid">

          <AgentMap />

        </div>


        {/* =================================================
            FIELD WORK / ASSIGNMENTS
        ================================================= */}

        <Assignments
          assignments={
            assignments
          }
        />

      </div>

    </AppShell>

  );
}


export default AgentDashboard;