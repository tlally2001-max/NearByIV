import { NextRequest, NextResponse } from "next/server";

/**
 * Retell AI Outbound Call API
 * Triggers an outbound call to verify provider availability
 *
 * Request body:
 * {
 *   to_phone: string (e.g., "+1234567890")
 *   from_phone: string (e.g., "+13239687755")
 *   agent_id: string (Retell agent ID)
 *   metadata: object (optional - any custom data to pass)
 * }
 */

const RETELL_API_KEY = process.env.RETELL_API_KEY;
const RETELL_BASE_URL = "https://api.retellai.com/v2";

if (!RETELL_API_KEY) {
  console.warn("RETELL_API_KEY not set in environment variables");
}

export async function POST(req: NextRequest) {
  try {
    if (!RETELL_API_KEY) {
      return NextResponse.json(
        { error: "Retell API key not configured" },
        { status: 500 }
      );
    }

    const { to_phone, from_phone, agent_id, metadata } = await req.json();

    // Validate required fields
    if (!to_phone || !from_phone || !agent_id) {
      return NextResponse.json(
        {
          error: "Missing required fields: to_phone, from_phone, agent_id",
        },
        { status: 400 }
      );
    }

    console.log("[Retell] Creating outbound call:", {
      to: to_phone,
      from: from_phone,
      agent_id,
    });

    // Call Retell API to initiate outbound call
    const response = await fetch(`${RETELL_BASE_URL}/create-phone-call`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to_number: to_phone,
        from_number: from_phone,
        agent_id: agent_id,
        metadata: metadata || {},
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Retell] API error:", errorData);
      return NextResponse.json(
        {
          error: "Failed to create call",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const callData = await response.json();

    console.log("[Retell] Call created:", {
      call_id: callData.call_id,
      status: callData.status,
      to: to_phone,
    });

    return NextResponse.json({
      success: true,
      call_id: callData.call_id,
      status: callData.status,
      to_phone,
      from_phone,
    });
  } catch (error) {
    console.error("[Retell] Error creating call:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
