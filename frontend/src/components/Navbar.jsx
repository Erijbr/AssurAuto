import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, User, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Si personne n'est connecté, on n'affiche pas la navbar (ou une version simplifiée)
  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LOGO + LIEN ACCUEIL */}
          <div className="flex items-center gap-2">
            <Link to={user.role === 'AGENT' ? '/agent' : '/client'} className="flex items-center gap-2 hover:opacity-80 transition">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl tracking-tight">Assur'Auto</span>
            </Link>
          </div>

          {/* MENU CENTRAL (Dépend du rôle) */}
          <div className="hidden md:flex items-center space-x-8">
            {user.role === 'CLIENT' && (
              <>
                <Link to="/client" className="flex items-center gap-2 text-gray-300 hover:text-white transition px-3 py-2 rounded-md text-sm font-medium">
                  <LayoutDashboard size={18} /> Mes Sinistres
                </Link>
                <Link to="/client/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition shadow-sm">
                  <PlusCircle size={18} /> Déclarer un sinistre
                </Link>
              </>
            )}

            {user.role === 'AGENT' && (
              <span className="text-gray-400 text-sm italic border border-gray-600 px-3 py-1 rounded-full">
                Mode Administrateur
              </span>
            )}
          </div>

          {/* MENU DROITE (Profil + Logout) */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold">{user.full_name || user.email}</span>
              <span className="text-xs text-blue-400 font-medium">{user.role}</span>
            </div>
            
            <div className="h-8 w-px bg-gray-600 mx-2"></div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-white/10 px-3 py-2 rounded-md transition"
              title="Se déconnecter"
            >
              <LogOut size={20} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}