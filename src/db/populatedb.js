const { Client } = require("pg");

const VIEWS = `
DROP VIEW IF EXISTS full_message_data;
CREATE VIEW full_message_data AS
SELECT first_name, message, date, message_table.id FROM user_table
JOIN message_table ON user_table.id = message_table.user_id
`;

const CREATE_TABLES = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");


CREATE TABLE IF NOT EXISTS "user_table" (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 user VARCHAR (255),
 password VARCHAR (255),
 member_status BOOLEAN,
 is_admin BOOLEAN
);


CREATE TABLE IF NOT EXISTS "message_table" (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 user_id INTEGER,
 message TEXT,
 member_status TEXT,
 date DATE
);
`;

async function main() {
  console.log("seeding...");

  const client = new Client({
    connectionString: `${process.env.DB_URL}`,
  });
  await client.connect();
  await client.query(VIEWS);
  console.log("views created");
  await client.end();
  console.log("done");
}

main();
