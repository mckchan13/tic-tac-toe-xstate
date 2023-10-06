// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    incrementRound:
      | "Client Sync State"
      | "No Winner"
      | "Reflect"
      | "Start Game";
    processPlayerSelection: "Player Selection" | "Reflect";
    resetContext: "Client Started New Game";
    setGameResult: "No Winner" | "Winner";
    setPlayerTurn: "No Winner";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "Round Equal to 9": "No Winner";
    "Round Less than 9": "No Winner";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Assert Result"
    | "Await Game Start"
    | "Game Over"
    | "New Tic Tac Toe Game"
    | "Round Start";
  tags: never;
}
