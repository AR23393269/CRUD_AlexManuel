import { useState } from "react";
import { createNota } from "../api/notas";

interface Props {
  onAdd: () => void;
}

export default function NotaForm({ onAdd }: Props) {
  const [texto, setTexto] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    await createNota(texto);
    setTexto("");
    onAdd();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        placeholder="Escribe una nota..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button>Guardar</button>
    </form>
  );
}