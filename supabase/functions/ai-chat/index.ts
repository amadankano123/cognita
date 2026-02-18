import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, projectContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context-aware system prompt
    const systemPrompt = `You are an AI Research Assistant embedded in a research document editor called Cognita. You help researchers improve their academic writing.

CURRENT PROJECT CONTEXT:
- Title: ${projectContext?.title || "Untitled"}
- Discipline: ${projectContext?.discipline || "Not specified"}
- Project Type: ${projectContext?.projectType || "Not specified"}
- Methodology: ${projectContext?.methodologyType || "Not specified"}
- Target Output: ${projectContext?.targetOutput || "Not specified"}
- Target Journal: ${projectContext?.targetJournal || "Not specified"}
- Current Active Section: ${projectContext?.activeSection || "None"}
- Active Section Content Preview: ${projectContext?.activeSectionContent ? projectContext.activeSectionContent.slice(0, 500) + (projectContext.activeSectionContent.length > 500 ? "..." : "") : "Empty"}
- Document Sections: ${projectContext?.sectionTitles?.join(", ") || "None"}
- Word Count: ${projectContext?.wordCount || 0} / ${projectContext?.targetWordCount || 0}
- Integrity Score: ${projectContext?.integrityScore || 0}

AI REVIEWER OBSERVATIONS:
${projectContext?.reviewIssues?.map((i: { severity: string; sectionTitle: string; message: string; suggestion?: string }) => `- [${i.severity.toUpperCase()}] ${i.sectionTitle}: ${i.message}${i.suggestion ? " (Suggestion: " + i.suggestion + ")" : ""}`).join("\n") || "No issues flagged."}

REVIEW SCORES:
${projectContext?.reviewScores?.map((s: { category: string; score: number; maxScore: number }) => `- ${s.category}: ${s.score}/${s.maxScore}`).join("\n") || "No scores available."}

YOUR CAPABILITIES:
1. Suggest improvements for any section based on the reviewer observations above.
2. Generate or rewrite content for specific sections.
3. Help with research methodology, structure, and academic writing style.
4. When generating content meant for insertion, wrap it in <insert-content> tags so the UI can offer an "Insert" button. Example:
   <insert-content>Your generated paragraph here...</insert-content>
5. Be specific, academic, and contextually aware. Reference the project details above.
6. Keep responses concise but thorough. Use markdown formatting.
7. If the user asks to generate content for a section, generate it wrapped in <insert-content> tags.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
