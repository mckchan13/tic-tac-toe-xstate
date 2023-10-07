import Route from "./components/Route";
import Board from "./components/Board";
import ViteHome from "./pages/ViteHome";
import "./tailwind.css";

function App() {
  return (
    <>
      <div>
        <Route path="/">
          <ViteHome />
        </Route>
        <Route path="/board">
          <Board />
        </Route>
      </div>
    </>
  );
}

export default App;
