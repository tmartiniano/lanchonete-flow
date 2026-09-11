import {
  Boxes,
  ChartNoAxesCombined,
  CreditCard,
  LayoutDashboard,
  PackageOpen,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", to: "/", number: "01", icon: LayoutDashboard },
  { label: "Produtos", to: "/produtos", number: "02", icon: PackageOpen },
  { label: "Categorias", to: "/categorias", number: "03", icon: Boxes },
  { label: "Clientes", to: "/clientes", number: "04", icon: Users },
  { label: "Pedidos", to: "/pedidos", number: "05", icon: ReceiptText },
  { label: "Pagamentos", to: "/pagamentos", number: "06", icon: CreditCard },
  { label: "Relatórios", to: "/relatorios", number: "07", icon: ChartNoAxesCombined },
  { label: "Configurações", to: "/configuracoes", number: "08", icon: Settings },
] as const;
