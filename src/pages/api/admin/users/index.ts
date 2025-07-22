import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SortOrder } from "@/types";
import checkCompanyId from "@/middleware/checkCompanyId";

export default checkCompanyId(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    page = "1",
    perPage = "10",
    sortField = "created_at",
    sortOrder = SortOrder.ASC,
    search = "",
  } = req.query;

  const company_id = req.headers["company-id"];

  const currentPage = parseInt(page as string, 10);
  const itemsPerPage = parseInt(perPage as string, 10);

  try {
    let query = supabase
      .from("users")
      .select("id,full_name,type,is_active,is_banned,email,created_at", {
        count: "exact",
      })
      .eq("company_id", company_id);

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    query = query.order(sortField as string, {
      ascending: sortOrder === SortOrder.ASC,
    });

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);

    const { data: users, count, error } = await query;

    if (error) {
      return res.status(500).json({ message: "Failed to fetch users", error });
    }

    const totalPages = Math.ceil((count || 0) / itemsPerPage);

    res.status(200).json({
      data: users,
      pagination: {
        sortField,
        sortOrder,
        currentPage,
        itemsPerPage,
        currentTotalItems: count,
        totalItems: count || 0,
        totalPages,
        search,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
