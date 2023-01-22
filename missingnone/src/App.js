import React, { useState } from "react";

// styling
import "./App.css";
import "@fontsource/open-sans";

// routes
import Landing from "./routes/Landing";
import Err404 from "./routes/Err404";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import Register from "./routes/Register";
import Home from "./routes/Home";
import DeckDetail from "./routes/DeckDetail";

// context
import UserContext from "./UserContext";

// framework
import { BrowserRouter, Route, Switch } from "react-router-dom";

function App() {
  const [token, setToken] = useState(null);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/logout">
              <Logout />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route path="/:username/:deck">
              <DeckDetail />
            </Route>
            <Err404 />
          </Switch>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}
export default App;
