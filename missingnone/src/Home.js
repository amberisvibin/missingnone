import { Link } from "react-router-dom";

function Home(props) {
  return (
    <div className="Home">
      <h1>Welcome to MissingNone!</h1>
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

export default Home;
