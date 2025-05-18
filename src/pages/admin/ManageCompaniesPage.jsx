import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building, Save, Users } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ManageCompaniesPage = () => {
  const { register, handleSubmit, reset: resetCompanyForm, formState: { errors: companyErrors } } = useForm({defaultValues: {name: ''}});
  const { handleSubmit: handleSubmitAssignment, control: controlAssignment, reset: resetAssignmentForm, formState: { errors: assignmentErrors } } = useForm({defaultValues: {companyId: '', inplantId: ''}});
  
  const { toast } = useToast();
  const { companies, addCompany, users } = useData();
  const [assignments, setAssignments] = useState(JSON.parse(localStorage.getItem('companyAssignments')) || []);

  const inplants = users.filter(u => u.role === 'inplant');

  const onAddCompanySubmit = (data) => {
    addCompany(data);
    toast({
      title: "Empresa Añadida",
      description: `La empresa ${data.name} ha sido añadida.`,
      className: "bg-green-500 text-white",
    });
    resetCompanyForm();
  };

  const onAssignCompanySubmit = (data) => {
    const companyDetails = companies.find(c => c.name === data.companyId);
    const inplantDetails = users.find(u => u.name === data.inplantId);

    if (!companyDetails || !inplantDetails) {
        toast({
            title: "Error de Asignación",
            description: "Empresa o Inplant no encontrado.",
            variant: "destructive",
        });
        return;
    }

    const newAssignment = { 
        id: `assign-${Date.now()}`, 
        companyName: companyDetails.name, 
        companyId: companyDetails.id,
        inplantName: inplantDetails.name,
        inplantId: inplantDetails.id
    };
    const updatedAssignments = [...assignments, newAssignment];
    setAssignments(updatedAssignments);
    localStorage.setItem('companyAssignments', JSON.stringify(updatedAssignments));
    toast({
      title: "Empresa Asignada",
      description: `Empresa ${newAssignment.companyName} asignada a Inplant ${newAssignment.inplantName}.`,
      className: "bg-blue-500 text-white",
    });
    resetAssignmentForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-2">
          Gestión de Empresas
        </h1>
        <p className="text-slate-400">Añade nuevas empresas y asígnalas a los Inplants.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="w-full bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/30">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <Building className="h-8 w-8 text-brand-orange" />
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
                Añadir Nueva Empresa
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onAddCompanySubmit)} className="space-y-6">
              <div>
                <Label htmlFor="companyName" className="text-slate-300">Nombre de la Empresa</Label>
                <Input id="companyName" {...register("name", { required: "El nombre de la empresa es obligatorio" })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
                {companyErrors.name && <p className="text-red-400 text-xs mt-1">{companyErrors.name.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white font-semibold py-3 text-base">
                <Save className="mr-2 h-5 w-5" />
                Añadir Empresa
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="w-full bg-slate-800/70 backdrop-blur-lg border-sky-500/50 shadow-2xl shadow-sky-500/30">
          <CardHeader>
             <div className="flex items-center space-x-3 mb-2">
              <Users className="h-8 w-8 text-sky-400" />
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-500">
                Asignar Empresa a Inplant
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAssignment(onAssignCompanySubmit)} className="space-y-6">
              <div>
                <Label htmlFor="companyIdAssign" className="text-slate-300">Empresa</Label>
                <Controller name="companyId" control={controlAssignment} rules={{ required: "Selecciona una empresa" }} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="companyIdAssign" className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-sky-500">
                      <SelectValue placeholder="Selecciona una empresa" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white border-slate-600">
                      {companies.map(c => <SelectItem key={c.id} value={c.name} className="hover:bg-sky-500">{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {assignmentErrors.companyId && <p className="text-red-400 text-xs mt-1">{assignmentErrors.companyId.message}</p>}
              </div>
              <div>
                <Label htmlFor="inplantIdAssign" className="text-slate-300">Inplant</Label>
                 <Controller name="inplantId" control={controlAssignment} rules={{ required: "Selecciona un inplant" }} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="inplantIdAssign" className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-sky-500">
                      <SelectValue placeholder="Selecciona un inplant" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white border-slate-600">
                      {inplants.map(i => <SelectItem key={i.id} value={i.name} className="hover:bg-sky-500">{i.name} ({i.email})</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {assignmentErrors.inplantId && <p className="text-red-400 text-xs mt-1">{assignmentErrors.inplantId.message}</p>}
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 text-base">
                <Save className="mr-2 h-5 w-5" />
                Asignar Empresa
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full bg-slate-800/70 backdrop-blur-lg border-emerald-500/50 shadow-2xl shadow-emerald-500/30 mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-emerald-300">Empresas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          {companies.length > 0 ? (
            <ul className="space-y-2">
              {companies.map(c => (
                <li key={c.id} className="p-3 bg-slate-700/50 rounded-lg text-slate-300">{c.name}</li>
              ))}
            </ul>
          ) : <p className="text-slate-400">No hay empresas registradas.</p>}
        </CardContent>
      </Card>

       <Card className="w-full bg-slate-800/70 backdrop-blur-lg border-yellow-500/50 shadow-2xl shadow-yellow-500/30 mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-yellow-300">Asignaciones Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <ul className="space-y-2">
              {assignments.map(a => (
                <li key={a.id} className="p-3 bg-slate-700/50 rounded-lg text-slate-300">
                  Empresa: <span className="font-semibold">{a.companyName}</span> asignada a Inplant: <span className="font-semibold">{a.inplantName}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-400">No hay asignaciones activas.</p>}
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default ManageCompaniesPage;