import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="ml-3 text-2xl font-bold text-blue-600 flex items-center"
          >
            Note App
          </Link>
          {user && (
            <div className="flex items-center space-x-6">
              <Link
                to="/profile"
                className="flex items-center space-x-3 hover:text-blue-600 transition-colors group"
              >
                <div className="relative">
                  <img
                    // If user has photoURL, use it. Otherwise, use the default image.
                    src={user.photoURL || "/default.jpg"}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border-2 border-gray-100 group-hover:border-blue-100 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm font-medium hidden sm:block text-gray-700 group-hover:text-blue-600">
                  {user.displayName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
