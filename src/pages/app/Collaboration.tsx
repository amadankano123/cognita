import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useProject } from "@/context/ProjectContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, MessageSquare } from "lucide-react";

const roleColors: Record<string, string> = {
  owner: "bg-primary text-primary-foreground",
  editor: "bg-accent text-accent-foreground",
  reviewer: "bg-warning text-warning-foreground",
  viewer: "bg-secondary text-secondary-foreground",
};

const mockComments = [
  { id: "cm1", user: "Dr. Fatima Al-Hassan", section: "Methodology", text: "Consider adding a more detailed explanation of the channel attention mechanism. Reviewers may not be familiar with this approach.", timestamp: "2 hours ago", replies: [
    { id: "cm1r1", user: "Dr. Amara Osei", text: "Good point — I'll add a paragraph with a diagram reference in the next revision.", timestamp: "1 hour ago" },
  ]},
  { id: "cm2", user: "Prof. James Mwangi", section: "Literature Review", text: "We should include the 2024 paper by Wani et al. on Vision Transformers for crop disease detection.", timestamp: "1 day ago", replies: [] },
];

const Collaboration = () => {
  const { project } = useProject();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  return (
    <div className="max-w-4xl animate-fade-in">
      <PageHeader
        title="Collaboration"
        subtitle="Manage your research team"
        breadcrumb={project.title}
      />

      {/* Invite */}
      <Card className="p-5 shadow-card mb-6">
        <h3 className="font-display font-semibold mb-3">Invite Collaborator</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter email address…"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1"
          />
          <Select value={inviteRole} onValueChange={setInviteRole}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="reviewer">Commenter</SelectItem>
            </SelectContent>
          </Select>
          <Button><UserPlus className="h-4 w-4 mr-2" /> Invite</Button>
        </div>
      </Card>

      {/* Team members */}
      <Card className="shadow-card mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Team Members</h3>
        </div>
        <div className="divide-y divide-border">
          {project.collaborators.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary shrink-0">
                {c.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
              <Badge className={roleColors[c.role] + " text-xs capitalize"}>{c.role}</Badge>
              <span className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                Active {c.lastActive}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Activity feed */}
      <Card className="shadow-card mb-6">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold">Recent Activity</h3>
        </div>
        <div className="divide-y divide-border">
          {project.activities.map((a) => (
            <div key={a.id} className="px-4 py-3">
              <p className="text-sm">
                <span className="font-medium">{a.user}</span>{" "}
                <span className="text-muted-foreground">{a.action}</span>{" "}
                <span className="font-medium">{a.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.timestamp}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Comments */}
      <Card className="shadow-card">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Discussion Threads
          </h3>
        </div>
        <div className="divide-y divide-border">
          {mockComments.map((comment) => (
            <div key={comment.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {comment.user.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-sm font-medium">{comment.user}</span>
                <Badge variant="secondary" className="text-[10px]">{comment.section}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">{comment.timestamp}</span>
              </div>
              <p className="text-sm text-foreground ml-9">{comment.text}</p>
              {comment.replies.map((reply) => (
                <div key={reply.id} className="ml-9 mt-3 pl-4 border-l-2 border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{reply.user}</span>
                    <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                  </div>
                  <p className="text-xs text-foreground">{reply.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Collaboration;
