import React from 'react';
import { useAuth } from '../context/AuthContext';

const Debug: React.FC = () => {
  const { isAuthenticated, user, loading, token } = useAuth();

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const testLogin = async () => {
    try {
      const response = await fetch('http://localhost:5004/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@example.com', // Replace with actual admin email
          password: 'admin123' // Replace with actual admin password
        })
      });
      
      const data = await response.json();
      console.log('Test login response:', data);
    } catch (error) {
      console.error('Test login error:', error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold mb-2">Auth State:</h2>
        <pre className="text-sm">{JSON.stringify({
          isAuthenticated,
          user,
          loading,
          token: token ? `${token.substring(0, 20)}...` : null
        }, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold mb-2">LocalStorage:</h2>
        <pre className="text-sm">{JSON.stringify({
          token: localStorage.getItem('token') ? `${localStorage.getItem('token')?.substring(0, 20)}...` : null,
          user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
        }, null, 2)}</pre>
      </div>

      <div className="space-y-4">
        <button 
          onClick={clearStorage}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear LocalStorage & Reload
        </button>
        
        <button 
          onClick={testLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-4"
        >
          Test Login API
        </button>
        
        <div className="mt-4">
          <a href="/admin" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Go to /admin
          </a>
          <a href="/login" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ml-4">
            Go to /login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Debug;
