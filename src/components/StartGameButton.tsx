import { useContext } from "react";
import useLoading from "../hooks/useLoading";
import useNavigation from "../hooks/useNavigation";
import Loading from "./Loading";
import BoardContext from "../context/BoardContext";

function StartGameButton() {
  const { navigate } = useNavigation();
  const { isLoading, setLoading } = useLoading(false);
  const { boardContext, setBoardContext } = useContext(BoardContext);

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
    const data = await response.json();
    console.log(data);
    setLoading(false);
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
