import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, MessageSquare } from "lucide-react";
import { mockSupervisedStudents } from "@/data/mockSupervisor";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  from: "supervisor" | "student";
  text: string;
  time: string;
}

const mockConversations: Record<string, Message[]> = {
  "stu-001": [
    { id: "m1", from: "student", text: "Good morning Prof. I've submitted my literature review for your review.", time: "9:15 AM" },
    { id: "m2", from: "supervisor", text: "Thank you. I'll review it by end of day and provide feedback.", time: "10:30 AM" },
    { id: "m3", from: "student", text: "Appreciated. Should I proceed with the methodology draft in the meantime?", time: "10:45 AM" },
  ],
  "stu-002": [
    { id: "m4", from: "student", text: "I'm having trouble accessing the dataset for my analysis.", time: "Yesterday" },
    { id: "m5", from: "supervisor", text: "Let me check with the data custodian. I'll get back to you.", time: "Yesterday" },
  ],
};

const SupervisorMessages = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState(mockConversations);

  const students = mockSupervisedStudents.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = mockSupervisedStudents.find(s => s.id === selectedStudent);
  const messages = selectedStudent ? (conversations[selectedStudent] || []) : [];

  const handleSend = () => {
    if (!newMessage.trim() || !selectedStudent) return;
    const msg: Message = { id: `m-${Date.now()}`, from: "supervisor", text: newMessage.trim(), time: "Just now" };
    setConversations(prev => ({
      ...prev,
      [selectedStudent]: [...(prev[selectedStudent] || []), msg],
    }));
    setNewMessage("");
  };

  return (
    <div className="max-w-5xl animate-fade-in">
      <PageHeader title="Messages" subtitle="Communicate with your supervised students" />

      <Card className="shadow-card overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
        <div className="flex h-full">
          {/* Student list */}
          <div className="w-72 border-r border-border flex flex-col shrink-0">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-0.5">
                {students.map(s => {
                  const lastMsg = conversations[s.id]?.slice(-1)[0];
                  const unread = conversations[s.id] && conversations[s.id].slice(-1)[0]?.from === "student";
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg transition-colors",
                        selectedStudent === s.id ? "bg-sidebar-accent" : "hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                          {s.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{s.name}</p>
                            {unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{lastMsg?.text || "No messages yet"}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {selected ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {selected.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.degreeLevel} · {selected.department}</p>
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map(m => (
                      <div key={m.id} className={cn("flex", m.from === "supervisor" ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[75%] rounded-lg p-3 text-sm",
                          m.from === "supervisor" ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <p>{m.text}</p>
                          <p className={cn("text-xs mt-1", m.from === "supervisor" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</p>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-10">No messages yet. Start the conversation.</p>
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="min-h-[40px] max-h-[100px] resize-none"
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                  <Button onClick={handleSend} disabled={!newMessage.trim()} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Select a student to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupervisorMessages;
