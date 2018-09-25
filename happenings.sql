CREATE TABLE IF NOT EXISTS happenings (
  id SERIAL PRIMARY KEY,
  title VARCHAR (100),
  max_char INT,
  max_haps INT
);

CREATE TABLE IF NOT EXISTS haps (
  id SERIAL PRIMARY KEY,
  body VARCHAR (500),
  happenings_id INT,
  position INT,
  FOREIGN KEY (happenings_id) REFERENCES  happenings(id)
);

DELETE FROM haps;
DELETE FROM happenings;

INSERT INTO happenings (title, max_char, max_haps) VALUES ('The Little Engine that Almost', 120, 30);
INSERT INTO happenings (title, max_char, max_haps) VALUES ('A Midsummers Nightmare', 200, 42);

INSERT INTO haps (body, happenings_id, positon) VALUES (
  'blah',
  (SELECT FROM happenings WHERE max_char=120),
  1
);

INSERT INTO haps (body, happenings_id, positon) VALUES (
  'MORE blah',
  (SELECT FROM happenings WHERE max_char=120),
  2
);

INSERT INTO haps (body, happenings_id, positon) VALUES (
  'blahing',
  (SELECT FROM happenings WHERE max_char=200),
  1
);