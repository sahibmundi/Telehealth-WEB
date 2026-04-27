import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth, type AdminInfo } from "@/hooks/use-admin-auth";
import { ShieldCheck, Lock } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { admin, setSession } = useAdminAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) setLocation("/admin");
  }, [admin, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email.trim() || !form.password) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          (body && typeof body.error === "string" && body.error) ||
            "Invalid admin credentials.",
        );
        return;
      }
      const token = body.token as string;
      const adminInfo = body.admin as AdminInfo;
      setSession(token, adminInfo);
      setLocation("/admin");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Staff Sign In
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Sign in to manage appointment requests.
          </p>
        </div>

        <div className="bg-card border border-card-border rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <Label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@telephysio.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-11 sm:h-12" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
