import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout, authHead } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    authHead(
      "Recuperar senha — QAP IA",
      "Receba um link para redefinir a senha da sua conta QAP IA.",
      "/forgot-password",
    ),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Link enviado", { description: "Verifique a sua caixa de entrada." });
      navigate({ to: "/reset-password" });
    }, 700);
  };

  return (
    <AuthLayout
      title="Esqueci minha senha"
      description="Informe o e-mail cadastrado e enviaremos um link para criar uma nova senha."
      footer={
        <>
          Lembrou a senha?{" "}
          <Link to="/login" className="font-medium text-azure hover:underline">
            Voltar para o login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@instituicao.gov.br"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
        >
          <Mail className="h-4 w-4" />
          {loading ? "Enviando..." : "Enviar link de recuperação"}
        </Button>
      </form>
    </AuthLayout>
  );
}
