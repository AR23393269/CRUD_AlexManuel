import { useEffect, useState } from "react";
import { getNotas } from "./api/notas";
import NotaForm from "./componentes/NotaForm";
import NotasTable from "./componentes/NotasTable";
import "./styles/main.css";

export interface Nota {
  id: number;
  texto: string;
}

function App() {
  const [notas, setNotas] = useState<Nota[]>([]);

  const cargarNotas = async () => {
    const data = await getNotas();
    setNotas(data);
  };

  useEffect(() => {
    cargarNotas();
  }, []);

  return (
    <div className="container">
      <h1>CRUD de Notas</h1>
      <NotaForm onAdd={cargarNotas} />
      <NotasTable notas={notas} onDelete={cargarNotas} />
    </div>
  );
}

export default App;