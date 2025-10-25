import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const { feedback, email, screenshot, url, userAgent, timestamp } = body || {};

    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      return NextResponse.json({ error: 'Feedback text is required' }, { status: 400 });
    }

    // Use Resend API for sending emails (you'll need to set up Resend.com)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL || 'your@email.com'; // Your email

    if (!RESEND_API_KEY) {
      // Fallback: Log to console if no email service configured
      console.log('=== NEW FEEDBACK ===');
      console.log('Feedback:', feedback);
      console.log('Email:', email || 'Not provided');
      console.log('URL:', url);
      console.log('User Agent:', userAgent);
      console.log('Timestamp:', timestamp);
      console.log('Screenshot:', screenshot ? 'Included' : 'Not included');
      console.log('==================');

      // Return success even without email (so user doesn't see error)
      return NextResponse.json({
        success: true,
        message: 'Feedback logged (email service not configured)'
      });
    }

    // Send email via Resend
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #1f2937; }
            .value { margin-top: 5px; padding: 10px; background: white; border-left: 4px solid #3b82f6; }
            .screenshot { margin-top: 20px; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📬 New Feedback from CivicPrep</h2>
            </div>
            <div class="content">
              <div class="section">
                <div class="label">Feedback:</div>
                <div class="value">${feedback.replace(/\n/g, '<br>')}</div>
              </div>

              ${email ? `
                <div class="section">
                  <div class="label">User Email:</div>
                  <div class="value">${email}</div>
                </div>
              ` : ''}

              <div class="section">
                <div class="label">Page URL:</div>
                <div class="value"><a href="${url}">${url}</a></div>
              </div>

              <div class="section">
                <div class="label">Timestamp:</div>
                <div class="value">${new Date(timestamp).toLocaleString()}</div>
              </div>

              <div class="section">
                <div class="label">User Agent:</div>
                <div class="value" style="font-size: 11px;">${userAgent}</div>
              </div>

              ${screenshot ? `
                <div class="screenshot">
                  <div class="label">Screenshot:</div>
                  <img src="${screenshot}" alt="Screenshot" style="max-width: 100%; margin-top: 10px; border: 1px solid #e5e7eb; border-radius: 4px;">
                </div>
              ` : ''}
            </div>
            <div class="footer">
              Sent from CivicPrep Feedback Widget
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CivicPrep Feedback <noreply@civicprep.com>', // Update with your domain
        to: [FEEDBACK_EMAIL],
        subject: `📬 New Feedback: ${feedback.substring(0, 50)}...`,
        html: emailHtml,
        reply_to: email || undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API error:', errorData);
      throw new Error('Failed to send email via Resend');
    }

    return NextResponse.json({ success: true, message: 'Feedback sent successfully' });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to send feedback', details: error.message },
      { status: 500 }
    );
  }
}
