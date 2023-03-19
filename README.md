# missingnone

MissingNone is a full stack React and Express app with a PostgreSQL database offering the capability to make and edit pokemon card decks. It is currently deployed at https://missingnone.onrender.com/. It uses the [Pokemon TCG API](https://pokemontcg.io/) to pull card data and images.

## features

This app has seperate user accounts and data storage. It uses a local backend server to interface with the local database, which stores user info, including their decks and cards. 

### user flow

The user starts on the landing page. There they can create an account or log in. They are then taken to the homepage. The user then can logout, create a new deck, or click on one of their decks. On the deck page, the user may delete the deck, rename the deck, delete cards in the deck, or choose to add new cards to the deck. On the add new cards page the user enters a search query and can add cards to their deck.

## to start

This site needs a PokemonTCG API key to function. To get one, sign up for an account at the [Pokemon TCG API Developer Portal](https://dev.pokemontcg.io/).

Clone the repository:
```
git clone https://github.com/amberisvibin/missingnone.git
```

### Database

This project uses PostgreSQL for it's database. A database should be made and configured with `pokemonapi-scheme.sql`.

### Backend

Go into the `backend` directory and run:
```
npm install
``` 
to install dependencies.
The backend needs an `.env` file to be configured with. This file will hold the `POKEMONAPI_KEY` and the `SECRET KEY`.
It should look like this:
```
POKEMONAPI_KEY = 'YOUR-API-KEY-HERE'
SECRET_KEY = 'YOUR-SECRET-KEY-HERE'
```
The backend can also have the `PORT`, `DATABASE_URL`, and `TEST_DATABASE_URL` environment variables set. These default to `3000`, `missingnone`, and `missingnone_test` respectively.
Once configured, it can be run in development with: 
```
nodemon server.js
``` 
or built for production with: 
```
node server.js
```

### Frontend

Go into the `missingnone` directory and run `npm install` to install dependencies.
The frontend needs to have the `REACT_APP_BASE_URL` environment variable set to the backend API URL, as it defaults to `localhost:3001`.
Once configured, it can be run in development with:
```
npm start
``` 
or built for production with:
```
npm run build
```
