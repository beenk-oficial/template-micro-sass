import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { full_name, email, type, ...rest } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .insert([{ full_name, email, type, ...rest }])
      .single();

    if (error) {
      return res.status(400).json({ message: "Failed to create user", error });
    }

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
