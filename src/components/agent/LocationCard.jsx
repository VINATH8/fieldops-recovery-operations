import { useEffect, useState } from "react";
import {
  MapPin,
  Navigation,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

function LocationCard() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function requestLocation() {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });

        setLoading(false);
      },
      (locationError) => {
        setLoading(false);

        if (locationError.code === 1) {
          setError(
            "Location permission was denied."
          );
        } else if (locationError.code === 2) {
          setError(
            "Your current location could not be determined."
          );
        } else {
          setError(
            "Unable to retrieve your location."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

  useEffect(() => {
    requestLocation();
  }, []);

  return (
    <section className="agent-location-card">

      <div className="location-card-top">

        <div>
          <div className="card-eyebrow">
            CURRENT LOCATION
          </div>

          <h3>
            {location
              ? "Location available"
              : "Location not shared"}
          </h3>
        </div>

        <div
          className={
            location
              ? "location-live-icon active"
              : "location-live-icon"
          }
        >
          <MapPin size={19} />
        </div>

      </div>


      {loading && (
        <div className="location-message">

          <LoaderCircle
            size={17}
            className="spin"
          />

          <span>
            Getting your current location...
          </span>

        </div>
      )}


      {!loading && location && (
        <div className="location-details">

          <div className="location-coordinate">

            <span>Latitude</span>

            <strong>
              {location.latitude.toFixed(6)}
            </strong>

          </div>

          <div className="location-coordinate">

            <span>Longitude</span>

            <strong>
              {location.longitude.toFixed(6)}
            </strong>

          </div>

          <div className="location-accuracy">

            <Navigation size={14} />

            Accuracy approximately{" "}
            {Math.round(location.accuracy)}m

          </div>

        </div>
      )}


      {!loading && !location && (
        <div className="location-empty">

          <div className="location-empty-icon">
            <AlertCircle size={17} />
          </div>

          <div>

            <strong>
              Location sharing is off
            </strong>

            <span>
              Enable location access to use field
              routing and geofenced check-ins.
            </span>

          </div>

        </div>
      )}


      {error && (
        <p className="location-error">
          {error}
        </p>
      )}


      <button
        type="button"
        className="secondary-action"
        onClick={requestLocation}
        disabled={loading}
      >
        <Navigation size={15} />

        {loading
          ? "Locating..."
          : location
            ? "Refresh location"
            : "Share my location"}
      </button>

    </section>
  );
}

export default LocationCard;