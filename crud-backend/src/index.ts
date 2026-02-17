import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pool } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   1️⃣ RATE LIMIT 10 REQUESTS POR MINUTO
========================= */

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Has alcanzado el límite de peticiones por minuto. Intenta nuevamente en un minuto."
  }
});

app.use(limiter);

/* =========================
   2️⃣ VALIDACIONES DE SEGURIDAD
========================= */

function validarTexto(texto: string) {
  if (!texto) return false;

  // max 100 caracteres
  if (texto.length > 100) return false;

  // solo letras y numeros
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(texto);
}

/* =========================
   RUTAS
========================= */

app.get("/notas", async (_req, res) => {
  const result = await pool.query("SELECT * FROM notas ORDER BY id DESC");
  res.json(result.rows);
});

app.post("/notas", async (req, res) => {
  const { texto } = req.body;

  if (!validarTexto(texto)) {
    return res.status(400).json({
      error:
        "Solo se permiten letras y números (máximo 100 caracteres). No se permiten scripts."
    });
  }

  const result = await pool.query(
    "INSERT INTO notas (texto) VALUES ($1) RETURNING *",
    [texto]
  );

  res.json(result.rows[0]);
});

app.put("/notas/:id", async (req, res) => {
  const { id } = req.params;
  const { texto } = req.body;

  if (!validarTexto(texto)) {
    return res.status(400).json({
      error: "Solo se permiten letras y números (máximo 100 caracteres)."
    });
  }

  const result = await pool.query(
    "UPDATE notas SET texto=$1 WHERE id=$2 RETURNING *",
    [texto, id]
  );

  res.json(result.rows[0]);
});


app.delete("/notas/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM notas WHERE id=$1", [id]);
  res.json({ message: "Nota eliminada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
