import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="max-w-sm mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={user.photoURL || "/default.jpg"}
          alt={user.displayName}
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-md"
        />
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {user.displayName}
        </h2>
        <p className="text-sm text-gray-600">{user.email}</p>

        <div className="mt-4 space-y-3 w-full">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">Account ID</h3>
            <p className="text-sm text-gray-800">{user.uid}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">
              Email Verified
            </h3>
            <p className="text-sm text-gray-800">
              {user.emailVerified ? "Yes" : "No"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-medium text-gray-500">
              Account Created
            </h3>
            <p className="text-sm text-gray-800">
              {new Date(user.metadata.creationTime).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
