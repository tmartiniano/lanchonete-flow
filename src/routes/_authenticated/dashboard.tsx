import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Boxes, ReceiptText, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Ponto de Apoio" },
      { name: "description", content: "Visão geral da operação da lanchonete." },
      { property: "og:title", content: "Dashboard — Ponto de Apoio" },
      { property: "og:description", content: "Visão geral da operação da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const metrics = [
  ["Faturamento hoje", "R$ 0,00", "Aguardando dados reais"],
  ["Pedidos abertos", "0", "Nenhum pedido registrado"],
  ["Produtos ativos", "0", "Cardápio ainda vazio"],
  ["Clientes cadastrados", "0", "Base ainda não conectada"],
];

function Dashboard() {
  return (
    <AppShell>
      <header>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Visão geral
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Horário de pico, tudo no lugar</h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
          A estrutura está pronta. As métricas serão preenchidas somente quando a base de dados for
          conectada.
        </p>
      </header>

      <section
        aria-label="Indicadores"
        className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4"
      >
        {metrics.map(([label, value, detail], index) => (
          <article
            key={label}
            className="rise rounded-lg border border-border bg-surface p-4 shadow-sm"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </article>
        ))}
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Movimentação do balcão</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Pedidos
            </span>
          </div>
          <div className="mt-4 rounded-md border border-dashed border-border bg-background/60 p-8 text-center">
            <ReceiptText aria-hidden="true" className="mx-auto size-6 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Nenhum pedido no momento</p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              A movimentação aparecerá aqui após a implementação dos pedidos e da base de dados.
            </p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Em preparo", "—"],
              ["Na fila", "—"],
              ["Concluídos", "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-border bg-background/50 p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <h2 className="font-semibold">Fundação preparada</h2>
          <div className="mt-4 space-y-3">
            {[
              [Boxes, "Catálogo", "Produtos e categorias"],
              [Users, "Relacionamento", "Clientes e histórico"],
              [ReceiptText, "Operação", "Pedidos e pagamentos"],
            ].map(([Icon, label, detail]) => {
              const ItemIcon = Icon as typeof Boxes;
              return (
                <div
                  key={String(label)}
                  className="flex items-center gap-3 rounded-md border border-border bg-background/50 p-3"
                >
                  <ItemIcon className="size-4 text-primary-ink" />
                  <div>
                    <p className="text-sm font-medium">{String(label)}</p>
                    <p className="text-xs text-muted-foreground">{String(detail)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-4 rounded-lg border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold">Próximas fases</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Roteiro
          </span>
        </div>
        <ol className="mt-3 divide-y divide-border">
          {[
            "Backend, autenticação e permissões",
            "Modelo de dados e políticas de segurança",
            "Catálogo de produtos e categorias",
            "Clientes, pedidos e pagamentos",
            "Relatórios e integrações aprovadas",
          ].map((item, index) => (
            <li key={item} className="flex items-center gap-3 py-3 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[10px] text-muted-foreground">
                {index + 2}
              </span>
              <span>{item}</span>
              <ArrowRight aria-hidden="true" className="ml-auto size-4 text-muted-foreground" />
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}
