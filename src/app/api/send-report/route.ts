import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, pdfBase64, auditId, finalZakat } = await req.json();

    if (!email || !pdfBase64) {
      return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
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
      from: `"Modern Zakat Engine" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Certified AAOIFI Zakat & Wealth Audit Report [${auditId}]`,
      html: `<div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px;">
        <h2 style="color: #34d399; margin-top: 0;">Certified Zakat Audit Report Attached</h2>
        <p>Assalamu Alaikum,</p>
        <p>Thank you for using Modern Zakat Engine. Your payment of <strong>₹799</strong> has been verified.</p>
        <p><strong>Audit Reference ID:</strong> ${auditId}</p>
        <p><strong>Total Zakat Due:</strong> ${finalZakat}</p>
        <p style="color: #94a3b8; font-size: 13px;">Your official 3-page AAOIFI Standard No. 35 compliant audit report is attached as a PDF.</p>
      </div>`,
      attachments: [
        {
          filename: `Zakat_Audit_Report_${auditId}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
