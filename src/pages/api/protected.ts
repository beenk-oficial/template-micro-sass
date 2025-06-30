import { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../middleware/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await authMiddleware(req, res, () => {
    res.status(200).json({ message: "Protected route accessed successfully" });
  });
}
