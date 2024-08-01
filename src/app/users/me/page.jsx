'use client'
import React, { useEffect, useState } from 'react';


function UserStats({email }) {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await fetch(`/api/get-user-stats?email=${email}`);
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
  if (error) return (<><div>Play a game to show your stats</div><a href="/trivia">Play Now!</a></>
  )

  return (
    <div>
      <h1>Your Stats</h1>
      {userStats && (
        <div>
          <p>Email: {userStats.email}</p>
          <p>Name: {userStats.name}</p>
          <p>Questions Right: {userStats.stats.questionsRight}</p>
          <p>Questions Wrong: {userStats.stats.questionsWrong}</p>
          <p>Longest Game: {userStats.stats.longestGame} seconds</p>
        </div>
      )}
    </div>
  );
}

export default UserStats;
