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

    const name = params.name || 'Project';
    const createdBy = params.createdBy || 'Unknown';
    const imageUrl = params.imageUrl || 'https://res.cloudinary.com/luxuryp/image/upload/v1704842104/background_ilux52.png';
    const avatarUrl = params.avatarUrl || 'https://i.pravatar.cc/150?img=48';
    const deepLink = `${appScheme}://deep-linking?${new URLSearchParams(Object.entries(params)).toString()}`;

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta name="deepview-service" content="deepview-service">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:700,300" rel="stylesheet" type="text/css">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        
        <!-- Meta tags -->
        <meta property="og:title" content="${name}">
        <meta property="og:description" content="Created by ${createdBy}">
        <meta property="og:image" content="${imageUrl}">
        <meta property="og:site_name" content="Collaboration Invite">
        
        <style>
            body {
                margin: 0;
                word-wrap: break-word;
                padding: 0px;
                align-items: center;
                justify-content: center;
                background-color: #000;
            }
            
            .main-image {
                background-image: url(${imageUrl});
                background-size: cover;
                height: 80vw;
            }
            
            .blurred-image {
                background-image: url(${imageUrl});
                background-size: cover;
                background-repeat: no-repeat;
                height: 50%;
                width: 100%;
                position: absolute;
                top: 50%;
                right: 0;
                transform: scaleY(-1);
                opacity: 30%;
                filter: blur(100px);
                z-index: -99;
            }
            
            .avatar {
                vertical-align: middle;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin-top: 22px;
                margin-bottom: 16px;
            }
            
            #content-container {
                margin-top: 48px;
                display: flex;
                flex-direction: column;
                align-items: center;
                bottom: 0px;
                width: 100%;
            }
            
            .card-title {
                text-align: center;
                margin: 0px;
                font-size: 24px;
                color: #FFF;
                margin-bottom: 16px;
            }
            
            .app-content {
                margin-top: 16px;
                margin-bottom: 40px;
                color: #C4C4C4;
                text-align: center;
                font-family: Inter;
                font-size: 16px;
                font-weight: 400;
                line-height: 16px;
            }
            
            .input-wrapper {
                width: 100%;
                flex: 1;
                display: flex;
                align-items: flex-end;
                padding-bottom: 20px;
            }
            
            .input-container {
                width: 100%;
                padding: 0 24px;
                text-align: center;
                box-sizing: border-box;
            }
            
            .cta-button {
                display: block;
                height: 62px;
                line-height: 62px;
                background-color: #FFF;
                border-radius: 100px;
                font-size: 20px;
                color: #000;
                text-align: center;
                text-decoration: none;
                margin-bottom: 20px;
            }
            
            .link-container {
                margin-top: 20px;
            }
            
            .link {
                font-size: 18px;
                font-weight: 600;
                padding-top: 20px;
                color: #FFF;
                text-decoration: none;
            }
            
            @media only screen and (orientation: landscape) {
                .main-image {
                    position: fixed;
                    height: 100vh;
                    width: 50%;
                }
                
                #content-container {
                    float: left;
                    width: 50%;
                    margin-left: 50%;
                }
            }
        </style>
    </head>
    <body>
        <div class="card center">
            <div class="main-image"></div>
            <div class="blurred-image"></div>
            <div id="content-container">
                <div><img class="avatar" src="${avatarUrl}"></div>
                <h4 class="card-title" style="margin-bottom:4px">Collaborate on</h4>
                <h4 class="card-title">${name}</h4>
                <div class="app-content">Created by ${createdBy}</div>
                <div class="input-wrapper">
                    <div class="input-container">
                        <form class="form-get-the-app">
                            <a href="${deepLink}" class="cta-button">Get the App</a>
                            <div class="link-container">
                                <a href="https://copilot-staging.app.link" class="link">Continue in browser</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
