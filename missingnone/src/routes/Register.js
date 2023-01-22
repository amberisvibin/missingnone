import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "../api";
import UserContext from "../UserContext";

function Register() {
  const INITIAL_STATE = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const [message, setMessage] = useState("");

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

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    try {
      await Api.register(formData.username, formData.password);
    } catch {
      setMessage("Duplicate username or bad password");
      return;
    }

    setToken(true);
    setFormData(INITIAL_STATE);
    history.push("/home");
  };

  return (
    <div className="register">
      <h3>Register</h3>
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
        />
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
