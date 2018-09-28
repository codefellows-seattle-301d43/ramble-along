CREATE TABLE IF NOT EXISTS happenings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  user_id VARCHAR(10),
  max_char INT,
  max_haps INT,
  is_finished BOOLEAN,
  first_hap VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS haps (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(10),
  body VARCHAR (500),
  happenings_id INT,
  position INT,
  FOREIGN KEY (happenings_id) REFERENCES  happenings(id)
);

DELETE FROM haps;
DELETE FROM happenings;

INSERT INTO happenings (title, user_id, max_char, max_haps, is_finished, first_hap) VALUES ('The Little Engine that Almost', 'HlKvflDJmM', 120, 3, true, 'This is the story of the Little Engine that... well... couldn''t');
INSERT INTO happenings (title, user_id, max_char, max_haps, is_finished, first_hap) VALUES ('A Midsummer''s Nightmare', 'AU6IaeEPVi', 200, 3, false, 'Paul couldn''t believe what he saw as he walked in the door.');
INSERT INTO happenings (title, user_id, max_char, max_haps, is_finished, first_hap) VALUES ('Harborcoat', 'HlKvflDJmM', 255, 20, false, 'They crowded up to Lenin with their noses worn off.');

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'I mean, not for a lack of trying.',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=120),
  1
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'Look, doing stuff is really hard, okay!?',
  'AU6IaeEPVi',
  (SELECT id FROM happenings WHERE max_char=120),
  2
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'Well I''d like to see you do better!',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=120),
  3
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'The blood was everywhere. Was Carl responsible? Was he capable of such a thing?',
  'HlKvflDJmM',
  (SELECT id FROM happenings WHERE max_char=200),
  1
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'Literally, was he capable? Carl was just a llama with a hat, just like Paul.',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=200),
  2
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'A handshake is worthy, if it''s all that you''ve got.',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=255),
  2
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'Metal shivs on wood, pushed through our backs.',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=255),
  3
);

INSERT INTO haps (body, user_id, happenings_id, position) VALUES (
  'There''s a splinter in your eye, it reads "react".',
  'tyxldkj345',
  (SELECT id FROM happenings WHERE max_char=255),
  4
);