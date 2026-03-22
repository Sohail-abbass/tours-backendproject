import express from "express";
import cors from "cors";
import routes from "./routes";
// import dotenv from "dotenv";
// dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
// console.log("DATABASE_URL:", process.env.DATABASE_URL);
app.options("*", cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check route (very useful)
app.get("/api/health", (req, res) => {
  res.json({ status: "API running" });
});
// const PORT = 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Backend running at http://localhost:${PORT}`);
// });
export default app;