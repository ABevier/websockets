import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import socketService from "./services/socketService";
import { JoinRoom } from "./components/joinRoom";
import GameContext, { GameContextProps } from "./GameContext";
import { Game } from "./components/game";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");

  const connectSocket = async () => {
    const socket = await socketService.connect("http://localhost:9000").catch((err) => {
      console.error(err);
    });
  };

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: GameContextProps = {
    isInRoom,
    setInRoom,
    playerSymbol,
    setPlayerSymbol,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <AppContainer>
        <WelcomeText>Welcome to Tic-Tac-Toe</WelcomeText>
        <MainContainer>{isInRoom ? <Game /> : <JoinRoom />}</MainContainer>
      </AppContainer>
    </GameContext.Provider>
  );
}

export default App;
