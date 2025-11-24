import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [friends, setFriends] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchFriends();
    fetchRatings();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${user.id}/friends`);
      setFriends(response.data);
    } catch (err) {
      console.error('Error fetching friends:', err);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axios.get(`${API_URL}/ratings/user/${user.id}`);
      setRatings(response.data.ratings);
      setAverageRating(response.data.averageRating);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFriend || rating === 0) {
      setError('Please select a friend and a rating');
      return;
    }

    try {
      await axios.post(`${API_URL}/ratings`, {
        ratee: selectedFriend._id,
        rating,
        comment,
      });

      setSelectedFriend(null);
      setRating(0);
      setComment('');
      fetchRatings();
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting rating');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Your Rating Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Rating Summary</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-blue-600">{averageRating}</div>
            <div>
              <p className="text-gray-600">Average Rating</p>
              <p className="text-gray-600">{ratings.length} ratings received</p>
            </div>
          </div>
        </div>

        {/* Rate a Friend */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Rate a Friend</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleRate}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Select Friend</label>
              <select
                value={selectedFriend?._id || ''}
                onChange={(e) => {
                  const friend = friends.find(f => f._id === e.target.value);
                  setSelectedFriend(friend);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="">Choose a friend...</option>
                {friends.map(friend => (
                  <option key={friend._id} value={friend._id}>
                    {friend.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Rating (1-5 stars)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
            >
              Submit Rating
            </button>
          </form>
        </div>
      </div>

      {/* Recent Ratings */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Ratings You've Received</h2>

        {ratings.length === 0 ? (
          <p className="text-gray-600">No ratings yet. Invite friends to get started!</p>
        ) : (
          <div className="space-y-4">
            {ratings.map(r => (
              <div key={r._id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{r.rater.name}</h3>
                  <div className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                </div>
                {r.comment && <p className="text-gray-600 mt-2">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
