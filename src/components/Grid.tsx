import React, { ReactElement } from "react";

export type GridProps = {
  row: number;
  col: number;
  mark: string;
  p1Turn: boolean;
  gameIsWon: boolean;
  handleBoardData: (row: number, col: number, mark: string) => void;
  handleP1Turn: () => void;
};

export type ClickEvent = React.MouseEvent;

function Grid(props: GridProps): ReactElement<GridProps> {
  const { row, col, mark, p1Turn, gameIsWon, handleBoardData, handleP1Turn } =
    props;

  const handleClick = () => {
    console.log(`Clicked row: ${row}, col: ${col}`);
    handleP1Turn();
    handleBoardData(row, col, p1Turn ? "X" : "O");
  };

  const toggle = (handler: (e: ClickEvent) => void) => {
    if (gameIsWon)
      return () => {
        console.log("Can't play, the game is won.");
      };
    return handler;
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
