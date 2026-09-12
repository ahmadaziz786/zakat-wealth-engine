import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { feedbackType, message, userEmail, currentInputs } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Zakat Engine Feedback" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `[Zakat Engine Feedback] - ${feedbackType}`,
      text: `Type: ${feedbackType}\nUser Email: ${userEmail || 'Anonymous'}\n\nMessage:\n${message}\n\nState Snapshot:\n${JSON.stringify(currentInputs, null, 2)}`
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Feedback email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
