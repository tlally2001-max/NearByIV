import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Step 1: Fetch the test provider from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const providerResponse = await fetch(
      `${supabaseUrl}/rest/v1/providers?is_confirmed_mobile=eq.true&select=name,phone,city,state`,
      {
        headers: { apikey: supabaseKey },
      }
    );

    if (!providerResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch provider from Supabase" },
        { status: 500 }
      );
    }

    const providers: Array<{
      name: string;
      phone: string;
      city: string;
      state: string;
    }> = await providerResponse.json();

    if (providers.length === 0) {
      return NextResponse.json(
        { error: "No confirmed mobile providers found" },
        { status: 404 }
      );
    }

    const provider = providers[0];

    // Step 2: Send SMS via /api/send-sms
    const testMessage = `Hi ${provider.name}, this is a test message from NearByIV. Please reply YES or NO to confirm availability.`;

    const smsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/send-sms`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: provider.phone,
          message: testMessage,
        }),
      }
    );

    if (!smsResponse.ok) {
      const error = await smsResponse.json();
      return NextResponse.json(
        { error: "Failed to send SMS", details: error },
        { status: 500 }
      );
    }

    const smsResult = await smsResponse.json();

    return NextResponse.json({
      success: true,
      provider: {
        name: provider.name,
        phone: provider.phone,
        city: provider.city,
        state: provider.state,
      },
      sms: smsResult,
    });
  } catch (error) {
    console.error("Test SMS error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
