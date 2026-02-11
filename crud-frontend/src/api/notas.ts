const API_URL = "http://localhost:3000";

export const getNotas = async () => {
  const res = await fetch(`${API_URL}/notas`);
  return res.json();
};

export const createNota = async (texto: string) => {
  const res = await fetch(`${API_URL}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto }),
  });
  return res.json();
};

export const deleteNota = async (id: number) => {
  await fetch(`${API_URL}/notas/${id}`, {
    method: "DELETE",
  });
};