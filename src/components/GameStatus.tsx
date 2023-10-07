import { PropsWithChildren, ReactElement } from "react";

export type GameStatusProps = {
  currentTurn: number;
  gameResult: "Player 1" | "Player 2" | "Draw" | undefined
  handleResetGame: () => void;
};

function GameStatus(props: PropsWithChildren<GameStatusProps>): ReactElement {
  const { currentTurn, gameResult, handleResetGame } = props;

  let message = currentTurn === 1 ? "Current Turn: Player 1" : "Current Turn: Player 2";

  if (gameResult) {
    const winner = gameResult;
    message = `Game over: the winner is ${winner}`;
  }

  return (
    <>
      {message}
      <br />
      {gameResult && (
        <button
          className="bg-gray-200 border border-black rounded py-0.5 px-2 text-black"
          onClick={handleResetGame}
        >
          Reset
        </button>
      )}
    </>
  );
}

export default GameStatus;
