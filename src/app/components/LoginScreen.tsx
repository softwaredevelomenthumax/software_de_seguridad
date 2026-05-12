import { useState } from 'react';
import { Lock, Shield } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    const response = await fetch(
      'http://localhost:3000/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem(
        'isLoggedIn',
        'true'
      );
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      onLogin();
    } else {
      alert(
        'Usuario o contraseña incorrectos'
      );
    }
  } catch (error) {
    console.log(error);

    alert('Error del servidor');
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-4 rounded-xl mb-4">
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-[1.75rem] font-semibold text-gray-900">
            Control de Ingreso
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Seguridad - Acceso Autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese su usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            <span>Iniciar Sesión</span>
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Sistema privado de gestión empresarial
        </p>
      </div>
    </div>
  );
}
