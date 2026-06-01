import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/auth-store";
import logo from "@/assets/cevaroli-logo.jpg";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(3, "Mínimo 3 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const { user, token } = await authService.login(values);
      login(user, token);
      navigate({ to: "/campaigns" });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Falha ao autenticar.");
    }
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 bg-[var(--bg-canvas)] lg:grid-cols-[55fr_45fr]">
      {/* Left decorative panel */}
      <section className="relative hidden overflow-hidden border-r border-[var(--border-subtle)] lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-0 bg-grid-subtle opacity-100" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-accent)", opacity: 0.55 }}
        />
        <div className="relative z-10 max-w-xl">
          <img
            src={logo}
            alt="Cevaroli"
            className="mb-10 h-14 w-14 rounded-xl object-cover shadow-[var(--shadow-md)]"
          />
          <h1 className="font-display text-[52px] leading-[1.05] text-[var(--text-primary)]">
            Gestão de Ofertas
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Grupo Cevaroli · Inteligência Promocional
          </p>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Plataforma corporativa para orquestrar campanhas, folhetos e peças digitais com margem
            controlada do início ao exporte.
          </p>
        </div>
        <span className="absolute bottom-6 left-16 z-10 font-mono text-[11px] text-[var(--text-tertiary)]">
          v1.0
        </span>
      </section>

      {/* Right form panel */}
      <section className="flex items-center justify-center bg-[var(--bg-surface)] px-6 py-12">
        <div className="w-full max-w-[380px]">
          <div className="section-label mb-8">Acesso à plataforma</div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[12px] text-[var(--text-secondary)]">
                Email corporativo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="ds-input"
                placeholder="seu.email@cevaroli.com.br"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[12px] text-[var(--status-critical)]">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[12px] text-[var(--text-secondary)]">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="ds-input pr-11"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 my-auto grid h-8 w-8 place-items-center rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff size={15} strokeWidth={1.5} />
                  ) : (
                    <Eye size={15} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[12px] text-[var(--status-critical)]">
                  {errors.password.message}
                </p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-primary)] text-[14px] font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
            </button>

            {serverError && (
              <div className="flex items-start gap-2 rounded-md border-l-2 border-[var(--status-critical)] bg-[var(--status-critical-muted)] px-3 py-2 text-[12px] text-[var(--status-critical)]">
                <AlertCircle size={14} strokeWidth={1.5} className="mt-px" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="mt-6 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-canvas)] p-3">
              <div className="section-label mb-2 text-[10px]">Acesso demo</div>
              <p className="text-[11px] leading-relaxed text-[var(--text-tertiary)]">
                Qualquer email válido. Use a senha para escolher o papel: <span className="font-mono text-[var(--text-secondary)]">cevaroli</span> (admin), <span className="font-mono text-[var(--text-secondary)]">comprador</span>, <span className="font-mono text-[var(--text-secondary)]">marketing</span>, <span className="font-mono text-[var(--text-secondary)]">designer</span>.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
