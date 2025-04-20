import express from "express";
import { router } from "./src/routes/v1";

const app = express();

app.use("/api/v1", router);

export default app;
  