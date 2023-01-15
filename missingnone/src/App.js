import "./App.css";
import "@fontsource/open-sans";
import Home from "./Home";
import Err404 from "./Err404";

import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Err404 />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
export default App;
