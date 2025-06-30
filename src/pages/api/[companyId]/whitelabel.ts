import type { NextApiRequest, NextApiResponse } from "next";

const whitelabelData = {
  colors: {
    background: "#1E1B2E", // tom escuro para contraste
    foreground: "#F5F5FF", // texto claro

    radius: "6px",
    card: "#2C2547",
    cardForeground: "#FFFFFF",

    popover: "#3A2F5E",
    popoverForeground: "#EDE9FE",

    primary: "#8A22F2",
    primaryForeground: "#FFFFFF",

    secondary: "#3D1673",
    secondaryForeground: "#FFFFFF",

    muted: "#7C1BA6",
    mutedForeground: "#D8B4FE",

    accent: "#7C1ED9",
    accentForeground: "#FFFFFF",

    destructive: "#DC3545",
    border: "#4E3C63",
    input: "#2A213D",
    ring: "#8A22F2",

    chart1: "#7C1BA6",
    chart2: "#8A22F2",
    chart3: "#7C1ED9",
    chart4: "#3D1673",
    chart5: "#AA22F2",

    sidebar: "#1A112F",
    sidebarForeground: "#FFFFFF",
    sidebarPrimary: "#8A22F2",
    sidebarPrimaryForeground: "#FFFFFF",
    sidebarAccent: "#7C1ED9",
    sidebarAccentForeground: "#FFFFFF",
    sidebarBorder: "#332B4D",
    sidebarRing: "#8A22F2",
  },

  name: "Beenk",
  logo: "/beenk.png",
  marketing_banner: {
    login: "/marketing-banner.svg",
    signup: "/marketing-banner.svg",
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" });
  }

  res.status(200).json(whitelabelData);
}
