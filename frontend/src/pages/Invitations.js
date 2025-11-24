import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Invitations = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sentInvites, setSentInvites] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleSendInvitation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter an email address');
        setLoading(false);
        return;
      }

      const inviteData = {
        recipientEmail: email,
        message,
      };

      const response = await axios.post(`${API_URL}/invitations/send`, inviteData);

      setSuccess(`Invitation sent successfully to ${email}!`);
      setSentInvites([...sentInvites, response.data]);

      // Clear form
      setEmail('');
      setMessage('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Invite Friends</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Invitation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Send Invitation</h2>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSendInvitation}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                placeholder="friend@example.com"
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Message (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                rows="3"
                placeholder="Add a personal message..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </div>

        {/* Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">📧 Email Invites</h3>
              <p className="text-gray-600">
                Send personalized invitations via email. Recipients will receive a link they can click to accept and join Ratify.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-2">👥 Build Your Network</h3>
              <p className="text-gray-600">
                Once they accept, you'll become friends on Ratify and can rate each other based on your experiences together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sent Invites */}
      {sentInvites.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Sent Invitations</h2>
          <div className="space-y-2">
            {sentInvites.map((invite, idx) => (
              <div key={idx} className="border-b pb-2">
                <p className="text-gray-700">
                  {invite.message} - {new Date().toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invitations;
