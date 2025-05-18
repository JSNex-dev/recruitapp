import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, Save, Users } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/hooks/useAuth';

const ManageUsersPage = () => {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: ''
    }
  });
  const { toast } = useToast();
  const { addUser, users: existingUsers } = useData(); 
  const { ROLES } = useAuth();

  const onSubmit = (data) => {
    addUser({ ...data, password: "password" }); 
    toast({
      title: "Usuario Creado",
      description: `El usuario ${data.name} (${data.role}) ha sido creado.`,
      className: "bg-green-500 text-white",
    });
    reset();
  };
  
  const roleOptions = [
    { value: ROLES.RECRUITER, label: "Reclutador" },
    { value: ROLES.INPLANT, label: "Inplant" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-2">
          Gestión de Usuarios
        </h1>
        <p className="text-slate-400">Añade nuevos usuarios o visualiza los existentes.</p>
      </div>

      <Card className="w-full max-w-xl mx-auto bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/30">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <UserPlus className="h-8 w-8 text-brand-orange" />
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
              Añadir Nuevo Usuario
            </CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Crea cuentas para reclutadores e inplants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-slate-300">Nombre Completo</Label>
              <Input id="name" {...register("name", { required: "El nombre es obligatorio" })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <Input id="email" type="email" {...register("email", { required: "El email es obligatorio", pattern: { value: /^\S+@\S+$/i, message: "Email inválido" } })} className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange mt-1" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Label htmlFor="role" className="text-slate-300">Rol</Label>
              <Controller name="role" control={control} rules={{ required: "El rol es obligatorio" }} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white mt-1 focus:ring-brand-orange">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 text-white border-slate-600">
                    {roleOptions.map(option => <SelectItem key={option.value} value={option.value} className="hover:bg-brand-orange">{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
              {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white font-semibold py-3 text-base transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-brand-orange/50 mt-4">
              <Save className="mr-2 h-5 w-5" />
              Crear Usuario
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="w-full bg-slate-800/70 backdrop-blur-lg border-sky-500/50 shadow-2xl shadow-sky-500/30">
        <CardHeader>
           <div className="flex items-center space-x-3 mb-2">
            <Users className="h-8 w-8 text-sky-400" />
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-500 to-blue-500">
              Usuarios Existentes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {existingUsers.length > 0 ? (
            <ul className="space-y-3">
              {existingUsers.map(u => (
                <li key={u.id} className="p-3 bg-slate-700/50 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email} - <span className="capitalize">{u.role}</span></p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${u.role === ROLES.ADMIN ? 'bg-red-500/70 text-red-100' : u.role === ROLES.RECRUITER ? 'bg-teal-500/70 text-teal-100' : 'bg-emerald-500/70 text-emerald-100'}`}>
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No hay usuarios registrados además del administrador.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ManageUsersPage;