import { useState } from 'react';

interface EntryRecord {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  collaboratorDocument: string;
  objectName: string;
  objectDescription: string;
  category: string;
  photo?: string;
  signature: string;
  entryDate: string;
  entryTime: string;
  notes: string;
  exitDate?: string;
  exitTime?: string;
  status?: string;
}

interface Props {
  entries: EntryRecord[];
  setEntries: React.Dispatch<React.SetStateAction<EntryRecord[]>>;
}

export default function Salidas({ entries, setEntries }: Props) {
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

      // 🔥 1. Actualizar backend (ajusta endpoint si es necesario)
      const response = await fetch('https://software-de-seguridad.onrender.com/exits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedObject,
          exitDate: now.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      // 🔥 2. Actualizar frontend sin recargar página
      const updatedEntries = entries.map((item) => {
        if (item.id === selectedObject && item.status !== 'SALIDA') {
          return {
            ...item,
            status: 'SALIDA',
            exitDate: now.toLocaleDateString('es-ES'),
            exitTime: now.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }
        return item;
      });

      setEntries(updatedEntries);

      // 🔥 3. Limpiar formulario
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block mb-2 font-medium">Documento</label>
          <input
            type="text"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            placeholder="Ingrese documento"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Objetos Activos
          </label>

          <select
            value={selectedObject}
            onChange={(e) => setSelectedObject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="">Seleccione objeto</option>

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
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
      >
        Registrar Salida
      </button>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Documento</th>
              <th className="p-3 text-left">Objeto</th>
              <th className="p-3 text-left">Ingreso</th>
              <th className="p-3 text-left">Salida</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3">{item.collaboratorDocument}</td>
                <td className="p-3">{item.objectName}</td>
                <td className="p-3">
                  {item.entryDate} - {item.entryTime}
                </td>
                <td className="p-3">
                  {item.exitDate
                    ? `${item.exitDate} - ${item.exitTime}`
                    : '---'}
                </td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      item.status === 'SALIDA'
                        ? 'bg-red-600'
                        : 'bg-green-600'
                    }`}
                  >
                    {item.status === 'SALIDA' ? 'FUERA' : 'DENTRO'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}