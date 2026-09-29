import {
  ClipboardList,
  CheckCircle2,
  Clock3,
} from "lucide-react";

function AgentStats({ assignments = [] }) {
  const assignedCount = assignments.length;

  const completedCount = assignments.filter(
    (assignment) =>
      assignment.status === "completed"
  ).length;

  const pendingCount = assignments.filter(
    (assignment) =>
      assignment.status !== "completed"
  ).length;

  const stats = [
    {
      label: "Assigned",
      value: assignedCount,
      icon: ClipboardList,
      type: "purple",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: CheckCircle2,
      type: "green",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock3,
      type: "orange",
    },
  ];

  return (
    <section className="agent-stats">

      {stats.map((stat) => {

        const Icon = stat.icon;

        return (
          <div
            className="agent-stat-card"
            key={stat.label}
          >

            <div
              className={`stat-icon ${stat.type}`}
            >
              <Icon size={18} />
            </div>

            <div className="stat-content">

              <span>
                {stat.label}
              </span>

              <strong>
                {stat.value}
              </strong>

            </div>

          </div>
        );
      })}

    </section>
  );
}

export default AgentStats;