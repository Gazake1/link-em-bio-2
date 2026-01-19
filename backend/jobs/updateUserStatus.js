import { pool } from "../database/db.js";

export async function updateUsersStatus() {
  try {
    const result = await pool.query(`
      UPDATE users
      SET
        rank = CASE
          WHEN frequencia >= 10 THEN 'Ouro'
          WHEN frequencia >= 5 THEN 'Prata'
          ELSE 'Bronze'
        END,
        status_cliente = CASE
          WHEN ultima_visita IS NOT NULL
           AND ultima_visita >= NOW() - INTERVAL '1 month 5 days'
            THEN 'active'
          ELSE 'inactive'
        END
    `);

    console.log("[CRON] Usuários atualizados:", result.rowCount);
  } catch (error) {
    console.error("[CRON] Erro ao atualizar usuários:", error);
  }
}
