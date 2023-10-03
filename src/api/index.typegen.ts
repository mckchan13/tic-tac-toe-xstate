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
    awaitClientSelection:
      | "Client Sync State"
      | "Player 1 Turn"
      | "Player 2 Turn";
    incrementRound: "No Winner" | "Start Game";
    processGameResult: "Player Selection" | "Reflect";
    promptClientForRestart: "Client Sync State" | "No Winner" | "Winner";
    resetContext: "Client Started New Game";
    setPlayerTurn: "No Winner";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    "Round Equal 9": "No Winner";
    "Round Less Than 9": "No Winner";
  };
  eventsCausingServices: {};
  matchesStates:
    | "Assert Result"
    | "Await Game Start"
    | "Await Player"
    | "Game Over"
    | "New Tic Tac Toe Game"
    | "Round Start";
  tags: never;
}
