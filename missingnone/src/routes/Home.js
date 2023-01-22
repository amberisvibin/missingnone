import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import Api from "../api";

import DeckList from "./DeckList";
import UserContext from "../UserContext";

function Home(props) {
  // todo: solve issue where token is not yet valid when page loads
  // todo: solve issue where non logged in users cause same issue
  const history = useHistory();

  const { token, setToken } = useContext(UserContext);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
    if (!tempToken) {
      history.push("/");
    }
    setToken(tempToken);

    setUser(jwt(tempToken));
    setLoading(false);
  }, [history]);

  if (loading) {
    return;
  }

  return (
    <div className="home">
      <h1>Welcome to MissingNone, {user.username}!</h1>
      <Link to="/logout">
        <button>Logout</button>
      </Link>
      <h2>Decks:</h2>
      <DeckList />
    </div>
  );
}

export default Home;
