import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

  useEffect(() => {
    const acceptInvitation = async () => {
      try {
        const authToken = localStorage.getItem('token');
        if (!authToken) {
          setError('Please login to accept the invitation');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const response = await axios.post(
          `${API_URL}/invitations/accept/${token}`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );

        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        setError(err.response?.data?.error || 'Error accepting invitation');
      } finally {
        setLoading(false);
      }
    };

    acceptInvitation();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        {loading && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold">Processing your invitation...</h2>
          </>
        )}

        {error && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        )}

        {success && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✓ Success!</h2>
            <p className="text-gray-600 mb-4">Invitation accepted! Welcome to Ratify.</p>
            <p className="text-sm text-gray-500">Taking you to your dashboard...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;
