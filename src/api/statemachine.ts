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
      /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBOAKwA2YtYAcNgEzOrAZgcAWVe4DsADQgAJ6I7s4WxM4AjO5W0T7RNg7uqqo2AL4ZQWj4eNhEZLCwYNyYAEpwAK4CvADqqCIipWqaSCC6+tSGxu3mCKmRzt7pNuGpfrZBoQgWdu7uFl7RDisOFqqTmdkgudj5hCSkxaW0lbA1vJUAZgJg6NStJp0GRib9zr72ERaxSzYWPxzLzTRAAWliVmIyz84Qs8NUMSsXiyOQw+3whWOJTK50uPBkBEwDSaLQ0zz0r16oH6LncxCS-xsfgSzhBIUQK2hG3cK1sgIB0SsqN26NwmKOJ1x1VqBKJJOanGU0TaOkp3TefUQXlh0Oi1mGi1WzNioIQCXpqgsMTG1qsk3i7hFe3FBRIDGYmAA8gA3Ur8ISicTBERYCRSJ7tF4a6lmRDOfzETaqKwpqwbVZWJxm9xeLxJmzpmzLFa8lPOsUHQoeli+-2CYRiCpwDjcaQ1yNqro9d6IFzOezIixOVQjhxZs1s6LEZnOPxuVReQsOVRCit5CXEOQKF1Vlg1ngSMod8lR9U9rXmtJ+aFz1LX5lLM1C+mfX5+FK8iLjvzrjFu4hygIKoRAgNhW14AAFAQcGCUo2DAO4Hh6TsOnPTUaT7MYGVXD9i2ZPMvAsM0wXTJMUmHfw-D8Udoj8bY0Q3ACgJAsCj14BsgzYEMww4CNTy7Kle3NOiB1zd8Ex8Gx0hI6I3EHZIszZedF2RP9XUOQDgNA8DJB4G4kMeAS0O7DC43NNwHGIfxnGSLwnEWWErDNDxiAcWzCPiOTGWiLIdhEAgIDgExdwlClTNjfohSha14T+JdAWBEjXAHd9cwTKxPlHJ0dlCgCKCoWga107hwqEy9hxvNxkS8dxZxSbMOQQHxLSXbxAUGZlhVyytN2xU5mwuWoypjYTUjsWzvFsNxPmohwSPc4gsyNKwPGiWInF-HqmM04q604EaL0w5rEVvecnA2LxZthSc-HzBNbP8a13O8Bx1L3Ld5GwXq3UUZhDrM-o5isxF1k2BwUkRcJJ2Laz4TcQs6ozNl3s3FidPYgHIssTKok+GxlziUt2RmMFfmhcdi2iRdC0yiI-IyIA */
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
        resetContext: assign({
          gameId: () => createNewGameId(),
          currentTurn: () => 1,
          board: () => createNewBoard(),
          gameResult: () => undefined,
          round: () => 0,
        }),

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
