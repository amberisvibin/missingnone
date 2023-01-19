"use strict";

/** Routes for decks. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Deck = require("../models/deck");
const deckNewSchema = require("../schemas/deckNew.json");
const deckUpdateSchema = require("../schemas/deckUpdate.json");
const deckSearchSchema = require("../schemas/deckSearch.json");
const deckAddCardSchema = require("../schemas/deckAddCard.json");

const router = express.Router({ mergeParams: true });

/** POST / { deck } => { deck }
 *
 * deck should be { name, userId }
 *
 * Returns { id, name, userId }
 *
 * Authorization required: user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, deckNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const deck = await Deck.create(req.body);
    return res.status(201).json({ deck });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { decks: [ { id, name, userId }, ...] }
 *
 * Can provide search filter in query:
 * - name (will find case-insensitive, partial matches)

 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  const q = req.query;
  // arrive as strings from querystring, but we want as int/bool
  // if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
  // q.hasEquity = q.hasEquity === "true";

  try {
    const validator = jsonschema.validate(q, deckSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const decks = await Deck.findAll(q);
    return res.json({ decks });
  } catch (err) {
    return next(err);
  }
});

/** GET /[deckId] => { deck }
 *
 * Returns { id, name, userId }
 *   //where company is { handle, name, description, numEmployees, logoUrl }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const deck = await Deck.get(req.params.id);
    return res.json({ deck });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[deckId]  { name } => { deck }
 *
 * Data can include: { name }
 *
 * Returns { id, name, userId }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, deckUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const deck = await Deck.update(req.params.id, req.body);
    return res.json({ deck });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[handle]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Deck.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

/** POST /:id { card } => { deck }
 *
 * card should be { api_id }
 *
 * Returns { id, name, userId, cards }
 *  where cards = [{card}, ...]
 *
 * Authorization required: user
 */

router.post("/:id", ensureLoggedIn, async function (req, res, next) {
  console.log(req.body);
  try {
    const validator = jsonschema.validate(req.body, deckAddCardSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const deck = await Deck.addCard(req.params.id, req.body.api_id);
    return res.status(201).json({ deck });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /:id/:card  =>  { deleted: card }
 *
 * Authorization required: admin
 */

router.delete("/:id/:card", ensureAdmin, async function (req, res, next) {
  try {
    await Deck.deleteCard(req.params.id, req.params.card);
    return res.json({ deleted: +req.params.card });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
