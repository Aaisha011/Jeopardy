export async function POST(req) {
    try {
      const { captcha } = await req.json(); // Parse JSON from request
      if (!captcha) {
        return new Response(JSON.stringify({ error: "Captcha token is missing" }), { status: 400 });
      }
  
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;
      const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;
  
      const response = await fetch(verifyURL, { method: "POST" });
      const data = await response.json();
  
      if (!data.success) {
        return new Response(JSON.stringify({ success: false, error: "Captcha verification failed" }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ success: true, message: "Captcha verified" }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
    }
  }
  