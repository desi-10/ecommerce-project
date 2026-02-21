import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterData {
  email: string;
}

const contactTemplate = (data: ContactFormData) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
      .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }
      .field { margin-bottom: 15px; }
      .field-label { font-weight: bold; color: #2563eb; margin-bottom: 5px; }
      .field-value { background-color: #f0f0f0; padding: 10px; border-radius: 4px; }
      .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <div class="field">
          <div class="field-label">Name</div>
          <div class="field-value">${data.name}</div>
        </div>
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value">${data.email}</div>
        </div>
        <div class="field">
          <div class="field-label">Subject</div>
          <div class="field-value">${data.subject}</div>
        </div>
        <div class="field">
          <div class="field-label">Message</div>
          <div class="field-value">${data.message.replace(/\n/g, "<br>")}</div>
        </div>
      </div>
      <div class="footer">
        <p>This email was sent from your ecommerce platform contact form</p>
      </div>
    </div>
  </body>
</html>
`;

const newsletterTemplate = (email: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
      .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; }
      .footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Our Newsletter!</h1>
      </div>
      <div class="content">
        <p>Thank you for subscribing to our newsletter!</p>
        <p>You will now receive updates about new products, special offers, and exclusive deals directly in your inbox.</p>
        <p style="margin-top: 20px; color: #666;">Subscribed email: <strong>${email}</strong></p>
      </div>
      <div class="footer">
        <p>You can unsubscribe anytime by clicking the unsubscribe link in any of our emails</p>
      </div>
    </div>
  </body>
</html>
`;

export const sendContactEmail = async (data: ContactFormData) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM_EMAIL,
      to: process.env.NODEMAILER_EMAIL,
      subject: `New Contact Form: ${data.subject}`,
      html: contactTemplate(data),
      replyTo: data.email,
    });

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM_EMAIL,
      to: data.email,
      subject: "We received your message",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: white; padding: 20px; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Contacting Us</h1>
              </div>
              <div class="content">
                <p>Hi ${data.name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p>Thank you for reaching out to us!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    throw error;
  }
};

export const sendNewsletterEmail = async (email: string) => {
  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_FROM_EMAIL,
      to: email,
      subject: "Welcome to Our Newsletter!",
      html: newsletterTemplate(email),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send newsletter email:", error);
    throw error;
  }
};
