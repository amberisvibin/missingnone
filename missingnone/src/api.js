import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class Api {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //sync token with localstorage on every request
    this.token = localStorage.getItem("token");

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${Api.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a deck by id. */

  static async getDeck(id) {
    let res = await this.request(`decks/${id}`);
    return res;
  }

  /** Get list of decks */

  static async getDecks() {
    let res = await this.request(`decks`);
    return res;
  }

  /** Get list of jobs */

  //   static async getJobs() {
  //     let res = await this.request(`jobs`);
  //     return res;
  //   }

  /** Log in */

  static async login(username, password) {
    let res = await this.request(
      `auth/token`,
      { username: username, password: password },
      "POST"
    );
    localStorage.setItem("token", res.token);
    this.token = res.token;
    // console.log(this.token);
    return res;
  }

  /** Register */

  static async register(username, password) {
    let res = await this.request(
      `auth/register`,
      {
        username: username,
        password: password,
      },
      "POST"
    );
    localStorage.setItem("token", res.token);
    this.token = res.token;
    // console.log(res);
    return res;
  }

  /** Log out */

  static async logout() {
    localStorage.setItem("token", "");
    this.token = "";
    // console.log(this.token);
  }

  /** Check if logged in */

  static async isLoggedIn() {
    this.token = localStorage.getItem("token");
    if (this.token !== "") {
      return true;
    } else {
      return false;
    }
    // console.log(this.token);
  }

  /** Get user data */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res;
  }

  /** Get card data */

  static async getCard(id) {
    let res = await this.request(`pokemontcg/${id}`);
    return res;
  }

  /** Search cards */

  static async search(query, page) {
    let res = await this.request(
      `pokemontcg/search`,
      { query: query, page: page },
      "POST"
    );
    return res;
  }

  /** Patch deck data */

  static async patchDeck(id, name) {
    let res = await this.request(
      `decks/${id}`,
      {
        name: name,
      },
      "PATCH"
    );
    return res;
  }

  /** Post new deck data */

  static async postDeck(id, name) {
    let res = await this.request(
      `decks`,
      {
        name: name,
        userId: id,
      },
      "POST"
    );
    return res;
  }

  /** Delete card from deck */

  static async deleteCard(deckId, cardId) {
    let res = await this.request(`decks/${deckId}/${cardId}`, {}, "DELETE");
    return res;
  }

  /** Delete deck */

  static async deleteDeck(deckId) {
    let res = await this.request(`decks/${deckId}`, {}, "DELETE");
    return res;
  }

  /** Post new card to decks */

  static async addCard(deckId, cardId) {
    let res = await this.request(
      `decks/${deckId}`,
      {
        api_id: cardId,
      },
      "POST"
    );
    return res;
  }

  /** Set user data */

  //   static async setUser(username) {
  //     let res = await this.request(
  //       `users/${username}`,
  //       {
  //         firstName: firstName,
  //         lastName: lastName,
  //         email: email,
  //       },
  //       "PATCH"
  //     );
  //     return res;
  //   }

  /** Apply to job */

  //   static async apply(username, jobId) {
  //     let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "POST");
  //     return res;
  //   }

  // obviously, you'll add a lot here ...
}

export default Api;
