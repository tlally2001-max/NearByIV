import { NextRequest, NextResponse } from "next/server";

// Store SMS conversations in memory (in production, use database)
const conversations = new Map<
  string,
  { provider_phone: string; provider_name: string; reply: string; timestamp: number }
>();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Twilio sends data as form-encoded, not JSON
    const from = formData.get("From") as string;
    const to = formData.get("To") as string;
    const body = (formData.get("Body") as string)?.trim().toUpperCase() || "";
    const messageSid = formData.get("MessageSid") as string;

    if (!from || !body) {
      return NextResponse.json(
        { error: "Missing From or Body" },
        { status: 400 }
      );
    }

    // Log the incoming message
    console.log(`[SMS Reply] From: ${from}, To: ${to}, Body: "${body}", SID: ${messageSid}`);

    // Check if reply is YES or NO
    const isConfirmed = body.includes("YES") || body.includes("Y");
    const isDeclined = body.includes("NO") || body.includes("N");

    if (!isConfirmed && !isDeclined) {
      // Reply is unclear
      console.log(`[SMS] Unclear response from ${from}: "${body}"`);

      // Optional: Send clarification SMS
      // await sendSMS(from, "Please reply with YES or NO");

      return NextResponse.json({
        status: "received",
        result: "unclear",
        message: "Reply received but unclear. Expected YES or NO.",
      });
    }

    // Store the response
    conversations.set(from, {
      provider_phone: from,
      provider_name: "RenewMe IV Therapy + Medspa", // In production, look this up from database
      reply: isConfirmed ? "YES" : "NO",
      timestamp: Date.now(),
    });

    console.log(
      `[SMS Confirmed] Provider at ${from} replied: ${isConfirmed ? "YES ✅" : "NO ❌"}`
    );

    // In production, you would:
    // 1. Update the database with this response
    // 2. Send notification to website user
    // 3. Trigger next step in flow

    return NextResponse.json({
      status: "received",
      result: isConfirmed ? "confirmed" : "declined",
      provider_phone: from,
      reply: isConfirmed ? "YES" : "NO",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Optional: Endpoint to check conversation status
export async function GET() {
  const allConversations = Array.from(conversations.entries()).map(
    ([phone, data]) => ({
      phone,
      ...data,
    })
  );

  return NextResponse.json({
    total: allConversations.length,
    conversations: allConversations,
  });
}
