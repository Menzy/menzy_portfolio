export async function joinWaitlist(email: string) {
  try {
    // Use different URLs for development vs production
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:3001/api/waitlist'  // Dev: use your Express server
      : '/api/waitlist';  // Production: use Vercel function
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: result.error || 'Failed to join waitlist' };
    }

    return result;
  } catch (error) {
    console.error('Error in joinWaitlist:', error);
    return { success: false, error: 'Failed to connect to server' };
  }
}