"use strict";

/** Routes for pokemontcgapi. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const Deck = require("../models/deck");

const router = express.Router({ mergeParams: true });

/** GET /:id  =>  { card }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    let card = await Deck.getCard(req.params.id);
    // console.log(card);
    return res.json({ card });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
