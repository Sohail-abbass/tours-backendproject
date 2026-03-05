import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// CORS
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

app.options("*", cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api", routes);

// Health check route (very useful)
app.get("/api/health", (req, res) => {
  res.json({ status: "API running" });
});

export default app;