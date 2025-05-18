import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, BarChartHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';


const StatCard = ({ title, value, icon, colorName, linkTo, linkText }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
  >
    <Card className={`bg-slate-800/70 backdrop-blur-md border-${colorName}-500/50 shadow-lg shadow-${colorName}-500/20`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        {React.cloneElement(icon, { className: `h-5 w-5 text-${colorName}-400` })}
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold text-${colorName}-400`}>{value}</div>
        {linkTo && (
          <Link to={linkTo}>
            <Button variant="link" className={`p-0 h-auto mt-2 text-xs text-${colorName}-400 hover:text-${colorName}-300`}>
              {linkText} &rarr;
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

const RecruiterDashboard = () => {
  const { candidates } = useData();
  const { user } = useAuth();

  // Filter candidates registered by the current recruiter
  const myCandidatesCount = candidates.filter(c => c.registrantId === user.id).length;
  const hiredByMeCount = candidates.filter(c => c.registrantId === user.id && c.estatus === 'Contratado').length;

  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Panel de Reclutador RTE
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Mis Candidatos Registrados" value={myCandidatesCount} icon={<Users />} colorName="brand-orange" linkTo="/recruiter/candidates" linkText="Ver mis candidatos"/>
        <StatCard title="Candidatos Contratados por mí" value={hiredByMeCount} icon={<Users />} colorName="green" />
        <StatCard title="Registrar Nuevo" value="+" icon={<UserPlus />} colorName="sky" linkTo="/recruiter/add-candidate" linkText="Añadir candidato"/>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-200">Mi Productividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <BarChartHorizontal className="h-16 w-16 text-brand-orange opacity-50" />
              <p className="ml-4 text-slate-500 text-lg">Gráficas de productividad personal estarán disponibles aquí.</p>
            </div>
             <Link to="/recruiter/add-candidate" className="mt-6 inline-block">
              <Button className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Registrar Nuevo Candidato
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RecruiterDashboard;