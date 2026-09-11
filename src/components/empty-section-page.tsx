import type { LucideIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export function EmptySectionPage({
  title,
  description,
  icon: Icon,
  phase,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  phase: string;
}) {
  return (
    <AppShell>
      <header className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Área do sistema</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      <section className="mt-6 grid min-h-[360px] place-items-center rounded-lg border border-dashed border-border bg-surface/60 p-8 text-center">
        <div className="max-w-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-md bg-primary/15 text-primary-ink">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <h2 className="mt-4 text-base font-semibold">Área preparada para evolução</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Nenhum dado foi incluído nesta etapa. Esta funcionalidade será implementada na {phase}.</p>
        </div>
      </section>
    </AppShell>
  );
}
