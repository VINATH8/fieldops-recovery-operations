function AgentHeader() {
  const currentHour = new Date().getHours();

  let greeting = "Good morning";

  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  }

  if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <section className="agent-page-header">

      <div>
        <div className="dashboard-eyebrow">
          FIELD OPERATIONS
        </div>

        <h2>
          {greeting}, Field Agent
        </h2>

        <p>
          Stay on top of your assigned recovery visits
          and field activity.
        </p>
      </div>

    </section>
  );
}

export default AgentHeader;