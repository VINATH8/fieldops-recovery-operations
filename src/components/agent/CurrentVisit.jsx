import {
  Navigation,
  MapPin,
  ClipboardCheck,
} from "lucide-react";

function CurrentVisit({ visit }) {
  if (!visit) {
    return (
      <section className="current-visit-card">

        <div className="card-eyebrow">
          CURRENT VISIT
        </div>

        <div className="empty-visit">

          <div className="empty-visit-icon">
            <ClipboardCheck size={21} />
          </div>

          <h3>
            No active visit
          </h3>

          <p>
            When a recovery case is assigned to you,
            your active visit will appear here.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="current-visit-card">

      <div className="card-eyebrow">
        CURRENT VISIT
      </div>

      <h3>
        {visit.title}
      </h3>

      <p className="visit-address">
        <MapPin size={14} />

        {visit.address}
      </p>

      <button
        type="button"
        className="visit-navigation-button"
      >
        <Navigation size={16} />

        Navigate
      </button>

    </section>
  );
}

export default CurrentVisit;