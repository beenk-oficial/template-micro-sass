import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, domain } = req.body;

  if (!slug && !domain) {
    return res.status(400).json({ error: "Slug or domain are required" });
  }

  const supabase = createServerSupabaseClient({ req, res });

  try {
    const query = supabase
      .from("companies")
      .select(
        "id, white_label_id, name, slug, domain, email, locale, timezone, currency, phone, status"
      );

    if (slug) {
      query.eq("slug", slug);
    } else {
      query.eq("domain", "localhost");
    }

    const { data: company, error } = await query.single();

    if (error || !company) {
      return res.status(404).json({ error: "Company not found" });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
