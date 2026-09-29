import {
  Menu,
} from "lucide-react";


function Topbar({
  role,
  title,
  subtitle,
  onMenuClick,
}) {

  return (

    <header className="app-topbar">

      <div className="topbar-left">

        <button
          type="button"
          className="mobile-menu-button"
          onClick={
            onMenuClick
          }
          aria-label="Open navigation"
        >

          <Menu
            size={20}
          />

        </button>


        <div className="topbar-heading">

          <div className="topbar-eyebrow">

            {role === "manager"
              ? "MANAGER CONTROL CENTER"
              : "FIELD AGENT CONSOLE"}

          </div>


          <h1>
            {title}
          </h1>


          {subtitle && (

            <p>
              {subtitle}
            </p>

          )}

        </div>

      </div>

    </header>

  );
}


export default Topbar;