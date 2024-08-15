CREATE TABLE IF NOT EXISTS books (
                                     id serial,
                                     name varchar,
                                     url varchar,
                                     PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS words_count (
                                           id serial,
                                           book_id integer REFERENCES books ON DELETE CASCADE,
                                           count integer,
                                           word varchar,
                                           FOREIGN KEY (book_id) REFERENCES books ON DELETE CASCADE,
    PRIMARY KEY (id)
    );
CREATE INDEX ON words_count(word);