import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error de Validación",
        description: "Por favor, ingresa email y contraseña.",
        variant: "destructive",
      });
      return;
    }
    const result = login(email, password);
    if (!result.success) {
      toast({
        title: "Error de Inicio de Sesión",
        description: result.message,
        variant: "destructive",
      });
    } else {
       toast({
        title: "Inicio de Sesión Exitoso",
        description: "Bienvenido!",
      });
      if (result.redirectTo) {
        navigate(result.redirectTo);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-slate-800/70 backdrop-blur-lg border-brand-orange/50 shadow-2xl shadow-brand-orange/30">
          <CardHeader className="text-center">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="mx-auto mb-4 p-3 bg-gradient-to-r from-brand-orange to-orange-600 rounded-full w-fit"
            >
              <LogIn className="h-10 w-10 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500">
              Iniciar Sesión en RTE
            </CardTitle>
            <CardDescription className="text-slate-400">
              Accede a tu panel de reclutamiento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:ring-brand-orange"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-brand-orange to-orange-600 hover:from-brand-orange-dark hover:to-orange-700 text-white font-semibold py-3 text-base transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-brand-orange/50"
              >
                Ingresar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center block">
             <a 
              href="https://estudionexo.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-slate-500 hover:text-brand-orange transition-colors"
            >
              Creado por Estudio Nexo
            </a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;