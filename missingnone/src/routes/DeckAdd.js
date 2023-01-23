import { useHistory, useParams, Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import jwt from "jwt-decode";
import Api from "../api";

import CardAddItem from "./CardAddItem";
import UserContext from "../UserContext";

function DeckAdd(props) {
  const { username, deck } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const INITIAL_STATE = { query: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [message, setMessage] = useState("");
  const { token, setToken } = useContext(UserContext);
  const [deckName, setDeckName] = useState("");
  const [deckData, setDeckData] = useState({});

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setCardList([]);
    // console.log(formData.query);
    let cards = [];
    try {
      cards = (await Api.search(`name:${formData.query}`, 1)).cardList[0];
    } catch {
      setMessage("No cards found.");
    }

    // console.log(cards);
    // let cards = await deckData.cards;

    let cardPromises = [];

    for (let card in cards) {
      cardPromises.push(Api.getCard(cards[card].id));
    }
    Promise.allSettled(cardPromises).then((cardData) => {
      for (let card in cardData) {
        if (cardData[card].status === "fulfilled") {
          // console.log(cardData[card].value);
          let cardValue = cardData[card].value.card;
          setCardList((cardList) => [
            ...cardList,
            <CardAddItem
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
  };

  useEffect(() => {
    async function onLoad() {
      const tempToken = localStorage.getItem("token");
      if (!tempToken) {
        history.push("/");
      }
      setToken(tempToken);
      let tempUser = jwt(tempToken);
      setUser(tempUser);
      let tempDeckData = (await Api.getDeck(deck)).deck;
      setDeckData(tempDeckData);

      setDeckName(tempDeckData.name);
      setLoading(false);
    }
    onLoad();
  }, [history, deck, setToken]);

  if (loading) {
    return (
      <div className="cardlist">
        <h1>Adding cards to {deckName}</h1>
        <p>
          <i>Loading...</i>
        </p>
      </div>
    );
  }

  return (
    <div className="cardlist">
      <h1>Adding cards to {deckName}</h1>
      <p>
        <i>
          Search for name. Use a * for wildcard. Example: "Syl*" will match
          Sylveon.
        </i>
      </p>
      <form onSubmit={handleSubmit} className="inline-block">
        <label htmlFor="query" className="inline-label">
          Search:
        </label>
        <input
          name="query"
          type="text"
          value={formData.query}
          onChange={handleChange}
        />
        <button type="submit" style={{ marginLeft: 5 }}>
          Search
        </button>
      </form>
      <br />
      <Link to={`/${username}/${deck}`}>
        <button>Back to {deckName}</button>
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

export default DeckAdd;
