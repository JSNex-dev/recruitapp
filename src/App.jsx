import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import RecruiterDashboard from '@/pages/recruiter/RecruiterDashboard';
import InplantDashboard from '@/pages/inplant/InplantDashboard';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import { Toaster } from '@/components/ui/toaster';
import { motion, AnimatePresence } from 'framer-motion';

import RecruiterAddCandidatePage from '@/pages/recruiter/AddCandidatePage';
import InplantAddCandidatePage from '@/pages/inplant/AddCandidatePageInplant';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import ManageCompaniesPage from '@/pages/admin/ManageCompaniesPage';
import AddCandidateForm from '@/components/forms/AddCandidateForm';
import AdminViewCandidatesPage from '@/pages/admin/AdminViewCandidatesPage';
import InplantAssignedCandidatesPage from '@/pages/inplant/InplantAssignedCandidatesPage';

const PlaceholderComponent = ({ title }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl"
  >
    <h2 className="text-3xl font-semibold mb-4 text-brand-orange">{title}</h2>
    <p className="text-slate-400">Esta sección está en construcción. ¡Vuelve pronto!</p>
    <div className="mt-6 h-64 bg-slate-700/50 rounded-lg flex items-center justify-center">
      <p className="text-slate-500 text-lg">Gráficas y más detalles próximamente...</p>
    </div>
  </motion.div>
);

const AdminAddCandidatePage = () => {
   const { user } = useAuth();
   return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-4"
    >
       <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange via-orange-500 to-red-500 mb-8">
        Registrar Nuevo Candidato (Admin)
      </h1>
      <AddCandidateForm 
        roleSpecificLogic={{
          userId: user.id,
          role: user.role,
          onSuccess: () => console.log("Candidato registrado por Admin")
        }}
      />
    </motion.div>
  );
}


function AppRoutes() {
  const { ROLES } = useAuth();
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/candidates" element={<AdminViewCandidatesPage />} /> 
              <Route path="/admin/add-candidate" element={<AdminAddCandidatePage />} />
              <Route path="/admin/companies" element={<ManageCompaniesPage />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
              <Route path="/admin/reports" element={<PlaceholderComponent title="Reportes de Productividad (Admin)" />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER]} />}>
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/candidates" element={<PlaceholderComponent title="Mis Candidatos (Reclutador) - En desarrollo" />} />
              <Route path="/recruiter/add-candidate" element={<RecruiterAddCandidatePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={[ROLES.INPLANT]} />}>
              <Route path="/inplant" element={<InplantDashboard />} />
              <Route path="/inplant/assigned-candidates" element={<InplantAssignedCandidatesPage />} />
              <Route path="/inplant/add-candidate" element={<InplantAddCandidatePage />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;