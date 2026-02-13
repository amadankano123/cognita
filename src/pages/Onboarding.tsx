import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Onboarding = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would create a new project
    navigate("/app/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Create a New Project</h1>
        <p className="text-muted-foreground text-center mb-8">Set up your research project in seconds.</p>

        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI-Based Early Detection of Crop Diseases" />
            </div>
            <div>
              <Label htmlFor="subtitle">Short Description</Label>
              <Textarea id="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="A brief summary of your research goals..." rows={3} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Create Project</Button>
              <Button type="button" variant="outline" onClick={() => navigate("/app/dashboard")}>
                Skip — Use Demo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
