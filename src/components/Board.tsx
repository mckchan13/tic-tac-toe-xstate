import { useState } from "react";
import Grid from "./Grid";
import GameStatus from "./GameStatus";

function Board() {
  const defaultBoard = createDefaultBoard();
  const [boardData, setBoardData] = useState<typeof defaultBoard>(defaultBoard);
  const [p1Turn, setP1Turn] = useState<boolean>(true);
  const [gameIsWon, winner] = assertWinner(boardData);

  const handleResetBoard = () => {
    console.log("Resetting board");
    setBoardData(() => {
      return defaultBoard;
    });
    setP1Turn(true);
  };

  const handleBoardData = (row: number, col: number, mark: string) => {
    setBoardData((board) => {
      const newBoard = board.slice();
      newBoard[row][col] = mark;
      return newBoard;
    });
  };

  const handleP1Turn = () => {
    setP1Turn((bool) => !bool);
  };

  const renderedBoard = boardData.map((row: string[], rowIdx: number) => {
    const renderedRow = row.map((mark: string, colIdx: number) => {
      return (
        <td key={`${rowIdx}-${colIdx}`}>
          <Grid
            row={rowIdx}
            col={colIdx}
            mark={mark}
            handleBoardData={handleBoardData}
            handleP1Turn={handleP1Turn}
            p1Turn={p1Turn}
            gameIsWon={gameIsWon}
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
        p1Turn={p1Turn}
        gameIsWon={gameIsWon}
        handleResetBoard={handleResetBoard}
        winner={winner}
      />
    </>
  );
}

export default Board;

function createDefaultBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

function assertWinner(board: string[][]): [boolean, string | undefined] {
  const turnsPlayed = board.reduce((acc, row) => {
    return acc + row.join("").length;
  }, 0);

  // check all columns
  for (let col = 0; col < board[0].length; col++) {
    const row = 1;
    const midMark = board[row][col];
    const aboveMark = board[row - 1][col];
    const belowMark = board[row + 1][col];
    if (midMark === aboveMark && midMark === belowMark && midMark !== "") {
      return [true, midMark];
    }
  }

  // check all rows
  for (let row = 0; row < board.length; row++) {
    const col = 1;
    const midMark = board[row][col];
    const leftMark = board[row][col - 1];
    const rightMark = board[row][col + 1];
    if (midMark === leftMark && midMark === rightMark && midMark !== "") {
      return [true, midMark];
    }
  }

  //check diagonals
  const midMark = board[1][1];
  // check left diagonal
  const upperLeftMark = board[0][0];
  const lowerRightMark = board[2][2];
  if (
    midMark === upperLeftMark &&
    midMark === lowerRightMark &&
    midMark !== ""
  ) {
    return [true, midMark];
  }

  // check right diagonal
  const upperRightMark = board[0][2];
  const lowerLeftMark = board[2][0];
  if (
    midMark === upperRightMark &&
    midMark === lowerLeftMark &&
    midMark !== ""
  ) {
    return [true, midMark];
  }

  if (turnsPlayed === 9) {
    return [true, "Draw"]
  }

  return [false, undefined];
}
