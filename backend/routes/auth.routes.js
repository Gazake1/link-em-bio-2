import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET

const user = process.env.USER
const pass = process.env.PASSWORD

// Endpoint de login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Aqui você define quem pode acessar. Exemplo fixo:
  if (username === `${user}` && password === `${pass}`) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
    return res.json({ token });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

export default router;
