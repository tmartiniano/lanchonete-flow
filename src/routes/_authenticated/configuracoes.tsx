import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Ponto de Apoio" },
      { name: "description", content: "Configurações do sistema da lanchonete." },
      { property: "og:title", content: "Configurações — Ponto de Apoio" },
      { property: "og:description", content: "Configurações do sistema da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Configurações"
      description="Preferências operacionais e integrações futuras serão centralizadas nesta área."
      icon={Settings}
      phase="Fase 2 e fases seguintes"
    />
  ),
});
