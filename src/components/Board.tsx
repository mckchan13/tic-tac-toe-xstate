import { useContext } from "react";
import Grid from "./Grid";
import GameStatus from "./GameStatus";
import BoardContext from "../context/BoardContext";
import { GameContext } from "../api/statemachine";
import { PlayerSelectionData } from "../api/statemachine";
import useNavigation from "../hooks/useNavigation";

function Board() {
  const { boardContext, setBoardContext } = useContext(BoardContext);
  const { board, gameResult, currentTurn } = boardContext;
  const { navigate } = useNavigation();

  const handleResetGame = async () => {
    // send signal to backend to start new game
    const response = await fetch("http://localhost:3000/api/resetgame");
    const { context } = (await response.json()) as {
      value: string;
      context: GameContext;
    };
    setBoardContext(context);
    if (navigate) navigate("/board");
  };

  const handleMarkGrid = async (row: number, col: number) => {
    const response = await fetch(
      "http://localhost:3000/api/playerselection",
      createPostRequest<Partial<PlayerSelectionData>>({
        player: currentTurn,
        coordinate: [row, col],
      })
    );

    const { context } = (await response.json()) as {
      value: string;
      context: GameContext;
    };

    setBoardContext(context);
  };

  const renderedBoard = board.map((row: string[], rowIdx: number) => {
    const renderedRow = row.map((mark: string, colIdx: number) => {
      return (
        <td key={`${rowIdx}-${colIdx}`}>
          <Grid
            row={rowIdx}
            col={colIdx}
            mark={mark}
            handleMarkGrid={handleMarkGrid}
            currentTurn={currentTurn}
            gameResult={gameResult}
          />
        </td>
      );
    });
    return <tr key={rowIdx}>{renderedRow}</tr>;
  });

  return (
    <>
      <table>
        <tbody>{renderedBoard}</tbody>
      </table>
      <br />
      <GameStatus
        currentTurn={currentTurn}
        gameResult={gameResult}
        handleResetGame={handleResetGame}
      />
    </>
  );
}

export default Board;

function createPostRequest<T>(requestBody: T) {
  const body = JSON.stringify(requestBody);
  return {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-type": "application/json",
    },
    body,
  } satisfies RequestInit;
}
