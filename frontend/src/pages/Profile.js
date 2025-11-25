import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [invitesSent, setInvitesSent] = useState(0);
  const [invitesReceived, setInvitesReceived] = useState(0);
  const { user } = useAuth();

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api';

  useEffect(() => {
    if (user && user.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user || !user.id) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/users/${user.id}`);
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        bio: response.data.bio || '',
      });
      // Fetch invitation counts (sent / received)
      try {
        const [allInvRes, pendingRes] = await Promise.all([
          axios.get(`${API_URL}/invitations`),
          axios.get(`${API_URL}/invitations/pending`),
        ]);

        const allInv = Array.isArray(allInvRes.data) ? allInvRes.data : [];
        const pendingInv = Array.isArray(pendingRes.data) ? pendingRes.data : [];

        const sentCount = allInv.filter(i => i.sender === user.id).length;

        // Combine pending and invitations where recipient matches user id
        const receivedIds = new Set();
        pendingInv.forEach(i => receivedIds.add(i._id));
        allInv.filter(i => i.recipient === user.id).forEach(i => receivedIds.add(i._id));

        setInvitesSent(sentCount);
        setInvitesReceived(receivedIds.size);
      } catch (invErr) {
        console.error('Error fetching invite counts:', invErr);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(`${API_URL}/users/${user.id}`, formData);
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error updating profile');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-6">
          <div className="flex flex-col items-center">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-32 h-32 rounded-full mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-4xl mb-4">
                {profile?.name[0]}
              </div>
            )}
            <h2 className="text-2xl font-bold text-center">{profile?.name}</h2>
            <p className="text-gray-600 text-center">{profile?.email}</p>
            {profile?.phone && (
              <p className="text-gray-600 text-center">{profile.phone}</p>
            )}
          </div>

          {profile?.friends && (
            <div className="mt-6 pt-6 border-t">
              <p className="font-semibold mb-2">{profile.friends.length} Friends</p>
              <p className="text-sm text-gray-600">Invites sent: {invitesSent}</p>
              <p className="text-sm text-gray-600">Invites received: {invitesReceived}</p>
            </div>
          )}
        </div>

        {/* Edit Profile Form */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <p className="text-gray-600">{profile?.email}</p>
              </div>

              {profile?.phone && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                  <p className="text-gray-600">{profile.phone}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                <p className="text-gray-600">{profile?.bio || 'No bio added yet'}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Member Since</label>
                <p className="text-gray-600">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
