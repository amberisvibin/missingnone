import { useHistory, useParams, Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import Api from "../api";

import CardItem from "./CardItem";
import UserContext from "../UserContext";

function DeckDetail(props) {
  const { username, deck } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [cardList, setCardList] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const INITIAL_STATE = { name: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const { token, setToken } = useContext(UserContext);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    Api.patchDeck(deck, formData.name);
    setDeckName(formData.name);
  };

  const handleDelete = (evt) => {
    evt.preventDefault();
    Api.deleteDeck(deck);
    history.push("/");
  };

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

      setFormData({
        name: deckData.name,
      });

      let cardPromises = [];

      for (let card in cards) {
        cardPromises.push(Api.getCard(cards[card].api_id));
      }
      Promise.allSettled(cardPromises).then((cardData) => {
        for (let card in cardData) {
          if (cardData[card].status === "fulfilled") {
            // console.log(cardData[card].value);
            let cardValue = cardData[card].value.card;
            setCardList((cardList) => [
              ...cardList,
              <CardItem
                key={card}
                id={cards[card].id}
                api_id={cardValue.id}
                image={cardValue.images.small}
                name={cardValue.name}
                deck_id={deckData.id}
              />,
            ]);
          } else {
            setMessage("One or more cards could not be loaded.");
          }
        }
        setLoading(false);
      });
    }
    onLoad();
  }, [history, deck, setToken]);

  if (loading) {
    return (
      <div className="cardlist">
        <h1>{deckName}</h1>
        <p>
          <i>Loading...</i>
        </p>
      </div>
    );
  }

  return (
    <div className="cardlist">
      <h1>{deckName}</h1>
      <form onSubmit={handleSubmit} className="inline-block">
        <label htmlFor="name" className="inline-label">
          Edit Name:
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
      <form onSubmit={handleDelete} className="inline-block">
        <button type="submit" style={{ marginLeft: 5, marginTop: 2 }}>
          Delete Deck
        </button>
      </form>
      <Link to={`/${user.username}/${deck}/add`}>
        <button>Add Cards</button>
      </Link>
      <p>
        <i>{message}</i>
      </p>
      <div style={{ textAlign: "center" }}>{cardList}</div>
      <Link to="/home">
        <button>Home</button>
      </Link>
    </div>
  );
}

export default DeckDetail;
