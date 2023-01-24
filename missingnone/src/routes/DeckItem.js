import React from "react";
import { Link } from "react-router-dom";

function DeckItem({ username, name, id }) {
  return (
    <Link to={`${username}/${id}`} key={id} className="deck card">
      {name}
    </Link>
  );
}

export default DeckItem;
