import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/dashboard" className="text-xl font-bold tracking-wide hover:text-indigo-200 transition">
        TaskBoard
      </Link>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-indigo-200 hidden sm:block">
            {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
