const express = require('express');
const app = express();

// Constants
const APP_SCHEME_IOS = 'presence-copilot-development';
const APP_STORE_URL = 'https://apps.apple.com/us/app/your-app/id1234567890';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.your.package.name';
const APP_SCHEME_ANDROID = 'presence-copilot-development';

// Function to generate the HTML content with dynamic OG tags and app redirect
const getStyledHtml = (platform, params = {}) => {
  try {
    console.log('getStyledHtml called with:', { platform, params });
    
    let appUrl = '';
    let appScheme = '';

    if (platform === 'ios') {
      appUrl = APP_STORE_URL;
      appScheme = APP_SCHEME_IOS;
    } else if (platform === 'android') {
      appUrl = PLAY_STORE_URL;
      appScheme = APP_SCHEME_ANDROID;
    }

    // Extract and sanitize parameters from the query string
    const name = params.name || 'Project';
    const createdBy = params.createdBy || 'Unknown';
    const imageUrl = params.imageUrl || 'https://via.placeholder.com/150';

    const deepLink = `${appScheme}://deep-linking?${new URLSearchParams(Object.entries(params)).toString()}`;
    console.log('Generated Deep Link:', deepLink);

    // Updated base URL with your domain
    const baseUrl = 'http://wgw.luxurycoders.com';

    return `<!DOCTYPE html>
    <html>
    <head>
        <title>Collaborate on Project</title>
        <meta property="og:title" content="Collaborate on Project">
        <meta property="og:description" content="Created by Copilot">
        <meta property="og:image" content="https://fastly.picsum.photos/id/112/200/300.jpg">
        <meta property="og:url" content="${baseUrl}">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="Copilot App">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f7;
                color: #1c1c1e;
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

            .button {
                display: inline-block;
                padding: 14px 28px;
                background-color: #007aff;
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

            .footer {
                margin-top: 30px;
                font-size: 0.8em;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Collaborate on Project</h1>
            <div class="subtitle">Created by Copilot</div>
            <div class="image-placeholder">
                <img src="https://via.placeholder.com/150" alt="Preview Image" style="max-width: 100%; max-height: 100%;">
            </div>
            <a href="${deepLink}" class="button">Open in App</a>
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
  } catch (error) {
    console.error('Error in getStyledHtml:', error);
    return 'An error occurred while generating the page.';
  }
};

// Main route handler
app.get('/', async (req, res) => {
  try {
    console.log('Incoming request:', {
      query: req.query,
      headers: req.headers,
      url: req.url
    });

    const userAgent = req.headers['user-agent'] || '';
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /android/i.test(userAgent);
    const params = req.query || {};

    console.log('Processed request params:', params);

    let platform = isIOS ? 'ios' : (isAndroid ? 'android' : 'ios');

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
