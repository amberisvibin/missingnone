import React from "react";
import Api from "../api";
// import { Link } from "react-router-dom";

function CardItem({ id, api_id, image, name, deck_id }) {
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await Api.deleteCard(deck_id, id);
    window.location.reload(false);
  };

  return (
    <div
      style={{
        margin: 5,
      }}
      className="card"
    >
      {/* link to card detail in future */}
      {/* <Link to={``} key={id}> */}
      {/* {api_id} */}
      <img src={image} height={175} width={125} alt={`${name}-${api_id}`}></img>
      <form onSubmit={handleSubmit}>
        <button type="submit">X</button>
      </form>
      {/* </Link> */}
    </div>
  );
}

export default CardItem;
