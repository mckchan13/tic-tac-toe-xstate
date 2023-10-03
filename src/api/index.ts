import crypto from "node:crypto";
import { createMachine, interpret, assign } from "xstate";
import express, { Request, Response } from "express";
import assertWinner from "../lib/assertWinner";

const PORT = 3000;

export function createNewGameId() {
  return crypto.randomUUID();
}

export function createNewBoard() {
  return new Array(3).fill(null).map(() => {
    return new Array(3).fill("");
  });
}

export function createNewGameContext() {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

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
      /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBGAEwAWAKzELADgCcV6-YDMANieeANCAAnoieNt7EdjZW7qrh3p4A7BaqdgC+aYFo+HjYRGSUNJgACgI4QWCc-EKi4kEiWBJSappIILr61IbGbeYIFjYuDk6qVsmeqi7eqgnegSEIALQ+VsTeNhsuNqozg6pO6Zkg2di5hCQUVLSl5ZU8NxWcbGACYOhdRi0mHQZGJn0pCyeYhxFI2RLeZweCzzRCLKxbSLhCyJTx2OzrKxJQ5ZDCnfD5UiwWCVWgAJTgAFcBLwAOqoEQiSpfNo-D49UB9RIYxwuJzWKwJJzbJyJWEIMKOPx2Zx8qw7CGJDK4nIEi7E0mYCmwam8GQETD0xnMjTfPS-DlmRBOUXECFbCaJVzhQXixbWRJ21HRRKqTxbax2KzK4543Bqsga7haqk0nj6w0MpmcZQWVo6c3s-7W2x2vkuZyOgb2N02Yj+wYDVFV7x2RIuEMncN5dUk6Pa3U8CkAM1e7xZGc63WzCDrFmIfm2FimLkS4M8VjdaIc3LsLhmCO5qgs3iVRybZ3yDGYmAA8gA3O6CYRiNgcbjSOQKY8qU2szPD3qIAsRbwuAvbOCMSjC44ruE45YpP+VgjPKKLco2YaHiQL5npeVTXrUbD1I0HDNG+g4WiOtYRFYUT8n4ri7nYThgTKxB8gu0R2Ko3K2N43iIaqLbEE+2BIWqijMDwEjRi+A7tB+fxfv0MHjmE9ZODEooQhs4oWDukRjKK4QzE6-I4qG3HnMQZIEJSIgQHekj3GUjyYFY2CUpwIgSWyn6cpY8oQdOQzeDBNieGi4Juii47yruUwbKKLGeFx+I8WZFlWaJvAPJUmAWE5LluVJloAkkwK+MBzh+juATBHCYXEBF9brDYMV+hkRwiAQEBwCYB5qmaQ7SZ5o5YhOYTbjOc6ooulVLPYqiOBsQaTCkIx-vFzYmZcRSoalPVETJ1i1iCZHWDa4x-nMk3RC4XobEBCJzcG+4CTx63XHZlTbVmu0xA42yCokqLCjsNhLs4ILIlEvqeNYfI2CtyGRm25KxtQ70eVaCC+hBNhHW4UyHbWboBROs40QuUQcbMsMRqhF5ve+vX5Yg9arH69Y+DRexBupowTuEQaookYzynOlM8XxXUtkJYAo31aOBsCCKsRCOm+oFYH7MQ00es6riGeLJlJZZ1ncNLDOyYMs1Yguu7+n+MKTYsa6REpC5s1s9ZNc1QA */
      predictableActionArguments: true,
      id: "Tic Tac Toe",

      tsTypes: {} as import("./index.typegen").Typegen0,

      context: createNewGameContext(),

      schema: {
        context: {} as GameContext,
        events: {} as
          | { type: "Client Started New Game" }
          | { type: "Start Game" }
          | { type: "Player 1 Turn" }
          | { type: "Player 2 Turn" }
          | { type: "Client Sync State" }
          | {
              type: "Player Selection";
              player: number;
              row: number;
              col: number;
            }
          | { type: "Reflect" }
          | { type: "Winner" }
          | { type: "No Winner" },
      },

      initial: "Await Game Start",

      states: {
        "Await Game Start": {
          on: {
            "Client Started New Game": "New Tic Tac Toe Game",
          },
        },

        "Await Player": {
          entry: "awaitClientSelection",
          on: {
            "Client Sync State": {
              target: "Await Player",
              internal: true,
            },
            "Player Selection": "Assert Result",
          },
        },

        "Assert Result": {
          entry: "processGameResult",
          on: {
            Winner: "Game Over",

            "No Winner": [
              {
                actions: ["setPlayerTurn"],
                target: "Round Start",
                cond: "Round Less Than 9",
              },
              {
                target: "Game Over",
                cond: "Round Equal 9",
              },
            ],

            Reflect: {
              target: "Assert Result",
              internal: true,
            },
          },
        },

        "Game Over": {
          entry: "promptClientForRestart",

          on: {
            "Client Started New Game": "New Tic Tac Toe Game",

            "Client Sync State": {
              target: "Game Over",
              internal: true,
            },
          },
        },

        "New Tic Tac Toe Game": {
          entry: "resetContext",

          on: {
            "Start Game": "Round Start",
          },
        },

        "Round Start": {
          entry: "incrementRound",
          on: {
            "Player 1 Turn": "Await Player",
            "Player 2 Turn": "Await Player",
          },
        },
      },
    },
    {
      actions: {
        resetContext: assign(createNewGameContext()),

        incrementRound: (context) => {
          context.round = context.round + 1;
        },

        setPlayerTurn: (context) => {
          // set the proper player for the next round
          if (context.currentTurn === 1) context.currentTurn = 2;
          else context.currentTurn = 1;
        },

        awaitClientSelection: (context, event, meta) => {
          // await the clients response;
        },

        processGameResult: (context, event, meta) => {
          // assert the winner/draw or if no winner continue game
          if (event.type === "Player Selection") {
            const { player, row, col } = event;
            context.board[row][col] = player === 1 ? "X" : "O";
          }

          // run function to assert a winner
        },
        promptClientForRestart: (context, event, meta) => {
          // prompt client to restart the game
        },
      },
      guards: {
        "Round Less Than 9": (context) => context.round < 9,
        "Round Equal 9": (context) => context.round === 9,
      },
    }
  );
}

function main(): void {
  const machine = createNewTicTacToeMachine();
  const interpreter = interpret(machine)
    .onTransition((state) => {
      console.log("Transitioning to:", state.value);
    })
    .start();

  const { initialState } = interpreter.machine;

  const app = express();

  app.use("/api/newgame", async (_: Request, res: Response) => {
    // starting a new game resets the context on entry into that state
    const newGameState = interpreter.machine.transition(
      initialState,
      "Client Started New Game"
    );

    // transition to the Round Start state, the on entry action should increment the round;
    const roundStartState = interpreter.machine.transition(
      newGameState,
      "Start Game"
    );

    let playerTurnEvent: "Player 1 Turn" | "Player 2 Turn" = "Player 1 Turn";

    if (roundStartState.context.currentTurn === 1) {
      playerTurnEvent = "Player 2 Turn";
    }

    const awaitPlayerState = interpreter.machine.transition(
      roundStartState,
      playerTurnEvent
    );

    const { value, context } = awaitPlayerState;

    // inform the front end to render the Round Start page with the current
    // context's turn
    res.json({ value, context });
  });

  app.use("/api/playerselection", (req: Request, res: Response) => {
    const {
      player,
      coordinate: [row, col],
    }: PlayerSelectionData = req.body;
    const currentPlayer = interpreter.machine.context.currentTurn;

    if (player !== currentPlayer) {
      throw new Error("Player does not match the game state.");
    }

    const previousState = interpreter.send("Reflect");

    const playerSelectionEvent = {
      type: "Player Selection",
      player,
      row,
      col,
    } as const;

    const assertResultState = interpreter.machine.transition(
      previousState,
      playerSelectionEvent as typeof playerSelectionEvent
    );

    const [gameOver, winner] = assertWinner(assertResultState.context.board);
  });

  app.use("/api/syncstate", async (_: Request, res: Response) => {
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
  gameId: UUID;
  board: string[][];
  gameResult: "Player 1" | "Player 2" | "Draw" | undefined;
  currentTurn: number;
  round: number;
};

export type PlayerSelectionData = {
  player: number;
  coordinate: [number, number];
};

export type PlayerSelectionEvent = {
  type: "Player Selection";
  player: number;
  row: number;
  col: number;
};
