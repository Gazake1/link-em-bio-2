import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import usersRoutes from "./routes/users.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, "frontend");

// ===== Middlewares =====
app.use(express.json());
app.use(express.static(frontendPath));

// ===== API (SEMPRE PRIMEIRO) =====
app.use("/api/users", usersRoutes);

// ===== Home =====
app.get("/api", (req, res) => {
  res.sendFile(path.join(frontendPath, "api.html"));
});

// ===== Frontend pages (bloqueando /api) =====
app.get("/:page", (req, res) => {
  const page = req.params.page;

  // bloqueia API e coisas estranhas
  if (page === "api" || !/^[a-z0-9-]+$/i.test(page)) {
    return res.status(404).end();
  }

  const filePath = path.join(frontendPath, `${page}.html`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Página não encontrada");
  }

  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
