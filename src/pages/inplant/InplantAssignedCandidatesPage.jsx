import React, { useState } from 'react';
import { useData } from '@/hooks/useData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Briefcase, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const estatusCandidatoOptions = ["Citado", "Entrevistado", "Contratado", "Rechazado"];

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
  link.setAttribute("download", "inplant_candidates_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const InplantAssignedCandidatesPage = () => {
  const { candidates, users, updateCandidateStatus, getUserById } = useData();
  const { user: currentUser } = useAuth(); // Inplant user
  const { toast } = useToast();

  // For now, Inplant sees all candidates. Logic for assigned companies/candidates can be added later.
  // const assignedCandidates = candidates.filter(c => c.assigneeId === currentUser.id); // Example filter
  const inplantCandidates = candidates; // Showing all for now

  const handleStatusChange = (candidateId, newStatus) => {
    updateCandidateStatus(candidateId, newStatus);
    toast({
      title: "Estatus Actualizado",
      description: `El estatus del candidato ha sido actualizado a ${newStatus}.`,
      className: "bg-green-500 text-white",
    });
  };
  
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
          <Briefcase className="h-10 w-10 text-brand-orange" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
            Candidatos Asignados
          </h1>
        </div>
        <Button onClick={() => downloadCSV(inplantCandidates, users)} className="bg-brand-orange hover:bg-brand-orange-dark text-white">
          <Download className="mr-2 h-4 w-4" /> Exportar a CSV
        </Button>
      </div>

      <Card className="bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/20">
        <CardHeader>
          <CardTitle className="text-xl text-slate-200">Gestionar Estatus de Candidatos</CardTitle>
          <CardDescription className="text-slate-400">
            Actualiza el estatus de los candidatos asignados. Actualmente gestionando {inplantCandidates.length} candidatos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inplantCandidates.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Nombre</TableHead>
                    <TableHead className="text-slate-300">Cuenta</TableHead>
                    <TableHead className="text-slate-300">Vacante</TableHead>
                    <TableHead className="text-slate-300">Estatus Actual</TableHead>
                    <TableHead className="text-slate-300 w-[200px]">Actualizar Estatus</TableHead>
                    <TableHead className="text-slate-300">Registrado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inplantCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="font-medium text-slate-200">{candidate.nombre}</TableCell>
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
                      <TableCell>
                        <Select
                          defaultValue={candidate.estatus}
                          onValueChange={(newStatus) => handleStatusChange(candidate.id, newStatus)}
                        >
                          <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white focus:ring-brand-orange">
                            <SelectValue placeholder="Cambiar estatus" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-700 text-white border-slate-600">
                            {estatusCandidatoOptions.map(status => (
                              <SelectItem key={status} value={status} className="hover:bg-brand-orange">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                       <TableCell className="text-slate-400">{getRegistrantName(candidate.registrantId)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8">No hay candidatos asignados para gestionar.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InplantAssignedCandidatesPage;