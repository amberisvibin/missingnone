-- Create schemas

-- Create tables
CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE,
    pass_hash VARCHAR(60),
    is_admin BOOL
);

CREATE TABLE IF NOT EXISTS decks
(
    id SERIAL PRIMARY KEY,
    userid INTEGER,
    name VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS cards
(
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(32),
    deck INTEGER
);


-- Create FKs
ALTER TABLE decks
    ADD    FOREIGN KEY (userid)
    REFERENCES users(id)
    MATCH SIMPLE
    ON DELETE CASCADE
;
    
ALTER TABLE cards
    ADD    FOREIGN KEY (deck)
    REFERENCES decks(id)
    MATCH SIMPLE
    ON DELETE CASCADE
;
    

-- Create Indexes

