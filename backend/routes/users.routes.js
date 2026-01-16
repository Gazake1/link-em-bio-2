import { Router } from "express";
import { pool } from "../database/db.js";
import { validateCpf } from "../utils/validateCpf.js";
import { validateEmail } from "../utils/valideEmail.js";

const router = Router();

/* =========================
   Criar usuário
========================= */
router.post("/", async (req, res) => {
  const { nome, cpf, telefone, email, data_nascimento } = req.body;

  // valida campos obrigatórios
  if (!nome || !cpf || !email || !data_nascimento) {
    return res.status(400).json({
      error: "Dados obrigatórios não informados",
    });
  }

  // valida CPF
  if (!validateCpf(cpf)) {
    return res.status(400).json({
      error: "CPF inválido",
    });
  }

  // valida email
  if (!validateEmail(email)) {
    return res.status(400).json({
      error: "Email inválido",
    });
  }

  try {
    const query = `
      INSERT INTO users (
        nome,
        cpf,
        telefone,
        email,
        data_nascimento
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        criado_em;
    `;

    const values = [
      nome.trim(),
      cpf.replace(/\D/g, ""),
      telefone || null,
      email.toLowerCase().trim(),
      data_nascimento,
    ];

    const result = await pool.query(query, values);

    return res.status(201).json({
      id: result.rows[0].id,
      nome,
      cpf,
      telefone,
      email,
      data_nascimento,
      criado_em: result.rows[0].criado_em,
    });
  } catch (error) {
    // CPF ou email duplicado
    if (error.code === "23505") {
      return res.status(409).json({
        error: "CPF ou email já cadastrado",
      });
    }

    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
});

/* =========================
   Listar usuários
========================= */
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        nome,
        cpf,
        telefone,
        email,
        data_nascimento,
        criado_em
      FROM users
      ORDER BY criado_em DESC;
    `;

    const result = await pool.query(query);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({
      error: "Erro ao listar usuários",
    });
  }
});

export default router;
