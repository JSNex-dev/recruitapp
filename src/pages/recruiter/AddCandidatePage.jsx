import React from 'react';
import AddCandidateForm from '@/components/forms/AddCandidateForm';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const RecruiterAddCandidatePage = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 mb-8">
        Registrar Nuevo Candidato (Reclutador)
      </h1>
      <AddCandidateForm 
        roleSpecificLogic={{
          userId: user.id,
          role: user.role,
          onSuccess: () => console.log("Candidato registrado por Reclutador")
        }}
      />
    </motion.div>
  );
};

export default RecruiterAddCandidatePage;