import { createFileRoute } from "@tanstack/react-router";
import { ChartNoAxesCombined } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Trilha do Sabor" },
      { name: "description", content: "Indicadores e relatórios da lanchonete." },
      { property: "og:title", content: "Relatórios — Trilha do Sabor" },
      { property: "og:description", content: "Indicadores e relatórios da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Relatórios"
      description="Indicadores baseados em dados reais serão apresentados nesta área."
      icon={ChartNoAxesCombined}
      phase="Fase 7"
    />
  ),
});
