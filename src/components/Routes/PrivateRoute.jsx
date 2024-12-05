import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "../UI/Spinner";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}
