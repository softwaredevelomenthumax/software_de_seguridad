import { useState } from 'react';
import {
  Camera,
  UserPlus,
  Users,
  FileSignature,
} from 'lucide-react';

import type { EntryRecord } from '../App';
import type { Collaborator } from '../types';

import { SignaturePad } from './SignaturePad';
import { CameraCapture } from './CameraCapture';

interface EntryFormProps {
  collaborators: Collaborator[];

  onSubmit: (
    entry: Omit<EntryRecord, 'id' | 'entryDate' | 'entryTime'>
  ) => void;

  onAddCollaborator: (
    collaborator: Omit<Collaborator, 'id'>
  ) => Collaborator;
}

export function EntryForm({
  collaborators,
  onSubmit,
  onAddCollaborator,
}: EntryFormProps) {
  const [mode, setMode] = useState<'existing' | 'new'>('existing');

  const [showCamera, setShowCamera] = useState(false);
  const [showSignature, setShowSignature] = useState(false);

  const [formData, setFormData] = useState({
    collaboratorId: '',
    objectName: '',
    objectDescription: '',
    category: '',
    photo: '',
    signature: '',
    notes: '',
  });

  const [newCollaborator, setNewCollaborator] = useState({
    fullName: '',
    document: '',
    position: '', // CARGO
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.signature) {
      alert('Debes capturar la firma');
      return;
    }

    if (!formData.photo) {
      alert('Debes capturar la foto');
      return;
    }

    let collaboratorId = formData.collaboratorId;
    let collaboratorName = '';
    let collaboratorDocument = '';

    if (mode === 'new') {
      const added = onAddCollaborator(newCollaborator);

      collaboratorId = added.id;
      collaboratorName = added.fullName;
      collaboratorDocument = added.document;
    } else {
      const collaborator = collaborators.find(c => c.id === collaboratorId);

      if (collaborator) {
        collaboratorName = collaborator.fullName;
        collaboratorDocument = collaborator.document;
      }
    }

    const data = {
      collaboratorId,
      collaboratorName,
      collaboratorDocument,

      objectName: formData.objectName,
      objectDescription: formData.objectDescription,
      category: formData.category,

      photo: formData.photo,
      signature: formData.signature,
      notes: formData.notes,
    };

    const response = await fetch('http://localhost:3000/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    onSubmit(result);

    alert('Ingreso registrado correctamente');

    setFormData({
      collaboratorId: '',
      objectName: '',
      objectDescription: '',
      category: '',
      photo: '',
      signature: '',
      notes: '',
    });

    setNewCollaborator({
      fullName: '',
      document: '',
      position: '',
    });

    setMode('existing');
  };

  return (
    <form className="max-w-4xl space-y-8" onSubmit={handleSubmit}>

      {/* COLABORADOR */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Información del Colaborador
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
              mode === 'existing'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            Existente
          </button>

          <button
            type="button"
            onClick={() => setMode('new')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition ${
              mode === 'new'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Nuevo
          </button>
        </div>

        {mode === 'existing' ? (
          <select
            value={formData.collaboratorId}
            onChange={e =>
              setFormData({ ...formData, collaboratorId: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Seleccionar colaborador</option>
            {collaborators.map(c => (
              <option key={c.id} value={c.id}>
                {c.fullName} - {c.document}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nombre completo"
              value={newCollaborator.fullName}
              onChange={e =>
                setNewCollaborator({ ...newCollaborator, fullName: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              placeholder="Documento"
              value={newCollaborator.document}
              onChange={e =>
                setNewCollaborator({ ...newCollaborator, document: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />

            <input
              placeholder="Cargo"
              value={newCollaborator.position}
              onChange={e =>
                setNewCollaborator({ ...newCollaborator, position: e.target.value })
              }
              className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* OBJETO */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">
          Información del Objeto
        </h3>

        <input
          placeholder="Nombre del objeto"
          value={formData.objectName}
          onChange={e =>
            setFormData({ ...formData, objectName: e.target.value })
          }
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg"
        />

        <textarea
          placeholder="Descripción"
          value={formData.objectDescription}
          onChange={e =>
            setFormData({ ...formData, objectDescription: e.target.value })
          }
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg"
        />

        <select
          value={formData.category}
          onChange={e =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        >
          <option value="">Seleccione categoría</option>
          <option value="herramienta">Herramienta</option>
          <option value="electronico">Electrónico</option>
          <option value="equipo">Equipo</option>
        </select>
      </div>

      {/* FOTO + FIRMA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* FOTO */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold mb-4">Fotografía</h3>

          {formData.photo ? (
            <img src={formData.photo} className="w-full h-48 object-cover rounded-lg" />
          ) : (
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-blue-50 text-blue-600 rounded-lg border-2 border-dashed border-blue-300"
            >
              <Camera className="w-6 h-6" />
              Tomar Fotografía
            </button>
          )}
        </div>

        {/* FIRMA */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold mb-4">Firma *</h3>

          {formData.signature ? (
            <img src={formData.signature} className="w-full h-48 object-contain bg-white rounded-lg" />
          ) : (
            <button
              type="button"
              onClick={() => setShowSignature(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-green-50 text-green-600 rounded-lg border-2 border-dashed border-green-300"
            >
              <FileSignature className="w-6 h-6" />
              Capturar Firma
            </button>
          )}
        </div>
      </div>

      {/* BOTÓN */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
      >
        Registrar Ingreso
      </button>

      {/* MODALES */}
      {showCamera && (
        <CameraCapture
          onCapture={img => {
            setFormData({ ...formData, photo: img });
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showSignature && (
        <SignaturePad
          onSave={sig => {
            setFormData({ ...formData, signature: sig });
            setShowSignature(false);
          }}
          onClose={() => setShowSignature(false)}
        />
      )}
    </form>
  );
}