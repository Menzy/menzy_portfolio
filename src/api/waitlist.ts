export async function joinWaitlist(email: string) {
  try {
    const response = await fetch('http://localhost:3001/api/waitlist', {
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