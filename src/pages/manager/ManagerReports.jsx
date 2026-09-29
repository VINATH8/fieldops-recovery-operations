import {
  BarChart3,
  FileText,
} from "lucide-react";

import AppShell from "../../components/layout/AppShell";

function ManagerReports() {
  return (
    <AppShell
      role="manager"
      title="Reports"
      subtitle="Operational performance and recovery outcomes."
    >

      <div className="manager-page">

        <div className="section-page-header">

          <div>

            <div className="dashboard-eyebrow">
              OPERATIONS ANALYTICS
            </div>

            <h2>
              Reports
            </h2>

            <p>
              Operational metrics generated from
              completed field activity.
            </p>

          </div>

        </div>


        <div className="reports-empty">

          <div className="reports-empty-icon">
            <BarChart3 size={25} />
          </div>

          <h3>
            Reports will populate from real activity
          </h3>

          <p>
            Once cases, visits and field updates are
            available through the backend, this section
            will calculate recovery and agent performance
            metrics.
          </p>

        </div>

      </div>

    </AppShell>
  );
}

export default ManagerReports;