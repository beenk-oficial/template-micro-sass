import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, company_id } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const supabase = createServerSupabaseClient({ req, res });

  try {
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "1h" }
    );

    // Store reset token in database
    const { error: tokenError } = await supabase
      .from("password_resets")
      .insert({
        user_id: user.id,
        reset_token: resetToken,
        expires_at: new Date(Date.now() + 3600000), // 1 hour expiration
      });

    if (tokenError) {
      return res.status(500).json({ error: "Failed to store reset token" });
    }

    // Send reset email (mocked for now)
    console.log(
      `Send email to ${email} with reset link: ${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    );

    return res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
