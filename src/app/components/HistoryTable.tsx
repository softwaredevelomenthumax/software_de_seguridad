import { useState } from 'react';
import { History, Search, Filter, Eye } from 'lucide-react';
import type { EntryRecord } from '../App';

interface HistoryTableProps {
  entries: EntryRecord[];
}

export function HistoryTable({ entries }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<EntryRecord | null>(null);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      (entry.objectName ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (entry.collaboratorName ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (entry.collaboratorDocument ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterCategory === 'all' || entry.category === filterCategory;

    return matchesSearch && matchesFilter;
  });

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay ingresos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* FILTERS */}
      <div className="flex gap-4">

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

          <input
            className="w-full pl-10 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />

          <select
            className="pl-10 py-2 border rounded-lg"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="herramienta">Herramienta</option>
            <option value="electronico">Electrónico</option>
            <option value="equipo">Equipo</option>
          </select>
        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">

          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-3 text-left">Objeto</th>
              <th className="p-3 text-left">Colaborador</th>
              <th className="p-3 text-left">Documento</th>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Hora</th>
              <th className="p-3 text-left">Categoría</th>
              <th className="p-3 text-left">Acción</th>
            </tr>
          </thead>

          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className="border-b hover:bg-gray-50">

                <td className="p-3">{entry.objectName || '-'}</td>
                <td className="p-3">{entry.collaboratorName || '-'}</td>
                <td className="p-3">{entry.collaboratorDocument || '-'}</td>
                <td className="p-3">{entry.entryDate || '-'}</td>
                <td className="p-3">{entry.entryTime || '-'}</td>
                <td className="p-3 capitalize">{entry.category || '-'}</td>

                <td className="p-3">
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className="flex items-center gap-1 text-blue-600"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl p-6 rounded-lg">

            <h2 className="text-xl font-bold mb-4">Detalle del ingreso</h2>

            <p><strong>Objeto:</strong> {selectedEntry.objectName}</p>
            <p><strong>Colaborador:</strong> {selectedEntry.collaboratorName}</p>
            <p><strong>Documento:</strong> {selectedEntry.collaboratorDocument}</p>
            <p><strong>Fecha:</strong> {selectedEntry.entryDate}</p>
            <p><strong>Hora:</strong> {selectedEntry.entryTime}</p>
            <p><strong>Categoría:</strong> {selectedEntry.category}</p>

            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setSelectedEntry(null)}
            >
              Cerrar
            </button>

          </div>

        </div>
      )}

    </div>
  );
}