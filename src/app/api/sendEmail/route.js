import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY; // Brevo API Key
    const senderEmail = process.env.BREVO_RECEIVER_EMAIL; // Admin Email

    if (!apiKey || !senderEmail) {
      return NextResponse.json({ error: "API Key or Sender Email is missing" }, { status: 500 });
    }

    // Step 1: User -> Admin
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: senderEmail }, // Admin as sender
        to: [{ email: senderEmail }],   // Admin as receiver
        replyTo: { email: email },  // User email for replies
        subject: `New Contact Message from ${name}`,
        textContent: `Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );

    // Step 2: Admin -> User (Confirmation)
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: senderEmail }, // Admin as sender
        to: [{ email: email }],  // Send confirmation to the user
        subject: "Thank You for Contacting Us",
        textContent: `Hi ${name},\n\nThank you for reaching out. We will get back to you soon.\n\nBest Regards,\nJoapary-quiz-game`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );

    return NextResponse.json({ success: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
