import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, ids } = req.body;

  try {
    if (id) {
      const { error } = await supabase.from("users").delete().eq("id", id);

      if (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete user", error });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } else if (ids && Array.isArray(ids)) {
      const { error } = await supabase.from("users").delete().in("id", ids);

      if (error) {
        return res
          .status(400)
          .json({ message: "Failed to delete users", error });
      }

      return res.status(200).json({ message: "Users deleted successfully" });
    }

    return res.status(400).json({ message: "No valid id or ids provided" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
