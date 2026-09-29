import {
  useEffect,
  useState,
} from "react";

import {
  UserRoundCog,
  MapPin,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

import {
  getManagerAgents,
  getAgentLocationAssignments,
  assignAgentToLocation,
} from "../../api/api";

import "./ManagerAssignments.css";


function ManagerAssignments() {

  const [agents, setAgents] =
    useState([]);

  const [locationAssignments, setLocationAssignments] =
    useState([]);

  const [selectedAgent, setSelectedAgent] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =========================================================
     LOAD AGENTS + CURRENT LOCATION ASSIGNMENTS
  ========================================================= */

  async function loadData() {

    try {

      setLoading(true);
      setError("");

      const [
        agentsResponse,
        assignmentsResponse,
      ] = await Promise.all([
        getManagerAgents(),
        getAgentLocationAssignments(),
      ]);


      const agentList =
        Array.isArray(
          agentsResponse
        )
          ? agentsResponse
          : agentsResponse?.agents || [];


      const assignmentList =
        Array.isArray(
          assignmentsResponse
        )
          ? assignmentsResponse
          : assignmentsResponse?.assignments || [];


      setAgents(
        agentList
      );

      setLocationAssignments(
        assignmentList
      );


    } catch (err) {

      console.error(
        "LOAD ASSIGNMENT DATA ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load agent assignments."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadData();

  }, []);


  /* =========================================================
     FIND AGENTS CURRENTLY ASSIGNED TO A LOCATION
  ========================================================= */

  const assignedAgentIds =
    new Set(
      locationAssignments
        .filter(
          (assignment) =>
            assignment.status !==
            "completed"
        )
        .map(
          (assignment) =>
            assignment.agentId
        )
    );


  /* =========================================================
     ONLY SHOW UNASSIGNED AGENTS
  ========================================================= */

  const unassignedAgents =
    agents.filter(
      (agent) =>
        !assignedAgentIds.has(
          agent.id
        )
    );


  /* =========================================================
     HANDLE ASSIGNMENT
  ========================================================= */

  async function handleAssign(event) {

    event.preventDefault();

    setError("");
    setSuccess("");


    if (!selectedAgent) {

      setError(
        "Please select a field agent."
      );

      return;
    }


    if (!address.trim()) {

      setError(
        "Please enter a destination."
      );

      return;
    }


    try {

      setSubmitting(true);


      const data =
        await assignAgentToLocation(
          selectedAgent,
          address.trim()
        );


      setSuccess(
        data?.message ||
        "Agent assigned successfully."
      );


      /*
       * Clear the form.
       */

      setSelectedAgent("");
      setAddress("");


      /*
       * Refresh the agent/assignment data.
       * The newly assigned agent will automatically
       * disappear from the dropdown.
       */

      await loadData();


    } catch (err) {

      console.error(
        "ASSIGNMENT ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to assign agent to this location."
      );

    } finally {

      setSubmitting(false);

    }
  }


  return (

    <AppShell
      role="manager"
      title="Agent assignments"
      subtitle="Assign any field agent to any destination."
    >

      <div className="manager-page assignment-page">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              FIELD DISPATCH
            </div>

            <h2>
              Agent assignments
            </h2>

            <p>
              Assign an available field agent to any location.
            </p>

          </div>


          <button
            type="button"
            className="outline-button"
            onClick={loadData}
            disabled={loading}
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


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="assignment-error">

            <AlertCircle
              size={17}
            />

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            SUCCESS
        =================================================== */}

        {success && (

          <div className="assignment-success">

            <CheckCircle2
              size={17}
            />

            <span>
              {success}
            </span>

          </div>

        )}


        {/* ===================================================
            FULL-WIDTH FORM
        =================================================== */}

        <div className="assignment-form-card">

          <div className="assignment-form-header">

            <div className="assignment-form-icon">

              <UserRoundCog
                size={21}
              />

            </div>

            <div>

              <h3>
                Assign field agent
              </h3>

              <p>
                Select an unassigned agent and provide the destination.
              </p>

            </div>

          </div>


          <form
            className="assignment-form"
            onSubmit={
              handleAssign
            }
          >

            {/* =================================================
                AGENT
            ================================================= */}

            <div className="assignment-field">

              <label>
                Field agent
              </label>

              <select
                value={
                  selectedAgent
                }
                onChange={(event) =>
                  setSelectedAgent(
                    event.target.value
                  )
                }
                disabled={
                  loading ||
                  submitting
                }
              >

                <option value="">
                  Select an unassigned agent
                </option>


                {unassignedAgents.map(
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
                        agent.name ||
                        agent.email
                      }

                      {" — "}

                      {
                        agent.email
                      }

                    </option>

                  )
                )}

              </select>


              {!loading &&
                unassignedAgents.length ===
                  0 && (

                  <span className="assignment-field-help">

                    All registered agents are currently assigned to a location.

                  </span>

                )}

            </div>


            {/* =================================================
                LOCATION
            ================================================= */}

            <div className="assignment-field">

              <label>
                Destination / Location
              </label>

              <div className="assignment-location-input">

                <MapPin
                  size={17}
                />

                <input
                  type="text"
                  value={
                    address
                  }
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter address or Plus Code"
                  disabled={
                    submitting
                  }
                />

              </div>


              <span className="assignment-field-help">

                Example: 5J58+MJ, Hunasamaranahalli, Karnataka 562157

              </span>

            </div>


            {/* =================================================
                SELECTED AGENT PREVIEW
            ================================================= */}

            {selectedAgent && (

              <div className="assignment-agent-preview">

                <div className="assignment-agent-avatar">

                  {
                    (
                      unassignedAgents.find(
                        (agent) =>
                          agent.id ===
                          selectedAgent
                      )?.name ||
                      "AG"
                    )
                      .slice(
                        0,
                        2
                      )
                      .toUpperCase()
                  }

                </div>


                <div className="assignment-agent-details">

                  <strong>

                    {
                      unassignedAgents.find(
                        (agent) =>
                          agent.id ===
                          selectedAgent
                      )?.name ||
                      "Selected agent"
                    }

                  </strong>


                  <span>

                    {
                      unassignedAgents.find(
                        (agent) =>
                          agent.id ===
                          selectedAgent
                      )?.email ||
                      ""
                    }

                  </span>

                </div>

              </div>

            )}


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="assignment-submit-button"
              disabled={
                loading ||
                submitting ||
                !selectedAgent ||
                !address.trim() ||
                unassignedAgents.length ===
                  0
              }
            >

              {submitting ? (

                <>
                  <RefreshCw
                    size={16}
                    className="spin"
                  />

                  Assigning...
                </>

              ) : (

                <>
                  <UserRoundCog
                    size={16}
                  />

                  Assign Agent
                </>

              )}

            </button>

          </form>

        </div>


        {/* ===================================================
            CURRENTLY ASSIGNED COUNT
        =================================================== */}

        <div className="assignment-summary">

          <div>

            <strong>
              {unassignedAgents.length}
            </strong>

            <span>
              Agents available for assignment
            </span>

          </div>


          <div>

            <strong>
              {assignedAgentIds.size}
            </strong>

            <span>
              Agents currently assigned
            </span>

          </div>

        </div>

      </div>

    </AppShell>
  );
}


export default ManagerAssignments;