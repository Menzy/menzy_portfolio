import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'EchoNote <noreply@wanmenzy.me>',
      to: [email],
      subject: 'Welcome to EchoNote Waitlist!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #012728; font-size: 28px; margin-bottom: 10px;">Welcome to EchoNote!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for joining our waitlist</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #012728; font-size: 20px; margin-bottom: 15px;">What's Next?</h2>
            <p style="color: #555; line-height: 1.6; margin-bottom: 15px;">
              You're now on the exclusive waitlist for EchoNote - the revolutionary voice-to-text app that transforms your speech into perfect text at the speed of thought.
            </p>
            <p style="color: #555; line-height: 1.6;">
              We'll notify you as soon as EchoNote is ready for early access. Get ready to experience unchained productivity!
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0;">
            <p style="color: #888; font-size: 14px;">Stay tuned for updates!</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}