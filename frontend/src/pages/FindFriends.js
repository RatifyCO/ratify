import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FindFriends = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invitesSent, setInvitesSent] = useState(new Set());
  const [inviteErrors, setInviteErrors] = useState({});

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

  // Auto-refresh search results every 5 seconds if a query is active
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const interval = setInterval(() => {
      handleSearchInternal(searchQuery);
    }, 5000);

    return () => clearInterval(interval);
  }, [searchQuery]);

  const handleSearchInternal = async (query) => {
    try {
      const response = await axios.get(`${API_URL}/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error auto-refreshing search:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/users/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      setError('Error searching users');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId, email) => {
    try {
      setInviteErrors({ ...inviteErrors, [userId]: '' });
      await axios.post(`${API_URL}/invitations/send`, {
        recipientEmail: email,
        message: `Join me on Ratify!`,
      });

      setInvitesSent(new Set([...invitesSent, userId]));
      setTimeout(() => {
        const newSet = new Set(invitesSent);
        newSet.delete(userId);
        setInvitesSent(newSet);
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error sending invite';
      setInviteErrors({ ...inviteErrors, [userId]: errorMsg });
      console.error('Error sending invite:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Find Friends</h1>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : searchResults.length === 0 && searchQuery ? (
          <div className="col-span-full text-center py-8 text-gray-600">
            No users found matching "{searchQuery}"
          </div>
        ) : (
          searchResults.map(user => (
            <div key={user._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-4">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                    {user.name[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-600 mb-4 text-sm">{user.bio}</p>
              )}

              <button
                onClick={() => handleInvite(user._id, user.email)}
                disabled={invitesSent.has(user._id)}
                className={`w-full py-2 rounded font-semibold ${
                  invitesSent.has(user._id)
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {invitesSent.has(user._id) ? '✓ Invite Sent' : 'Send Invite'}
              </button>
              {inviteErrors[user._id] && (
                <p className="text-red-600 text-sm mt-2">{inviteErrors[user._id]}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FindFriends;
