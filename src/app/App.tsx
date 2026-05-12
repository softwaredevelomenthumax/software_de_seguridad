import { useState, useEffect } from 'react';
import {
  Package,
  Users,
  LogOut,
  History,
  ArrowDownCircle,
} from 'lucide-react';
import { LoginScreen } from './components/LoginScreen';
import { MetricCard } from './components/MetricCard';
import { CollaboratorsList } from './components/CollaboratorsList';
import { EntryForm } from './components/EntryForm';
import { HistoryTable } from './components/HistoryTable';
import Salidas from "../pages/Salidas";
import Usuarios from '../pages/Usuarios';

export interface Collaborator {
  id: string;
  fullName: string;
  document: string;
  position: string;
  area: string;
}

export interface EntryRecord {
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
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const user = JSON.parse(
    localStorage.getItem('user') || '{}'
  );


  useEffect(() => {
  const loggedIn = localStorage.getItem('isLoggedIn');

  if (loggedIn === 'true') {
    setIsLoggedIn(true);
  }

  const savedCollaborators =
    localStorage.getItem('collaborators');

  if (savedCollaborators) {
    setCollaborators(
      JSON.parse(savedCollaborators)
    );
  }

  fetchEntries();
}, []);

const fetchEntries = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/entries`
    );

    const data = await response.json();

    setEntries(data);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    localStorage.setItem('collaborators', JSON.stringify(collaborators));
  }, [collaborators]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const addCollaborator = (collaborator: Omit<Collaborator, 'id'>) => {
    const newCollaborator = { ...collaborator, id: Date.now().toString() };
    setCollaborators([...collaborators, newCollaborator]);
    return newCollaborator;
  };

  const addEntry = (entry: Omit<EntryRecord, 'id' | 'entryDate' | 'entryTime'>) => {
    const now = new Date();
    const newEntry: EntryRecord = {
      ...entry,
      id: Date.now().toString(),
      entryDate: now.toLocaleDateString('es-ES'),
      entryTime: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
    setEntries([...entries, newEntry]);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const totalEntries = entries.length;
  const totalCollaborators = collaborators.length;
  const today = new Date().toLocaleDateString('es-ES');
  const todayEntries = entries.filter((e) => e.entryDate === today).length;

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-[1.5rem] font-semibold text-gray-900">
              Control de Ingreso - Seguridad
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Package },
              { id: 'register', label: 'Registrar Ingreso', icon: ArrowDownCircle },
              { id: 'salidas', label: 'Registrar Salida', icon: ArrowDownCircle },
              { id: 'collaborators', label: 'Colaboradores', icon: Users },
              { id: 'history', label: 'Historial', icon: History },
              ...(user.role === 'admin'
                ? [
                    {
                      id: 'users',
                      label: 'Usuarios',
                      icon: Users,
                    },
                  ]
                : []),

            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MetricCard
                title="Ingresos Totales"
                value={totalEntries}
                icon={Package}
                color="blue"
              />
              <MetricCard
                title="Ingresos Hoy"
                value={todayEntries}
                icon={ArrowDownCircle}
                color="green"
              />
              <MetricCard
                title="Colaboradores Registrados"
                value={totalCollaborators}
                icon={Users}
                color="orange"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-[1.25rem] font-semibold text-gray-900 mb-4">
                Accesos Rápidos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('register')}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                >
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Registrar Ingreso</span>
                </button>
                <button
                  onClick={() => setActiveTab('collaborators')}
                  className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Ver Colaboradores</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                >
                  <History className="w-5 h-5" />
                  <span>Ver Historial</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-[1.25rem] font-semibold text-gray-900 mb-6">
              Registrar Ingreso de Objeto
            </h2>
            <EntryForm
              collaborators={collaborators}
              onSubmit={addEntry}
              onAddCollaborator={addCollaborator}
            />
          </div>
        )}

        {activeTab === 'collaborators' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-[1.25rem] font-semibold text-gray-900 mb-6">
              Colaboradores Registrados
            </h2>
            <CollaboratorsList collaborators={collaborators} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-[1.25rem] font-semibold text-gray-900 mb-6">
              Historial de Ingresos
            </h2>
            <HistoryTable entries={entries} />
          </div>

        )}
        {activeTab === 'salidas' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-[1.25rem] font-semibold text-gray-900 mb-6">
              Registrar Salida de Objetos
            </h2>
            <Salidas entries={entries} setEntries={setEntries} />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Usuarios />
          </div>
        )}

      </main>
    </div>
  );
}
