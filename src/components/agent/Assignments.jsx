import {
  ClipboardList,
  ArrowRight,
} from "lucide-react";

function Assignments({ assignments = [] }) {
  return (
    <section className="assignments-card">

      <div className="section-heading">

        <div>

          <div className="card-eyebrow">
            FIELD WORK
          </div>

          <h3>
            My assignments
          </h3>

        </div>

        {assignments.length > 0 && (
          <span className="assignment-count">
            {assignments.length}
          </span>
        )}

      </div>


      {assignments.length === 0 ? (
        <div className="assignments-empty">

          <div className="assignments-empty-icon">
            <ClipboardList size={20} />
          </div>

          <div>

            <strong>
              No assignments yet
            </strong>

            <p>
              Your assigned recovery cases will
              appear here once they are allocated.
            </p>

          </div>

        </div>
      ) : (
        <div className="assignment-list">

          {assignments.map((assignment) => (

            <div
              className="assignment-row"
              key={assignment.id}
            >

              <div>

                <strong>
                  {assignment.title}
                </strong>

                <span>
                  {assignment.address}
                </span>

              </div>

              <button
                type="button"
                className="assignment-arrow"
              >
                <ArrowRight size={17} />
              </button>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}

export default Assignments;