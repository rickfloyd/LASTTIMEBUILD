import React from 'react';
import CommunityHub from '../components/CommunityHub';
import UserCreatedPublicRooms from '../components/UserCreatedPublicRooms';

const PublicCommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Public Community Hub
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          Explore ideas, scripts, and discussions shared by the public community.
        </p>
      </header>
      
      <div className="comm-link-container" style={{ justifyContent: 'center', borderBottom: '2px solid #00ffcc' }}>
        <a href="video_room.html" target="_blank" className="comm-btn btn-video">
          START VIDEO CONF
        </a>
        <a href="video_room.html" target="_blank" className="comm-btn btn-voice">
          JOIN VOICE CHAT
        </a>
        <a href="#" className="comm-btn btn-sms">
          TEXT / SMS VIEW
        </a>
      </div>

      <CommunityHub visibility="public" />
      <div className="mt-8">
        <UserCreatedPublicRooms />
      </div>
    </div>
  );
};

export default PublicCommunityPage;
