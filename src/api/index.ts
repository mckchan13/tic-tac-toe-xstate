import { interpret } from "xstate";
import express, { Request, Response, json } from "express";
import cors from "cors";
import {
  PlayerSelectionEvent,
  PlayerSelectionData,
  createNewTicTacToeMachine,
} from "./statemachine.ts";
import assertWinner from "../lib/assertWinner.ts";

const PORT = 3000;

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

  app.get("/api/resetgame", (_: Request, res: Response) => {
    interpreter.send({ type: "Client Restarted Game" });
    const roundStartState = interpreter.send({ type: "Start Game" });
    const { value, context } = roundStartState;
    res.json({ value, context });
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();
