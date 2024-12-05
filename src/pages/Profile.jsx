import React from 'react';
import ProfileCard from '../components/Profile/ProfileCard';

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">
        Profile Information
      </h1>
      <ProfileCard />
    </div>
  );
}