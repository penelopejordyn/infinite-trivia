'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';


function UserStats({email }) {
    const { user } = useUser();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/get-user-stats?email=${user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user stats');
        }
        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Stats</h1>
      {userStats && (
        <div>
          <p>Email: {userStats.email}</p>
          <p>Name: {userStats.name}</p>
          <p>Questions Right: {userStats.stats.questionsRight}</p>
          <p>Questions Wrong: {userStats.stats.questionsWrong}</p>
          <p>Longest Game: {userStats.stats.longestGame}</p>
        </div>
      )}
    </div>
  );
}

export default UserStats;
