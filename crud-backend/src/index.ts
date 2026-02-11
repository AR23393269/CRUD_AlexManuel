import "./db";
import cors from "cors";
import express from "express";
import { pool } from "./db";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));
// Crear tabla notas al iniciar
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id SERIAL PRIMARY KEY,
        texto TEXT NOT NULL
      );
    `);
    console.log("Tabla 'notas' lista");
  } catch (error) {
    console.error("Error creando la tabla notas", error);
  }
})();

// Ruta base
app.get("/", (_req, res) => {
  res.send("API funcionando");
});

// Obtener todas las notas (GET)
app.get("/notas", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notas ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener notas" });
  }
});

// Crear nota (POST)
app.post("/notas", async (req, res) => {
  try {
    const { texto } = req.body;
    const result = await pool.query(
      "INSERT INTO notas (texto) VALUES ($1) RETURNING *",
      [texto]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al crear nota" });
  }
});

// Eliminar nota (DELETE)
app.delete("/notas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM notas WHERE id = $1", [id]);
    res.json({ message: "Nota eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar nota" });
  }
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});