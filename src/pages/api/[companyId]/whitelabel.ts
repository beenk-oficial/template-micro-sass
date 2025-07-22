import type { NextApiRequest, NextApiResponse } from "next";

const whitelabelData = {
  colors: {
    background: "#1E1B2E",
    foreground: "#F5F5FF",

    radius: "6px",
    card: "#2C2547",
    "card-foreground": "#FFFFFF",

    popover: "#3A2F5E",
    "popover-foreground": "#EDE9FE",

    primary: "#8A22F2",
    "primary-foreground": "#FFFFFF",

    secondary: "#3D1673",
    "secondary-foreground": "#FFFFFF",

    muted: "#7C1BA6",
    "muted-foreground": "#D8B4FE",

    accent: "#7C1ED9",
    "accent-foreground": "#FFFFFF",

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
    "sidebar-foreground": "#F5F5F5",

    "sidebar-primary": "#A950FF",
    "sidebar-primary-foreground": "#0D011A",

    "sidebar-accent": "#9B40F9",
    "sidebar-accent-foreground": "#0D011A",

    "sidebar-border": "#3E325F",
    "sidebar-ring": "#C48CFF",
  },

  name: "Beenk",
  logo: "/beenk.png",
  favicon: "/beenk_favicon.png",
  email: "beenk@gmail.com",
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
