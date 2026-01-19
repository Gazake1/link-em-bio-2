import { Router } from "express";
import { pool } from "../database/db.js";
import { authAdmin } from "../middlewares/auth.js";

const router = Router();

/* =========================
   Listar usuários (admin)
========================= */
router.get("/", authAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email,
        data_nascimento,
        frequencia,
        status_cliente,
        rank,
        ultima_visita,
        criado_em
      FROM users
      ORDER BY criado_em DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "erro:": error });
  }
});

/* =========================
   Atualizar usuário (admin)
========================= */
router.get("/:id", authAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email,
        data_nascimento,
        frequencia,
        status_cliente,
        rank,
        ultima_visita
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro GET users/:id:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});



export default router;
