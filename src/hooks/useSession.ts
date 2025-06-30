import { useUserStore } from "@/stores/user";
import { useWhitelabelStore } from "@/stores/whitelabel";

export const useSession = () => {
  const companyUser = useUserStore((state) => state.user);
  const companyUserId = useUserStore((state) => state.user?.id);
  const userId = useUserStore((state) => state.user?.user_id);
  const company = useWhitelabelStore((state) => state.company);
  const companyId = useWhitelabelStore((state) => state.company?.id);
  const slug = useWhitelabelStore((state) => state.company?.slug);
  const domain = useWhitelabelStore((state) => state.company?.domain);

  return {
    companyUser,
    companyUserId,
    company,
    companyId,
    userId,
    slug,
    domain,
  };
};
