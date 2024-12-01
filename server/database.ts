import pg from "pg";
import "dotenv/config";

// const pool = new pg.Pool({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : undefined,
// });

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,

});

pool.connect((err: any) => {
  //console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

  if (err) throw err;
  console.log("Connect to PostgreSQL successfully!");
});

export default pool;
