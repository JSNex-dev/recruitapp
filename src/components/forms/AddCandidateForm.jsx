import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, Save } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';

const municipios = ["Monterrey", "Guadalupe", "San Nicolás", "Apodaca", "Escobedo", "Santa Catarina", "Juárez", "García", "Otro"];
const escolaridades = ["Primaria", "Secundaria", "Preparatoria", "Técnico", "Licenciatura", "Maestría", "Doctorado"];
const estatusCandidato = ["Citado", "Entrevistado", "Contratado", "Rechazado"];

const AddCandidateForm = ({ roleSpecificLogic }) => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      nombre: '',
      telefono: '',
      municipio: '',
      escolaridad: '',
      cuenta: '',
      vacante: '',
      estatus: 'Citado'
    }
  });
  const { toast } = useToast();
  const { addCandidate, companies } = useData();
  const { user } = useAuth();

  const onSubmit = (data) => {
    const candidateData = {
      ...data,
      registrantId: user.id, 
      registrantRole: user.role,
      registrationDate: new Date().toISOString().split('T')[0] 
    };
    addCandidate(candidateData);
    toast({
      title: "Candidato Registrado",
      description: `El candidato ${data.nombre} ha sido registrado exitosamente.`,
      className: "bg-green-500 text-white",
    });
    reset();
    if(roleSpecificLogic && roleSpecificLogic.onSuccess) {
      roleSpecificLogic.onSuccess();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/30">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <UserPlus className="h-8 w-8 text-brand-orange" />
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
              Registrar Nuevo Candidato
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Completa los siguientes campos para añadir un nuevo candidato al sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="nombre" className="text-slate-300">Nombre Completo</Label>
              <Input id="nombre" {...register("nombre", { required: "El nombre es obligatorio" })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
              {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre.message}</p>}
            </div>

            <div>
              <Label htmlFor="telefono" className="text-slate-300">Teléfono</Label>
              <Input id="telefono" type="tel" {...register("telefono", { required: "El teléfono es obligatorio", pattern: {value: /^[0-9]{10}$/, message: "Teléfono inválido (10 dígitos)"} })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
              {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="municipio" className="text-slate-300">Municipio</Label>
                 <Controller name="municipio" control={control} rules={{ required: "El municipio es obligatorio" }} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-brand-orange">
                      <SelectValue placeholder="Selecciona un municipio" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white border-slate-600">
                      {municipios.map(m => <SelectItem key={m} value={m} className="hover:bg-brand-orange">{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {errors.municipio && <p className="text-red-400 text-xs mt-1">{errors.municipio.message}</p>}
              </div>

              <div>
                <Label htmlFor="escolaridad" className="text-slate-300">Escolaridad</Label>
                <Controller name="escolaridad" control={control} rules={{ required: "La escolaridad es obligatoria" }} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-brand-orange">
                      <SelectValue placeholder="Selecciona escolaridad" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 text-white border-slate-600">
                      {escolaridades.map(e => <SelectItem key={e} value={e} className="hover:bg-brand-orange">{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
                {errors.escolaridad && <p className="text-red-400 text-xs mt-1">{errors.escolaridad.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="cuenta" className="text-slate-300">Cuenta / Empresa</Label>
               <Controller name="cuenta" control={control} rules={{ required: "La cuenta es obligatoria" }} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-brand-orange">
                    <SelectValue placeholder="Selecciona una cuenta" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white border-slate-600">
                    {companies.map(c => <SelectItem key={c.id} value={c.name} className="hover:bg-brand-orange">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
              {errors.cuenta && <p className="text-red-400 text-xs mt-1">{errors.cuenta.message}</p>}
            </div>

            <div>
              <Label htmlFor="vacante" className="text-slate-300">Vacante Aplicada</Label>
              <Input id="vacante" {...register("vacante", { required: "La vacante es obligatoria" })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
              {errors.vacante && <p className="text-red-400 text-xs mt-1">{errors.vacante.message}</p>}
            </div>

            <div>
              <Label htmlFor="estatus" className="text-slate-300">Estatus Inicial</Label>
               <Controller name="estatus" control={control} rules={{ required: "El estatus es obligatorio" }} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} >
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-brand-orange">
                    <SelectValue placeholder="Selecciona un estatus" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white border-slate-600">
                    {estatusCandidato.map(e => <SelectItem key={e} value={e} className="hover:bg-brand-orange">{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
              {errors.estatus && <p className="text-red-400 text-xs mt-1">{errors.estatus.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white font-semibold py-3 text-base transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-brand-orange/50 mt-4">
              <Save className="mr-2 h-5 w-5" />
              Guardar Candidato
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddCandidateForm;