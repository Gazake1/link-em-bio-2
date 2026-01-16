import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET;

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "senha123") {
    const token = jwt.sign({ username }, SECRET_KEY, {
      expiresIn: "2h",
    });

    return res.json({ token });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

export default router;
