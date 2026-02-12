import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { pool } from "./db";

const app = express();

app.use(cors());
app.use(express.json());

/* ============================
   LÍMITE DE PETICIONES
   (NO limita GET)
============================ */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20, // 20 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas peticiones, intenta nuevamente en un minuto"
  }
});

// Aplicar solo a métodos que modifican datos
app.use("/notas", (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  limiter(req, res, next);
});

/* ============================
   VALIDACIÓN
============================ */
function validarTexto(texto: string) {
  if (!texto) return "El texto es obligatorio";

  const limpio = texto.trim();

  if (limpio.length === 0)
    return "No se permiten espacios en blanco";

  if (limpio.length > 100)
    return "Máximo 100 caracteres permitidos";

  return null;
}

/* ============================
   GET
============================ */
app.get("/notas", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notas ORDER BY id ASC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Error al obtener notas" });
  }
});

/* ============================
   POST
============================ */
app.post("/notas", async (req: Request, res: Response) => {
  try {
    const { texto } = req.body;

    const error = validarTexto(texto);
    if (error) return res.status(400).json({ error });

    const result = await pool.query(
      "INSERT INTO notas (texto) VALUES ($1) RETURNING *",
      [texto.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Error al crear nota" });
  }
});

/* ============================
   PUT
============================ */
app.put("/notas/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { texto } = req.body;

    const error = validarTexto(texto);
    if (error) return res.status(400).json({ error });

    const result = await pool.query(
      "UPDATE notas SET texto = $1 WHERE id = $2 RETURNING *",
      [texto.trim(), id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Nota no encontrada" });

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Error al actualizar nota" });
  }
});

/* ============================
   DELETE
============================ */
app.delete("/notas/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM notas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Nota no encontrada" });

    res.json({ mensaje: "Nota eliminada correctamente" });
  } catch {
    res.status(500).json({ error: "Error al eliminar nota" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
