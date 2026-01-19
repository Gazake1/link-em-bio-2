import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET;

router.post("/", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuário e password são obrigatórios",
    });
  }

  // LOGIN FIXO
  if (username === "admin" && password === "password123") {
    const token = jwt.sign(
      {
        username,
        isAdmin: true, // 🔥 ESSENCIAL
      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  }

  return res.status(401).json({
    error: "Credenciais inválidas",
  });
});

export default router;
