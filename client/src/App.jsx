import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PatientDashboard from './pages/patient/Dashboard';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import ZegoChatDemo from './pages/ZegoChatDemo';
import ConsultationSetup from './pages/ConsultationSetup';
export default function App(){
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/zego-chat-demo" element={<ZegoChatDemo />} />
      <Route path="/consultation" element={<ConsultationSetup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
