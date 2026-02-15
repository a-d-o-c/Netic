import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface Match {
  title: string
  price: number | null
  url: string | null
  location: string | null
  source: string
}

export async function sendMatchNotification(
  email: string,
  wantTitle: string,
  matches: Match[]
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Netic <notifications@netic.app>',
      to: email,
      subject: `🧲 Netic found ${matches.length} match${matches.length !== 1 ? 'es' : ''} for "${wantTitle}"`,
      html: generateMatchEmailHTML(wantTitle, matches),
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error }
  }
}

function generateMatchEmailHTML(wantTitle: string, matches: Match[]): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .match-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 15px;
        }
        .match-title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 10px;
        }
        .match-details {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          background: #8b5cf6;
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          color: #9ca3af;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px;">🧲 Netic</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">What you want, finds you</p>
      </div>
      
      <div class="content">
        <h2 style="color: #111827; margin-top: 0;">Great news!</h2>
        <p style="color: #4b5563; font-size: 16px;">
          We found <strong>${matches.length} match${matches.length !== 1 ? 'es' : ''}</strong> for your want: <strong>"${wantTitle}"</strong>
        </p>
        
        ${matches.map(match => `
          <div class="match-card">
            <div class="match-title">${match.title}</div>
            <div class="match-details">
              ${match.price ? `💰 $${match.price}` : ''}
              ${match.location ? `📍 ${match.location}` : ''}
              ${match.source ? `<br>Source: ${match.source.toUpperCase()}` : ''}
            </div>
            ${match.url ? `
              <a href="${match.url}" class="button">View Listing →</a>
            ` : ''}
          </div>
        `).join('')}
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Happy hunting! Netic will keep searching and notify you when we find more matches.
        </p>
      </div>
      
      <div class="footer">
        <p>You're receiving this because you posted a want on Netic.</p>
        <p>🧲 Netic - Built with love in New Zealand</p>
      </div>
    </body>
    </html>
  `
}

export async function sendOfferNotification(
  email: string,
  wantTitle: string,
  offererName: string,
  offererEmail: string,
  message: string | null
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Netic <notifications@netic.app>',
      to: email,
      subject: `💚 Someone has what you want: "${wantTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f0fdf4;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .offer-card {
              background: white;
              border: 2px solid #10b981;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">💚 Great News!</h1>
          </div>
          
          <div class="content">
            <p style="font-size: 16px;">
              <strong>${offererName}</strong> has what you're looking for: <strong>"${wantTitle}"</strong>
            </p>
            
            <div class="offer-card">
              <p><strong>Contact:</strong> ${offererEmail}</p>
              ${message ? `<p><strong>Message:</strong> "${message}"</p>` : ''}
            </div>
            
            <p style="color: #065f46;">
              Reach out to them directly to arrange pickup or delivery!
            </p>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Error sending offer email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Failed to send offer email:', error)
    return { success: false, error }
  }
}
