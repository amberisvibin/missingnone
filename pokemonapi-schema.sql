-- Create schemas

-- Create tables
CREATE TABLE IF NOT EXISTS users
(
    id INTEGER NOT NULL UNIQUE,
    username VARCHAR(32) UNIQUE,
    pass_hash VARCHAR(60),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS decks
(
    id INTEGER NOT NULL UNIQUE,
    user INTEGER,
    name VARCHAR(32),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS cards
(
    id INTEGER NOT NULL UNIQUE,
    deck INTEGER,
    api_id VARCHAR(32),
    PRIMARY KEY(id)
);


-- Create FKs
ALTER TABLE decks
    ADD    FOREIGN KEY (user)
    REFERENCES users(id)
    MATCH SIMPLE
;
    
ALTER TABLE cards
    ADD    FOREIGN KEY (deck)
    REFERENCES decks(id)
    MATCH SIMPLE
;
    

-- Create Indexes

