CREATE TABLE IF NOT EXISTS happenings (
  id SERIAL PRIMARY KEY,
  title VARCHAR (100),
  max_char INT,
  max_haps INT,
  is_finished BOOLEAN
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

INSERT INTO happenings (title, max_char, max_haps, is_finished) VALUES ('The Little Engine that Almost', 120, 30, false);
INSERT INTO happenings (title, max_char, max_haps, is_finished) VALUES ('A Midsummers Nightmare', 200, 42, false);
INSERT INTO happenings (title, max_char, max_haps, is_finished) VALUES ('The Boy Who Couldn''t Even', 255, 20, false);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'blah',
  (SELECT id FROM happenings WHERE max_char=120),
  1
);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'MORE blah',
  (SELECT id FROM happenings WHERE max_char=120),
  2
);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'blahing',
  (SELECT id FROM happenings WHERE max_char=200),
  1
);