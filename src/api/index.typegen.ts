
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "awaitClientSelection": "Client Sync State" | "Player 1 Turn" | "Player 2 turn";
"processGameResult": "Client Sync State" | "Selection Made";
"promptClientForRestart": "Client Sync State" | "Draw" | "Winner";
"promptClientTurn": "Client Sync State" | "No Winner" | "Start Game";
"setupNewGame": "Client Started New Game" | "Client Sync State";
"setupServer": "Client Sync State" | "xstate.init";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          
        };
        matchesStates: "Assert Result" | "Await Game Start" | "Await Player" | "Game Over" | "New Tic Tac Toe Game" | "Round Start";
        tags: never;
      }
  