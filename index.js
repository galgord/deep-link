const express = require('express');
const app = express();

// Constants
const APP_SCHEME_IOS = 'presence-copilot-development';
const APP_STORE_URL = 'https://apps.apple.com/us/app/your-app/id1234567890';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.your.package.name';
const APP_SCHEME_ANDROID = 'presence-copilot-development';

// Utility function to encode text for HTML
const encodeText = (text) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Function to generate the HTML content with dynamic OG tags and app redirect
const getStyledHtml = (platform, params) => {
  let appUrl = '';
  let appScheme = '';

  if (platform === 'ios') {
    appUrl = APP_STORE_URL;
    appScheme = APP_SCHEME_IOS;
  } else if (platform === 'android') {
    appUrl = PLAY_STORE_URL;
    appScheme = APP_SCHEME_ANDROID;
  } else {
    return 'Unsupported platform.'; // Handle unsupported platforms elsewhere
  }

  // Extract parameters from the query string
  const name = params.name;
  const createdBy = params.createdBy;
  const imageUrl = params.imageUrl || 'https://via.placeholder.com/150'; // Default image URL

  const deepLink = `${appScheme}://deep-linking?${new URLSearchParams(params).toString()}`;
  console.log('Generated Deep Link:', deepLink);

  // Updated base URL with your domain
  const baseUrl = 'http://wgw.luxurycoders.com';

  return `<!DOCTYPE html>
    <html>
    <head>
        <title>${encodeText(`Collaborate on ${name}`)}</title>
        <meta property="og:title" content="${encodeText(`Collaborate on ${name}`)}">
        <meta property="og:description" content="${encodeText(`Created by ${createdBy}`)}">
        <meta property="og:image" content="${encodeText(imageUrl)}">
        <meta property="og:url" content="${encodeText(
          `${baseUrl}?${new URLSearchParams(params).toString()}`
        )}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="${encodeText('Copilot App')}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            /* Modern, clean styling inspired by Accept Invite 2.0 */
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f7; /* Light gray background */
                color: #1c1c1e; /* Dark text */
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }

            .container {
                background-color: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                padding: 40px;
                max-width: 400px;
                width: 90%;
                margin: 20px;
            }

            h1 {
                font-size: 1.8em;
                font-weight: 600;
                margin-bottom: 10px;
                color: #1c1c1e;
            }

            .subtitle {
                font-size: 1.1em;
                color: #666;
                margin-bottom: 30px;
            }

            .creator {
                font-size: 0.9em;
                color: #888;
                margin-bottom: 40px;
            }

            .image-placeholder {
                width: 100%;
                height: 150px;
                background-color: #e0e0e0;
                border-radius: 12px;
                margin-bottom: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #888;
                font-size: 1em;
            }

            .button {
                display: inline-block;
                padding: 14px 28px;
                background-color: #007aff; /* iOS blue */
                color: #fff;
                text-decoration: none;
                border-radius: 12px;
                font-size: 1em;
                font-weight: 500;
                transition: background-color 0.3s ease;
                width: 100%;
                box-sizing: border-box;
                text-align: center;
                margin-bottom: 15px;
            }

            .button:hover {
                background-color: #0063cc; /* Darker blue */
            }

            .continue-link {
                display: inline-block;
                color: #007aff;
                text-decoration: none;
                font-weight: 500;
                font-size: 0.9em;
            }

            .continue-link:hover {
                text-decoration: underline;
            }

            .footer {
                margin-top: 30px;
                font-size: 0.8em;
                color: #888;
            }

            /* Add some spacing for mobile */
            @media (max-width: 600px) {
                .container {
                    padding: 30px;
                    margin: 10px;
                }

                h1 {
                    font-size: 1.5em;
                }

                .subtitle {
                    font-size: 1em;
                }

                .button {
                    padding: 12px 24px;
                    font-size: 0.9em;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>${encodeText(`Collaborate on ${name}`)}</h1>
            <div class="subtitle">Created by ${encodeText(createdBy)}</div>
            <div class="image-placeholder"><img src="${encodeText(
              imageUrl
            )}" alt="Preview Image" style="max-width: 100%; max-height: 100%;"></div>
            <a href="${deepLink}" class="button">Download the iOS App</a>
            <a href="${encodeText(
              'https://copilot-staging.app.link'
            )}" class="continue-link">Continue in browser</a>
            <div class="footer">gianmancuso.lp.com</div>
        </div>

        <script>
         function openApp() {
            console.log("openApp function called");
            console.log("Deep link URL:", "${deepLink}");
            window.location.href = "${deepLink}";
            setTimeout(function() {
                console.log("Redirecting to app store after timeout");
                window.location.href = "${appUrl}";
            }, 1500);
        }
     document.addEventListener('DOMContentLoaded', function() {
    openApp();
  });
        </script>
    </body>
    </html>`;
};

// Main route handler
app.get('/', async (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const params = req.query;

    console.log('Request received with params:', params, 'User-Agent:', userAgent);

    let platform = '';

    if (isIOS) {
      platform = 'ios';
    } else if (isAndroid) {
      platform = 'android';
    } else {
      // For testing purposes, default to iOS if not on mobile
      platform = 'ios';
    }

    const html = getStyledHtml(platform, params);
    res.send(html);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;
