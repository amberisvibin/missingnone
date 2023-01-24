import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useEffect, useContext } from "react";

import UserContext from "../UserContext";

function Landing(props) {
  const history = useHistory();
  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    // grab token, check if valid
    const tempToken = localStorage.getItem("token");
    setToken(tempToken);

    if (tempToken) {
      history.push("/home");
    }
  }, [history, setToken]);

  return (
    <div className="landing">
      <h1>
        Welcome to <span className="bolded">MissingNone!</span>
      </h1>
      <p>
        MissingNone is a react application where you can create and manage
        pokemon card decks powered by the
        <a
          href="https://pokemontcg.io/"
          target="_blank"
          rel="noreferrer"
          aria-label="opens external site in a new window"
        >
          Pokemon TCG API
        </a>
        !
      </p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Sign Up</button>
      </Link>
    </div>
  );
}

export default Landing;
