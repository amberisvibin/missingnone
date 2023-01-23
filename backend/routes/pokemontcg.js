"use strict";

/** Routes for pokemontcgapi. */

const express = require("express");
const { BadRequestError } = require("../expressError");
const Deck = require("../models/deck");

const router = express.Router({ mergeParams: true });

/** POST /search { query, page } =>  { cards[] }
 *
 * Authorization required: none
 */

router.post("/search", async function (req, res, next) {
  console.log(req.body);
  try {
    let cardList = await Deck.search(req.body.query, req.body.page);
    return res.json({ cardList });
  } catch (err) {
    return next(err);
  }
});

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
