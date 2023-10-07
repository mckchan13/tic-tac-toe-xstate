import { useContext } from "react";
import Loading from "./Loading";
import useLoading from "../hooks/useLoading";
import useNavigation from "../hooks/useNavigation";
import BoardContext from "../context/BoardContext";
import { GameContext } from "../api";

function StartGameButton() {
  const { navigate } = useNavigation();
  const { isLoading, setLoading } = useLoading(false);
  const { setBoardContext } = useContext(BoardContext);

  const handleNavigation = (to: string) => {
    if (navigate) {
      console.log("Navigating: ", to);
      navigate(to);
    }
  };

  const handleClick = async () => {
    // send signal to backend to start new game
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/newgame");
    const { context } = (await response.json()) as {
      value: string;
      context: GameContext;
    };
    console.log(context);
    setLoading(false);
    setBoardContext(context);
    handleNavigation("/board");
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <button
          onClick={handleClick}
          className="outline rounded bg-gray-200 text-center my-4"
        >
          Start Game
        </button>
      )}
    </>
  );
}

export default StartGameButton;
