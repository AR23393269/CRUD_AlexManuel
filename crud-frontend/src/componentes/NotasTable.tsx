import { deleteNota } from "../api/notas";

interface Nota {
  id: number;
  texto: string;
}

export default function NotasTable({
  notas,
  onDelete,
}: {
  notas: Nota[];
  onDelete: () => void;
}) {
  const handleDelete = async (id: number) => {
    await deleteNota(id);
    onDelete();
  };

  return (
    <div className="notas-section">
      <h2 className="notas-title">Tus notas</h2>
      {notas.length === 0 ? (
        <p className="notas-empty">No tienes notas todavia. Escribe una arriba.</p>
      ) : (
        <ul className="notas-list">
          {notas.map((nota) => (
            <li key={nota.id} className="nota-item">
              <span className="nota-texto">{nota.texto}</span>
              <button className="nota-delete" onClick={() => handleDelete(nota.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}