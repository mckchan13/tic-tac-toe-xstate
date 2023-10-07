import React, { createContext, ReactNode, useState } from "react";
import { GameContext } from "../api/statemachine";

export type GameContextStateDispatcher = React.Dispatch<
  React.SetStateAction<GameContext>
>;

function createBlankBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

function createInitialBoardContext(): GameContext {
  return {
    gameId: undefined,
    board: createBlankBoard(),
    gameResult: undefined,
    currentTurn: 1,
    round: 0,
  } satisfies GameContext;
}

export interface BoardContextInterface {
  boardContext: GameContext;
  setBoardContext: GameContextStateDispatcher;
}

const BoardContext = createContext<BoardContextInterface>({
  boardContext: createInitialBoardContext(),
  setBoardContext: () => null,
});

function BoardProvider({ children }: { children: ReactNode }) {
  const [boardContext, setBoardContext] = useState<GameContext>(
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
