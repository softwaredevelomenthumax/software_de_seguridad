import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  role: string;
}

export default function Usuarios() {
  const [users, setUsers] = useState<User[]>([]);

  const [username, setUsername] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

    const isAdmin = user.role === 'admin';

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/auth/users'
      );

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAdmin) {
  alert('No tienes permisos');
  return;
}

  const createUser = async () => {
    try {
      await fetch(
        'http://localhost:3000/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            role,
          }),
        }
      );

      alert('Usuario creado');

      setUsername('');
      setPassword('');
      setRole('user');

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-xl border">
        <h2 className="text-xl font-semibold mb-4">
          Crear Usuario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="border rounded-lg p-3"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="border rounded-lg p-3"
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="border rounded-lg p-3"
          >
            <option value="user">
              Usuario
            </option>

            <option value="admin">
              Administrador
            </option>
          </select>
        </div>

        <button
          onClick={createUser}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Crear Usuario
        </button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            Usuarios Registrados
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Usuario
              </th>

              <th className="p-4 text-left">
                Rol
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-t"
              >
                <td className="p-4">
                  {user.id}
                </td>

                <td className="p-4">
                  {user.username}
                </td>

                <td className="p-4">
                  {user.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}