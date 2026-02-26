import { NextRequest, NextResponse } from "next/server";

/**
 * Retell AI Webhook Handler
 * Receives POST requests from Retell for various call events
 *
 * Event types:
 * - call_started: Call has been initiated
 * - call_ended: Call has ended, transcript available
 * - call_analyzed: Call has been analyzed with summary
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[Retell Webhook] Received event:", {
      event: body.event,
      call_id: body.call_id,
      timestamp: new Date().toISOString(),
    });

    const event = body.event;

    // Handle different event types
    switch (event) {
      case "call_started": {
        console.log(`[Retell] Call started: ${body.call_id}`);
        // In production: log call start to database
        break;
      }

      case "call_ended": {
        console.log(`[Retell] Call ended: ${body.call_id}`);
        console.log("[Retell] Call data:", {
          duration: body.call_duration,
          transcript: body.transcript,
          call_id: body.call_id,
        });
        // In production:
        // 1. Store transcript and call metadata in database
        // 2. Process the transcript to extract user needs
        // 3. Trigger SMS to provider or next step in flow
        break;
      }

      case "call_analyzed": {
        console.log(`[Retell] Call analyzed: ${body.call_id}`);
        console.log("[Retell] Analysis:", {
          call_id: body.call_id,
          summary: body.summary,
          user_transcript: body.user_transcript,
          agent_transcript: body.agent_transcript,
        });
        // In production:
        // 1. Extract structured data from agent_transcript (therapy type, location, etc.)
        // 2. Update request status in database
        // 3. Send SMS to matching providers
        break;
      }

      default:
        console.log(`[Retell] Unknown event: ${event}`);
    }

    // Retell requires a 200 OK response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[Retell Webhook] Error:", error);
    // Still return 200 to acknowledge receipt
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
