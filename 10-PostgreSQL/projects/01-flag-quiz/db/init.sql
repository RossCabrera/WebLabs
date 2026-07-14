CREATE TABLE IF NOT EXISTS capitals (
  id SERIAL PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  capital VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  flag VARCHAR(10) NOT NULL
);

COPY capitals (id, country, capital) FROM '/docker-entrypoint-initdb.d/capitals.csv' CSV HEADER;
COPY flags (id, name, flag) FROM '/docker-entrypoint-initdb.d/flags.csv' CSV HEADER;

SELECT setval('capitals_id_seq', (SELECT MAX(id) FROM capitals));
SELECT setval('flags_id_seq', (SELECT MAX(id) FROM flags));
