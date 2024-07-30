import React, { useState, useEffect, useRef } from 'react';

function Timer({ onTimeUp, onAnswer }) {
  const [time, setTime] = useState(30);
  const [gameDuration, setGameDuration] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
      setGameDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (time <= 0) {
      clearInterval(intervalRef.current);
      onTimeUp({ gameDuration, correctAnswers, incorrectAnswers });
    }
  }, [time, onTimeUp, gameDuration, correctAnswers, incorrectAnswers]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setTime((prevTime) => prevTime + 5);
      setCorrectAnswers((prevCorrect) => prevCorrect + 1);
    } else {
      setTime((prevTime) => prevTime - 5);
      setIncorrectAnswers((prevIncorrect) => prevIncorrect + 1);
    }
  };

  useEffect(() => {
    onAnswer(handleAnswer);
  }, [onAnswer]);

  return (
    <div className="timer">
      <h2>Time Left: {time}s</h2>
    </div>
  );
}

export default Timer;
