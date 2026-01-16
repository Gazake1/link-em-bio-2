import { pool } from "../database/db.js";

export async function createUser(req, res) {
  const { nome, cpf, telefone, email, dataNascimento } = req.body;

  if (!nome || !cpf || !email || !dataNascimento) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const query = `
      INSERT INTO users
        (nome, cpf, telefone, email, data_nascimento)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING id
    `;

    const values = [nome, cpf, telefone, email, dataNascimento];

    const result = await pool.query(query, values);

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      userId: result.rows[0].id,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "CPF ou email já cadastrado" });
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
