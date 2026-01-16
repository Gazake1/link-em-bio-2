import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import usersRoutes from "./routes/users.routes.js";


const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend");

app.use(express.json());
app.use(express.static(frontendPath));

// API
app.use("/api/users", usersRoutes);

// Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/:page", (req, res) => {
  res.sendFile(path.join(frontendPath, `${req.params.page}.html`));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na Porta: ${PORT}`);
});
