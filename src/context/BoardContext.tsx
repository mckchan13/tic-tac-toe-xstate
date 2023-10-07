import React, { createContext, ReactNode, useState } from "react";
import { GameContext as TServerGameContext } from "../api";

export type GameContextStateDispatcher = React.Dispatch<
  React.SetStateAction<TServerGameContext>
>;

function createBlankBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

function createInitialBoardContext(): TServerGameContext {
  return {
    gameId: undefined,
    board: createBlankBoard(),
    gameResult: undefined,
    currentTurn: 1,
    round: 0,
  } satisfies TServerGameContext;
}

export interface BoardContextInterface {
  boardContext: TServerGameContext;
  setBoardContext: GameContextStateDispatcher;
}

const BoardContext = createContext<BoardContextInterface>({
  boardContext: createInitialBoardContext(),
  setBoardContext: () => null,
});

function BoardProvider({ children }: { children: ReactNode }) {
  const [boardContext, setBoardContext] = useState<TServerGameContext>(
    createInitialBoardContext()
  );

  const value = {
    boardContext,
    setBoardContext,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export { BoardProvider };

export default BoardContext;
