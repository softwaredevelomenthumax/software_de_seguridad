import { User, Search } from 'lucide-react';
import { useState } from 'react';
import type { Collaborator } from '../App';

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  onDelete?: (id: string) => void;
  onEdit?: (collaborator: Collaborator) => void;
}

export function CollaboratorsList({ collaborators, onDelete, onEdit }: CollaboratorsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollaborators = collaborators.filter((collaborator) =>
    collaborator.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collaborator.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (collaborators.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No hay colaboradores registrados</p>
        <p className="text-sm mt-2">
          Los colaboradores se registrarán automáticamente al crear un ingreso
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre, documento o cargo..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCollaborators.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No se encontraron colaboradores
          </div>
        ) : (
          filteredCollaborators.map((collaborator) => (
  <div
    key={collaborator.id}
    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start gap-3 mb-3">
      <div className="bg-blue-100 p-2 rounded-full">
        <User className="w-5 h-5 text-blue-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {collaborator.fullName}
        </h3>
        <p className="text-sm text-gray-600">
          {collaborator.document}
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Cargo:</span>
        <span className="text-sm font-medium text-gray-900">
          {collaborator.position}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Área:</span>
        <span className="text-sm font-medium text-gray-900 capitalize">
          {collaborator.area}
        </span>
      </div>
    </div>

    {/* EDITAR */}
    {onEdit && (
      <button
        onClick={() => onEdit(collaborator)}
        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
      >
        Editar
      </button>
    )}
    {/* 🔥 BOTONES QUE PEDISTE */}
    <div className="flex gap-2 mt-4">
      <button
        onClick={() => onDelete?.(collaborator.id)}
        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Eliminar
      </button>
    </div>
  </div>
))
        )}
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-600">
        Total de colaboradores: <strong>{filteredCollaborators.length}</strong>
      </div>
    </div>
  );
}
