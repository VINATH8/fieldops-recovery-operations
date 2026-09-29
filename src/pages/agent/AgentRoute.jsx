import {
  useEffect,
  useState,
} from "react";

import {
  MapPin,
  Navigation,
  LocateFixed,
  Route as RouteIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import AppShell from "../../components/layout/AppShell";

import {
  getAgentCases,
  getRoute,
  updateAgentLocation,
  checkIn,
} from "../../api/api";


/* =========================================================
   HELPERS
========================================================= */

function toNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}


function normalizeCase(item) {
  return {
    ...item,

    latitude: toNumber(
      item?.latitude
    ),

    longitude: toNumber(
      item?.longitude
    ),
  };
}


/* =========================================================
   MAP MARKERS
========================================================= */

const sourceIcon = L.divIcon({
  className: "fieldops-map-marker",
  html: `
    <div
      style="
        width: 18px;
        height: 18px;
        background: #16a34a;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "
    ></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});


const destinationIcon = L.divIcon({
  className: "fieldops-map-marker",
  html: `
    <div
      style="
        width: 18px;
        height: 18px;
        background: #dc2626;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.35);
      "
    ></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});


/* =========================================================
   MAP CENTER
========================================================= */

function MapCenter({
  position,
  destination,
}) {
  const map = useMap();

  useEffect(() => {
    const target =
      destination ||
      position;

    if (!target) {
      return;
    }

    map.setView(
      target,
      15,
      {
        animate: true,
      }
    );
  }, [
    position,
    destination,
    map,
  ]);

  return null;
}


/* =========================================================
   AGENT ROUTE
========================================================= */

function AgentRoute() {

  const [cases, setCases] =
    useState([]);

  const [selectedCase, setSelectedCase] =
    useState(null);

  const [position, setPosition] =
    useState(null);

  const [route, setRoute] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [checkingIn, setCheckingIn] =
    useState(false);

  const [checkedIn, setCheckedIn] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
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
        "AGENT ROUTE CASES:",
        response
      );

      let result = [];

      if (
        Array.isArray(
          response
        )
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

      const normalized =
        result.map(
          normalizeCase
        );

      setCases(
        normalized
      );


      /* Preserve selected destination */

      if (
        normalized.length
      ) {

        if (
          selectedCase
        ) {

          const refreshed =
            normalized.find(
              (item) =>
                String(
                  item.id
                ) ===
                String(
                  selectedCase.id
                )
            );

          if (
            refreshed
          ) {

            setSelectedCase(
              refreshed
            );

          } else {

            setSelectedCase(
              normalized[0]
            );

          }

        } else {

          setSelectedCase(
            normalized[0]
          );

        }

      } else {

        setSelectedCase(
          null
        );

      }

    } catch (err) {

      console.error(
        "AGENT ROUTE CASE ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load assigned cases."
      );

    } finally {

      setLoading(false);

    }

  }


  /* =======================================================
     INITIAL LOAD + AUTO REFRESH
  ======================================================= */

  useEffect(() => {

    loadCases();

    const interval =
      window.setInterval(
        () => {
          loadCases();
        },
        5000
      );


    function handleFocus() {
      loadCases();
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

  }, []);


  /* =======================================================
     GPS
  ======================================================= */

  useEffect(() => {

    if (
      !navigator.geolocation
    ) {

      setError(
        "This browser does not support location services."
      );

      return undefined;

    }


    const watchId =
      navigator.geolocation.watchPosition(

        async (
          location
        ) => {

          const latitude =
            toNumber(
              location.coords.latitude
            );

          const longitude =
            toNumber(
              location.coords.longitude
            );

          const accuracy =
            toNumber(
              location.coords.accuracy
            );


          if (
            latitude === null ||
            longitude === null
          ) {
            return;
          }


          setPosition([
            latitude,
            longitude,
          ]);


          try {

            await updateAgentLocation(
              latitude,
              longitude,
              accuracy
            );

          } catch (err) {

            console.error(
              "Location sync failed:",
              err
            );

          }

        },

        (
          locationError
        ) => {

          console.error(
            "GPS ERROR:",
            locationError
          );

          setError(
            "Location permission is required for live routing."
          );

        },

        {
          enableHighAccuracy:
            true,

          maximumAge:
            5000,

          timeout:
            15000,
        }

      );


    return () => {

      navigator.geolocation.clearWatch(
        watchId
      );

    };

  }, []);


  /* =======================================================
     DESTINATION
  ======================================================= */

  const destination =
    selectedCase &&
    selectedCase.latitude !== null &&
    selectedCase.longitude !== null
      ? [
          selectedCase.latitude,
          selectedCase.longitude,
        ]
      : null;


  /* =======================================================
     MAP CENTER
  ======================================================= */

  const mapCenter =
    destination ||
    position ||
    [
      12.9716,
      77.5946,
    ];


  /* =======================================================
     ROUTE COORDINATES
  ======================================================= */

  const routeCoordinates =
    Array.isArray(
      route?.geometry?.coordinates
    )
      ? route.geometry.coordinates
          .map(
            (coordinate) => {

              if (
                !Array.isArray(
                  coordinate
                ) ||
                coordinate.length < 2
              ) {
                return null;
              }

              const longitude =
                toNumber(
                  coordinate[0]
                );

              const latitude =
                toNumber(
                  coordinate[1]
                );

              if (
                latitude === null ||
                longitude === null
              ) {
                return null;
              }

              return [
                latitude,
                longitude,
              ];

            }
          )
          .filter(Boolean)
      : [];


  /* =======================================================
     LOCATION ASSIGNMENT
  ======================================================= */

  const isLocationAssignment =
    selectedCase?.taskType ===
      "location_assignment" ||
    String(
      selectedCase?.caseNumber ||
      ""
    ).startsWith(
      "TASK-agent_assignment_"
    );


  /* =======================================================
     CALCULATE ROUTE
  ======================================================= */

  async function handleCalculateRoute() {

    if (!selectedCase) {

      setError(
        "Select a destination first."
      );

      return;

    }


    if (
      isLocationAssignment
    ) {

      setError(
        "Route calculation is available for recovery cases."
      );

      return;

    }


    if (!destination) {

      setError(
        "The selected destination does not have valid coordinates."
      );

      return;

    }


    if (!position) {

      setError(
        "Waiting for your current GPS location."
      );

      return;

    }


    try {

      setRouteLoading(
        true
      );

      setError("");
      setMessage("");


      const response =
        await getRoute(
          selectedCase.id
        );


      setRoute(
        response
      );


      setMessage(
        "Route calculated successfully."
      );

    } catch (err) {

      console.error(
        "ROUTE CALCULATION ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to calculate route."
      );

    } finally {

      setRouteLoading(
        false
      );

    }

  }


  /* =======================================================
     CHECK-IN
  ======================================================= */

  async function handleCheckIn() {

    if (!selectedCase) {

      setError(
        "Select a destination first."
      );

      return;

    }


    if (
      isLocationAssignment
    ) {

      setError(
        "Check-in is available for recovery cases."
      );

      return;

    }


    if (!position) {

      setError(
        "Waiting for your current GPS location."
      );

      return;

    }


    if (!destination) {

      setError(
        "The selected destination does not have valid coordinates."
      );

      return;

    }


    try {

      setCheckingIn(
        true
      );

      setError("");
      setMessage("");


      const result =
        await checkIn(
          selectedCase.id,
          {
            latitude:
              position[0],

            longitude:
              position[1],
          }
        );


      setCheckedIn(
        true
      );


      setMessage(
        result?.message ||
        "Check-in successful."
      );


    } catch (err) {

      console.error(
        "CHECK-IN ERROR:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to check in."
      );

    } finally {

      setCheckingIn(
        false
      );

    }

  }


  /* =======================================================
     SELECT TASK
  ======================================================= */

  function handleSelectTask(
    item
  ) {

    const normalized =
      normalizeCase(
        item
      );


    setSelectedCase(
      normalized
    );


    setRoute(
      null
    );


    setCheckedIn(
      normalized?.status ===
      "in_progress"
    );


    setError("");
    setMessage("");

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <AppShell
      role="agent"
      title="Route & map"
      subtitle="Plan and navigate your assigned field visits."
    >

      <div className="route-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              FIELD NAVIGATION
            </div>

            <h2>
              Route & map
            </h2>

            <p>
              View your assigned destinations
              and calculate driving routes.
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
            EXISTING PAGE LAYOUT
        ================================================= */}

        <div className="route-layout">


          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside className="route-sidebar">

            <div className="route-sidebar-heading">

              <div>

                <div className="card-eyebrow">
                  ASSIGNED TASKS
                </div>

                <h3>
                  Your destinations
                </h3>

              </div>


              <RouteIcon
                size={19}
              />

            </div>


            {loading ? (

              <div className="route-empty-state">

                <RefreshCw
                  size={18}
                  className="spin"
                />

                <span>
                  Loading assigned destinations...
                </span>

              </div>

            ) : !cases.length ? (

              <div className="route-empty-state">

                <MapPin
                  size={18}
                />

                <span>
                  No assigned destinations.
                </span>

              </div>

            ) : (

              <div className="route-case-list">

                {cases.map(
                  (
                    item
                  ) => {

                    const active =
                      String(
                        selectedCase?.id
                      ) ===
                      String(
                        item.id
                      );


                    const locationTask =
                      item.taskType ===
                        "location_assignment" ||
                      String(
                        item.caseNumber ||
                        ""
                      ).startsWith(
                        "TASK-agent_assignment_"
                      );


                    return (

                      <button
                        key={
                          item.id
                        }
                        type="button"
                        className={
                          active
                            ? "route-case active"
                            : "route-case"
                        }
                        onClick={() =>
                          handleSelectTask(
                            item
                          )
                        }
                      >

                        <div className="route-case-icon">

                          <MapPin
                            size={17}
                          />

                        </div>


                        <div>

                          {/* =================================
                              TASK TITLE
                          ================================= */}

                          <strong>

                            {
                              locationTask
                                ? "Assigned destination"
                                : (
                                    item.caseNumber ||
                                    item.id
                                  )
                            }

                          </strong>


                          {/* =================================
                              CUSTOMER / TASK TYPE
                          ================================= */}

                          {!locationTask && (

                            <span>

                              {
                                item.customerName ||
                                "Recovery case"
                              }

                            </span>

                          )}


                          {/* =================================
                              ADDRESS
                          ================================= */}

                          <small>

                            {
                              item.address ||
                              item.location ||
                              "Address unavailable"
                            }

                          </small>

                        </div>

                      </button>

                    );

                  }
                )}

              </div>

            )}


            {/* =================================================
                CURRENT LOCATION
            ================================================= */}

            <div className="current-location-box">

              <div className="live-dot" />

              <div>

                <strong>
                  Your location
                </strong>

                <span>

                  {
                    position
                      ? "GPS location active"
                      : "Waiting for GPS"
                  }

                </span>

              </div>

            </div>

          </aside>


          {/* =================================================
              MAP
          ================================================= */}

          <section className="route-map-card">

            <MapContainer
              center={
                mapCenter
              }
              zoom={
                destination ||
                position
                  ? 15
                  : 12
              }
              scrollWheelZoom={
                true
              }
              style={{
                width:
                  "100%",

                height:
                  "100%",
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              <MapCenter
                position={
                  position
                }
                destination={
                  destination
                }
              />


              {/* =================================================
                  SOURCE MARKER
              ================================================= */}

              {position && (

                <Marker
                  position={
                    position
                  }
                  icon={
                    sourceIcon
                  }
                >

                  <Tooltip
                    permanent
                    direction="top"
                    offset={[
                      0,
                      -8,
                    ]}
                  >

                    <strong>
                      SOURCE
                    </strong>

                  </Tooltip>


                  <Popup>

                    <strong>
                      Source
                    </strong>

                    <br />

                    Your current location

                  </Popup>

                </Marker>

              )}


              {/* =================================================
                  DESTINATION MARKER
              ================================================= */}

              {destination && (

                <Marker
                  position={
                    destination
                  }
                  icon={
                    destinationIcon
                  }
                >

                  <Tooltip
                    permanent
                    direction="top"
                    offset={[
                      0,
                      -8,
                    ]}
                  >

                    <strong>
                      DESTINATION
                    </strong>

                  </Tooltip>


                  <Popup>

                    <strong>
                      Destination
                    </strong>

                    <br />

                    {
                      selectedCase?.address ||
                      selectedCase?.location ||
                      "Assigned location"
                    }

                  </Popup>

                </Marker>

              )}


              {/* =================================================
                  ACTUAL ROUTE ONLY
              ================================================= */}

              {routeCoordinates.length > 0 && (

                <Polyline
                  positions={
                    routeCoordinates
                  }
                  pathOptions={{
                    weight: 6,
                  }}
                />

              )}

            </MapContainer>


            {/* =================================================
                NO DESTINATION
            ================================================= */}

            {!destination && (

              <div className="route-map-overlay">

                <MapPin
                  size={22}
                />

                <strong>
                  No destination coordinates
                </strong>

                <span>
                  This assigned task does not have
                  valid mapped coordinates.
                </span>

              </div>

            )}


            {/* =================================================
                GPS WAITING
            ================================================= */}

            {destination &&
              !position && (

                <div
                  className="route-map-overlay"
                  style={{
                    pointerEvents:
                      "none",
                  }}
                >

                  <LocateFixed
                    size={22}
                  />

                  <strong>
                    Destination located
                  </strong>

                  <span>
                    Allow GPS access for live navigation.
                  </span>

                </div>

              )}

          </section>

        </div>

      </div>

    </AppShell>

  );
}


export default AgentRoute;