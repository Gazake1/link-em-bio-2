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

  // campos obrigatórios
  if (!nome || !cpf || !email || !data_nascimento) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  // valida CPF real
  if (!validateCpf(cpf)) {
    return res.status(400).json({ error: "CPF inválido" });
  }

  // valida email real
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    const query = `
      INSERT INTO users
        (nome, cpf, telefone, email, data_nascimento)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const values = [
      nome,
      cpf.replace(/\D/g, ""), // salva sem máscara
      telefone,
      email.toLowerCase(),    // padroniza email
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
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        error: "CPF ou email já cadastrado",
      });
    }

    console.error(error);
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
    const result = await pool.query(
      `SELECT id, nome, cpf, telefone, email, data_nascimento, criado_em
       FROM users
       ORDER BY criado_em DESC`
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro ao listar usuários",
    });
  }
});

export default router;
