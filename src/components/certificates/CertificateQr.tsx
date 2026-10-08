import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import CopyText from '../common/CopyText';
import type { Id } from '../../types/certificate';

/** QR points to the frontend public verification route; it contains only the certificate ID. */
export default function CertificateQr({ certificateId }: { certificateId: Id }) {
  const url = `${window.location.origin}/verify/${certificateId}`;
  return (
    <div className="card p-5">
      <h3 className="mb-4 inline-flex items-center gap-2 text-sm font-semibold"><QrCode size={18} /> Public verification</h3>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="rounded-lg border border-slate-200 bg-white p-3"><QRCodeSVG value={url} size={120} /></div>
        <div className="min-w-0 space-y-2 text-sm text-slate-500">
          <p>Anyone can scan this code to open the public verification page for this certificate.</p>
          <CopyText value={url} truncate={false} />
          <div>
            <Link to={`/verify/${certificateId}`} target="_blank" className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:underline">
              Open public page <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
