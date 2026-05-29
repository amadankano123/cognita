import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  Send, Loader2, Sparkles, Download, Trash2, Bot, User,
  BookOpen, Layers, ShieldCheck, ExternalLink, Library, Search,
  GitCompare, Telescope, FlaskConical, NotebookPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type AssistMode = "assist" | "mine" | "build" | "critique";

interface AIChatPanelProps {
  activeSectionId?: string;
  onInsertContent: (content: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

interface SourceCard {
  title: string;
  authors: string;
  year: string;
  venue: string;
  doi: string;
  credibility: number;
  relevance: number;
  topicMatch: number;
  peerReviewed: boolean;
  note: string;
}

type ContentBlock =
  | { kind: "markdown"; text: string }
  | { kind: "insert"; text: string }
  | { kind: "source"; card: SourceCard };

// Parse assistant message into ordered blocks (markdown + insert-content + source-card)
function parseAssistantContent(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const regex = /<insert-content>([\s\S]*?)<\/insert-content>|<source-card\b([^>]*)>([\s\S]*?)<\/source-card>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({ kind: "markdown", text: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      blocks.push({ kind: "insert", text: match[1].trim() });
    } else {
      const attrs = match[2] || "";
      const note = (match[3] || "").trim();
      const getAttr = (k: string) =>
        new RegExp(`${k}="([^"]*)"`, "i").exec(attrs)?.[1] || "";
      blocks.push({
        kind: "source",
        card: {
          title: getAttr("title"),
          authors: getAttr("authors"),
          year: getAttr("year"),
          venue: getAttr("venue"),
          doi: getAttr("doi"),
          credibility: Number(getAttr("credibility")) || 0,
          relevance: Number(getAttr("relevance")) || 0,
          topicMatch: Number(getAttr("topicMatch")) || 0,
          peerReviewed: getAttr("peerReviewed").toLowerCase() === "true",
          note,
        },
      });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    blocks.push({ kind: "markdown", text: text.slice(lastIndex) });
  }
  return blocks;
}

const MODE_META: Record<AssistMode, { label: string; icon: typeof Sparkles; hint: string }> = {
  assist: { label: "Assist", icon: Sparkles, hint: "Balanced research assistant" },
  mine:   { label: "Mine",   icon: Telescope, hint: "Literature mining & source discovery" },
  build:  { label: "Build",  icon: FlaskConical, hint: "Frameworks, variables, methodology" },
  critique: { label: "Critique", icon: NotebookPen, hint: "Senior reviewer critique" },
};

const QUICK_ACTIONS: Record<AssistMode, { icon: typeof BookOpen; label: string; prompt: string }[]> = {
  assist: [
    { icon: Sparkles, label: "Suggest improvements", prompt: "Suggest improvements for the current section using my project context." },
    { icon: BookOpen, label: "Summarize my references", prompt: "Summarize the key themes across my imported references and relate them to my active section." },
    { icon: Search, label: "What should I add next?", prompt: "Given my project context and reviewer feedback, what should I work on next?" },
  ],
  mine: [
    { icon: Telescope, label: "Find recent studies", prompt: "Find recent (last 5 years) studies on my topic. Return source-cards with DOIs." },
    { icon: Library, label: "Find empirical studies", prompt: "Find empirical studies relevant to my variables and methodology. Return source-cards." },
    { icon: GitCompare, label: "Compare methodologies", prompt: "Compare methodological approaches used in literature on my topic. Surface contradictions." },
    { icon: ShieldCheck, label: "Highly cited papers", prompt: "List highly-cited foundational papers in my discipline relevant to my topic. Return source-cards." },
    { icon: Layers, label: "Detect literature gaps", prompt: "Identify literature gaps and underexplored themes in my topic area." },
  ],
  build: [
    { icon: Layers, label: "Theoretical framework", prompt: "Suggest a theoretical framework for my project and justify the choice." },
    { icon: FlaskConical, label: "Recommend methodology", prompt: "Recommend a methodology aligned with my research questions and discipline." },
    { icon: BookOpen, label: "Generate literature review", prompt: "Generate an empirical literature review draft for my active section. Wrap insertable content in <insert-content>." },
    { icon: Sparkles, label: "Conceptual framework", prompt: "Propose a conceptual framework linking my variables. Explain each relationship." },
  ],
  critique: [
    { icon: NotebookPen, label: "Detect unsupported claims", prompt: "Read my active section and flag unsupported claims, weak arguments, and logical gaps." },
    { icon: ShieldCheck, label: "Critique methodology", prompt: "Critique the methodology described in my project as a senior journal reviewer would." },
    { icon: Search, label: "Outdated references?", prompt: "Identify outdated or weak references in my library and suggest stronger replacements." },
    { icon: BookOpen, label: "Argument evaluation", prompt: "Evaluate the logical flow and argument strength of my active section." },
  ],
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-success" : value >= 60 ? "bg-primary" : "bg-warning";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-muted-foreground w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      <span className="text-[9px] font-medium w-6 text-right tabular-nums">{value}</span>
    </div>
  );
}

function SourceCardView({ card }: { card: SourceCard }) {
  return (
    <div className="my-2 border border-primary/20 rounded-md bg-card p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-semibold leading-snug flex-1">{card.title || "Untitled source"}</p>
        {card.peerReviewed && (
          <Badge variant="secondary" className="text-[9px] px-1 py-0 shrink-0 gap-0.5">
            <ShieldCheck className="h-2.5 w-2.5" /> Peer-reviewed
          </Badge>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight mb-0.5">{card.authors}</p>
      <p className="text-[10px] text-muted-foreground italic leading-tight mb-2">
        {card.venue}{card.year ? ` · ${card.year}` : ""}
      </p>
      {card.note && <p className="text-[10px] text-foreground leading-snug mb-2">{card.note}</p>}
      <div className="space-y-1 mb-2">
        <ScoreBar label="Credibility" value={card.credibility} />
        <ScoreBar label="Relevance" value={card.relevance} />
        <ScoreBar label="Topic match" value={card.topicMatch} />
      </div>
      {card.doi && (
        <a
          href={`https://doi.org/${card.doi}`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-primary hover:underline inline-flex items-center gap-1"
        >
          <ExternalLink className="h-2.5 w-2.5" /> doi.org/{card.doi}
        </a>
      )}
    </div>
  );
}

export default function AIChatPanel({ activeSectionId, onInsertContent }: AIChatPanelProps) {
  const { project } = useProject();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AssistMode>("assist");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeSection = project.sections.find((s) => s.id === activeSectionId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const buildProjectContext = useCallback(() => ({
    title: project.title,
    discipline: project.discipline,
    projectType: project.projectType,
    methodologyType: project.methodologyType,
    targetOutput: project.targetOutput,
    targetJournal: project.targetJournal,
    activeSection: activeSection?.title || "None",
    activeSectionContent: activeSection?.content || "",
    sectionTitles: project.sections.map((s) => s.title),
    wordCount: project.wordCount,
    targetWordCount: project.targetWordCount,
    integrityScore: project.integrityScore,
    referenceCount: project.references?.length || 0,
    reviewIssues: project.reviewIssues.map((i) => ({
      severity: i.severity, sectionTitle: i.sectionTitle, message: i.message, suggestion: i.suggestion,
    })),
    reviewScores: project.reviewScores.map((s) => ({
      category: s.category, score: s.score, maxScore: s.maxScore,
    })),
  }), [project, activeSection]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          projectContext: buildProjectContext(),
          mode,
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        toast({ title: "AI Error", description: errorData.error || `Error ${resp.status}`, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("Chat error:", e);
      toast({ title: "Connection Error", description: "Failed to reach AI service.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);
  const actions = QUICK_ACTIONS[mode];

  return (
    <div className="flex flex-col h-full">
      {/* Context + mode header */}
      <div className="px-3 py-2 border-b border-border bg-muted/30 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Telescope className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="text-[10px] font-semibold text-foreground truncate">Lit_MGR Research Intelligence</span>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1 text-muted-foreground hover:text-destructive" onClick={clearChat}>
              <Trash2 className="h-2.5 w-2.5 mr-0.5" /> Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(Object.keys(MODE_META) as AssistMode[]).map((m) => {
            const Icon = MODE_META[m].icon;
            const active = m === mode;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                title={MODE_META[m].hint}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors border",
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                )}
              >
                <Icon className="h-2.5 w-2.5" /> {MODE_META[m].label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          <Bot className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            Context: <span className="text-foreground">{activeSection?.title || "No section"}</span> · {project.references?.length || 0} refs
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="text-center py-3">
              <Telescope className="h-8 w-8 text-primary/40 mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">Lit_MGR · {MODE_META[mode].label} mode</p>
              <p className="text-[10px] text-muted-foreground mt-1 px-2">{MODE_META[mode].hint}</p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Quick actions</p>
              {actions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => sendMessage(a.prompt)}
                    className="w-full text-left px-3 py-2 text-xs rounded-md border border-border hover:bg-accent/50 hover:border-primary/30 transition-colors flex items-start gap-2"
                  >
                    <Icon className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-muted-foreground italic text-center pt-2 border-t border-border">
              Sources verified via DOI · No hallucinated references
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Telescope className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className={cn(
                "max-w-[88%] rounded-lg px-3 py-2 text-xs",
                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/60 text-foreground"
              )}>
                {msg.role === "assistant" ? (
                  <>
                    {parseAssistantContent(msg.content).map((block, bIdx) => {
                      if (block.kind === "markdown") {
                        if (!block.text.trim()) return null;
                        return (
                          <div key={bIdx} className="prose prose-xs prose-neutral dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_pre]:text-[10px]">
                            <ReactMarkdown>{block.text}</ReactMarkdown>
                          </div>
                        );
                      }
                      if (block.kind === "source") {
                        return <SourceCardView key={bIdx} card={block.card} />;
                      }
                      // insert
                      return (
                        <div key={bIdx} className="mt-2 mb-2 border border-primary/30 rounded-md bg-primary/5 p-2">
                          <div className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5" /> Generated content
                          </div>
                          <div className="text-xs leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto mb-2">
                            {block.text.slice(0, 300)}{block.text.length > 300 ? "..." : ""}
                          </div>
                          <Button
                            size="sm"
                            className="h-6 text-[10px] w-full gap-1"
                            onClick={() => onInsertContent(block.text)}
                          >
                            <Download className="h-2.5 w-2.5" /> Insert into {activeSection?.title || "Section"}
                          </Button>
                        </div>
                      );
                    })}
                    {isLoading && idx === messages.length - 1 && (
                      <span className="inline-block w-1.5 h-3.5 bg-primary/60 animate-pulse ml-0.5" />
                    )}
                  </>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2 items-center">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Telescope className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Mining literature…
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-2 border-t border-border">
        <div className="flex gap-1.5">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "mine" ? "Search literature, find gaps, compare studies…" :
              mode === "build" ? "Ask for frameworks, methods, variables…" :
              mode === "critique" ? "Ask Lit_MGR to critique this section…" :
              "Ask about your research…"
            }
            className="min-h-[36px] max-h-[80px] resize-none text-xs py-2 px-3"
            rows={1}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
