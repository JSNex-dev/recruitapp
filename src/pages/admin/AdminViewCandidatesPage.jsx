import React from 'react';
import { useData } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const downloadCSV = (data, users) => {
  const findUserName = (registrantId) => {
    const user = users.find(u => u.id === registrantId);
    return user ? user.name : 'Desconocido';
  };

  const headers = ["Fecha Registro", "Nombre", "Teléfono", "Municipio", "Escolaridad", "Cuenta", "Vacante", "Estatus", "Reclutador"];
  const rows = data.map(candidate => [
    candidate.registrationDate,
    candidate.nombre,
    candidate.telefono,
    candidate.municipio,
    candidate.escolaridad,
    candidate.cuenta,
    candidate.vacante,
    candidate.estatus,
    findUserName(candidate.registrantId) 
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "candidates_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const AdminViewCandidatesPage = () => {
  const { candidates, users, getUserById } = useData();

  const getRegistrantName = (registrantId) => {
    const user = getUserById(registrantId);
    return user ? user.name : 'N/A';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Users className="h-10 w-10 text-brand-orange" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
            Todos los Candidatos
          </h1>
        </div>
        <Button onClick={() => downloadCSV(candidates, users)} className="bg-brand-orange hover:bg-brand-orange-dark text-white">
          <Download className="mr-2 h-4 w-4" /> Exportar a CSV
        </Button>
      </div>

      <Card className="bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/20">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200">Lista de Candidatos Registrados</CardTitle>
          <CardDescription className="text-slate-400">
            Visualiza todos los candidatos en el sistema. Actualmente hay {candidates.length} candidatos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Fecha Reg.</TableHead>
                    <TableHead className="text-slate-300">Nombre</TableHead>
                    <TableHead className="text-slate-300">Teléfono</TableHead>
                    <TableHead className="text-slate-300">Municipio</TableHead>
                    <TableHead className="text-slate-300">Escolaridad</TableHead>
                    <TableHead className="text-slate-300">Cuenta</TableHead>
                    <TableHead className="text-slate-300">Vacante</TableHead>
                    <TableHead className="text-slate-300">Estatus</TableHead>
                    <TableHead className="text-slate-300">Registrado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-slate-400">{candidate.registrationDate || 'N/A'}</TableCell>
                      <TableCell className="font-medium text-slate-200">{candidate.nombre}</TableCell>
                      <TableCell className="text-slate-400">{candidate.telefono}</TableCell>
                      <TableCell className="text-slate-400">{candidate.municipio}</TableCell>
                      <TableCell className="text-slate-400">{candidate.escolaridad}</TableCell>
                      <TableCell className="text-slate-400">{candidate.cuenta}</TableCell>
                      <TableCell className="text-slate-400">{candidate.vacante}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold
                          ${candidate.estatus === 'Contratado' ? 'bg-green-500/70 text-green-100' : 
                            candidate.estatus === 'Rechazado' ? 'bg-red-500/70 text-red-100' :
                            candidate.estatus === 'Entrevistado' ? 'bg-yellow-500/70 text-yellow-100' :
                            'bg-sky-500/70 text-sky-100'}`}>
                          {candidate.estatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-400">{getRegistrantName(candidate.registrantId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No hay candidatos registrados aún.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminViewCandidatesPage;