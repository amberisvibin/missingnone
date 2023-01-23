"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

const pokemon = require("pokemontcgsdk");

/** Related functions for companies. */

class Deck {
  /** Create a deck (from data), update db, return new deck data.
   *
   * data should be { name, userId }
   *
   * Returns { name, userId }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO decks (name,
                             userId)
           VALUES ($1, $2)
           RETURNING id, name, userid AS "userId"`,
      [data.name, data.userId]
    );
    let deck = result.rows[0];

    return deck;
  }

  /** Find all decks (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - name (will find case-insensitive, partial matches)
   *
   * Returns [{ id, name, userId }, ...]
   * */

  static async findAll({ name } = {}) {
    let query = `SELECT id,
                        name,
                        userId
                 FROM decks`;
    let whereExpressions = [];
    let queryValues = [];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL

    if (name !== undefined) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.doin(" AND ");
    }

    // console.log(query);

    // Finalize query and return results

    query += " ORDER BY name";
    const decksRes = await db.query(query, queryValues);
    return decksRes.rows;
  }

  /** Given a deck id, return data about deck.
   *
   * Returns { id, name, userId, cards }
   *   where cards is [{card}, ...]
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const deckRes = await db.query(
      `SELECT id,
                        name,
                        userId
                 FROM decks
                 WHERE id=$1`,
      [id]
    );

    const deck = deckRes.rows[0];

    let cardsRes = await db.query(
      `SELECT id, api_id, deck
        FROM cards
        where deck=$1`,
      [id]
    );
    const cards = cardsRes.rows;

    deck.cards = cards;

    if (!deck) throw new NotFoundError(`No deck: ${id}`);

    // const companiesRes = await db.query(
    //   `SELECT handle,
    //               name,
    //               description,
    //               num_employees AS "numEmployees",
    //               logo_url AS "logoUrl"
    //        FROM companies
    //        WHERE handle = $1`,
    //   [deck.companyHandle]
    // );

    // delete deck.companyHandle;
    // deck.company = companiesRes.rows[0];

    return deck;
  }

  /** Update deck data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name }
   *
   * Returns { id, name, userId }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE decks 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                name, 
                                userId`;
    const result = await db.query(querySql, [...values, id]);
    const deck = result.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${id}`);

    return deck;
  }

  /** Delete given deck from database; returns undefined.
   *
   * Throws NotFoundError if deck not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM decks
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const deck = result.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${id}`);
  }

  /** Add a card to a deck; returns deck.
   *
   * Throws NotFoundError if deck not found.
   **/

  static async addCard(id, api_id) {
    console.log(id, api_id);
    const deckRes = await db.query(
      `SELECT id
           FROM decks
           WHERE id = $1`,
      [id]
    );
    const deck = deckRes.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${id}`);

    const cardInsertRes = await db.query(
      `INSERT INTO CARDS(api_id, deck)
        VALUES($1, $2)`,
      [api_id, deck.id]
    );

    let cardsRes = await db.query(
      `SELECT id, api_id, deck
        FROM cards
        where deck=$1`,
      [deck.id]
    );
    const cards = cardsRes.rows;

    deck.cards = cards;

    return deck;
  }

  /** Delete card from deck; returns deck.
   *
   * Throws NotFoundError if deck or card not found.
   **/

  static async deleteCard(id, card_id) {
    console.log(id, card_id);
    const deckRes = await db.query(
      `SELECT id
           FROM decks
           WHERE id = $1`,
      [id]
    );
    const deck = deckRes.rows[0];

    if (!deck) throw new NotFoundError(`No deck: ${id}`);

    const cardRes = await db.query(
      `SELECT id
           FROM cards
           WHERE id = $1 AND deck = $2`,
      [card_id, id]
    );
    const card = cardRes.rows[0];

    if (!card) throw new NotFoundError(`No card: ${card_id}`);

    const cardDeleteRes = await db.query(
      `DELETE
        FROM CARDS
        WHERE id=$1`,
      [card_id]
    );

    let cardsRes = await db.query(
      `SELECT id, api_id, deck
        FROM cards
        WHERE deck=$1`,
      [deck.id]
    );
    const cards = cardsRes.rows;

    deck.cards = cards;

    return deck;
  }

  /** Get card from pokemontcgapi
   *
   * Throws NotFoundError if card not found.
   **/

  static async getCard(id) {
    return await pokemon.card.find(id).then((card) => {
      // console.log(card);
      return card;
    });
  }

  /** Search from pokemontcgapi
   *
   * Throws NotFoundError if card not found.
   **/

  static async search(query, page) {
    let cardList = [];
    await pokemon.card
      .where({ q: query, pageSize: 25, page: page })
      .then((cards) => {
        for (let card in cards) {
          // console.log(cards[card]);
          cardList.push(cards[card]);
        }
      });
    return cardList;
  }
}

module.exports = Deck;
