import React from 'react';
import { ShieldOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnauthPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center">
        <ShieldOff className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. Please log in with the appropriate account.
        </p>
        <Link
          to="/auth/login"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthPage;
