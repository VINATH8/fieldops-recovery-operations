import { Navigate } from "react-router-dom";

import {
  getCurrentUser,
} from "../../api/api";


function ProtectedRoute({
  children,
  role,
}) {

  const user =
    getCurrentUser();


  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  if (
    role &&
    user.role !== role
  ) {

    return (
      <Navigate
        to={
          user.role === "manager"
            ? "/manager"
            : "/agent"
        }
        replace
      />
    );

  }


  return children;
}


export default ProtectedRoute;