import crypto from "node:crypto";
import { Interpreter, State, createMachine, interpret } from "xstate";
import express, { NextFunction, Request, Response } from "express";

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type GameContext = {
  gameId: UUID;
  board: string[][];
  gameResult: "Player 1" | "Player 2" | "Draw" | undefined;
  currentTurn: number;
};

export function createNewGameId() {
  return crypto.randomUUID();
}

export function createNewGameContext() {
  const board = new Array(3).fill(null).map(() => {
    return new Array(3).fill("");
  });

  const defaultContext = {
    gameId: createNewGameId(),
    board,
    gameResult: undefined,
    currentTurn: 1,
  } satisfies GameContext;

  return defaultContext;
}

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBGAEwBmAJzEAHFcfObAFlUB2Rxa82AGhAAT0QbGytiWytbd0cAVnd3ADYLCwBfdKC0fDxsImIAJQIAVxEINg5uHgAFARxgsE5MC2wSzhE1TSQQXX1qQ2Me8wQLD3diL3jVGL8LV1UUoNCEAFoLOwsnLyt3O2Tpu1VVZKt4zOyMbDzCEmKyiolquoamzCtManbOjRM+gyMJhGaTsDjs4RcLg2Zysy0Q602212+0Ox1OjguIBy13wBQoVFoL0anB4rDAAjA6AGRkwAFkcBAVL8ev9qUNQCM7L5iDZ4jZkp4EkcDhY4WsrHYJolUtNkqk9slVDZMdjcLiSKRYLAmrRCnASgJeDICJgAOqoEQiJpdP56AHssyWbyqSbJGw+eJeNJWVSOZJi1ZeCaLKyK5KuKxB5J2c5ZLFXNX5DVanWYPWwA28c2W63MnR2tlAxBeOxeYjxCUVyPxRx2H3+kKWSIWTwWVTxGtJVTWRzKuOqm54lPcNP6w08AAinBw5BtLILgyLCDrkVSBwOZyOtjF1mILe77c7rZcfcuuXVxAYzEwAHkAG5NfhCUTiKpSCpyBRXpndfP9RfDIgmzJMQ0abJ47g7D6EpilY8w8m2oIuDM3ZeFMKoJoOJCfoozCkm+uE-ra-6AoBoxQjykFcjEjhoQK7g7hYIEVj4UYnD4vixmeOJJsQOHfk+whiGwwQiFgEhSHOf72kuLZeC6CT2CWHa+P48Q7kkxBKiWXinO2vihhh568fc5SVJIgkviJYnmZJea9AupEcpYkEKXypYxjWfjhAGYzxMQcThlM7gbDMflGTxtxkJQNCYESj6CEJ4iieJHB2b+DkkQ6wJ7P5jgzF6NiqPsJz8gG-KrkkeyeCcey+lx8bGVFmraiO6aZpZwmsCltlEfOWVLgK-ngmcSQ+tM-LqY24pjKBRy+FytZti4EWJlF363g+JKJVZ3U2RJfXSYWZHrlEiS+L2tbJFMjiwfEWxchE7hnN4FYpMkq1YdFBKEeZ1Q7V1PUHVJmUyWRLYxk4BXva4qlTSsNjOMQpbuJ6ERMR2+yZHGIgEIy8A9AO6rEWDzkIPEpbIxEiTPe2SoHAGqMui2SSgsKqNpJ9F74rFG1PNQJPHWT1gHFpZw9rRYzRg2KzPQ4aFVVBkqo1YXMmaUZn84LAHC7EUPepNMquAGfoBQkrNHDMHino1kV4jFhL1MS2tOY65FnAFMzXf4jg1Qx02rDY8GLDKrlBxKvtq81w66mOAv9aTbscTy0FyhWrhKb5vrltMkaKj7Fh8jbRO8Rt95NC72XFnWWnuuCBy+0cFY7jMTgpCx7qRj6QZRwU-FKJXslnDYURHHRtGue4gTTT6jgBdM1g+JKtaxpkQA */
    id: "Tic Tac Toe",

    tsTypes: {} as import("./index.typegen").Typegen0,

    schema: {
      context: createNewGameContext() as GameContext,
    },

    initial: "Await Game Start",

    states: {
      "Await Game Start": {
        entry: "setupServer",
        on: {
          "Client Started New Game": "New Game",

          "Client Sync State": {
            target: "Await Game Start",
            internal: true
          }
        },
      },

      "Round Start": {
        entry: "promptClientTurn",
        on: {
          "Player 1 Turn": "Await Player",
          "Player 2 turn": "Await Player",

          "Client Sync State": {
            target: "Round Start",
            internal: true
          }
        },
      },

      "Await Player": {
        entry: "awaitClientSelection",
        on: {
          "Selection Made": "Assert Result",

          "Client Sync State": {
            target: "Await Player",
            internal: true
          }
        },
      },

      "Assert Result": {
        entry: "processGameResult",
        on: {
          "No Winner": "Round Start",
          Winner: "Game Over",
          Draw: "Game Over",

          "Client Sync State": {
            target: "Assert Result",
            internal: true
          }
        },
      },

      "Game Over": {
        entry: "promptClientForRestart",

        on: {
          "Client Started New Game": "New Game",

          "Client Sync State": {
            target: "Game Over",
            internal: true
          }
        },
      },

      "New Game": {
        entry: "setupNewGame",
        on: {
          "Start Game": "Round Start",

          "Client Sync State": {
            target: "New Game",
            internal: true
          }
        },
      },
    }
  },
  {
    actions: {
      setupServer: (context, event, meta) => {
        // setup listener to wait for client to start
      },
      setupNewGame: (context, event, meta) => {
        // setup context to refresh to a new game context;
      },
      promptClientTurn(context, event, meta) {
        // prompt the client to make a turn
      },
      awaitClientSelection(context, event, meta) {
        // await the clients response;
      },
      processGameResult(context, event, meta) {
        // assert the winner/draw or if no winner continue game
      },
      promptClientForRestart(context, event, meta) {
        // prompt client to restart the game
      },
    },
  }
);

export function main(): void {
  const machinesMap = new Map<UUID, Interpreter<GameContext>>();

  const app = express();

  app.use("/api/newgame", (req: Request, res: Response, next: NextFunction) => {
    const gameMachine = interpret(machine).onTransition((state) => {
      console.log(state.value);
    }).start();

    gameMachine.subscribe((state) => {
      state.context
    })

    console.log(req, res, next);
  });
}
