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
router.put("/:id", authAdmin, async (req, res) => {
  const { id } = req.params;

  const {
    nome,
    telefone,
    email,
    data_nascimento,
    frequencia,
    status_cliente,
    rank,
    ultima_visita
  } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET
        nome = $1,
        telefone = $2,
        email = $3,
        data_nascimento = $4,
        frequencia = $5,
        status_cliente = $6,
        rank = $7,
        ultima_visita = $8
      WHERE id = $9
      `,
      [
        nome,
        telefone || null,
        email,
        data_nascimento,
        frequencia ?? 0,
        status_cliente,           // ✅ NUNCA null
        rank || "bronze",
        ultima_visita || null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erro PUT users:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});


export default router;
