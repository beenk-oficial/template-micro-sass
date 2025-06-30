import { useWhitelabelStore } from "@/stores/whitelabel";
import { setRootColors } from "@/utils/setRootColors";

export function useWhitelabel() {
  const colors = useWhitelabelStore((state) => state.colors);
  const name = useWhitelabelStore((state) => state.name);
  const logo = useWhitelabelStore((state) => state.logo);
  const marketing_banner = useWhitelabelStore(
    (state) => state.marketing_banner
  );
  const company = useWhitelabelStore((state) => state.company);
  const slug = useWhitelabelStore((state) => state.slug);
  const domain = useWhitelabelStore((state) => state.domain);

  const setColors = useWhitelabelStore((state) => state.setColors);
  const setCompany = useWhitelabelStore((state) => state.setCompany);

  async function loadCompany() {
    const response = await fetch(`/api/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, domain }),
    });

    const data = await response.json();

    if (data.id) {
      setCompany(data);
    }
  }

  async function loadWhitelabel() {
    await loadCompany();
    const response = await fetch(`/api/${company?.id}/whitelabel`);
    const data = await response.json();
    setColors(data.colors);
    setRootColors(data.colors);
    useWhitelabelStore.setState({
      name: data.name,
      logo: data.logo,
      marketing_banner: data.marketing_banner,
      favicon: data.favicon,
    });
  }

  return {
    colors,
    name,
    logo,
    marketing_banner,
    loadWhitelabel,
    loadCompany,
  };
}
