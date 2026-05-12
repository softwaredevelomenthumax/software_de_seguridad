import { useState, useRef } from 'react';
import { Camera, Upload, UserPlus, Users, FileSignature } from 'lucide-react';
import type { Collaborator, EntryRecord } from '../App';
import { SignaturePad } from './SignaturePad';
import { CameraCapture } from './CameraCapture';

interface EntryFormProps {
  collaborators: Collaborator[];
  onSubmit: (entry: Omit<EntryRecord, 'id' | 'entryDate' | 'entryTime'>) => void;
  onAddCollaborator: (collaborator: Omit<Collaborator, 'id'>) => Collaborator;
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
    position: '',
    area: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.signature) {
    alert('Por favor, capture la firma del colaborador');
    return;
  }

  let collaboratorId = formData.collaboratorId;
  let collaboratorName = '';
  let collaboratorDocument = '';

  if (mode === 'new') {
    const addedCollaborator = onAddCollaborator(newCollaborator);

    collaboratorId = addedCollaborator.id;
    collaboratorName = addedCollaborator.fullName;
    collaboratorDocument = addedCollaborator.document;
  } else {
    const collaborator = collaborators.find(
      (c) => c.id === collaboratorId
    );

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

  try {
    const response = await fetch(
      'http://localhost:3000/entries',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    console.log(result);

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
      area: '',
    });

    setMode('existing');
  } catch (error) {
    console.log(error);

    alert('Error al registrar ingreso');
  }
};

  const handlePhotoCapture = (photoData: string) => {
    setFormData({ ...formData, photo: photoData });
    setShowCamera(false);
  };

  const handleSignatureCapture = (signatureData: string) => {
    setFormData({ ...formData, signature: signatureData });
    setShowSignature(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {/* Collaborator Selection */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-4">
          Información del Colaborador
        </h3>

        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              mode === 'existing'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Colaborador Existente</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
              mode === 'new'
                ? 'bg-blue-50 border-blue-600 text-blue-700'
                : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Nuevo Colaborador</span>
          </button>
        </div>

        {mode === 'existing' ? (
          <div>
            <label htmlFor="collaborator" className="block text-gray-700 mb-2">
              Seleccionar Colaborador *
            </label>
            <select
              id="collaborator"
              value={formData.collaboratorId}
              onChange={(e) =>
                setFormData({ ...formData, collaboratorId: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={mode === 'existing'}
            >
              <option value="">Seleccione un colaborador</option>
              {collaborators.map((collaborator) => (
                <option key={collaborator.id} value={collaborator.id}>
                  {collaborator.fullName} - {collaborator.document} ({collaborator.position})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newFullName" className="block text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                id="newFullName"
                type="text"
                value={newCollaborator.fullName}
                onChange={(e) =>
                  setNewCollaborator({
                    ...newCollaborator,
                    fullName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Juan Pérez"
                required={mode === 'new'}
              />
            </div>
            <div>
              <label htmlFor="newDocument" className="block text-gray-700 mb-2">
                Documento *
              </label>
              <input
                id="newDocument"
                type="text"
                value={newCollaborator.document}
                onChange={(e) =>
                  setNewCollaborator({
                    ...newCollaborator,
                    document: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 12345678"
                required={mode === 'new'}
              />
            </div>
            <div>
              <label htmlFor="newPosition" className="block text-gray-700 mb-2">
                Cargo *
              </label>
              <input
                id="newPosition"
                type="text"
                value={newCollaborator.position}
                onChange={(e) =>
                  setNewCollaborator({
                    ...newCollaborator,
                    position: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Técnico"
                required={mode === 'new'}
              />
            </div>
            <div>
              <label htmlFor="newArea" className="block text-gray-700 mb-2">
                Área *
              </label>
              <select
                id="newArea"
                value={newCollaborator.area}
                onChange={(e) =>
                  setNewCollaborator({ ...newCollaborator, area: e.target.value })
                }
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={mode === 'new'}
              >
                <option value="">Seleccione un área</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="produccion">Producción</option>
                <option value="logistica">Logística</option>
                <option value="calidad">Calidad</option>
                <option value="administracion">Administración</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Object Information */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-4">
          Información del Objeto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="objectName" className="block text-gray-700 mb-2">
              Nombre del Objeto *
            </label>
            <input
              id="objectName"
              type="text"
              value={formData.objectName}
              onChange={(e) =>
                setFormData({ ...formData, objectName: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Laptop Dell"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione una categoría</option>
              <option value="herramienta">Herramienta</option>
              <option value="electronico">Dispositivo Electrónico</option>
              <option value="equipo">Equipo de Trabajo</option>
              <option value="vehiculo">Vehículo/Moto</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="objectDescription"
              className="block text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="objectDescription"
              value={formData.objectDescription}
              onChange={(e) =>
                setFormData({ ...formData, objectDescription: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Detalles, marca, modelo, color, etc."
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Observaciones adicionales del personal de seguridad"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Photo and Signature */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-4">
            Fotografía del Objeto
          </h3>
          {formData.photo ? (
            <div className="space-y-4">
              <img
                src={formData.photo}
                alt="Objeto capturado"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, photo: '' })}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Eliminar Foto
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border-2 border-dashed border-blue-300"
            >
              <Camera className="w-6 h-6" />
              <span>Tomar Fotografía</span>
            </button>
          )}
        </div>

        {/* Signature */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-[1.1rem] font-semibold text-gray-900 mb-4">
            Firma del Colaborador *
          </h3>
          {formData.signature ? (
            <div className="space-y-4">
              <img
                src={formData.signature}
                alt="Firma"
                className="w-full h-48 object-contain bg-white rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, signature: '' })}
                className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                Limpiar Firma
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowSignature(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-8 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border-2 border-dashed border-green-300"
            >
              <FileSignature className="w-6 h-6" />
              <span>Capturar Firma</span>
            </button>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> La fecha y hora de ingreso se registrarán
          automáticamente al guardar este formulario.
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
      >
        Registrar Ingreso
      </button>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Signature Modal */}
      {showSignature && (
        <SignaturePad
          onSave={handleSignatureCapture}
          onClose={() => setShowSignature(false)}
        />
      )}
    </form>
  );
}
