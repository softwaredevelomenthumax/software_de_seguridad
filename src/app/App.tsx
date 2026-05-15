import { useState, useEffect } from 'react';
import {
  Package,
  LogOut,
} from 'lucide-react';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import { LoginScreen } from './components/LoginScreen';
import { EntryForm } from './components/EntryForm';
import { HistoryTable } from './components/HistoryTable';
import { apiUrl } from '../api';

import Salidas from '../pages/Salidas';
import Usuarios from '../pages/Usuarios';

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
  const [collaborators, setCollaborators] = useState<any[]>([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ================= LOGIN =================
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

  // ================= LOAD DATA =================
  const loadEntries = async () => {
    const res = await fetch(apiUrl('/entries'));
    const data = await res.json();
    setEntries(Array.isArray(data) ? data : []);
  };

  const loadCollaborators = async () => {
    const res = await fetch(apiUrl('/collaborators'));
    const data = await res.json();
    setCollaborators(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadEntries();
    loadCollaborators();
  }, []);

  // ================= ADD COLLABORATOR =================
  const addCollaborator = async (collaborator: {
    fullName: string;
    document: string;
    position: string;
    area: string;
  }) => {
    const res = await fetch(apiUrl('/collaborators'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collaborator),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No se pudo crear el colaborador');

    setCollaborators(prev => [...prev, data]);

    return data;
  };

  // ================= ADD ENTRY (FIXED) =================
  const addEntry = async (entry: any) => {
    const res = await fetch(apiUrl('/entries'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...entry,
        status: 'DENTRO'
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'No se pudo crear el registro');

    setEntries(prev => [data, ...prev]);
  };

  // ================= DELETE =================
  const deleteEntry = async (id: string) => {
    await fetch(apiUrl(`/entries/${id}`), {
      method: 'DELETE',
    });

    await loadEntries();
    showToast('Registro eliminado');
  };

  // ================= FILTER =================
  const filteredEntries = entries.filter(e => {
    const date = e.entryDate?.split('T')[0];
    if (startDate && date < startDate) return false;
    if (endDate && date > endDate) return false;
    return true;
  });

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEntries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entradas');
    XLSX.writeFile(wb, 'entradas.xlsx');
    showToast('Exportado a Excel');
  };

  // ================= EXPORT PDF =================
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

    (doc as any).autoTable({
      head: [['ID', 'Colaborador', 'Objeto', 'Categoría', 'Fecha', 'Estado']],
      body: tableData,
    });

    doc.save('entradas.pdf');
    showToast('Exportado a PDF');
  };

  // ================= AUTH =================
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
        <h1 className="flex items-center gap-2 font-bold">
          <Package /> Control de Ingreso
        </h1>

        <button onClick={handleLogout}>
          <LogOut />
        </button>
      </header>

      {/* NAV */}
      <nav className="bg-white flex gap-4 p-3 border-b">
        {[
          { id: 'dashboard', label: 'Inicio' },
          { id: 'register', label: 'Registrar' },
          { id: 'salidas', label: 'Salidas' },
          { id: 'history', label: 'Historial' },
          { id: 'users', label: 'Usuarios' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={activeTab === t.id ? 'text-blue-600' : ''}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* MAIN */}
      <main className="p-6">

        {/* DASHBOARD (LOGO) */}
        {activeTab === 'dashboard' && (
          <div className="flex items-center justify-center min-h-[100vh]">
            <img src="/img/logo.png" alt="Logo" className="w-48 md:w-64 object-contain" />
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
          <div className="space-y-4">

            <div className="flex gap-3 flex-wrap">

              <input
                type="date"
                onChange={e => setStartDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />

              <input
                type="date"
                onChange={e => setEndDate(e.target.value)}
                className="border px-3 py-2 rounded"
              />

              <button
                onClick={exportExcel}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Exportar Excel
              </button>

              <button
                onClick={exportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Exportar PDF
              </button>

            </div>

            <HistoryTable entries={filteredEntries} />

          </div>
        )}

        {/* SALIDAS */}
        {activeTab === 'salidas' && (
          <Salidas
            entries={entries}
            setEntries={setEntries}
            onDelete={deleteEntry}
          />
        )}

        {/* USERS */}
        {activeTab === 'users' && <Usuarios />}

      </main>
    </div>
  );
}
