import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../database/db.js";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Usuário e password são obrigatórios",
    });
  }

  try {
    const { rows } = await pool.query(
      `
      SELECT id, username, password, role
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        error: "Usuário ou password inválidos",
      });
    }

    const passwordValida = await bcrypt.compare(password, user.password);

    if (!passwordValida) {
      return res.status(401).json({
        error: "Usuário ou password inválidos",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.role === "admin", // 🔥 ESSENCIAL
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Erro interno no servidor",
    });
  }
});

export default router;
