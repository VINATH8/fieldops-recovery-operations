import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import {
  useEffect,
  useState,
} from "react";

function AgentMap() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    const watchId =
      navigator.geolocation.watchPosition(
        (location) => {
          setPosition([
            location.coords.latitude,
            location.coords.longitude,
          ]);
        },
        () => {},
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 15000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, []);

  /*
    Temporary map center only.

    This is NOT recovery-case data.
    Once browser GPS is available, the map centers
    on the actual agent location.
  */
  const center = position || [
    20.5937,
    78.9629,
  ];

  return (
    <section className="agent-map-card">

      <div className="map-card-header">

        <div>

          <div className="card-eyebrow">
            FIELD MAP
          </div>

          <h3>
            Your location
          </h3>

        </div>

        <div className="map-live-status">
          <span />
          Live
        </div>

      </div>


      <div className="agent-map">

        <MapContainer
          center={center}
          zoom={position ? 15 : 5}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "100%",
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {position && (
            <Marker position={position}>

              <Popup>
                Your current location
              </Popup>

            </Marker>
          )}

        </MapContainer>


        {!position && (
          <div className="map-empty-overlay">

            <div className="map-empty-content">

              <div className="map-empty-icon">
                ◉
              </div>

              <strong>
                Waiting for location
              </strong>

              <span>
                Allow browser location access
                to show your position.
              </span>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}

export default AgentMap;