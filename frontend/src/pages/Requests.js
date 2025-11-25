import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/invitations/pending`);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  const respond = async (inviteToken, action) => {
    setError('');
    try {
      if (action === 'accept') {
        await axios.post(`${API_URL}/invitations/accept/${inviteToken}`);
      } else {
        await axios.post(`${API_URL}/invitations/decline/${inviteToken}`);
      }
      // refresh list
      fetchRequests();
    } catch (err) {
      console.error('Error responding to request:', err);
      setError('Could not update request');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Friend Requests</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6">No pending requests.</div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-start">
              <div>
                <div className="font-semibold">{r.sender?.name || 'Someone'}</div>
                <div className="text-sm text-gray-600">{r.message || 'No message'}</div>
                <div className="text-xs text-gray-400 mt-2">{new Date(r.createdAt).toLocaleString()}</div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => respond(r.inviteToken, 'accept')}
                  className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => respond(r.inviteToken, 'decline')}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
