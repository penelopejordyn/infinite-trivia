import React, { useState, useMemo, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import getData from './getData'; // Ensure the path is correct for getData

function Advanced() {
  const [db, setDb] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState([]);
  const currentIndexRef = useRef(currentIndex);

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

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, index) => {
    const currentQuestion = db[index];
    const directionToIndex = {
      'left': 1,
      'right': 3,
      'up': 2,
      'down': 0
    };
    
    const selectedAnswerIndex = directionToIndex[direction];
    const selectedAnswer = currentAnswers[selectedAnswerIndex];

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    console.log(`Swiped ${direction}: ${selectedAnswer} (Correct: ${currentQuestion.correct_answer})`);

    setLastDirection(isCorrect ? 'correct' : 'incorrect');
    setFeedback(isCorrect ? 'Correct!' : 'Incorrect!');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000); // Hide feedback after 2 seconds
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

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

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
      <h1>React Tinder Card</h1>
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
          {currentAnswers.map((answer, idx) => (
            <div
              key={idx}
              className={`answer answer-${idx}`}
              style={{ display: 'block' }}
            >
              {decodeHtml(answer)}
            </div>
          ))}
        </div>
      )}
      {showFeedback && <div className="feedback">{feedback}</div>}
      <div className="buttons">
        <button onClick={() => swipe('left')}>Swipe Left</button>
        <button onClick={() => swipe('right')}>Swipe Right</button>
        <button onClick={() => swipe('up')}>Swipe Up</button>
        <button onClick={() => swipe('down')}>Swipe Down</button>
      </div>
    </div>
  );
}

export default Advanced;
