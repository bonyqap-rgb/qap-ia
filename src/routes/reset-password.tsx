import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout, authHead } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reset-password")({
  head: () =>
    authHead(
      "Nova senha — QAP IA",
      "Defina uma nova senha para a sua conta QAP IA.",
      "/reset-password",
    ),
  component: ResetPasswordPage,
});

function strength(value: string) {
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

const labels = ["Muito fraca", "Fraca", "Razoável", "Boa", "Forte"];

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const score = strength(password);
  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mismatch) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Senha atualizada");
      navigate({ to: "/login" });
    }, 700);
  };

  return (
    <AuthLayout
      title="Criar nova senha"
      description="Escolha uma senha forte e exclusiva para a sua conta."
      footer={
        <Link to="/login" className="font-medium text-azure hover:underline">
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <div className="flex items-center gap-1.5 pt-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < score ? "bg-azure" : "bg-muted",
                )}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Segurança: {labels[score]}</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirmar senha</Label>
          <Input
            id="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            aria-invalid={mismatch}
          />
          {mismatch && <p className="text-xs text-destructive">As senhas não coincidem.</p>}
        </div>

        <Button
          type="submit"
          disabled={loading || mismatch}
          className="w-full gap-2 bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
        >
          <KeyRound className="h-4 w-4" />
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
    </AuthLayout>
  );
}
