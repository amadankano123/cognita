import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import {
  Send, Loader2, Sparkles, Download, Trash2, Bot, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/context/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  activeSectionId?: string;
  onInsertContent: (content: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

// Extract <insert-content> blocks from assistant messages
function extractInsertBlocks(text: string): { before: string; insertable: string; after: string }[] {
  const regex = /<insert-content>([\s\S]*?)<\/insert-content>/g;
  const parts: { before: string; insertable: string; after: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    parts.push({
      before: text.slice(lastIndex, match.index),
      insertable: match[1].trim(),
      after: "",
    });
    lastIndex = match.index + match[0].length;
  }

  if (parts.length === 0) return [{ before: text, insertable: "", after: "" }];
  if (lastIndex < text.length) {
    parts[parts.length - 1].after = text.slice(lastIndex);
  }
  return parts;
}

const SUGGESTION_PROMPTS = [
  "Suggest improvements for the current section",
  "Help me strengthen my methodology",
  "Generate content for this section",
  "What are the reviewer's main concerns?",
];

export default function AIChatPanel({ activeSectionId, onInsertContent }: AIChatPanelProps) {
  const { project } = useProject();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeSection = project.sections.find((s) => s.id === activeSectionId);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
    reviewIssues: project.reviewIssues.map((i) => ({
      severity: i.severity,
      sectionTitle: i.sectionTitle,
      message: i.message,
      suggestion: i.suggestion,
    })),
    reviewScores: project.reviewScores.map((s) => ({
      category: s.category,
      score: s.score,
      maxScore: s.maxScore,
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
        }),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        const errorMsg = errorData.error || `Error ${resp.status}`;
        toast({ title: "AI Error", description: errorMsg, variant: "destructive" });
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
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

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

      // Final flush
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

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Context indicator */}
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-medium text-muted-foreground">
            Context: <span className="text-foreground">{activeSection?.title || "No section selected"}</span>
          </span>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" className="h-5 text-[10px] px-1 mt-1 text-muted-foreground hover:text-destructive" onClick={clearChat}>
            <Trash2 className="h-2.5 w-2.5 mr-0.5" /> Clear chat
          </Button>
        )}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <div className="text-center py-4">
              <Sparkles className="h-8 w-8 text-primary/40 mx-auto mb-2" />
              <p className="text-xs font-medium text-foreground">AI Research Assistant</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Context-aware suggestions based on your project and reviewer feedback.
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">Suggestions</p>
              {SUGGESTION_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left px-3 py-2 text-xs rounded-md border border-border hover:bg-accent/50 hover:border-primary/30 transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-primary inline mr-1.5" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-xs",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-foreground"
              )}>
                {msg.role === "assistant" ? (
                  <>
                    {extractInsertBlocks(msg.content).map((block, bIdx) => (
                      <div key={bIdx}>
                        {block.before && (
                          <div className="prose prose-xs prose-neutral dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_pre]:text-[10px]">
                            <ReactMarkdown>{block.before}</ReactMarkdown>
                          </div>
                        )}
                        {block.insertable && (
                          <div className="mt-2 mb-2 border border-primary/30 rounded-md bg-primary/5 p-2">
                            <div className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                              <Sparkles className="h-2.5 w-2.5" /> Generated content
                            </div>
                            <div className="text-xs leading-relaxed whitespace-pre-line max-h-32 overflow-y-auto mb-2">
                              {block.insertable.slice(0, 300)}{block.insertable.length > 300 ? "..." : ""}
                            </div>
                            <Button
                              size="sm"
                              className="h-6 text-[10px] w-full gap-1"
                              onClick={() => onInsertContent(block.insertable)}
                            >
                              <Download className="h-2.5 w-2.5" /> Insert into {activeSection?.title || "Section"}
                            </Button>
                          </div>
                        )}
                        {block.after && (
                          <div className="prose prose-xs prose-neutral dark:prose-invert max-w-none [&_p]:my-1">
                            <ReactMarkdown>{block.after}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
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
              <Bot className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-2 border-t border-border">
        <div className="flex gap-1.5">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your research…"
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
