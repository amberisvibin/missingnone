import { useHistory } from "react-router-dom";
import { useEffect, useContext } from "react";

import UserContext from "../UserContext";

function Logout(props) {
  const history = useHistory();

  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    // grab token, check if valid
    localStorage.removeItem("token");
    setToken(null);
    history.push("/");
  }, [history, setToken]);

  return (
    <div className="logout">
      <p>Logging you out...</p>
    </div>
  );
}

export default Logout;
