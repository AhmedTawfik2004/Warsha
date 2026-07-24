import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, owner, phone, area, category, description } = body;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Warsha.eg <onboarding@resend.dev>",
        to: "Warsha.Finder@gmail.com",
        subject: `New shop request: ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;">
            <div style="background:#E8730A;padding:16px 24px;border-radius:12px 12px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:20px;">New Shop Listing Request</h1>
              <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:13px;">Warsha.eg — Review and approve or reject in the admin panel</p>
            </div>
            <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none;">
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;width:120px;">Shop name</td><td style="padding:8px 0;font-size:14px;color:#111;font-weight:700;">${name}</td></tr>
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;">Owner</td><td style="padding:8px 0;font-size:14px;color:#111;">${owner}</td></tr>
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;">Phone</td><td style="padding:8px 0;font-size:14px;color:#111;">${phone}</td></tr>
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;">Area</td><td style="padding:8px 0;font-size:14px;color:#111;">${area}</td></tr>
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;">Category</td><td style="padding:8px 0;font-size:14px;color:#111;">${category}</td></tr>
                <tr><td style="padding:8px 0;font-size:12px;color:#888;font-weight:700;text-transform:uppercase;vertical-align:top;">Description</td><td style="padding:8px 0;font-size:14px;color:#111;">${description || "—"}</td></tr>
              </table>
              <div style="margin-top:24px;padding:16px;background:#fff3e0;border-radius:8px;border:1px solid #ffe0b2;">
                <p style="margin:0;font-size:13px;color:#E8730A;font-weight:700;">Action required</p>
                <p style="margin:6px 0 0;font-size:13px;color:#555;">Reply to this email asking the shop owner to send photos. Once you receive them, go to the admin panel to approve or reject.</p>
                <a href="https://warsha-rosy.vercel.app/admin" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#E8730A;color:#fff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:700;">Open Admin Panel</a>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      // Don't fail the request — DB insert already succeeded
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("notify-shop-request error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}