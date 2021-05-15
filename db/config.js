import pg from "pg";

const Pool = pg.Pool;

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

db.on("connect", () => {
  console.log("pg db connected");
});

db.on("error", () => {
  console.log("pg db connection error");
});

export default db;
