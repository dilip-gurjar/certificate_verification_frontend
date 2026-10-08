import { Link, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Employees from '../pages/Employees/Employees';
import EmployeeDetails from '../pages/EmployeeDetails/EmployeeDetails';
import CreateEmployee from '../pages/CreateEmployee/CreateEmployee';
import EditEmployee from '../pages/EditEmployee/EditEmployee';
import Certificates from '../pages/Certificates/Certificates';
import CertificateDetails from '../pages/CertificateDetails/CertificateDetails';
import GenerateCertificate from '../pages/GenerateCertificate/GenerateCertificate';
import Verification from '../pages/Verification/Verification';
import PublicVerification from '../pages/Verification/PublicVerification';
import SharedCertificateVerification from '../pages/Verification/SharedCertificateVerification';
import EmployeeLayout from '../components/employee/EmployeeLayout';
import EmployeeAuthGuard from '../components/employee/EmployeeAuthGuard';
import EmployeePortal from '../pages/EmployeePortal/EmployeePortal';
import EmployeeLogin from '../pages/EmployeeLogin/EmployeeLogin';
import EmployeeCertificate from '../pages/EmployeeCertificate/EmployeeCertificate';
import AdminAuthGuard from '../components/admin/AdminAuthGuard';
import AdminLogin from '../pages/AdminLogin/AdminLogin';
import AdminForgotPassword from '../pages/AdminForgotPassword/AdminForgotPassword';
import AdminResetPassword from '../pages/AdminResetPassword/AdminResetPassword';

function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-6">Go to dashboard</Link>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/verify/:certificateId" element={<PublicVerification />} />
      <Route path="/verify/certificate/:shareToken" element={<SharedCertificateVerification />} />

      {/* Employee portal (separate layout + separate auth from the admin side) */}
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<Navigate to="login" replace />} />
        <Route path="login" element={<EmployeeLogin />} />
        <Route path="certificate" element={<EmployeeAuthGuard><EmployeeCertificate /></EmployeeAuthGuard>} />
        <Route path=":token" element={<EmployeePortal />} />
      </Route>

      {/* Admin authentication (public) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
      <Route path="/admin" element={<Navigate to="/" replace />} />

      {/* Existing admin panel, now behind the admin auth guard */}
      <Route element={<AdminAuthGuard><AppLayout /></AdminAuthGuard>}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="employees/new" element={<CreateEmployee />} />
        <Route path="employees/:id" element={<EmployeeDetails />} />
        <Route path="employees/:id/edit" element={<EditEmployee />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="certificates/generate" element={<GenerateCertificate />} />
        <Route path="certificates/:id" element={<CertificateDetails />} />
        <Route path="verification" element={<Verification />} />
        <Route path="verification/:id" element={<Verification />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
