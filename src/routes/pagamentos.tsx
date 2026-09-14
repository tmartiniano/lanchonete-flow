import { createFileRoute } from "@tanstack/react-router";
import { CreditCard } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/pagamentos")({
  head: () => ({
    meta: [
      { title: "Pagamentos — Ponto de Apoio" },
      { name: "description", content: "Gestão dos pagamentos da lanchonete." },
      { property: "og:title", content: "Pagamentos — Ponto de Apoio" },
      { property: "og:description", content: "Gestão dos pagamentos da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Pagamentos"
      description="Recebimentos e conferências financeiras aprovadas serão reunidos nesta área."
      icon={CreditCard}
      phase="Fase 6"
    />
  ),
});
