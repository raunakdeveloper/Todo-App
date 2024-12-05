import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '../UI/Spinner';

export default function Login() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-28 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome to Todo App</h1>
        {loading ? (
          <Spinner />
        ) : (
          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}