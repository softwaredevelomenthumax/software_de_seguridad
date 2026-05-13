import { useState } from 'react';
import type { EntryRecord } from '../app/App';

interface SalidasProps {
  entries: EntryRecord[];
  setEntries: React.Dispatch<React.SetStateAction<EntryRecord[]>>;
  onDelete: (id: string) => void;
}

export default function Salidas({
  entries,
  setEntries,
  onDelete,
}: SalidasProps) {
  const [document, setDocument] = useState('');
  const [selectedObject, setSelectedObject] = useState('');

  const activeEntries = entries.filter(
    (item) =>
      item.collaboratorDocument === document &&
      item.status !== 'SALIDA'
  );

  const registerExit = async () => {
    if (!selectedObject) {
      alert('Seleccione un objeto');
      return;
    }

    try {
      const now = new Date();

      const res = await fetch(`http://localhost:3000/exits`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedObject,
          exitDate: now.toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Error al registrar salida');

      // 🔥 RELOAD REAL DESDE BACKEND
      const updated = await fetch('http://localhost:3000/entries');
      const data = await updated.json();

      setEntries(Array.isArray(data) ? data : []);

      setDocument('');
      setSelectedObject('');

      alert('Salida registrada correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al registrar salida');
    }
  };

  return (
    <div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div>
          <label className="block mb-2 font-medium">Documento</label>
          <input
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Documento"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Objetos activos</label>

          <select
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            className="w-full border p-3 rounded-lg"
          >
            <option value="">Seleccione</option>

            {activeEntries.map((item) => (
              <option key={item.id} value={item.id}>
                {item.objectName}
              </option>
            ))}
          </select>
        </div>

      </div>

      <button
        onClick={registerExit}
        className="bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        Registrar Salida
      </button>

      {/* TABLE */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Objeto</th>
              <th>Ingreso</th>
              <th>Salida</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((item) => (
              <tr key={item.id} className="border-b">

                <td>{item.collaboratorDocument}</td>
                <td>{item.objectName}</td>
                <td>{item.entryDate} - {item.entryTime}</td>
                <td>
                  {item.exitDate
                    ? `${item.exitDate} - ${item.exitTime}`
                    : '---'}
                </td>

                <td>
                  {item.status === 'SALIDA' ? 'FUERA' : 'DENTRO'}
                </td>

                <td>
                  <button
                    onClick={() => {
                      const ok = window.confirm(
                        '¿Seguro que deseas eliminar?'
                      );

                      if (ok) onDelete(item.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}