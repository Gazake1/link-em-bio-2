import { Router } from "express";
import { pool } from "../database/db.js";
import { authAdmin } from "../middlewares/auth.js";

const router = Router();

/* =========================
   Listar usuários (admin)
========================= */
router.get("/", authAdmin, async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    rank,
    status_cliente,
    freq_min
  } = req.query;

  const offset = (page - 1) * limit;
  const values = [];
  let where = "WHERE 1=1";

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    where += ` AND (
      LOWER(nome) LIKE $${values.length}
      OR LOWER(email) LIKE $${values.length}
      OR cpf LIKE $${values.length}
    )`;
  }

  if (rank) {
    values.push(rank);
    where += ` AND rank = $${values.length}`;
  }

  if (status_cliente) {
    values.push(status_cliente);
    where += ` AND status_cliente = $${values.length}`;
  }

  if (freq_min) {
    values.push(Number(freq_min));
    where += ` AND frequencia >= $${values.length}`;
  }

  try {
    const totalQuery = `
      SELECT COUNT(*) FROM users
      ${where}
    `;

    const totalResult = await pool.query(totalQuery, values);
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    values.push(limit);
    values.push(offset);

    const usersQuery = `
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
      ${where}
      ORDER BY criado_em DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const usersResult = await pool.query(usersQuery, values);

    res.json({
      users: usersResult.rows,
      total,
      page: Number(page),
      totalPages
    });
  } catch (error) {
    console.error("Erro GET admin/users:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
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
      RETURNING *
      `,
      [
        nome,
        telefone || null,
        email,
        data_nascimento,
        frequencia ?? 0,
        status_cliente ?? 'never_visited',
        rank ?? 'Bronze',
        ultima_visita || null,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro PUT admin/users:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});



export default router;
