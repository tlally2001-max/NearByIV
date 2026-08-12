import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const providerId = typeof body.providerId === "string" ? body.providerId : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
    const history: ChatMessage[] = Array.isArray(body.conversationHistory)
      ? body.conversationHistory
          .filter((item: unknown): item is ChatMessage => {
            if (!item || typeof item !== "object") return false;
            const candidate = item as Partial<ChatMessage>;
            return (candidate.role === "user" || candidate.role === "assistant") && typeof candidate.content === "string";
          })
          .slice(-6)
          .map((item: ChatMessage) => ({ role: item.role, content: item.content.slice(0, 1500) }))
      : [];

    if (!providerId || !message) {
      return NextResponse.json({ error: "Missing provider or message" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Assistant is not configured" }, { status: 503 });
    }

    const supabase = await createClient();
    const { data: provider } = await supabase
      .from("providers")
      .select("business_name, City, State, phone, website, treatments, service_areas, personalized_bio, menu_highlights, working_hours, medical_staff_type, is_confirmed_mobile")
      .eq("id", providerId)
      .single();

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const menuServices = Array.isArray(provider.menu_highlights)
      ? provider.menu_highlights
          .map((item: unknown) => (item && typeof item === "object" && "service" in item ? String((item as { service: unknown }).service) : ""))
          .filter(Boolean)
          .slice(0, 20)
      : [];
    const systemInstruction = `You are the NearbyIV directory assistant for the listing “${provider.business_name}”. You are not the provider and must never imply affiliation, employment, or medical authority.

Answer only from the published listing context below. If the answer is not present, say you do not have that information and direct the user to contact the provider. Never diagnose, recommend a treatment, determine eligibility, give emergency guidance beyond telling the user to call 911, or guarantee credentials, oversight, pricing, availability, safety, or results. Keep answers concise, warm, and factual. Do not collect sensitive medical information.

Published listing context:
- Provider: ${provider.business_name}
- Location: ${[provider.City, provider.State].filter(Boolean).join(", ")}
- Phone: ${provider.phone || "Not published"}
- Website: ${provider.website || "Not published"}
- Mobile service status: ${provider.is_confirmed_mobile ? "Published evidence indicates mobile service" : "Not confirmed"}
- Clinician information: ${provider.medical_staff_type || "Not published"}
- Services: ${menuServices.join(", ") || provider.treatments || "Not published"}
- Service areas: ${provider.service_areas || "Not published"}
- Hours: ${provider.working_hours || "Not published"}
- Description: ${(provider.personalized_bio || "Not published").slice(0, 3000)}`;

    const contents = history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));
    if (!contents.length || contents[contents.length - 1]?.parts[0]?.text !== message) {
      contents.push({ role: "user", parts: [{ text: message }] });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.2,
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Assistant provider unavailable" }, { status: 502 });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json({ error: "No assistant response" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Unable to process chat message" }, { status: 500 });
  }
}
