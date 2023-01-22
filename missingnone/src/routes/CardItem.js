import React from "react";
import { Link } from "react-router-dom";

function CardItem({ id, api_id, image }) {
  return (
    <div
      style={{
        margin: 5,
      }}
      className="card"
    >
      {/* <Link to={``} key={id}> */}
      {/* {api_id} */}
      <img src={image} height={175} width={125}></img>
      {/* </Link> */}
    </div>
  );
}

export default CardItem;
