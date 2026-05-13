import { useState, useEffect } from 'react';
import {
  Package,
  Users,
  LogOut,
  History,
  ArrowDownCircle,
} from 'lucide-react';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { LoginScreen } from './components/LoginScreen';
import { MetricCard } from './components/MetricCard';
import { CollaboratorsList } from './components/CollaboratorsList';
import { EntryForm } from './components/EntryForm';
import { HistoryTable } from './components/HistoryTable';

import Salidas from '../pages/Salidas';
import Usuarios from '../pages/Usuarios';

// ---------------- TYPES ----------------
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
  exitDate?: string;
  exitTime?: string;
  status?: string;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [entries, setEntries] = useState<EntryRecord[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ---------------- LOGIN ----------------
  useEffect(() => {
    const logged = localStorage.getItem('isLoggedIn');
    if (logged === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // ---------------- LOAD ENTRIES ----------------
  const loadEntries = async () => {
    const res = await fetch('http://localhost:3000/entries');
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // ---------------- FILTER ----------------
  const filteredEntries = entries.filter(e => {
    const date = e.entryDate?.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  // ---------------- ADD ENTRY ----------------
  const addEntry = async (entry: any) => {
    const res = await fetch('http://localhost:3000/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const data = await res.json();
    setEntries(prev => [data, ...prev]);
    showToast('Registro creado');
  };

  // ---------------- ADD COLLABORATOR (FIX) ----------------
  const addCollaborator = (collaborator: Omit<Collaborator, 'id'>) => {
    const newCol: Collaborator = {
      ...collaborator,
      id: Date.now().toString(),
    };

    setCollaborators(prev => [...prev, newCol]);
    return newCol;
  };

  // ---------------- DELETE ----------------
  const deleteEntry = async (id: string) => {
    await fetch(`http://localhost:3000/entries/${id}`, {
      method: 'DELETE',
    });

    await loadEntries();
    showToast('Eliminado');
  };

  // ---------------- EXCEL ----------------
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEntries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entradas');
    XLSX.writeFile(wb, 'entradas.xlsx');
  };

  // ---------------- PDF (FIX IMPORT + AUTO TABLE) ----------------
  const exportPDF = () => {
    const doc = new jsPDF();

    const tableData = filteredEntries.map(e => [
      e.id,
      e.collaboratorName,
      e.objectName,
      e.category,
      e.entryDate,
      e.status,
    ]);

    autoTable(doc, {
      head: [['ID', 'Colaborador', 'Objeto', 'Categoría', 'Fecha', 'Estado']],
      body: tableData,
    });

    doc.save('entradas.pdf');
  };

  const today = new Date().toISOString().split('T')[0];

  const todayEntries = entries.filter(
    e => e.entryDate?.split('T')[0] === today
  ).length;

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b p-4 flex justify-between">
        <h1 className="font-bold flex items-center gap-2">
          <Package /> Control de Ingreso
        </h1>
        <button onClick={handleLogout}><LogOut /></button>
      </header>

      {/* NAV */}
      <nav className="bg-white flex gap-4 p-3 border-b">
        {['dashboard','register','salidas','history','users'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={activeTab === t ? 'text-blue-600 font-bold' : ''}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="p-6">

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <MetricCard title="Total" value={entries.length} icon={Package} color="blue" />
              <MetricCard title="Hoy" value={todayEntries} icon={ArrowDownCircle} color="green" />
              <MetricCard title="Usuarios" value={collaborators.length} icon={Users} color="orange" />
            </div>

            {/* FILTROS + EXPORT (MEJORADOS) */}
            <div className="flex gap-3 items-center flex-wrap">

              <input type="date" onChange={e => setStartDate(e.target.value)} />
              <input type="date" onChange={e => setEndDate(e.target.value)} />

              <button
                onClick={exportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
              >
                📊 Excel
              </button>

              <button
                onClick={exportPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
              >
                📄 PDF
              </button>
            </div>

            {/* ACTIVIDAD */}
            <div className="bg-white p-4 rounded-lg">
              <h2 className="font-bold mb-3">Actividad reciente</h2>

              {entries.slice(0, 5).map(e => (
                <div key={e.id} className="flex justify-between border-b py-2">
                  <span>{e.objectName} - {e.collaboratorName}</span>
                  <span>{e.status}</span>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* REGISTER */}
        {activeTab === 'register' && (
          <EntryForm
            collaborators={collaborators}
            onSubmit={addEntry}
            onAddCollaborator={addCollaborator}
          />
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <HistoryTable entries={filteredEntries} />
        )}

        {/* SALIDAS */}
        {activeTab === 'salidas' && (
          <Salidas entries={entries} setEntries={setEntries} onDelete={deleteEntry} />
        )}

        {/* USERS */}
        {activeTab === 'users' && <Usuarios />}

      </main>
    </div>
  );
}