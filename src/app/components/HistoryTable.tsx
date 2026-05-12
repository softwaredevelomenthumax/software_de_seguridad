import { useState } from 'react';
import { History, Search, Filter, Eye } from 'lucide-react';
import type { EntryRecord } from '../App';

interface HistoryTableProps {
  entries: EntryRecord[];
}

export function HistoryTable({ entries }: HistoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<EntryRecord | null>(null);

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.objectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.collaboratorDocument.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterCategory === 'all' || entry.category === filterCategory;

    return matchesSearch && matchesFilter;
  });

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay ingresos registrados</p>
        <p className="text-sm mt-2">
          El historial aparecerá cuando se registren ingresos de objetos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por objeto, colaborador o documento..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">Todas las categorías</option>
            <option value="herramienta">Herramienta</option>
            <option value="electronico">Dispositivo Electrónico</option>
            <option value="equipo">Equipo de Trabajo</option>
            <option value="vehiculo">Vehículo/Moto</option>
            <option value="otros">Otros</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Objeto
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Colaborador
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Documento
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Fecha
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Hora
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Categoría
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.objectName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {entry.collaboratorName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.collaboratorDocument}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.entryDate}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.entryTime}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 capitalize">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex gap-4 text-sm text-gray-600">
        <span>
          Total: <strong>{filteredEntries.length}</strong>
        </span>
      </div>

      {/* Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-[1.25rem] font-semibold text-gray-900">
                Detalle del Ingreso
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Collaborator Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Información del Colaborador
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">
                      {selectedEntry.collaboratorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Documento</p>
                    <p className="font-medium text-gray-900">
                      {selectedEntry.collaboratorDocument}
                    </p>
                  </div>
                </div>
              </div>

              {/* Object Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Información del Objeto
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-medium text-gray-900">
                      {selectedEntry.objectName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoría</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {selectedEntry.category}
                    </p>
                  </div>
                  {selectedEntry.objectDescription && (
                    <div>
                      <p className="text-sm text-gray-600">Descripción</p>
                      <p className="font-medium text-gray-900">
                        {selectedEntry.objectDescription}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Ingreso</p>
                      <p className="font-medium text-gray-900">
                        {selectedEntry.entryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hora de Ingreso</p>
                      <p className="font-medium text-gray-900">
                        {selectedEntry.entryTime}
                      </p>
                    </div>
                  </div>
                  {selectedEntry.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Observaciones</p>
                      <p className="font-medium text-gray-900">
                        {selectedEntry.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo */}
              {selectedEntry.photo && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Fotografía</h4>
                  <img
                    src={selectedEntry.photo}
                    alt="Objeto"
                    className="w-full max-h-96 object-contain bg-gray-100 rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* Signature */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Firma del Colaborador</h4>
                <img
                  src={selectedEntry.signature}
                  alt="Firma"
                  className="w-full max-h-48 object-contain bg-white rounded-lg border border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
