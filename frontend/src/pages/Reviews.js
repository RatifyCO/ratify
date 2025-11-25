import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Reviews = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/${user.id}/friends`);
      setFriends(res.data || []);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Unable to load friends');
    }
  };

  const loadReviewsForFriend = async (friend) => {
    setError('');
    setReviews([]);
    setSelectedFriend(friend);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/ratings/user/${friend._id}`);
      setReviews(res.data.ratings || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Unable to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!selectedFriend || rating === 0) {
      setError('Select a friend and choose a rating');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await axios.post(`${API_URL}/ratings`, {
        ratee: selectedFriend._id,
        rating,
        comment,
      });
      setComment('');
      setRating(0);
      // reload reviews
      await loadReviewsForFriend(selectedFriend);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Unable to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Reviews</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Your Friends</h2>
          {friends.length === 0 ? (
            <p className="text-gray-600">No friends yet. Invite people to get started.</p>
          ) : (
            <ul className="space-y-2">
              {friends.map((f) => (
                <li key={f._id}>
                  <button
                    onClick={() => loadReviewsForFriend(f)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100"
                  >
                    {f.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">{selectedFriend ? `${selectedFriend.name} — Reviews` : 'Select a friend'}</h2>

          {loading && selectedFriend && <p>Loading reviews...</p>}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {!selectedFriend && <p className="text-gray-600">Choose a friend to view their reviews.</p>}

          {selectedFriend && !loading && (
            <div>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews for this friend yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="border-b pb-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{r.rater?.name || 'Anonymous'}</div>
                        <div className="text-yellow-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      </div>
                      {r.comment && <p className="text-gray-600 mt-2">{r.comment}</p>}
                      <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Write a review form */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                <form onSubmit={submitReview}>
                  <div className="mb-3">
                    <label className="block text-gray-700 font-semibold mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setRating(s)} className={`text-3xl ${rating >= s ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-gray-700 font-semibold mb-1">Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" rows="3" />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button type="button" onClick={() => { setComment(''); setRating(0); }} className="bg-gray-200 px-4 py-2 rounded">
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
