export default async function handler(req, res) {

  /* ===== CORS HEADERS ===== */
  res.setHeader("Access-Control-Allow-Origin", "https://civilbench.com");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  /* ===== Handle Preflight ===== */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /* ===== Allow only DELETE ===== */
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { jobId, adminKey } = req.body;

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/jobs?id=eq.${jobId}`,
    {
      method: "DELETE",
      headers: {
        apikey: process.env.SUPABASE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to delete job" });
  }

  res.status(200).json({ success: true });
}
