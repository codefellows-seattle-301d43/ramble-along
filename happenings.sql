CREATE TABLE IF NOT EXISTS happenings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  userId VARCHAR(10),
  max_char INT,
  max_haps INT,
  is_finished BOOLEAN,
  first_hap VARCHAR(500)
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

INSERT INTO happenings (title, userId, max_char, max_haps, is_finished, first_hap) VALUES ('The Little Engine that Almost', 'HlKvflDJmM', 120, 30, false, 'first happpppppp');
INSERT INTO happenings (title, userId, max_char, max_haps, is_finished, first_hap) VALUES ('A Midsummers Nightmare', 'AU6IaeEPVi', 200, 42, false, 'first happpppppp');
INSERT INTO happenings (title, userId, max_char, max_haps, is_finished, first_hap) VALUES ('The Boy Who Couldn''t Even', 'dsdofbeof2', 255, 20, false, 'first happpppppp');

INSERT INTO haps (body, happenings_id, position) VALUES (
  'blah I am not last',
  (SELECT id FROM happenings WHERE max_char=120),
  1
);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'MORE blah I am last',
  (SELECT id FROM happenings WHERE max_char=120),
  2
);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'blahing',
  (SELECT id FROM happenings WHERE max_char=200),
  1
);

INSERT INTO haps (body, happenings_id, position) VALUES (
  'blahing blah blah blah',
  (SELECT id FROM happenings WHERE max_char=255),
  1
);