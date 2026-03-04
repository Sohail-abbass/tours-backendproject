import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// CORS middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tours-frontend.vercel.app"
    ],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
// import "./config/env"; // load env first

// import express from "express";
// import cors from "cors";
// import routes from "./routes";
// import pool from "./config/postgres";

// console.log("ENV TEST:", {
//   refresh: process.env.GMAIL_REFRESH_TOKEN,
//   user: process.env.GMAIL_USER,
// });const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Test DB connection on startup
// (async () => {
//   try {
//     const res = await pool.query("SELECT NOW()");
//     console.log("✅ Database Connected:", res.rows[0]);
//   } catch (error) {
//     console.error("❌ Database Connection Failed:", error);
//   }
// })();

// // Mount routes
// app.use("/api", routes);

// // Health route
// app.get("/", (req, res) => {
//   res.json({ message: "API Running 🚀" });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });