import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, Building, BarChartHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '@/hooks/useData';

const StatCard = ({ title, value, icon, colorName }) => (
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
        {/* <p className="text-xs text-slate-500 mt-1">Desde el último mes</p> */}
      </CardContent>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const { candidates, users: allUsers, companies } = useData();
  const recruiters = allUsers.filter(u => u.role === 'recruiter').length;
  const inplants = allUsers.filter(u => u.role === 'inplant').length;


  return (
    <div className="space-y-8">
      <motion.h1 
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Panel de Administrador RTE
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Candidatos" value={candidates.length} icon={<Users />} colorName="brand-orange" />
        <StatCard title="Empresas" value={companies.length} icon={<Building />} colorName="sky" />
        <StatCard title="Reclutadores" value={recruiters} icon={<Users />} colorName="teal" />
        <StatCard title="Inplants" value={inplants} icon={<Users />} colorName="green" />
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
              <p className="ml-4 text-slate-500 text-lg">Gráficas de productividad por reclutador e inplant estarán disponibles aquí.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8"
      >
        <Card className="bg-slate-800/70 backdrop-blur-md border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-slate-200">Actividad Reciente (Placeholder)</CardTitle>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {[
                "Nuevo candidato 'Ana Pérez' registrado.",
                "Estado de 'Juan López' actualizado a 'Contratado'.",
                "Nueva empresa 'Innovatech Ltd.' añadida.",
              ].map((activity, index) => (
                <li key={index} className="text-sm text-slate-400 border-l-2 border-brand-orange pl-3 py-1 hover:bg-slate-700/50 rounded-r-md transition-colors">
                  {activity}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;