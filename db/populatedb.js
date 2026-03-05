const { Client } = require("pg");

const VIEWS = ``;

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
 member_status BOOLEAN
);


CREATE TABLE IF NOT EXISTS "message_table" (
 id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
 user_id VARCHAR (255),
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
  await client.query(CREATE_TABLES);
  console.log("tables created");
  await client.end();
  console.log("done");
}

main();
