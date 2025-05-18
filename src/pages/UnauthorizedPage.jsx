
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth.jsx';

const UnauthorizedPage = () => {
  const { user, ROLES } = useAuth();

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case ROLES.ADMIN: return "/admin";
      case ROLES.RECRUITER: return "/recruiter";
      case ROLES.INPLANT: return "/inplant";
      default: return "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-slate-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ShieldAlert className="h-24 w-24 text-red-400 mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
          Acceso Denegado
        </h1>
        <h2 className="text-2xl font-semibold mb-6 text-slate-300">
          No tienes permiso para acceder a esta página.
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
          Si crees que esto es un error, por favor contacta al administrador.
        </p>
        <Link to={getDashboardPath()}>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Volver a mi Panel
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
