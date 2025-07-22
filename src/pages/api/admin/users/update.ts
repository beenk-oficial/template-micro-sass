import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, ...updates } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .single();

    if (error) {
      return res.status(400).json({ message: "Failed to update user", error });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
