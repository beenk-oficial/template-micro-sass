import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, company_id } = req.body;

  if (!email || !password || !company_id) {
    return res
      .status(400)
      .json({ error: "Email, password, and company_id are required" });
  }

  const { data: user, error } = await supabase
    .from("company_users")
    .select(
      `
      id,
      company_id,
      type,
      is_active,
      user:users!inner (
        id,
        email,
        is_banned
      ),
      authentication:authentications (
        id,
        provider,
        email,
        password_hash
      )
      `
    )
    .eq("company_id", company_id)
    .eq("user.email", email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isBanned = user.user[0].is_banned;

  if (!user.is_active || isBanned) {
    return res.status(403).json({ error: "User is not active or is banned" });
  }

  const authentication = user.authentication[0];

  const isProviderValid = authentication.provider === "email";
  if (!isProviderValid) {
    return res.status(401).json({ error: "Invalid authentication provider" });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    authentication.password_hash
  );

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    {
      user_id: user.id,
      email: authentication.email,
      company_id: company_id,
      provider: "email",
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    {
      user_id: user.id,
      email: authentication.email,
      company_id: company_id,
      provider: "email",
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  const { error: tokenError } = await supabase
    .from("authentications")
    .update({
      access_token: accessToken,
      access_token_expires_at: new Date(Date.now() + 3600000),
      refresh_token: refreshToken,
      refresh_token_expires_at: new Date(Date.now() + 604800000),
      last_login: new Date(),
    })
    .eq("id", authentication.id);

  if (tokenError) {
    return res.status(500).json({ error: "Failed to store refresh token" });
  }

  await supabase.from("audit_logs").insert({
    authentication_id: authentication.id,
    event: "login",
    ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    user_agent: req.headers["user-agent"],
    origin: req.headers.origin || "unknown",
    metadata: user,
  });

  res.setHeader("Set-Cookie", [
    `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600`,
    `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800`,
  ]);

  const userData = user.user[0];

  return res.status(200).json({
    user: {
      id: user.id,
      user_id: userData.id,
      company_id: user.company_id,
      authentication_id: authentication.id,
      email: authentication.email,
      type: user.type,
    },
    token: {
      access_token: accessToken,
    },
  });
}
