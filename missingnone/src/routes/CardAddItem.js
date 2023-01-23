import React from "react";
import Api from "../api";
// import { Link } from "react-router-dom";

function CardAddItem({ id, api_id, image, name, deck_id }) {
  const handleSubmit = async (evt) => {
    evt.preventDefault();
    await Api.addCard(deck_id, id);
    // window.location.reload(false);
  };

  return (
    <div
      style={{
        margin: 5,
      }}
      className="card"
    >
      {/* <Link to={``} key={id}> */}
      {/* {api_id} */}
      <img src={image} height={175} width={125} alt={`${name}-${api_id}`}></img>
      <form onSubmit={handleSubmit}>
        <button type="submit">+</button>
      </form>
      {/* </Link> */}
    </div>
  );
}

export default CardAddItem;
