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

  useEffect(() => {
    const tempToken = localStorage.getItem("token");
    setToken(tempToken);

    if (tempToken) {
      history.push("/home");
    }
  }, [history]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    Api.login(formData.username, formData.password);
    setToken(true);
    setFormData(INITIAL_STATE);
    history.push("/home");
  };

  return (
    <div className="login">
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
