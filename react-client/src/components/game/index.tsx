import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import GameContext from "../../GameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Zen Tokyo Zoo", cursive;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

interface CellProps {
  borderTop?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  borderBottom?: boolean;
}

const Cell = styled.div<CellProps>`
  width: 13em;
  height: 9em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
  border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
  border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};

  &:hover {
    background-color: #8d44ad28;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &:after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &:after {
    content: "O";
  }
`;

export type GameBoard = Array<Array<"x" | "o" | null>>;

export function Game() {
  const [matrix, setMatrix] = useState<GameBoard>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const { playerSymbol, setPlayerSymbol } = useContext(GameContext);

  const updateGameMatrix = (col: number, row: number, symbol: "x" | "o") => {
    const newMatrix = [...matrix];
    if (!newMatrix[row][col]) {
      newMatrix[row][col] = symbol;
      setMatrix(newMatrix);
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix);
    }
  };

  useEffect(() => {
    if (socketService.socket) {
      gameService.onGameUpdate(socketService.socket, (gameBoard) => {
        console.log("received update", gameBoard);
        setMatrix(gameBoard);
      });
    }
  }, []);

  return (
    <GameContainer>
      {matrix.map((row, rowIdx) => {
        return (
          <RowContainer key={rowIdx}>
            {row.map((col, colIdx) => {
              return (
                <Cell
                  key={`${colIdx}`}
                  borderRight={colIdx < 2}
                  borderLeft={colIdx > 0}
                  borderBottom={rowIdx < 2}
                  borderTop={rowIdx > 0}
                  onClick={() => updateGameMatrix(colIdx, rowIdx, playerSymbol)}
                >
                  {col ? col === "x" ? <X /> : <O /> : null}
                </Cell>
              );
            })}
          </RowContainer>
        );
      })}
    </GameContainer>
  );
}
