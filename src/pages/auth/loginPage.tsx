import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.email || !form.password || loading) return;

    try {
      setError(null);
      setLoading(true);

      await login(form);

      navigate("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Check credentials and API base URL.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 min-h-screen items-center justify-center bg-white p-4 dark:bg-black">
      <p className="text-5xl tracking-wide text-black uppercase font-light">
        Bhola Admin
      </p>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="mt-1 text-2xl font-semibold">Sign in</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>

              <Input
                type="email"
                placeholder="admin@bhola.app"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>

              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
