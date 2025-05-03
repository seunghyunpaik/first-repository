import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const teeRef = useRef<HTMLDivElement>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout>();

  const startGame = () => {
    if (isGameRunning) return;
    setIsGameRunning(true);
    setScore(0);
    setTimeLeft(30);
    moveTee();
    gameIntervalRef.current = setInterval(updateGame, 1000);
  };

  const updateGame = () => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        endGame();
        return 0;
      }
      return prev - 1;
    });
  };

  const endGame = () => {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
    }
    setIsGameRunning(false);
    alert(`게임 종료! 최종 점수: ${score}`);
  };

  const moveTee = () => {
    if (!gameAreaRef.current || !teeRef.current) return;
    
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const teeSize = 20;
    
    const randomX = Math.random() * (gameAreaRect.width - teeSize);
    const randomY = Math.random() * (gameAreaRect.height - teeSize);
    
    if (teeRef.current) {
      teeRef.current.style.left = `${randomX}px`;
      teeRef.current.style.top = `${randomY}px`;
    }
  };

  const checkCollision = (): boolean => {
    if (!teeRef.current) return false;
    
    const teeRect = teeRef.current.getBoundingClientRect();
    const holeElement = document.querySelector('.hole');
    if (!holeElement) return false;
    
    const holeRect = holeElement.getBoundingClientRect();
    
    const distance = Math.sqrt(
      Math.pow(teeRect.left + teeRect.width/2 - (holeRect.left + holeRect.width/2), 2) +
      Math.pow(teeRect.top + teeRect.height/2 - (holeRect.top + holeRect.height/2), 2)
    );
    
    return distance < 25;
  };

  const handleTeeClick = () => {
    if (!isGameRunning) {
      startGame();
      return;
    }
    
    if (checkCollision()) {
      setScore(prev => prev + 10);
      moveTee();
    } else {
      setScore(prev => Math.max(0, prev - 5));
    }
  };

  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="game-area" ref={gameAreaRef}>
        <div className="hole"></div>
        <div 
          className="tee" 
          ref={teeRef}
          onClick={handleTeeClick}
        ></div>
      </div>
      <div className="score">점수: <span>{score}</span></div>
      <div className="timer">시간: <span>{timeLeft}</span>초</div>
    </div>
  );
};

export default App; 