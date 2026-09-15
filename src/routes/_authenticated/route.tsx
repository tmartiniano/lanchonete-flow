import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { getMyAccess } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login", search: { reason: undefined } });
    const access = await getMyAccess();
    if (!access.authorized) {
      await supabase.auth.signOut();
      throw redirect({ to: "/login", search: { reason: "unauthorized" } });
    }
    if (access.profile.must_change_password && location.pathname !== "/trocar-senha") {
      throw redirect({ to: "/trocar-senha" });
    }
    return access;
  },
  component: () => <Outlet />,
});
