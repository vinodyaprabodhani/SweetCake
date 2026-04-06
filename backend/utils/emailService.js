const nodemailer = require('nodemailer');

const createTransporter = async () => {
    // Production Mode: Use real SMTP credentials if they exist in the .env file
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT === '465', // true for 465
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Development Mode Fallback: Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

exports.sendConfirmationEmail = async (orderData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"Sweet Cake" <noreply@sweetcake.lk>', 
            to: orderData.customer_email,
            subject: `Custom Order Received - #${orderData.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4A2C2A; font-family: Georgia, serif; margin: 0;">Sweet Cake</h1>
                        <span style="color: #D4A574; font-size: 14px;">Premium Sri Lankan Bakery</span>
                    </div>
                    
                    <h2 style="color: #E8848E; border-bottom: 2px solid #E8848E; padding-bottom: 10px;">Custom Order Received! 🎂</h2>
                    
                    <p style="font-size: 16px; color: #333;">Dear ${orderData.customer_name},</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        Thank you for placing a custom cake request with Sweet Cake! We have received your order instructions and our masterful bakers are currently reviewing the details.
                    </p>
                    
                    <div style="background-color: #FFF8F0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h4 style="margin-top: 0; color: #D4A574; font-size: 18px; border-bottom: 1px solid #E8C9A0; padding-bottom: 8px;">Request Summary</h4>
                        <table style="width: 100%; font-size: 15px; color: #444;">
                            <tr><td style="padding: 5px 0;"><strong>Order Request ID:</strong></td><td>#${orderData.orderId}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Cake Required:</strong></td><td>${orderData.cake_type}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Target Delivery:</strong></td><td>${orderData.delivery_date}</td></tr>
                        </table>
                    </div>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        We will contact you shortly using your phone number or email to confirm a final price quote before we begin baking.
                    </p>
                    <p style="font-size: 16px; color: #333; margin-top: 30px;">
                        Stay Sweet,<br/>
                        <strong>The Sweet Cake Team</strong>
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("Message sent to Ethereal Email Service: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Check the Email Preview URL here -> %s", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("Error sending custom order email:", error);
    }
};

exports.sendStandardOrderEmail = async (orderData) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"Sweet Cake" <noreply@sweetcake.lk>', 
            to: orderData.customer_email,
            subject: `Order Confirmation - #${orderData.orderNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #4A2C2A; font-family: Georgia, serif; margin: 0;">Sweet Cake</h1>
                        <span style="color: #D4A574; font-size: 14px;">Premium Sri Lankan Bakery</span>
                    </div>
                    
                    <h2 style="color: #4A2C2A; border-bottom: 2px solid #E8848E; padding-bottom: 10px;">Order Confirmed! 🎉</h2>
                    
                    <p style="font-size: 16px; color: #333;">Dear ${orderData.customer_name},</p>
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        We have successfully safely received your order. Our masterful bakers will begin preparing your delicious cakes shortly!
                    </p>
                    
                    <div style="background-color: #FFF8F0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h4 style="margin-top: 0; color: #D4A574; font-size: 18px; border-bottom: 1px solid #E8C9A0; padding-bottom: 8px;">Order Details</h4>
                        <table style="width: 100%; font-size: 15px; color: #444;">
                            <tr><td style="padding: 5px 0;"><strong>Order Number:</strong></td><td>${orderData.orderNumber}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Shipping To:</strong></td><td>${orderData.shipping_city}</td></tr>
                            <tr><td style="padding: 5px 0;"><strong>Payment Method:</strong></td><td>${orderData.payment_method.toUpperCase()}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold;"><strong>Total Paid:</strong></td><td style="font-weight: bold; color: #4A2C2A;">LKR ${orderData.total_amount}</td></tr>
                        </table>
                    </div>
                    
                    <p style="font-size: 16px; color: #555; line-height: 1.5;">
                        Thank you for choosing Sweet Cake for your special moments. 
                    </p>
                    <p style="font-size: 16px; color: #333; margin-top: 30px;">
                        Stay Sweet,<br/>
                        <strong>The Sweet Cake Team</strong>
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("Standard Order Message sent to Ethereal Email Service: %s", info.messageId);
        console.log("Check the Email Preview URL here -> %s", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("Error sending standard order email:", error);
    }
};
