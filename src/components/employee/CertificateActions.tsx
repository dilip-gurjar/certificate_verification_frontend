import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Download, Loader2, Share2 } from 'lucide-react';
import { employeePortalApi } from '../../api/employeePortalApi';
import { errorMessage } from '../../api/apiClient';
import { isEmployeeAuthenticated } from '../../utils/employeeAuth';
import { saveBlob } from '../../utils/download';

/** Only the public verification route plus the share token; nothing else goes into the URL. */
function buildShareUrl(shareToken?: string | null): string | null {
  const token = shareToken?.trim();
  return token ? `${window.location.origin}/verify/certificate/${encodeURIComponent(token)}` : null;
}

export default function CertificateActions({ shareToken }: { shareToken?: string | null }) {
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  const download = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const blob = await employeePortalApi.downloadCertificatePdf();
      saveBlob(blob, 'employment-certificate.pdf');
      toast.success('Certificate downloaded');
    } catch (e) {
      toast.error(errorMessage(e));
      // The API layer clears the employee session on 401; same redirect as the certificate page.
      if (!isEmployeeAuthenticated()) {
        navigate('/employee/login', { replace: true, state: { from: '/employee/certificate', expired: true } });
      }
    } finally {
      setDownloading(false);
    }
  };

  const copyLink = async (url: string) => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      setManualUrl(null);
      toast.success('Certificate link copied');
    } catch {
      setManualUrl(url);
      toast.error('Could not copy automatically. Copy the link below.');
    }
  };

  const share = async () => {
    if (sharing) return;
    const url = buildShareUrl(shareToken);
    if (!url) {
      toast.error('A share link is not available for this certificate yet.');
      return;
    }
    setSharing(true);
    try {
      if (typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: 'Employment Certificate', text: 'View my employment certificate', url });
          return;
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') return; // user closed the dialog
          // Any other share failure: fall back to copying the link.
        }
      }
      await copyLink(url);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary w-full sm:w-auto" onClick={() => void download()} disabled={downloading}>
          {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {downloading ? 'Downloading…' : 'Download Certificate'}
        </button>
        <button className="btn-secondary w-full sm:w-auto" onClick={() => void share()} disabled={sharing}>
          {sharing ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
          Share Certificate
        </button>
      </div>
      {manualUrl && (
        <input readOnly className="input font-mono text-xs" value={manualUrl} onFocus={(e) => e.currentTarget.select()} aria-label="Certificate link" />
      )}
    </div>
  );
}
