import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../common/ConfirmDialog';
import { certificateApi } from '../../api/certificateApi';
import { errorMessage } from '../../api/apiClient';
import type { Employee } from '../../types/employee';

export default function GenerateCertificateDialog({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const confirm = async () => {
    if (!employee) return;
    setBusy(true);
    try {
      const cert = await certificateApi.generate(employee.id);
      toast.success('Certificate generated successfully');
      onClose();
      navigate(cert?.id !== undefined ? `/certificates/${cert.id}` : '/certificates');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!employee}
      title="Generate certificate"
      message={<>The backend will create and sign an employment Verifiable Credential for <strong>{employee?.name}</strong>. Continue?</>}
      confirmLabel="Generate"
      loading={busy}
      onConfirm={confirm}
      onCancel={onClose}
    />
  );
}
