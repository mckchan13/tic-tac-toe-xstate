import crypto from "node:crypto";
import { createMachine, interpret } from "xstate";
import express, { Request, Response } from "express";

const PORT = 3000;

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

export function createNewBoard() {
  return new Array(3).fill(null).map(() => {
    return new Array(3).fill("");
  });
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

export function createNewTicTacToeMachine() {
  return createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QBUCWBjABMghl5A9mAHQCCA7jqgC6YDiOAtmJgMrU4BO1AxAMIAbVGAB2tdl2qRMAOTDl6TMAG0ADAF1EoAA4FYNVARFaQAD0QBGAEwAWAKzELADgCcV6-YDMANieeANCAAnoieNt7EdjZW7qrh3p4A7BaqdgC+aYFo+HjYRMQASgQAriIQbBzcPAAKAjhBYJyYFtjFnCJqmkgguvrUhsbd5ggWYTbEiXaqMRbJTk5x3oEhCAC0Fi4WxE6Jti7eUy6qqt5W6Zkg2di5hCRFpeUSVbX1jZhWmNRtHRomvQZGEzDCwbFzEFyeTxWJzQjZnKzLRDrTbbXY2faHY6nJwZLIYa74fIUKi0F4NTg8VhgARgdD9IyYACyOAgKl+3X+9MGoGGLicW08dh8NlUTjsRwOFkRaysLnGUW8Fim3kV6O8qk8uMu+NwhJIpFgsEatAKcGKAl4MgImAA6qgRCJGp0-noAdyzJZVIlVBMEokxclrKKlsEkYlxnErOrfDDw94XOc8Tk9WRDcbMKbYObeHaHU72TpXVygYhEi5EpFZXYYpNXFYTtLrI4RSk7HYnDYW9DNRcrrq8vq09wM2aLTwACKcHDkZ0cosDEsINxWYiKg4HM5HKwBUMjFcWFupdud1TWPxavs3fIMZiYADyADdGvwhKJxJUpOU5Aob2yuoW+gXIZEE2CJ402EUbF2etZWldwnGITwUhcNwFnrWZJgvHUrxIb9sGwvVFGYSkPyIv8XUAwFgL3flEKgvkYh2RJvE7RsLAiat-TjE5-X5RNtWTAdiDwy9CN-F9hDENgghELAJCkWcALdRcD29bYhXLBN21mQVG07YgNTLZj620qMsME25ChKMoKkkCS32k2TbIUgsennKieUsKCfTFTxNLbflEkhaV1kFYgbCcXxJhsDZplGfjRKE4kaEwMln0ESTxBkuSOBc-83Mo91gXRBw0OSTxVH2E4fBCnwVxYzs5SxdFRQSgikqHE1R14DKHNYbLnPIudCsXFiHAhM5OxMjUDhC9xPFXI5+T5VwUmhcyCSE397yfCleqk-qnPkoalOLaj12ISb+T8VxvFrOC7C2PkoWiKZJlsFUNv7Szktobanh618DoG47FIK5TqIPBNtmmOMY0CuxpU8GFwXDOwgvcA5xW8DILhEAhWXgbpEtuCiIc8hBxQrCaomiVIZsR3dVnsH0D0alCTnsEEvpwshKBS-6PzJs6KesA4DLOM8dlGeMQxWaIwUScNO2guV7CsHmU3uGyAeFoDRe3cYFhBbd1yVeYQsi8KxXZ45DZ7JNNp+-nSTqck9Y8j09zOcLpjuoKO2OGxaucAzwiVbykNlDtNY6o1h0zbMPaK0t5kQmCVWreY-MSEKUgQttYfVAOlUhWPLO2x9GmTxcyxXQyIQODsjmrRtpm2cJOKSKxdi9Gxy-yET2tuMia8hs4FtlL1mJ2bybB3FZ6wQlnrH9OVXHODIgA */
      predictableActionArguments: true,
      id: "Tic Tac Toe",

      tsTypes: {} as import("./index.typegen").Typegen0,

      context: createNewGameContext(),

      schema: {
        context: {} as GameContext,
      },

      initial: "Await Game Start",

      states: {
        "Await Game Start": {
          entry: "setupServer",
          on: {
            "Client Started New Game": "New Tic Tac Toe Game",

            "Client Sync State": {
              target: "Await Game Start",
              internal: true,
            },
          },
        },

        "Round Start": {
          entry: "promptClientTurn",
          on: {
            "Player 1 Turn": "Await Player",
            "Player 2 turn": "Await Player",

            "Client Sync State": {
              target: "Round Start",
              internal: true,
            },
          },
        },

        "Await Player": {
          entry: "awaitClientSelection",
          on: {
            "Selection Made": "Assert Result",

            "Client Sync State": {
              target: "Await Player",
              internal: true,
            },
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
          entry: "setupNewGame",
          on: {
            "Start Game": "Round Start",

            "Client Sync State": {
              target: "New Tic Tac Toe Game",
              internal: true,
            },
          },
        },
      },
    },
    {
      actions: {
        setupServer: (context, event, meta) => {
          // setup listener to wait for client to start
        },
        setupNewGame: (context, event, meta) => {
          // setup context to refresh to a new game context;
        },
        promptClientTurn: (context, event, meta) => {
          // prompt the client to make a turn
        },
        awaitClientSelection: (context, event, meta) => {
          // await the clients response;
        },
        processGameResult: (context, event, meta) => {
          // assert the winner/draw or if no winner continue game
        },
        promptClientForRestart: (context, event, meta) => {
          // prompt client to restart the game
        },
      },
    }
  );
}

export function main(): void {
  const machine = createNewTicTacToeMachine();
  const interpreter = interpret(machine)
    .onTransition(() => {
      // console.log(state);
    })
    .start();

  const { initialState } = interpreter.machine;

  const app = express();

  app.use("/api/newgame", async (_: Request, res: Response) => {
    // do something with the request, such as validate the identity of the
    interpreter.machine.withContext(createNewGameContext());
    const { value, context } = interpreter.machine.transition(
      initialState,
      "Client Started New Game"
    );
    res.json({ value, context });
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
