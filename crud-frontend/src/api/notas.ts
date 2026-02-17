import { API_URL } from "../config/api";

/* =========================
   VALIDACIÓN FRONTEND
========================= */

function validarTexto(texto: string) {
  if (!texto) return false;

  // máximo 100 caracteres
  if (texto.length > 100) return false;

  // solo letras y números
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(texto);
}

/* =========================
   GET
========================= */

export const getNotas = async () => {
  const res = await fetch(`${API_URL}/notas`);

  if (res.status === 429) {
    alert("Has alcanzado el límite de peticiones por minuto. Intenta en 1 minuto.");
    throw new Error("Rate limit");
  }

  return res.json();
};

/* =========================
   CREATE
========================= */

export const createNota = async (texto: string) => {

  if (!validarTexto(texto)) {
    alert("Solo se permiten letras y números (máximo 100 caracteres).");
    return;
  }

  const res = await fetch(`${API_URL}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto }),
  });

  if (res.status === 429) {
    alert("Has alcanzado el límite de peticiones por minuto. Intenta en 1 minuto.");
    throw new Error("Rate limit");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    alert(data?.error || "Error al crear nota");
    throw new Error("Error");
  }

  return data;
};



/* =========================
   DELETE
========================= */

export const deleteNota = async (id: number) => {
  const res = await fetch(`${API_URL}/notas/${id}`, {
    method: "DELETE",
  });

  if (res.status === 429) {
    alert("Has alcanzado el límite de peticiones por minuto. Intenta en 1 minuto.");
    throw new Error("Rate limit");
  }

  if (!res.ok) {
    alert("Error al eliminar nota");
    throw new Error("Error");
  }
};
