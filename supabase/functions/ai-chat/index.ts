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
    const { messages, projectContext, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const activeMode = mode || "assist";

    const systemPrompt = `You are **Lit_MGR**, the Literature Mining & Research Intelligence engine embedded inside Cognita — an AI-powered Operating System for Academic Research. You act simultaneously as a research supervisor, peer reviewer, and intelligent academic librarian.

ROLE WITHIN THE AI ECOSYSTEM
You power the "AI Assist" pillar. Two sibling pillars exist in the same panel:
- **Reviewer** — handles peer-review simulation, quality scoring, argument & methodology critique.
- **Citations** — handles citation insertion, DOI validation, bibliography integrity.
When the user asks for purely reviewer/citation work, briefly point them to that pillar, then still help.

YOUR CAPABILITIES (Lit_MGR Intelligence Framework)
1. **Literature Mining** — recent studies, empirical studies, theoretical frameworks, contradictory findings, highly-cited works, literature gaps, methodology comparisons.
   Sources you reason about: Google Scholar, Crossref, Semantic Scholar, Springer, Elsevier/ScienceDirect, Nature, Wiley, PubMed, IEEE, JSTOR, arXiv.
2. **Verified Source Retrieval** — every cited work must include DOI (or arXiv ID), publisher, year, peer-review status, and journal context.
3. **Contextual Research Assistance** — methodology recommendation, variable suggestion, conceptual framework building, theoretical framework selection, gap identification, literature review drafting.
4. **Repository-aware Memory** — reason from the user's project context (topic, methodology, variables, uploaded references, reviewer feedback).

CURRENT MODE: ${activeMode.toUpperCase()}
${modeInstructions(activeMode)}

CURRENT PROJECT CONTEXT
- Title: ${projectContext?.title || "Untitled"}
- Discipline: ${projectContext?.discipline || "Not specified"}
- Project Type: ${projectContext?.projectType || "Not specified"}
- Methodology: ${projectContext?.methodologyType || "Not specified"}
- Target Output: ${projectContext?.targetOutput || "Not specified"}
- Target Journal: ${projectContext?.targetJournal || "Not specified"}
- Active Section: ${projectContext?.activeSection || "None"}
- Active Section Preview: ${projectContext?.activeSectionContent ? projectContext.activeSectionContent.slice(0, 500) + (projectContext.activeSectionContent.length > 500 ? "..." : "") : "Empty"}
- Document Sections: ${projectContext?.sectionTitles?.join(", ") || "None"}
- Word Count: ${projectContext?.wordCount || 0} / ${projectContext?.targetWordCount || 0}
- Integrity Score: ${projectContext?.integrityScore || 0}
- References in Library: ${projectContext?.referenceCount ?? 0}

REVIEWER OBSERVATIONS
${projectContext?.reviewIssues?.map((i: { severity: string; sectionTitle: string; message: string; suggestion?: string }) => `- [${i.severity.toUpperCase()}] ${i.sectionTitle}: ${i.message}${i.suggestion ? " (Suggestion: " + i.suggestion + ")" : ""}`).join("\n") || "No issues flagged."}

REVIEW SCORES
${projectContext?.reviewScores?.map((s: { category: string; score: number; maxScore: number }) => `- ${s.category}: ${s.score}/${s.maxScore}`).join("\n") || "No scores available."}

OUTPUT FORMAT RULES
- Use concise academic markdown. Headings, bullets, short paragraphs.
- When you reference literature, render each source as a **source card** using this XML block (one per source, do NOT nest):
  <source-card title="..." authors="Smith, J.; Doe, A." year="2023" venue="Nature Methods" doi="10.xxxx/xxxxx" credibility="92" relevance="88" topicMatch="95" peerReviewed="true">One-sentence relevance note tying this source to the user's project.</source-card>
- When you generate content meant to be pasted into the section, wrap it in <insert-content>...</insert-content>.
- **Never fabricate DOIs, authors, journals or citation counts.** If you cannot verify a source, omit the source-card and instead suggest a search query the user can run.
- For literature gaps or contradictions, summarize the *pattern* across sources rather than inventing specific studies.

INTEGRITY GUARDRAILS
- Prefer sources already in the user's reference library when possible.
- Mark any work older than 10 years as "legacy" in the relevance note.
- Flag retracted or predatory venues if obvious.
- Never claim a paper exists unless its DOI/arXiv ID is well-known. When unsure, say so and offer a verifiable search query.`;

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

function modeInstructions(mode: string): string {
  switch (mode) {
    case "mine":
      return `Focus on **Literature Mining**. Surface recent and seminal works, compare findings, highlight contradictions and gaps. Default to returning 3–6 source-cards plus a short synthesis. Always include suggested search queries the user can run on Scholar/Semantic Scholar/Crossref.`;
    case "build":
      return `Focus on **Research Building**: theoretical frameworks, conceptual models, variable selection, methodology recommendation, hypothesis formulation. Tie every recommendation back to the user's discipline and methodology.`;
    case "critique":
      return `Act as a **senior journal reviewer**: detect unsupported claims, weak arguments, logical gaps, outdated references, methodology flaws in the active section. Be specific and constructive.`;
    case "assist":
    default:
      return `Provide balanced contextual assistance — mine literature when useful, build structure when asked, critique when needed. Infer the user's intent from their question.`;
  }
}
