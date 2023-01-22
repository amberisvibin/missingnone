import React from "react";
import { Link } from "react-router-dom";
import Api from "../api";

function DeckItem({ username, name, id }) {
  return (
    <Link to={`${username}/${id}`} key={id} className="deck card">
      {name}
    </Link>
  );
}

export default DeckItem;
