import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import TinderCard from 'react-tinder-card';
import getData from './getData'; 
import Timer from './Timer';
import { PrismaClient } from '@prisma/client';

function Advanced() {
  const [db, setDb] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const currentIndexRef = useRef(currentIndex);
  const answerHandlerRef = useRef();

  function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('https://opentdb.com/api.php?amount=50');
      const formattedData = res.results.map((question) => {
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer]);
        return { ...question, answers };
      });
      setDb(formattedData);
      setCurrentIndex(formattedData.length - 1);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (db.length > 0) {
      setCurrentAnswers(db[currentIndex].answers);
    }
  }, [currentIndex, db]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef()),
    [db.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0 && !gameOver;

  const swiped = (direction, index) => {
    const currentQuestion = db[index];
    const directionToIndex = {
      'left': 0,
      'right': 1,
      'up': 2,
      'down': 3
    };
    
    const selectedAnswerIndex = directionToIndex[direction];
    const selectedAnswer = currentAnswers[selectedAnswerIndex];

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    console.log(`Swiped ${direction}: ${selectedAnswer} (Correct: ${currentQuestion.correct_answer})`);

    setLastDirection(isCorrect ? 'correct' : 'incorrect');
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect!');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000); // Hide feedback after 2 seconds

    if (answerHandlerRef.current) {
      answerHandlerRef.current(isCorrect);
    }

    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current.restoreCard();
    }
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };


  const handleTimeUp = ({ gameDuration, correctAnswers, incorrectAnswers }) => {
    setGameOver(true);

    console.log(`Game Over! Duration: ${gameDuration}s, Correct: ${correctAnswers}, Incorrect: ${incorrectAnswers}`);
  };

  const registerAnswerHandler = useCallback((handler) => {
    answerHandlerRef.current = handler;
  }, []);

  return (
    <div className="app">
      <link
        href='https://fonts.googleapis.com/css?family=Damion&display=swap'
        rel='stylesheet'
      />
      <link
        href='https://fonts.googleapis.com/css?family=Alatsi&display=swap'
        rel='stylesheet'
      />
      {!gameOver ? (
        <>
          <div className='cardContainer'>
            {db.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={character.question}
                onSwipe={(dir) => swiped(dir, index)}
                onCardLeftScreen={() => outOfFrame(character.question, index)}
              >
                <div className='card'>
                  <h3>{decodeHtml(character.difficulty)}</h3>
                  <h2>{decodeHtml(character.question)}</h2>
                </div>
              </TinderCard>
            ))}
          </div>
          {db.length > 0 && (
            <div className='answers'>
              <div className="answer answer-0">{decodeHtml(currentAnswers[0])}</div>
              <div className="answer answer-1">{decodeHtml(currentAnswers[1])}</div>
              <div className="answer answer-2">{decodeHtml(currentAnswers[2])}</div>
              <div className="answer answer-3">{decodeHtml(currentAnswers[3])}</div>
            </div>
          )}
          {showFeedback && <div className="feedback">{feedback}</div>}
          <div className="buttons">
            <button onClick={() => swipe('left')}>Swipe Left</button>
            <button onClick={() => swipe('right')}>Swipe Right</button>
            <button onClick={() => swipe('up')}>Swipe Up</button>
            <button onClick={() => swipe('down')}>Swipe Down</button>
          </div>
          <Timer onTimeUp={handleTimeUp} onAnswer={registerAnswerHandler} />
        </>
      ) : (
        <div className="gameOver">
          <h2>Game Over!</h2>
          <a className="fakeButton" href="/trivia">Play Again</a>
        </div>
      )}
    </div>
  );
}

export default Advanced;
