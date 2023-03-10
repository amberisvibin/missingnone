import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "../api";
import UserContext from "../UserContext";

function Login() {
  const INITIAL_STATE = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { token, setToken } = useContext(UserContext);
  const history = useHistory();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // grab token, check if valid
    const tempToken = localStorage.getItem("token");
    setToken(tempToken);

    if (tempToken) {
      history.push("/home");
    }
  }, [history, setToken]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    // login
    if (formData.username === "" || formData.password === "") {
      setMessage("You must enter a username and password.");
      return;
    }
    try {
      await Api.login(formData.username, formData.password);
    } catch {
      setMessage("Invalid username or password.");
      return;
    }
    setToken(true);
    setFormData(INITIAL_STATE);
    history.push("/home");
  };

  return (
    <div className="login">
      <h3>Login</h3>
      <p>
        <i>{message}</i>
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          minLength={1}
        />
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          minLength={1}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
