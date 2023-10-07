import React, { ReactElement } from "react";

export type GridProps = {
  row: number;
  col: number;
  mark: string;
  currentTurn: number;
  gameResult: "Player 1" | "Player 2" | "Draw" | undefined;
  handleMarkGrid: (row: number, col: number, mark: string) => void;
};

export type ClickEvent = React.MouseEvent;

function Grid(props: GridProps): ReactElement<GridProps> {
  const { row, col, mark, currentTurn, gameResult, handleMarkGrid } = props;

  const handleClick = () => {
    console.log(`Player ${currentTurn} clicked row: ${row}, col: ${col}`);
    handleMarkGrid(row, col, currentTurn === 1 ? "X" : "O");
  };

  const toggle = (handler: (e: ClickEvent) => void) => {
    switch (true) {
      case gameResult !== undefined:
        return () => console.log("Can't play, the game is won.");

      case mark === "X" || mark === "O":
        return () => console.log("Can't play, this grid is already marked.");

      default:
        return handler;
    }
  };

  return (
    <>
      <div
        onClick={toggle(handleClick)}
        className="h-20 w-20 mx-0.25 my-0.25 text-center py-7 bg-cyan-400"
      >
        {mark}
      </div>
    </>
  );
}

export default Grid;
