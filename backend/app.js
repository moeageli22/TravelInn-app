// backend/app.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Email sending endpoint using Gemini AI to generate email content
app.post('/api/send-confirmation', async (req, res) => {
    try {
        const {
            email,
            hotelName,
            hotelLocation,
            roomName,
            roomPrice,
            checkIn,
            checkOut,
            nights,
            guests,
            totalPrice,
            specialRequests,
            bookingId
        } = req.body;

        // Validate required fields
        if (!email || !hotelName || !roomName || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({
                success: false,
                message: 'Missing required booking information'
            });
        }

        // Generate booking confirmation ID if not provided
        const confirmationId = bookingId || `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Format dates
        const checkInDate = new Date(checkIn).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const checkOutDate = new Date(checkOut).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create email HTML template
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">
                                ✨ Booking Confirmed!
                            </h1>
                            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                                Your dream stay awaits
                            </p>
                        </td>
                    </tr>

                    <!-- Confirmation ID -->
                    <tr>
                        <td style="padding: 30px; background: #f8f9fa; text-align: center; border-bottom: 2px dashed #e0e0e0;">
                            <p style="margin: 0 0 10px; color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                Confirmation Number
                            </p>
                            <h2 style="margin: 0; color: #8b5cf6; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                                ${confirmationId}
                            </h2>
                        </td>
                    </tr>

                    <!-- Hotel Details -->
                    <tr>
                        <td style="padding: 30px;">
                            <h3 style="margin: 0 0 20px; color: #1a1a1a; font-size: 20px; font-weight: 600;">
                                📍 Your Accommodation
                            </h3>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                                <h4 style="margin: 0 0 8px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                                    ${hotelName}
                                </h4>
                                <p style="margin: 0; color: #666; font-size: 14px;">
                                    📍 ${hotelLocation}
                                </p>
                            </div>

                            <!-- Room Details -->
                            <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); padding: 20px; border-radius: 12px; border: 2px solid rgba(139, 92, 246, 0.3);">
                                <h4 style="margin: 0 0 15px; color: #8b5cf6; font-size: 16px; font-weight: 600;">
                                    🛏️ ${roomName}
                                </h4>
                                <table width="100%" cellpadding="8" cellspacing="0">
                                    <tr>
                                        <td style="color: #666; font-size: 14px; width: 50%;">Check-in:</td>
                                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${checkInDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666; font-size: 14px;">Check-out:</td>
                                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${checkOutDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666; font-size: 14px;">Duration:</td>
                                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${nights} night${nights > 1 ? 's' : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #666; font-size: 14px;">Guests:</td>
                                        <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right;">
                                            ${guests} guest${guests > 1 ? 's' : ''}
                                        </td>
                                    </tr>
                                    ${specialRequests ? `
                                    <tr>
                                        <td colspan="2" style="padding-top: 10px;">
                                            <div style="background: rgba(255,255,255,0.7); padding: 10px; border-radius: 8px;">
                                                <p style="margin: 0 0 5px; color: #666; font-size: 12px; font-weight: 600;">Special Requests:</p>
                                                <p style="margin: 0; color: #1a1a1a; font-size: 13px;">${specialRequests}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>
                        </td>
                    </tr>

                    <!-- Pricing Breakdown -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <h3 style="margin: 0 0 15px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                                💰 Payment Summary
                            </h3>
                            <table width="100%" cellpadding="10" cellspacing="0" style="background: #f8f9fa; border-radius: 12px;">
                                <tr>
                                    <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                        Room Rate (${nights} night${nights > 1 ? 's' : ''})
                                    </td>
                                    <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        $${roomPrice} × ${nights}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                        Subtotal
                                    </td>
                                    <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        $${totalPrice}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #666; font-size: 14px; border-bottom: 1px solid #e0e0e0;">
                                        Taxes & Fees
                                    </td>
                                    <td style="color: #1a1a1a; font-size: 14px; font-weight: 600; text-align: right; border-bottom: 1px solid #e0e0e0;">
                                        Included
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color: #1a1a1a; font-size: 18px; font-weight: 700; padding-top: 15px;">
                                        Total Amount Paid
                                    </td>
                                    <td style="color: #8b5cf6; font-size: 24px; font-weight: 700; text-align: right; padding-top: 15px;">
                                        $${totalPrice}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px;">
                                <h4 style="margin: 0 0 10px; color: #856404; font-size: 16px; font-weight: 600;">
                                    ℹ️ Important Information
                                </h4>
                                <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px; line-height: 1.6;">
                                    <li>Check-in time: 3:00 PM</li>
                                    <li>Check-out time: 11:00 AM</li>
                                    <li>Please bring a valid ID and credit card</li>
                                    <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
                                </ul>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Information -->
                    <tr>
                        <td style="padding: 30px; background: #f8f9fa; text-align: center;">
                            <h4 style="margin: 0 0 15px; color: #1a1a1a; font-size: 16px; font-weight: 600;">
                                Need Help?
                            </h4>
                            <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                                Our support team is here for you 24/7
                            </p>
                            <p style="margin: 0; color: #8b5cf6; font-size: 14px; font-weight: 600;">
                                📧 support@travelinn.com | 📞 1-800-TRAVELINN
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); text-align: center;">
                            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 24px; font-weight: 700;">
                                Travelinn
                            </h2>
                            <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                                Thank you for choosing Travelinn. We look forward to hosting you!
                            </p>
                            <div style="margin-top: 20px;">
                                <a href="#" style="color: rgba(255,255,255,0.9); text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
                                <span style="color: rgba(255,255,255,0.5);">|</span>
                                <a href="#" style="color: rgba(255,255,255,0.9); text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        // In a real application, you would use a service like SendGrid, Mailgun, or Nodemailer
        // For this example, we'll simulate sending the email and log it
        console.log('='.repeat(80));
        console.log('EMAIL CONFIRMATION SENT');
        console.log('='.repeat(80));
        console.log(`To: ${email}`);
        console.log(`Confirmation ID: ${confirmationId}`);
        console.log(`Hotel: ${hotelName}`);
        console.log(`Room: ${roomName}`);
        console.log(`Check-in: ${checkInDate}`);
        console.log(`Check-out: ${checkOutDate}`);
        console.log(`Total: $${totalPrice}`);
        console.log('='.repeat(80));

        // TODO: Integrate with actual email service
        // Example with Nodemailer (you would need to install and configure it):
        /*
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: '"Travelinn" <noreply@travelinn.com>',
            to: email,
            subject: `Booking Confirmation - ${confirmationId}`,
            html: emailHTML
        });
        */

        // Return success response
        res.json({
            success: true,
            message: 'Confirmation email sent successfully',
            confirmationId: confirmationId,
            bookingDetails: {
                hotelName,
                roomName,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                nights,
                totalPrice
            }
        });

    } catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send confirmation email',
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📧 Email confirmation endpoint available at http://localhost:${PORT}/api/send-confirmation`);
});