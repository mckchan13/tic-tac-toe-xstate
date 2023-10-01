import { PropsWithChildren, ReactElement } from "react";

export type GameStatusProps = {
  p1Turn: boolean;
  gameIsWon: boolean;
  winner: string | undefined;
  handleResetBoard: () => void;
};

function GameStatus(props: PropsWithChildren<GameStatusProps>): ReactElement {
  const { p1Turn, gameIsWon, winner, handleResetBoard } = props;

  let message = p1Turn ? "Current Turn: Player 1" : "Current Turn: Player 2";

  if (gameIsWon) {
    message = `Game over: the winner is ${
      winner === "X" ? "Player 1" : "Player 2"
    }`;
  }

  return (
    <>
      {message}
      <br />
      {gameIsWon && (
        <button
          className="bg-gray-200 border border-black rounded py-0.5 px-2 text-black"
          onClick={handleResetBoard}
        >
          Reset
        </button>
      )}
    </>
  );
}

export default GameStatus;
