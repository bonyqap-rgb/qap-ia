import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout, authHead } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/signup")({
  head: () =>
    authHead(
      "Criar conta — QAP IA",
      "Crie sua conta gratuita no QAP IA e faça a primeira consulta.",
      "/signup",
    ),
  component: SignupPage,
});

function SignupPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Conta criada", { description: "Confirme o e-mail para continuar." });
      navigate({ to: "/verify-email" });
    }, 700);
  };

  return (
    <AuthLayout
      title="Criar conta gratuita"
      description="Sem cartão de crédito. Você pode migrar de plano a qualquer momento."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-azure hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" required autoComplete="name" placeholder="Seu nome" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail institucional</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@instituicao.gov.br"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="unit">Unidade</Label>
            <Input id="unit" placeholder="Ex.: 1º BPM" autoComplete="organization" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Função</Label>
            <Select defaultValue="operacional">
              <SelectTrigger id="role">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="operacional">Operacional</SelectItem>
                <SelectItem value="administrativo">Administrativo</SelectItem>
                <SelectItem value="juridico">Jurídico</SelectItem>
                <SelectItem value="comando">Comando</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="Mínimo de 8 caracteres"
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Use ao menos 8 caracteres, com letras e números.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox id="terms" required className="mt-0.5" />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-relaxed text-muted-foreground"
          >
            Li e aceito os{" "}
            <Link to="/terms" className="font-medium text-azure hover:underline">
              Termos de Uso
            </Link>{" "}
            e a{" "}
            <Link to="/privacy" className="font-medium text-azure hover:underline">
              Política de Privacidade
            </Link>
            .
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full gap-2 bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
        >
          <UserPlus className="h-4 w-4" />
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>
    </AuthLayout>
  );
}
