import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, Edit3, BarChartHorizontal, UserPlus } from 'lucide-react';
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

const InplantDashboard = () => {
  const { candidates } = useData();
  const { user } = useAuth();

  // Simplified logic for demonstration
  const assignedCandidatesCount = candidates.length; // In a real app, filter by assignment
  const pendingUpdateCount = candidates.filter(c => c.estatus === "Citado" || c.estatus === "Entrevistado").length;
  const hiredThisMonthCount = candidates.filter(c => c.estatus === "Contratado").length; // Needs date filtering for "this month"

  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Panel de Inplant RTE
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Candidatos Asignados" value={assignedCandidatesCount} icon={<Users />} colorName="brand-orange" linkTo="/inplant/assigned-candidates" linkText="Ver candidatos"/>
        <StatCard title="Estatus por Actualizar" value={pendingUpdateCount} icon={<Edit3 />} colorName="yellow" />
        <StatCard title="Contratados (Total)" value={hiredThisMonthCount} icon={<CheckSquare />} colorName="green" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-200">Gráficas de Productividad</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <BarChartHorizontal className="h-16 w-16 text-brand-orange opacity-50" />
              <p className="ml-4 text-slate-500 text-lg">Gráficas de productividad estarán disponibles aquí.</p>
            </div>
            <Link to="/inplant/add-candidate" className="mt-6 inline-block">
              <Button className="bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" /> Registrar Candidato
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default InplantDashboard;