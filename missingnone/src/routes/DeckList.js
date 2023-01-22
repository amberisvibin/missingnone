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

  useEffect(() => {
    async function onLoad() {
      setDeckList([]);
      let tempUser = jwt(token);
      setUser(tempUser);
      let decks = (await Api.getUser(tempUser.username)).user.decks;

      // console.log(decks);

      for (let deck in decks) {
        setDeckList((deckList) => [
          ...deckList,
          <DeckItem
            key={decks[deck].id}
            id={decks[deck].id}
            name={decks[deck].name}
            username={tempUser.username}
          />,
        ]);
      }
    }
    onLoad();
  }, [history]);

  return <div className="decklist">{deckList}</div>;
}

export default DeckList;
