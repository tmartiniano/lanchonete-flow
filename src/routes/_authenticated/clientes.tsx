import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { EmptySectionPage } from "@/components/empty-section-page";
export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Trilha do Sabor" },
      { name: "description", content: "Gestão de clientes da lanchonete." },
      { property: "og:title", content: "Clientes — Trilha do Sabor" },
      { property: "og:description", content: "Gestão de clientes da lanchonete." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <EmptySectionPage
      title="Clientes"
      description="Cadastros e histórico de clientes serão organizados nesta área."
      icon={Users}
      phase="Fase 5"
    />
  ),
});
