import { Link } from 'react-router-dom';
import { Award, Eye, FilePlus2, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import type { Employee } from '../../types/employee';
import type { Certificate } from '../../types/certificate';

interface Props {
  employee: Employee;
  cert: Certificate | null;
  onDelete: (e: Employee) => void;
  onGenerate: (e: Employee) => void;
}

export default function EmployeeActions({ employee, cert, onDelete, onGenerate }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      <Link className="icon-btn" to={`/employees/${employee.id}`} title="View" aria-label="View"><Eye size={16} /></Link>
      <Link className="icon-btn" to={`/employees/${employee.id}/edit`} title="Edit" aria-label="Edit"><Pencil size={16} /></Link>
      {cert ? (
        <>
          <Link className="icon-btn" to={`/certificates/${cert.id}`} title="View certificate" aria-label="View certificate"><Award size={16} /></Link>
          <Link className="icon-btn" to={`/verification/${cert.id}`} title="Verify certificate" aria-label="Verify certificate"><ShieldCheck size={16} /></Link>
        </>
      ) : (
        <button className="icon-btn" onClick={() => onGenerate(employee)} title="Generate certificate" aria-label="Generate certificate"><FilePlus2 size={16} /></button>
      )}
      <button className="icon-btn hover:text-red-600" onClick={() => onDelete(employee)} title="Delete" aria-label="Delete"><Trash2 size={16} /></button>
    </div>
  );
}
