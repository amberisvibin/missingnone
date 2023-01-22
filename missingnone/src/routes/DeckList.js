import { useHistory } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import Api from "../api";

import DeckItem from "./DeckItem";
import UserContext from "../UserContext";

function DeckList(props) {
  const history = useHistory();
  const { token, setToken } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [deckList, setDeckList] = useState([]);
  const INITIAL_STATE = { name: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    console.log(user);
    await Api.postDeck(user.user.id.toString(), formData.name);
    window.location.reload(false);
  };

  useEffect(() => {
    async function onLoad() {
      setDeckList([]);
      const tempToken = localStorage.getItem("token");
      if (!tempToken) {
        history.push("/");
      }
      let tempUser = jwt(token);
      tempUser = await Api.getUser(tempUser.username);
      // console.log(tempUser);
      setUser(tempUser);
      let decks = tempUser.user.decks;

      // console.log(decks);

      for (let deck in decks) {
        setDeckList((deckList) => [
          ...deckList,
          <DeckItem
            key={decks[deck].id}
            id={decks[deck].id}
            name={decks[deck].name}
            username={tempUser.user.username}
          />,
        ]);
      }
    }
    onLoad();
  }, [history, token]);

  return (
    <div className="decklist">
      <form onSubmit={handleSubmit} className="inline-block">
        <label htmlFor="name" className="inline-label">
          New Deck:
        </label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <button type="submit" style={{ marginLeft: 5 }}>
          Save
        </button>
      </form>
      <br />
      {deckList}
    </div>
  );
}

export default DeckList;
