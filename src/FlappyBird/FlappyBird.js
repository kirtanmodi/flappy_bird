import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { css } from "@emotion/react";

const FRAME_RATE = 24;
const GAME_FRAME = 700;
const GAME_FRAME_WIDTH = 400;
// const GAME_FRAME_2 = 100;
const BIRD_JUMP = 100;
const OBSTACLE_WIDTH = 100;
// const GAP = 200;
const MAX = 300;
const MIN = 100;
const GAP_MAX = 200;
const GAP_MIN = 250;

const MARGIN_TOP = 2;

const breakpoints = [576, 768, 992, 1200];

const mq = breakpoints.map((bp) => `@media (min-width: ${bp}px)`);

function FlappyBird() {
  const [gameStart, setGameStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [ballPosition, setBallPosition] = useState(150);
  const [obstacleHeight, setObstacleHeight] = useState(0);
  const [bottomObstacleHeight, setBottomObstacleHeight] = useState(100);
  const [moveObstacle, setMoveObstacle] = useState(GAME_FRAME_WIDTH - 100);
  // const [bottomObstaclePosition, setBottomObstaclePosition] = useState(600)
  const [hasObstacleMoved, setHasObstacleMoved] = useState(false);
  const [GAP, setGAP] = useState(200);
  const [score, setScore] = useState(0);

  // useEffect to move bird down
  useEffect(() => {
    let intervalId;
    if (gameStart && !isGameOver) {
      intervalId = setInterval(() => {
        setBallPosition(ballPosition + 10);
      }, FRAME_RATE);

      if (ballPosition === 650) {
        clearInterval(intervalId);
        setIsGameOver(true);
        setGameStart(false);
      } else if (ballPosition < 0) {
        setBallPosition(0);
      }

      if (moveObstacle <= 50 && moveObstacle + OBSTACLE_WIDTH > 0) {
        if (
          ballPosition < obstacleHeight ||
          ballPosition > obstacleHeight + GAP
        ) {
          console.log("game over");
          setIsGameOver(true);
          setGameStart(false);
          clearInterval(intervalId);
        }
      }
    }
    return () => clearInterval(intervalId);
  }, [
    ballPosition,
    gameStart,
    isGameOver,
    obstacleHeight,
    bottomObstacleHeight,
    moveObstacle,
    GAP,
  ]);

  console.log(
    obstacleHeight,
    GAP,
    bottomObstacleHeight,
    moveObstacle,
    ballPosition
  );

  // useEffect to start game
  useEffect(() => {
    const clickToStart = () => {
      if (!isGameOver) {
        setGameStart(true);
      }
    };
    document.addEventListener("click", clickToStart);
    return () => {
      document.removeEventListener("click", clickToStart);
    };
  }, [isGameOver, ballPosition]);

  // useEffect to move Bird on click
  useEffect(() => {
    const handleBird = () => {
      if (!isGameOver) {
        setBallPosition(ballPosition - BIRD_JUMP);
      }
    };
    document.addEventListener("click", handleBird);
    return () => {
      document.removeEventListener("click", handleBird);
    };
  }, [ballPosition, isGameOver]);

  // useEffect to generate random obstacle height
  useEffect(() => {
    setGAP(Math.floor(Math.random() * (GAP_MAX - GAP_MIN + 1)) + GAP_MIN);
    setObstacleHeight(Math.floor(Math.random() * (MAX - MIN + 1)) + MIN);
  }, [hasObstacleMoved]);

  // useEffect to generate bottomObstacleHeight
  useEffect(() => {
    setBottomObstacleHeight(700 - obstacleHeight - GAP);
  }, [obstacleHeight]);

  // useEffect to move obstacle
  useEffect(() => {
    let obstacleInterval;
    if (gameStart) {
      obstacleInterval = setInterval(() => {
        setMoveObstacle(moveObstacle - 10);
      }, FRAME_RATE);
    }
    if (moveObstacle > GAME_FRAME_WIDTH - 100) {
      setHasObstacleMoved(false);
      //   setScore(score + 1);
    }
    return () => clearInterval(obstacleInterval);
  }, [ballPosition]);

  useEffect(() => {
    if (moveObstacle <= -100) {
      setHasObstacleMoved(true);
      setMoveObstacle(GAME_FRAME_WIDTH);
    }
  }, [ballPosition]);

  useEffect(() => {
    if (hasObstacleMoved) {
      setScore(score + 1);
    }
  }, [hasObstacleMoved]);

  return (
    <GameFrame
      //   height={`${GAME_FRAME_2}vh`}
      //   width={`${GAME_FRAME_2}vw`}
      height={GAME_FRAME}
      width={GAME_FRAME_WIDTH}
      bgcolor={"aliceblue"}
    >
      <div style={{ textAlign: "center" }}>SCORE: {score}</div>
      <TopObstacle
        obstacleHeight={obstacleHeight}
        moveObstacle={`${moveObstacle}px`}
      />
      <Bird
        top={`${ballPosition}px`}
        css={css`
          backgroundcolor: green;
          ${mq[0]} {
            backgroundcolor: gray;
          }
          ${mq[1]} {
            backgroundcolor: hotpink;
          }
        `}
      />
      <BottomObstacle
        moveObstacle={`${moveObstacle}px`}
        bottomObstacleHeight={bottomObstacleHeight}
        bottomObstaclePosition={
          GAME_FRAME - obstacleHeight - bottomObstacleHeight
        }
      />
    </GameFrame>
  );
}

export default FlappyBird;

const GameFrame = styled.div((props) => ({
  marginTop: MARGIN_TOP,
  height: props.height,
  width: props.width,
  backgroundColor: props.bgcolor,
  overflow: "hidden",
}));

const Bird = styled.div((props) => ({
  marginTop: MARGIN_TOP,
  position: "absolute",
  // left: "300px",
  top: props.top,
  height: "50px",
  width: "50px",
  backgroundColor: "#F37878",
  borderRadius: "50%",
  transition: "all 0.04s ease-out",
}));

const TopObstacle = styled.div((props) => ({
  position: "relative",
  top: "0px",
  left: props.moveObstacle,
  backgroundColor: "#5BB318",
  height: props.obstacleHeight,
  width: `${OBSTACLE_WIDTH}px`,
}));
const BottomObstacle = styled.div((props) => ({
  position: "relative",
  top: props.bottomObstaclePosition,
  bottom: "0px",
  left: props.moveObstacle,
  backgroundColor: "#7DCE13",
  height: props.bottomObstacleHeight,
  width: `${OBSTACLE_WIDTH}px`,
}));
