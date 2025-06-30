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

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  const { code, company_id } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      return res.status(400).json({ error: errorData.error });
    }

    const tokens = await tokenResponse.json();
    const idToken = tokens.id_token;

    const decodedToken = jwt.decode(idToken) as {
      email: string;
      name: string;
    };

    if (!decodedToken || !decodedToken.email) {
      return res.status(400).json({ error: "Invalid ID token" });
    }

    const email = decodedToken.email;
    const fullName = decodedToken.name;

    const supabase = createServerSupabaseClient({ req, res });

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    let userId;
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert([{ email, full_name: fullName }])
        .select("*")
        .single();

      const { data: newCompanyUser, error: createCompanyUserError } =
        await supabase
          .from("company_users")
          .insert({ user_id: userId, company_id })
          .select("*")
          .single();

      await supabase.from("authentications").insert({
        company_user_id: newCompanyUser.id,
        provider: "google",
        email,
      });

      if (createError || createCompanyUserError) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      userId = newUser.id;
    } else {
      userId = user.id;
    }

    const accessToken = jwt.sign(
      { user_id: userId, email, company_id: company_id, provider: "google" },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { user_id: userId, email, company_id: company_id, provider: "google" },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    const { data: authentication, error: tokenError } = await supabase
      .from("authentications")
      .update({
        access_token: accessToken,
        access_token_expires_at: new Date(Date.now() + 3600000),
        refresh_token: refreshToken,
        refresh_token_expires_at: new Date(Date.now() + 604800000),
        last_login: new Date(),
      })
      .eq("email", email)
      .eq("provider", "google")
      .select("*")
      .single();

    await supabase.from("audit_logs").insert({
      authentication_id: authentication.id,
      event: "login",
      ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      user_agent: req.headers["user-agent"],
      origin: req.headers.origin || "unknown",
      metadata: user,
    });

    if (tokenError) {
      return res.status(500).json({ error: "Failed to store tokens" });
    }

    res.setHeader("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=604800`,
    ]);

    return res.status(200).json({
      user: {
        user_id: userId,
        email,
        name: fullName,
        company_id: user.company_id,
        company_user_id: user.id,
        authentication_id: authentication.id,
        type: user.type,
      },
      token: {
        access_token: accessToken,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
