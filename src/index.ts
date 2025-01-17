import express from "express";

import voteRouter from "./routers/voteRoutes";

const app = express();
const PORT = Number(process.env.PORT) || 8002;

// Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Routes
app.use("/api", voteRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
