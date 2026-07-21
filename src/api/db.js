import { supabase } from "@/lib/supabase";
import { User } from "@/entities/User";
import { ForumPost } from "@/entities/ForumPost";
import { SSNLookup } from "@/entities/SSNLookup";
import { Address } from "@/entities/Address";
import { BatchAnalysis } from "@/entities/BatchAnalysis";
import { SavedSSN } from "@/entities/SavedSSN";
import { SavedAddress } from "@/entities/SavedAddress";
import { SkiptraceSearch } from "@/entities/SkiptraceSearch";
import { InvokeLLM, UploadFile } from "@/integrations/Core";

export const db = {
  auth: {
    async isAuthenticated() {
      const { data } = await supabase.auth.getSession();
      return Boolean(data.session);
    },
    me: () => User.me(),
    logout: (redirectTo) => User.logout(redirectTo || "/Login"),
    redirectToLogin: (redirectTo) =>
      User.loginWithRedirect(redirectTo || window.location.href),
  },
  entities: {
    ForumPost,
    SSNLookup,
    Address,
    BatchAnalysis,
    SavedSSN,
    SavedAddress,
    SkiptraceSearch,
  },
  integrations: {
    Core: { InvokeLLM, UploadFile },
  },
  appLogs: {
    async logUserInApp(pageName) {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) return;
        await supabase.from("app_activity_logs").insert({
          user_id: data.user.id,
          page_name: pageName,
        });
      } catch {
        /* ignore */
      }
    },
  },
};

export default db;
