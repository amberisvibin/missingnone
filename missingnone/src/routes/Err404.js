import { Link } from "react-router-dom";

function Err404(props) {
  return (
    <div className="Err404">
      <h1>404</h1>
      <img src="/MissingNo.png" className="" alt="missingno"></img>
      <p>We could't find that page...</p>
      <Link to="/">
        <button>Home</button>
      </Link>
    </div>
  );
}

export default Err404;
