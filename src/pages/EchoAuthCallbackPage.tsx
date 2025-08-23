import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EchoNavbar } from '@/components/EchoNavbar';

export function EchoAuthCallbackPage() {
  const [status, setStatus] = useState<'idle' | 'contacting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const postToApp = useCallback(async () => {
    setStatus('contacting');
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:3000/auth/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callbackUrl: window.location.href })
      });

      if (!res.ok) {
        throw new Error(`Local app responded with ${res.status}`);
      }

      setStatus('success');

      // Auto-close after short delay (optional)
      setTimeout(() => {
        // Some browsers block window.close() if tab not opened via script;
        // user can still close manually if it doesn't work.
        window.close();
      }, 600);
    } catch (err: unknown) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setErrorMsg(
        errorMessage ||
          'Could not contact the EchoNote app. Please ensure the app is running.'
      );
    }
  }, []);

  // Auto-trigger on mount
  useEffect(() => {
    postToApp();
  }, [postToApp]);

  const isLoading = status === 'contacting';

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <EchoNavbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Finishing Sign-In
          </h1>

            {status === 'idle' || status === 'contacting' ? (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Connecting securely to the EchoNote app...
              </p>
            ) : status === 'success' ? (
              <p className="text-lg text-green-600 dark:text-green-400 mb-8">
                Success! You can close this tab.
              </p>
            ) : (
              <p className="text-lg text-red-600 dark:text-red-400 mb-4">
                {errorMsg}
              </p>
            )}

          <div className="flex flex-col items-center space-y-3">
            <Button
              onClick={postToApp}
              disabled={isLoading || status === 'success'}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 text-lg font-medium rounded-lg min-w-[220px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Contacting App...
                </>
              ) : status === 'success' ? (
                'Authenticated'
              ) : status === 'error' ? (
                'Retry Connection'
              ) : (
                'Return to App'
              )}
            </Button>

            {status === 'error' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Make sure the EchoNote app is open (it starts a local server on port 3000).
              </p>
            )}
          </div>

          {/* Optional debug info (remove in production) */}
          {/* <pre className="mt-6 text-xs text-gray-400 break-all">
            {window.location.href}
          </pre> */}
        </div>
      </div>
    </div>
  );
}