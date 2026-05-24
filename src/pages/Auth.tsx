import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import cognitaLogo from "@/assets/cognita-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { AppRole, ADMIN_ROLES, HOD_ROLES, STUDENT_ROLES, ROLE_GROUPS } from "@/types/research";
import { ROLE_HOME_ROUTE } from "@/lib/permissions";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [name, setName] = useState("");
  const [role, setRole] = useState<AppRole | "">("");
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const getPostAuthRoute = (selectedRole: AppRole, isSignup: boolean) => {
    if (isSignup) {
      if (ADMIN_ROLES.includes(selectedRole)) return "/admin-onboarding";
      if (HOD_ROLES.includes(selectedRole)) return "/hod-onboarding";
      if (selectedRole === "Supervisor") return "/supervisor-onboarding";
      if (([...STUDENT_ROLES, "Researcher"] as AppRole[]).includes(selectedRole)) return "/onboarding";
    }
    return ROLE_HOME_ROUTE[selectedRole] ?? "/auth";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select your role to continue");
      return;
    }
    const effectiveEmail = email || "demo@cognita.edu";
    if (mode === "login") {
      const success = login(effectiveEmail, password, role);
      if (success) navigate(getPostAuthRoute(role, false));
    } else {
      const success = signup(name, effectiveEmail, password, role);
      if (success) navigate(getPostAuthRoute(role, true));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={cognitaLogo} alt="Cognita Logo – Academic cap on book" className="h-12 w-12 object-contain mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Welcome to Cognita</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {mode === "login" ? "Sign in to continue" : "Create your account"}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="flex mb-6 border-b border-border">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 pb-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  mode === m ? "border-primary text-primary" : "border-transparent text-muted-foreground"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Doe" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@institution.edu" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
              <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_GROUPS.map((group) => (
                    <SelectGroup key={group.label}>
                      <SelectLabel className="text-xs text-muted-foreground uppercase tracking-wide">{group.label}</SelectLabel>
                      {group.roles.map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {role && ADMIN_ROLES.includes(role as AppRole) && (
                <p className="text-xs text-primary mt-1">🏛️ You'll be directed to the Institutional Dashboard</p>
              )}
              {role && HOD_ROLES.includes(role as AppRole) && (
                <p className="text-xs text-primary mt-1">🏢 You'll be directed to the Department Dashboard</p>
              )}
              {role && !role && (
                <p className="text-xs text-muted-foreground mt-1">Choose your role to continue</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={!role}>
              {mode === "login" ? "Login" : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Select your role — you'll land on the dashboard for that role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
