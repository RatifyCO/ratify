import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-white text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Ratify</h1>
          <p className="text-xl md:text-2xl mb-8">
            Connect with friends and share honest feedback through ratings
          </p>

          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Login
              </Link>
            </div>
          )}

          {user && (
            <div className="flex gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/find-friends"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Find Friends
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-2">Rate Friends</h3>
              <p className="text-gray-600">
                Rate your friends on a 1-5 star scale and leave comments about your experiences together.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-2xl font-bold mb-2">Build Network</h3>
              <p className="text-gray-600">
                Connect with people you know and build your trusted network of friends and colleagues.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-2xl font-bold mb-2">Easy Invitations</h3>
              <p className="text-gray-600">
                Invite friends via email or phone number and grow your circle effortlessly.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2">Track Ratings</h3>
              <p className="text-gray-600">
                See your average rating and understand how friends perceive you based on feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-2">Leave Comments</h3>
              <p className="text-gray-600">
                Add personalized comments to your ratings to provide meaningful feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is secure with password encryption and privacy-first design.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-600 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-6">Join thousands of people sharing honest feedback with friends</p>
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 Ratify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
