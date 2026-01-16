import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import usersRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.routes.js"
import adminUsersRoutes from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ===== dirname (ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== Frontend =====
const frontendPath = path.resolve(__dirname, "frontend");

// ===== Middlewares =====
app.use(express.json());
app.use(express.static(frontendPath));

// ===== API (PRIMEIRO, SEMPRE) =====
app.use("/api/users", usersRoutes);
app.use("/api/admin/users", adminUsersRoutes);

// rota base da API (opcional, mas recomendado)
app.get("/api", (req, res) => {
  res.json({ status: "API online" });
});

// ===== Home =====
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use("/api/login", authRoutes);


// ===== Frontend pages (BLOQUEANDO /api) =====
app.get("/:page", (req, res) => {
  const page = req.params.page;

  // bloqueia api, arquivos e caminhos inválidos
  if (
    page === "api" ||
    page.includes(".") ||
    !/^[a-z0-9-]+$/i.test(page)
  ) {
    return res.status(404).end();
  }

  const filePath = path.join(frontendPath, `${page}.html`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Página não encontrada");
  }

  res.sendFile(filePath);
});

// ===== Start =====
app.listen(PORT, () => {
  console.log(`Servidor rodando em https://saiba.mais.santos-tech.com`);
});
