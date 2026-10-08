import { useCallback, useState } from 'react';
import { certificateApi } from '../api/certificateApi';
import { errorMessage } from '../api/apiClient';
import type { Id, VerificationResult } from '../types/certificate';

export type VerifyStatus = 'idle' | 'loading' | 'done' | 'error';

export interface VerifyState {
  status: VerifyStatus;
  result?: VerificationResult;
  error?: string;
}

/** Calls GET /certificate/{id}/verify. The frontend never verifies proofs itself. */
export function useVerify() {
  const [state, setState] = useState<VerifyState>({ status: 'idle' });

  const run = useCallback(async (id: Id) => {
    setState({ status: 'loading' });
    try {
      const result = await certificateApi.verify(id);
      setState({ status: 'done', result });
      return result;
    } catch (e) {
      setState({ status: 'error', error: errorMessage(e) });
      return null;
    }
  }, []);

  return { ...state, run };
}
