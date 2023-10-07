import { useContext } from "react";
import NavigationContext from "../context/NavigationContext";

function useNavigation() {
  return useContext(NavigationContext);
}

export default useNavigation;