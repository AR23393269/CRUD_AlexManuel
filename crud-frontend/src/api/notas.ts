const API = `${import.meta.env.VITE_API_URL}/notas`;

async function manejarRespuesta(res: Response) {
  if (res.status === 429) {
    const data = await res.json();
    alert(data.error);
    return null;
  }

  if (!res.ok) {
    alert("Error en el servidor");
    return null;
  }

  return res.json();
}

export async function getNotas() {
  const res = await fetch(API);
  const data = await manejarRespuesta(res);
  return data ?? [];
}

export async function createNota(texto: string) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto })
  });

  return manejarRespuesta(res);
}

export async function updateNota(id: number, texto: string) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texto })
  });

  return manejarRespuesta(res);
}

export async function deleteNota(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  return manejarRespuesta(res);
}
