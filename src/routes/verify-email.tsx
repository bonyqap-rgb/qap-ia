import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

import { AuthLayout, authHead } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export const Route = createFileRoute("/verify-email")({
  head: () =>
    authHead(
      "Verificar e-mail — QAP IA",
      "Confirme o código enviado para o seu e-mail e ative a conta QAP IA.",
      "/verify-email",
    ),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [code, setCode] = useState("");

  return (
    <AuthLayout
      title="Confirme seu e-mail"
      description="Enviamos um código de 6 dígitos para o e-mail informado no cadastro."
      footer={
        <>
          E-mail errado?{" "}
          <Link to="/signup" className="font-medium text-azure hover:underline">
            Refazer cadastro
          </Link>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          type="button"
          disabled={code.length < 6}
          onClick={() => toast.success("E-mail confirmado")}
          className="w-full gap-2 bg-gradient-azure text-primary-foreground shadow-azure hover:brightness-110"
        >
          <MailCheck className="h-4 w-4" />
          Confirmar e-mail
        </Button>

        <button
          type="button"
          onClick={() => toast.success("Novo código enviado")}
          className="w-full text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Não recebeu? Reenviar código
        </button>
      </div>
    </AuthLayout>
  );
}
