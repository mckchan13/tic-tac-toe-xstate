import crypto from "node:crypto";
import { createMachine, assign } from "xstate";

export function createPlayerSelectionEvent(
  player: number,
  row: number,
  col: number
) {
  return {
    type: "Player Selection",
    player,
    row,
    col,
  } as const;
}

export function createNewGameId() {
  return crypto.randomUUID();
}

export function createNewBoard() {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
}

export function createNewGameContext() {
  console.log("Creating new game context...");
  const board = createNewBoard();

  return {
    gameId: createNewGameId(),
    board,
    gameResult: undefined,
    currentTurn: 1,
    round: 0,
  } satisfies GameContext;
}

export function createNewTicTacToeMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBOAMwBGYhZsWALAA4AbAFYrDiy4A0IACeiFZWqvYePm5uAOwATF5WTk4AvikBaPh42ERksLBg3JgASnAArgK8AOqoIiKFappIILr61IbGzeYIYRbEcS5OqtFWcWExHm4BwQgWbsShzjYuyy4WqhNuaRkY2NmEJKT5hbSlsBW8pQBmAmDo1I0mrQZGJt1xqlb2cRYO3k5uCwxOZOaaIAC0NisHmIThsMVGv3WcRsHlS6RAmT2+FyRwKRTOFx4MgImBqdQaGieehenVA3TcY2INkBANiNiccVBQUQy1h61sLkmQMBqO2mN2uBxh2OBPKlWJpPJ9U4yhsTR0NPary6iCcCNhjg8A28K3ZVjBCA5X1UFhRbm8CQmHih4qxUpyJAYzEwAHkAG6FfhCUSnOAcbjSb0qKnNZ7aulmRCMuIRJy+NyqdxZjz+HkILl2WJxeIeVQA3OqMUY937XLRv2BzjB4RiNiBERYCRSR5xrUdN6IMYxYgbVRljyRLOo9yWpJOUeeEE2Za2cduyV1khyBS16WKZg8CRFaO9zVtAe6q2qDawkthG8xWLOS2or4fBwxFyhGw-IUxDcsmlYhigIMoRAgNgI14AAFAQcECQo2DAW57g6M8Wn7HV6WTB1mSrL83ABGJknTS1wUiUdv18KwYjo6cn0A7FPRAsCIKgyQW1DdtOw4ntY3PWlByteFUyST8xiGTMpnzSEEgiNwhRcLl4nLNEmI9A5WPAyDj0uMAbjuB4BMwi9sKTK0EhcBZ4kU1wHSBaFLS8YhlKI5IXV-FkHDSDERAICA4BMPdPWpMzE26VEYTtX4oWcQFgSI8i4hS+x4SSMZjRvb8NK3MhKBoA8WD0sKhKvOZU3tKxPA+GIostIYF2BBJRisdxYizXLgLxE4SnlahSoTYSwnmOI7MmBJaq-cjlOIXNTUnWwoXcACa03YCGwDQpBsvHCECGVNOXidx1k5DYEUtEsFzGMbaLtZTBhcLqWJ3bB1s9IqdvM7pnFTXwgQsLxlIFGJLqIhZfgSTxqvWZTnq00CdI47gvoiyxjX6D5onml1v25GZwQcWEhSImxy08Y0fl8lIgA */
      predictableActionArguments: true,

      preserveActionOrder: true,

      id: "Tic Tac Toe",

      tsTypes: {} as import("./statemachine.typegen").Typegen0,

      context: createNewGameContext(),

      schema: {
        context: {} as GameContext,
        events: {} as
          | { type: "Client Started New Game" }
          | { type: "Start Game" }
          | { type: "Client Sync State" }
          | {
              type: "Player Selection";
              player: number;
              row: number;
              col: number;
            }
          | { type: "Reflect" }
          | { type: "Winner"; winner: "Player 1" | "Player 2" }
          | { type: "No Winner" }
          | { type: "Client Restarted Game" },
      },

      initial: "Await Game Start",

      states: {
        "Await Game Start": {
          on: {
            "Client Started New Game": "New Tic Tac Toe Game",
          },
        },

        "Assert Result": {
          entry: "processPlayerSelection",
          on: {
            Winner: {
              actions: "setGameResult",
              target: "Game Over",
            },

            Reflect: {
              target: "Assert Result",
              internal: true,
            },

            "No Winner": [
              {
                target: "Round Start",
                actions: "setPlayerTurn",
                cond: "Round Less than 9",
              },
              {
                target: "Game Over",
                actions: "setGameResult",
                cond: "Round Equal to 9",
              },
            ],
          },
        },

        "Game Over": {
          on: {
            "Client Sync State": {
              target: "Game Over",
              internal: true,
            },

            "Client Restarted Game": {
              actions: "resetContext",
              target: "New Tic Tac Toe Game",
            },
          },
        },

        "New Tic Tac Toe Game": {
          on: {
            "Start Game": "Round Start",
          },
        },

        "Round Start": {
          entry: "incrementRound",

          on: {
            "Player Selection": "Assert Result",

            "Client Sync State": {
              target: "Round Start",
              internal: true,
            },

            Reflect: {
              target: "Round Start",
              internal: true,
            },
          },
        },
      },
    },
    {
      actions: {
        resetContext: assign(createNewGameContext()),

        incrementRound: assign({
          round: ({ round }) => round + 1,
        }),

        setPlayerTurn: assign({
          currentTurn: ({ currentTurn }) => {
            console.log("setting player turn, previous player:", currentTurn);
            return currentTurn === 1 ? 2 : 1;
          },
        }),

        processPlayerSelection: assign({
          board: (context, event) => {
            // assert the winner/draw or if no winner continue game
            if (event.type === "Player Selection") {
              const { player, row, col } = event;
              context.board[row][col] = player === 1 ? "X" : "O";
            }
            return context.board;
          },
        }),

        setGameResult: assign({
          gameResult: (
            _,
            event: {
              type: "Winner" | "No Winner";
              winner?: "Player 1" | "Player 2";
            }
          ) => {
            if (event.type === "Winner") {
              return event.winner;
            }
            return "Draw";
          },
        }),
      },

      guards: {
        "Round Less than 9": (context) => context.round < 9,

        "Round Equal to 9": (context) => context.round === 9,
      },
    }
  );
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type GameContext = {
  gameId: UUID | undefined;
  board: string[][];
  gameResult: "Player 1" | "Player 2" | "Draw" | undefined;
  currentTurn: number;
  round: number;
};

export type PlayerSelectionData = {
  gameId: UUID;
  player: number;
  coordinate: [number, number];
};

export interface GameStateResponse {
  value: string;
  context: GameContext;
}

export type PlayerSelectionEvent = ReturnType<
  typeof createPlayerSelectionEvent
>;
