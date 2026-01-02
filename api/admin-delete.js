import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ADMIN KEY (never expose)
);

export default async function handler(req, res) {
  /* ---------------- CORS HEADERS ---------------- */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  /* ---------------- PRE-FLIGHT ---------------- */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* ---------------- METHOD CHECK ---------------- */
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { adminKey, jobId } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
