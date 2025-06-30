import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, full_name, company_id } = req.body;

  if (!email || !password || !full_name || !company_id) {
    return res.status(400).json({
      error: "Email, password, full_name, and company_id are required",
    });
  }

  const supabase = createServerSupabaseClient({ req, res });

  try {
    const { data: existingUser } = await supabase
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

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    const hashedPassword = await bcrypt.hash(password, 10);

    let createdUser = user;
    if (!user) {
      const { data: newUser, error: createUserError } = await supabase
        .from("users")
        .insert([{ email, full_name }])
        .select("*")
        .single();

      if (createUserError) {
        return res.status(500).json({ error: "Failed to create user" });
      }

      createdUser = newUser;
    }

    const { data: newCompanyUser, error: createCompanyUserError } =
      await supabase
        .from("company_users")
        .insert([{ company_id, user_id: createdUser?.id }])
        .select("*")
        .single();

    if (createCompanyUserError) {
      return res.status(500).json({ error: "Failed to create company_users" });
    }

    const { data: newAuthentication, error: createAuthenticationError } =
      await supabase
        .from("authentications")
        .insert([
          {
            company_user_id: newCompanyUser.id,
            provider: "email",
            email,
            password_hash: hashedPassword,
          },
        ])
        .select("*")
        .single();

    if (createAuthenticationError) {
      return res
        .status(500)
        .json({ error: "Failed to create authentications" });
    }

    await supabase.from("audit_logs").insert({
      authentication_id: newAuthentication.id,
      event: "signup",
      ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      user_agent: req.headers["user-agent"],
      origin: req.headers.origin || "unknown",
      metadata: {
        company_id,
        email,
        full_name,
      },
    });

    return res.status(201).json({
      user: {
        user_id: createdUser.id,
        email,
        name: full_name,
        company_id,
        company_user_id: newCompanyUser.id,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}
