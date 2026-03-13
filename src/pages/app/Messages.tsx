import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockSupervisorUser } from "@/data/mockProject";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  from: "supervisor" | "student";
  authorName: string;
  text: string;
  time: string;
}

/** Shared conversation seed keyed by student ID — mirrors SupervisorMessages */
const studentConversations: Record<string, Message[]> = {
  "stu-ug-001": [
    { id: "m1", from: "student", authorName: "Fatima Al-Hassan", text: "Good morning Prof. I've submitted my literature review for your review.", time: "9:15 AM" },
    { id: "m2", from: "supervisor", authorName: "Prof. Kwame Mwangi", text: "Thank you Fatima. I'll review it by end of day and provide feedback.", time: "10:30 AM" },
    { id: "m3", from: "student", authorName: "Fatima Al-Hassan", text: "Appreciated. Should I proceed with the methodology draft in the meantime?", time: "10:45 AM" },
  ],
  "stu-pg-002": [
    { id: "m10", from: "student", authorName: "James Thornton", text: "Prof, I've completed the first draft of my research design chapter.", time: "Yesterday" },
    { id: "m11", from: "supervisor", authorName: "Prof. Kwame Mwangi", text: "Great progress James. I'll review it this week. Please also prepare the ethics application.", time: "Yesterday" },
  ],
  "stu-pg-001": [
    { id: "m8", from: "student", authorName: "Amara Okafor", text: "Prof, I've submitted my preliminary findings paper draft for co-author review.", time: "5 hours ago" },
    { id: "m9", from: "supervisor", authorName: "Prof. Kwame Mwangi", text: "Excellent work Amara. I'll review and add comments by Friday. Also, let's discuss the ε parameter selection for the differential privacy experiment.", time: "4 hours ago" },
  ],
};

const Messages = () => {
  const { user } = useAuth();
  const studentId = user?.id || "stu-ug-001";
  const studentName = user?.name || "Student";

  const supervisor = mockSupervisorUser;
  const initials = supervisor.name.split(" ").map(n => n[0]).join("");

  const [messages, setMessages] = useState<Message[]>(
    studentConversations[studentId] || []
  );
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: "student",
      authorName: studentName,
      text: newMessage.trim(),
      time: "Just now",
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage("");
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <PageHeader title="Messages" subtitle="Chat with your assigned supervisor" />

      <Card className="shadow-card overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium">{supervisor.name}</p>
              <p className="text-xs text-muted-foreground">Supervisor · {supervisor.institution}</p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id} className={cn("flex", m.from === "student" ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[75%] rounded-lg p-3 text-sm",
                    m.from === "student" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <p className={cn("text-xs font-medium mb-1", m.from === "student" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.authorName}</p>
                    <p>{m.text}</p>
                    <p className={cn("text-xs mt-1", m.from === "student" ? "text-primary-foreground/70" : "text-muted-foreground")}>{m.time}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="flex-1 flex items-center justify-center py-10">
                  <div className="text-center">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No messages yet. Start the conversation with your supervisor.</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border flex gap-2 shrink-0">
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
        </div>
      </Card>
    </div>
  );
};

export default Messages;
