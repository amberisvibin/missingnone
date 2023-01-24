import React from "react";
import Api from "../api";

function CardAddItem({ id, api_id, image, name, deck_id }) {
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await Api.addCard(deck_id, id);
  };

  return (
    <div
      style={{
        margin: 5,
      }}
      className="card"
    >
      <img src={image} height={175} width={125} alt={`${name}-${api_id}`}></img>
      <form onSubmit={handleSubmit}>
        <button type="submit">+</button>
      </form>
    </div>
  );
}

export default CardAddItem;
