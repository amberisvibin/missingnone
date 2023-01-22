import { useHistory, useParams } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import Api from "../api";

import CardItem from "./CardItem";
import UserContext from "../UserContext";

function DeckDetail(props) {
  const { username, deck } = useParams();

  const history = useHistory();

  const { token, setToken } = useContext(UserContext);

  const [user, setUser] = useState(null);

  const [cardList, setCardList] = useState([]);

  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    async function onLoad() {
      const tempToken = localStorage.getItem("token");
      if (!tempToken) {
        history.push("/");
      }
      setToken(tempToken);
      setCardList([]);
      let tempUser = jwt(tempToken);
      setUser(tempUser);
      let deckData = (await Api.getDeck(deck)).deck;
      let cards = await deckData.cards;

      setDeckName(deckData.name);

      console.log(cards);

      for (let card in cards) {
        let cardData = await Api.getCard(cards[card].api_id);
        console.log(cardData);
        setCardList((cardList) => [
          ...cardList,
          <CardItem
            key={cards[card].id}
            id={cards[card].id}
            api_id={cards[card].api_id}
            image={cardData.card.images.small}
            // name={cards[card].name}
            // username={tempUser.username}
          />,
        ]);
      }
    }
    onLoad();
  }, [history]);

  return (
    <div className="cardlist">
      <h1>{deckName}</h1>
      {cardList}
    </div>
  );
}

export default DeckDetail;
