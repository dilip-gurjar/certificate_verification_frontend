import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex flex-col items-center border-red-200 px-6 py-10 text-center">
      <AlertCircle className="mb-2 text-red-500" size={28} />
      <h3 className="text-sm font-semibold text-slate-900">Something went wrong</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
      {onRetry && (
        <button className="btn-secondary mt-4" onClick={onRetry}><RefreshCw size={16} /> Try again</button>
      )}
    </div>
  );
}
