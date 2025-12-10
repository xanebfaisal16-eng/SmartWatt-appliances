import { SENDER_EMAIL } from "../config/awsses.js";

const emailTemplate = (reciver_email, subject, body) => {
    return {
        Source: SENDER_EMAIL,
        Destination: {
            ToAddresses: [reciver_email]
        },
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: `practicezone - ${subject}`
            },
            Body: {
                Html: {
                    Charset: 'UTF-8',
                   Data: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smartwat - Intelligent Energy Systems</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        .tagline {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
        }
        .content {
            padding: 40px 30px;
        }
        .body-content {
            color: #555555;
            font-size: 16px;
            line-height: 1.7;
        }
        .button {
            display: inline-block;
            margin: 25px 0;
            padding: 14px 32px;
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }
        .footer {
            background-color: #f8fafc;
            padding: 25px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .company-info {
            margin-bottom: 15px;
            font-weight: 600;
            color: #4b5563;
        }
        .developer-credit {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .highlight-box {
            background-color: #f0f9ff;
            border-left: 4px solid #3B82F6;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .info-item {
            margin: 10px 0;
            display: flex;
            align-items: center;
        }
        .info-item i {
            color: #3B82F6;
            margin-right: 10px;
            font-style: normal;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
        }
        .expiry-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
            color: #92400e;
            text-align: center;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 25px 15px;
            }
            .button {
                display: block;
                margin: 20px auto;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">SMARTWAT</div>
            <p class="tagline">Intelligent Energy Solutions</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="body-content">
                ${body}
                
                <div class="highlight-box">
                    <div class="info-item">
                        <i>✓</i> <strong>Secure & Encrypted</strong> - Your data is protected with industry-standard security
                    </div>
                    <div class="info-item">
                        <i>✓</i> <strong>24/7 Support</strong> - Our team is always ready to assist you
                    </div>
                    <div class="info-item">
                        <i>✓</i> <strong>Energy Efficient</strong> - Smart solutions for sustainable living
                    </div>
                </div>
                
                <div class="expiry-notice">
                    ⏰ This link will expire in 1 hour for your security.
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="company-info">Smartwat Energy Systems Pvt. Ltd.</div>
            <p>📍 123 Innovation Drive, Tech City, TC 10101</p>
            <p>📞 +1 (555) 123-4567 | ✉️ support@smartwat.com</p>
            
            <div class="social-links">
                <a href="#" class="social-icon">🌐 Website</a>
                <a href="#" class="social-icon">📘 Facebook</a>
                <a href="#" class="social-icon">📸 Instagram</a>
                <a href="#" class="social-icon">💼 LinkedIn</a>
            </div>
            
            <div class="developer-credit">
                <p>Powered by Smartwat Technology | © ${new Date().getFullYear()} All rights reserved</p>
                <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
                    This email was sent by our automated system. Please do not reply to this message.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`
                }
            }
        }
    };
};

export default emailTemplate;
