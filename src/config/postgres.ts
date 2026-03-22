import { Pool } from "pg";

const pool = new Pool({
  host: "aws-1-ap-southeast-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.gtooamkaleijiuaaqqbt",
  password: "Lanja@123456789012",
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error:", err);
});

export default pool;