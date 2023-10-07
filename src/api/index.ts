import crypto from "node:crypto";
import { createMachine, interpret, assign } from "xstate";
import express, { Request, Response, json } from "express";
import cors from "cors";
import assertWinner from "../lib/assertWinner.ts";

const PORT = 3000;

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
      /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBOAMwBGYhZsWALAA4AbAFYrDiy4A0IACeiFZWqvYePm5uAOwATF5WTk4AvikBaPh42ERksLBg3JgASnAArgK8AOqoIiKFappIILr61IbGzeYIYRbEcS5OqtFWcWExHm4BwQgWbsShzjYuyy4WqhNuaRkY2NmEJKT5hbSlsBW8pQBmAmDo1I0mrQZGJt1xqlb2cRYO3k5uCwxOZOaaIAC0NisHmIThsMVGv3WcRsHlS6RAmT2+FyRwKRTOFx4MgImBqdQaGieehenVA3TcY2INkBANiNiccVBQUQy1h61sLkmQMBqO2mN2uBxh2OBPKlWJpPJ9U4yhsTR0NPary6iCcCNhjg8A28K3ZVjBCA5X1UFhRbm8CQmHih4qxUpyJAYzEwAHkAG6FfhCUTiDjcaRyBTelRU5rPbV0syIRl9awxGIsmKqFxrByWrl2WJxTZc1STDkuN2S-a5GN+wOcYPCMRsQIiLASKSPeNajpvRBjGLEDbl8uRHOo9yWpJOEeeEE2Za2cvVrLS4hR7A16WKZg8CRFGM9zVtfu6q2qDawkthK8xWLOS2or4fBwxFyhGw-IUxNfYz1iGKAgyhECA2HDXgAAUBBwQJCjYMBbnuDoTxaPsdXpFMHWZVR4XcAEYmSJwLEtcFIhHT9fCsDNsxWB9-w9A4gJAsCIMkZtQzbDt2O7ONT1pAcrXhOIFhIkSkmGYYyO-GELEmIUXC5eJVCcNFGNrEhgNA8DD0uMAbjuB5+PQs9MOTK0EhcBZ4jcQZ3G8BEPEtLxiCUtxiJdb8WQcNIMREAgIDgEx3U06kzKTbpUTkn4-mcQFgQ8si4hS+x4VGNwlw8SIPPRHZ10AigqFoes9PCwSLzmUT7SsTwPkzbLLSGOdgQSUYrHcWIcw0jc8ROEp5WocrEyEsJ5jiOy1MZY0Ng-MilOIDwqKFLwlw62IesA+sA0KYbzywhAhlEzl4ncdZOVmi0eQQEs5zGCaaLtJT7M25it1C3cYz28zumcUTfCBeSOp+T4YgLDyFl+BJPFq9YlNe3JtLYsrewioT5Oqj5oiW6Fl25GZwQcWEhQ8mxVM8Y0fj8lIgA */
      predictableActionArguments: true,

      preserveActionOrder: true,

      id: "Tic Tac Toe",

      tsTypes: {} as import("./index.typegen").Typegen0,

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
          | { type: "No Winner" },
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
            "Client Started New Game": {
              actions: "resetContext",
              target: "New Tic Tac Toe Game",
            },

            "Client Sync State": {
              target: "Game Over",
              internal: true,
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

function main(): void {
  const machine = createNewTicTacToeMachine();
  const interpreter = interpret(machine)
    .onTransition((state) => {
      console.log("Transitioning to:", state.value);
      console.log("The new context:", state.context);
    })
    .start();

  const app = express();

  app.use(cors());
  
  app.use(json());

  app.get("/api/newgame", async (_: Request, res: Response) => {
    // starting a new game resets the context on entry into that state
    interpreter.send({ type: "Client Started New Game" });

    // transition to the Round Start state, the on entry action should increment the round;
    const roundStartState = interpreter.send({ type: "Start Game" });

    const { value, context } = roundStartState;

    res.json({ value, context });
  });

  app.post("/api/playerselection", (req: Request, res: Response) => {
    const {
      player,
      coordinate: [row, col],
    }: PlayerSelectionData = req.body;

    const {
      context: { currentTurn: currentPlayer },
    } = interpreter.send("Reflect");

    if (player !== currentPlayer) {
      throw new Error("Player does not match the game state.");
    }

    const playerSelectionEvent = {
      type: "Player Selection",
      player,
      row,
      col,
    } as const satisfies PlayerSelectionEvent;

    const assertResultState = interpreter.send(playerSelectionEvent);

    const [gameOver, winnerNumberString] = assertWinner(
      assertResultState.context.board
    );

    if (gameOver && winnerNumberString) {
      // fire winner event;
      const winner = winnerNumberString === "X" ? "Player 1" : "Player 2";
      const gameOverState = interpreter.send({ type: "Winner", winner });
      const { value, context } = gameOverState;
      res.json({ value, context });
    } else {
      // fire no winner event
      const roundStartState = interpreter.send("No Winner");
      const { value, context } = roundStartState;
      res.json({ value, context });
    }
  });

  app.get("/api/syncstate", async (_: Request, res: Response) => {
    const state = interpreter.send("Client Sync State");
    const { value, context } = state;
    res.json({ value, context });
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();

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
