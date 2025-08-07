import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

app.post('/api/waitlist', async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});