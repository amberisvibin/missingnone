import { useHistory } from "react-router-dom";
import { useEffect, useContext } from "react";

import UserContext from "../UserContext";

function Logout(props) {
  const history = useHistory();

  const { token, setToken } = useContext(UserContext);

  useEffect(() => {
    localStorage.removeItem("token");
    setToken(null);
    history.push("/");
  }, [history]);

  return (
    <div className="logout">
      <p>Logging you out...</p>
    </div>
  );
}

export default Logout;
