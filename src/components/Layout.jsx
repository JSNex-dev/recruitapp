import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Home, Users, Briefcase, LogOut, UserPlus, Building, BarChart2, UserPlus2, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarLink = ({ to, icon, children, currentPath }) => {
  const isActive = currentPath === to || (to !== '/' && currentPath.startsWith(to));
  return (
    <Link to={to}>
      <motion.div
        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ease-in-out
                    ${isActive ? 'bg-brand-orange text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {React.cloneElement(icon, { className: "h-5 w-5 mr-3" })}
        {children}
      </motion.div>
    </Link>
  );
};

const Layout = () => {
  const { user, logout, ROLES } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    const result = logout();
    if (result.success && result.redirectTo) {
      navigate(result.redirectTo);
    }
  };

  if (!user) {
    return null; 
  }

  const getRoleSpecificLinks = () => {
    switch (user.role) {
      case ROLES.ADMIN:
        return [
          { to: '/admin', icon: <Home />, label: 'Dashboard Admin' },
          { to: '/admin/candidates', icon: <Users />, label: 'Ver Candidatos' },
          { to: '/admin/add-candidate', icon: <UserPlus2 />, label: 'Añadir Candidato' },
          { to: '/admin/companies', icon: <Building />, label: 'Empresas' },
          { to: '/admin/users', icon: <UserPlus />, label: 'Usuarios' },
          { to: '/admin/reports', icon: <BarChart2 />, label: 'Reportes Productividad' },
        ];
      case ROLES.RECRUITER:
        return [
          { to: '/recruiter', icon: <Home />, label: 'Dashboard Reclutador' },
          { to: '/recruiter/candidates', icon: <Users />, label: 'Mis Candidatos' },
          { to: '/recruiter/add-candidate', icon: <UserPlus2 />, label: 'Registrar Candidato' },
        ];
      case ROLES.INPLANT:
        return [
          { to: '/inplant', icon: <Home />, label: 'Dashboard Inplant' },
          { to: '/inplant/assigned-candidates', icon: <Briefcase />, label: 'Candidatos Asignados' },
          { to: '/inplant/add-candidate', icon: <UserPlus2 />, label: 'Registrar Candidato' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getRoleSpecificLinks();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="flex flex-1 overflow-hidden">
        <motion.aside 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-64 bg-slate-800/80 backdrop-blur-md p-6 space-y-6 shadow-2xl flex flex-col justify-between border-r border-slate-700"
        >
          <div>
            <div className="text-center mb-10">
              <Link to="/" className="flex items-center justify-center space-x-2">
                <motion.div 
                  className="p-2 bg-brand-orange rounded-lg"
                  animate={{ rotate: [0, 15, -10, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Briefcase className="h-8 w-8 text-white" />
                </motion.div>
                <h1 className="text-3xl font-bold text-brand-orange">RTE</h1>
              </Link>
            </div>
            <nav className="space-y-2">
              {navLinks.map(link => (
                <SidebarLink key={link.to} to={link.to} icon={link.icon} currentPath={currentPath}>
                  {link.label}
                </SidebarLink>
              ))}
            </nav>
          </div>
          
          <div className="space-y-4">
             <div className="border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-300 font-semibold">{user.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-slate-300 hover:bg-red-500/20 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Cerrar Sesión
            </Button>
          </div>
        </motion.aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <footer className="bg-slate-800/90 backdrop-blur-sm text-center p-3 border-t border-slate-700">
        <a 
          href="https://estudionexo.xyz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-slate-400 hover:text-brand-orange transition-colors"
        >
          Creado por Estudio Nexo
        </a>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;