import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EchoNavbar } from "@/components/EchoNavbar";
import Apple from '@/components/Apple';

export function EchoAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const [isReturning, setIsReturning] = useState(false);

  // Extract OAuth parameters from URL
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const state = searchParams.get('state');

  const handleReturnToApp = async () => {
    setIsReturning(true);
    
    try {
      // Prepare the data to send back to the local app
      const callbackData = {
        success: code && !error,
        code: code,
        error: error,
        errorDescription: errorDescription,
        state: state,
        timestamp: new Date().toISOString()
      };

      // Call the local EchoNote app
      await fetch('http://localhost:3000/return', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callbackData)
      });

      // Close the window after successful communication
      setTimeout(() => {
        window.close();
      }, 1000);
    } catch (err) {
      console.error('Failed to communicate with EchoNote app:', err);
    } finally {
      setIsReturning(false);
    }
  };



  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <EchoNavbar />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Click Below To Finish Login
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          Press the button below to successfully log back into EchoNote.
        </p>
        
        <Button
           onClick={handleReturnToApp}
           disabled={isReturning}
           size="lg"
           className="bg-green-600 hover:bg-green-700 text-white px-4 py-4 text-lg font-medium rounded-lg min-w-[200px]"
         >
           {isReturning ? (
             <>
               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
               Returning to App
             </>
           ) : (
             <>
                <Apple className="w-4 h-4 mr-2 text-white" />
                Return to App
              </>
           )}
         </Button>
        </div>
      </div>
    </div>
  );
}